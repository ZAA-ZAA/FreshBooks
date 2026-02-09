from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from decimal import Decimal
import hashlib
import uuid
import random
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import base64

from config import Config
from models import (
    db, Tenant, User, Client, Invoice, InvoiceItem, 
    Estimate, EstimateItem, Expense, Payment, Item,
    Vendor, Bill, TeamMember, RecurringTemplate
)

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database
db.init_app(app)

@app.route('/')
def index():
    return 'Backend is running successfully 🚀'


# ==================== HELPER FUNCTIONS ====================

def get_tenant_id():
    """Get tenant_id from request headers or use default for single-tenant mode"""
    tenant_id = request.headers.get('X-Tenant-ID')
    if not tenant_id:
        # For simplicity, use/create a default tenant if not specified
        tenant = Tenant.query.first()
        if tenant:
            return str(tenant.id)
    return tenant_id

def error_response(message, status_code=400):
    return jsonify({'error': message}), status_code

def success_response(data=None, message=None, status_code=200):
    response = {'success': True}
    if data is not None:
        response['data'] = data
    if message:
        response['message'] = message
    return jsonify(response), status_code

# In-memory OTP store: email -> { 'otp': str, 'expires': datetime }
_otp_store = {}
OTP_EXPIRY_MINUTES = 10

def _send_otp_email(to_email, otp_code):
    """Send OTP via SMTP (Gmail)."""
    smtp_email = getattr(Config, 'SMTP_EMAIL', None) or ''
    smtp_password = getattr(Config, 'SMTP_PASSWORD', None) or ''
    if not smtp_email or not smtp_password:
        return False
    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = to_email
        msg['Subject'] = 'Your BookFlow verification code'
        body = f'''Hello,\n\nYour verification code is: {otp_code}\n\nThis code expires in {OTP_EXPIRY_MINUTES} minutes. If you did not request this, please ignore this email.\n\n— BookFlow'''
        msg.attach(MIMEText(body, 'plain'))
        with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, to_email, msg.as_string())
        return True
    except Exception:
        return False

def _verify_otp(email, otp):
    """Check if OTP matches and is not expired. Returns True if valid."""
    email = (email or '').strip().lower()
    entry = _otp_store.get(email)
    if not entry:
        return False
    if datetime.utcnow() > entry['expires']:
        del _otp_store[email]
        return False
    return entry['otp'] == str(otp).strip()

def _send_email(to_email, subject, html_body, pdf_base64=None, pdf_filename='document.pdf'):
    """Send email via SMTP (e.g. invoice/estimate). Optionally attach PDF."""
    smtp_email = getattr(Config, 'SMTP_EMAIL', None) or ''
    smtp_password = getattr(Config, 'SMTP_PASSWORD', None) or ''
    if not smtp_email or not smtp_password:
        return False
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = smtp_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))
        if pdf_base64:
            try:
                payload = base64.b64decode(pdf_base64)
                attachment = MIMEBase('application', 'pdf')
                attachment.set_payload(payload)
                encoders.encode_base64(attachment)
                attachment.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
                msg.attach(attachment)
            except Exception:
                pass
        with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, to_email, msg.as_string())
        return True
    except Exception:
        return False

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/check-email', methods=['GET'])
def check_email():
    """Check if an email is already registered (for signup validation)"""
    email = request.args.get('email', '').strip()
    if not email:
        return error_response('Email is required')
    exists = User.query.filter_by(email=email).first() is not None
    return success_response({'available': not exists, 'exists': exists})


@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    """Send 6-digit OTP to email for signup verification."""
    data = request.json
    email = (data.get('email') or '').strip()
    if not email:
        return error_response('Email is required')
    if User.query.filter_by(email=email).first():
        return error_response('Email already registered')
    otp_code = ''.join(random.choices('0123456789', k=6))
    _otp_store[email.lower()] = {
        'otp': otp_code,
        'expires': datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    }
    if not _send_otp_email(email, otp_code):
        return error_response('Failed to send verification email. Check SMTP settings.')
    return success_response({'sent': True}, 'Verification code sent to your email')


@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP so frontend can proceed to next step. Does not consume OTP (verified again at register)."""
    data = request.json
    email = (data.get('email') or '').strip()
    otp = (data.get('otp') or '').strip()
    if not email or not otp:
        return error_response('Email and OTP are required')
    if not _verify_otp(email, otp):
        return error_response('Invalid or expired verification code')
    return success_response({'verified': True})


@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user and tenant. Requires valid OTP from send-otp."""
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return error_response('Email and password are required')
    
    email = data['email'].strip()
    otp = (data.get('otp') or '').strip()
    if not otp:
        return error_response('Verification code is required')
    
    if not _verify_otp(email, otp):
        return error_response('Invalid or expired verification code')
    
    # Consume OTP
    _otp_store.pop(email.lower(), None)
    
    # Check if email exists
    if User.query.filter_by(email=email).first():
        return error_response('Email already registered')
    
    # Create tenant
    tenant = Tenant(
        name=data.get('company_name', email.split('@')[0]),
        email=email,
        phone=data.get('phone', '')
    )
    db.session.add(tenant)
    db.session.flush()
    
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    user = User(
        tenant_id=tenant.id,
        email=email,
        password_hash=password_hash,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        role='owner'
    )
    db.session.add(user)
    db.session.commit()
    
    return success_response({
        'user': user.to_dict(),
        'tenant': tenant.to_dict()
    }, 'Registration successful', 201)

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return error_response('Email and password are required')
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return error_response('Invalid credentials', 401)
    
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    if user.password_hash != password_hash:
        return error_response('Invalid credentials', 401)
    
    if not user.is_active:
        return error_response('Account is deactivated', 401)
    
    return success_response({
        'user': user.to_dict(),
        'tenant': user.tenant.to_dict()
    })

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Not authenticated', 401)
    
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return error_response('Tenant not found', 404)
    
    user = User.query.filter_by(tenant_id=tenant_id).first()
    
    return success_response({
        'user': user.to_dict() if user else None,
        'tenant': tenant.to_dict()
    })

# ==================== TENANT LOGO (sync across devices) ====================

@app.route('/api/tenant/logo', methods=['GET'])
def get_tenant_logo():
    """Get current tenant logo (base64 data URL)."""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Not authenticated', 401)
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return error_response('Tenant not found', 404)
    return success_response({'logo': tenant.logo_data})

@app.route('/api/tenant/logo', methods=['PUT'])
def update_tenant_logo():
    """Update current tenant logo. Body: { \"logo\": \"data:image/png;base64,...\" } or null to clear."""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Not authenticated', 401)
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return error_response('Tenant not found', 404)
    data = request.get_json() or {}
    logo = data.get('logo')
    if logo is not None and not isinstance(logo, str):
        return error_response('logo must be a string or null', 400)
    tenant.logo_data = logo if logo else None
    db.session.commit()
    return success_response({'logo': tenant.logo_data}, 'Logo updated')

@app.route('/api/tenant', methods=['PUT'])
def update_tenant():
    """Update current tenant (name, phone, address, country, currency). Used by Settings."""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Not authenticated', 401)
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return error_response('Tenant not found', 404)
    data = request.get_json() or {}
    if 'name' in data and data['name'] is not None:
        tenant.name = str(data['name'])
    if 'phone' in data:
        tenant.phone = str(data['phone']) if data['phone'] is not None else None
    if 'address' in data:
        tenant.address = str(data['address']) if data['address'] is not None else None
    if 'country' in data and data['country'] is not None:
        tenant.country = str(data['country'])
    if 'currency' in data and data['currency'] is not None:
        tenant.currency = str(data['currency'])
    db.session.commit()
    return success_response(tenant.to_dict(), 'Tenant updated')

# ==================== CLIENT ROUTES ====================

@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Get all clients for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    clients = Client.query.filter_by(tenant_id=tenant_id, is_active=True).order_by(Client.created_at.desc()).all()
    return success_response([c.to_dict() for c in clients])

@app.route('/api/clients/<client_id>', methods=['GET'])
def get_client(client_id):
    """Get single client"""
    tenant_id = get_tenant_id()
    client = Client.query.filter_by(id=client_id, tenant_id=tenant_id).first()
    
    if not client:
        return error_response('Client not found', 404)
    
    return success_response(client.to_dict())

@app.route('/api/clients', methods=['POST'])
def create_client():
    """Create new client"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    if not data.get('company'):
        return error_response('Company name is required')
    
    client = Client(
        tenant_id=tenant_id,
        company=data['company'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        mobile=data.get('mobile', ''),
        address=data.get('address', ''),
        city=data.get('city', ''),
        state=data.get('state', ''),
        postal_code=data.get('postal_code', ''),
        country=data.get('country', 'Philippines'),
        balance=0
    )
    
    db.session.add(client)
    db.session.commit()
    
    return success_response(client.to_dict(), 'Client created successfully', 201)

@app.route('/api/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    """Update client"""
    tenant_id = get_tenant_id()
    client = Client.query.filter_by(id=client_id, tenant_id=tenant_id).first()
    
    if not client:
        return error_response('Client not found', 404)
    
    data = request.json
    
    if 'company' in data:
        client.company = data['company']
    if 'first_name' in data:
        client.first_name = data['first_name']
    if 'last_name' in data:
        client.last_name = data['last_name']
    if 'email' in data:
        client.email = data['email']
    if 'phone' in data:
        client.phone = data['phone']
    if 'mobile' in data:
        client.mobile = data['mobile']
    if 'address' in data:
        client.address = data['address']
    if 'city' in data:
        client.city = data['city']
    if 'state' in data:
        client.state = data['state']
    if 'postal_code' in data:
        client.postal_code = data['postal_code']
    if 'country' in data:
        client.country = data['country']
    
    db.session.commit()
    
    return success_response(client.to_dict(), 'Client updated successfully')

@app.route('/api/clients/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    """Delete (soft) client"""
    tenant_id = get_tenant_id()
    client = Client.query.filter_by(id=client_id, tenant_id=tenant_id).first()
    
    if not client:
        return error_response('Client not found', 404)
    
    client.is_active = False
    db.session.commit()
    
    return success_response(message='Client deleted successfully')

# ==================== INVOICE ROUTES ====================

@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    """Get all invoices for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    invoices = Invoice.query.filter_by(tenant_id=tenant_id).order_by(Invoice.created_at.desc()).all()
    return success_response([inv.to_dict() for inv in invoices])

@app.route('/api/invoices/<invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    """Get single invoice"""
    tenant_id = get_tenant_id()
    invoice = Invoice.query.filter_by(id=invoice_id, tenant_id=tenant_id).first()
    
    if not invoice:
        return error_response('Invoice not found', 404)
    
    return success_response(invoice.to_dict())

@app.route('/api/invoices/next-number', methods=['GET'])
def get_next_invoice_number():
    """Get next invoice number"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    count = Invoice.query.filter_by(tenant_id=tenant_id).count()
    next_number = str(count + 1).zfill(7)
    
    return success_response({'number': next_number})

@app.route('/api/invoices', methods=['POST'])
def create_invoice():
    """Create new invoice"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    # Validation: Client is required
    if not data.get('client_id'):
        return error_response('Client is required. Please select a client before saving the invoice.')
    
    # Verify client exists
    client = Client.query.filter_by(id=data['client_id'], tenant_id=tenant_id).first()
    if not client:
        return error_response('Selected client not found')
    
    # Calculate totals from items
    items_data = data.get('items', [])
    subtotal = sum(float(item.get('rate', 0)) * float(item.get('qty', 1)) for item in items_data)
    tax_amount = sum(
        (float(item.get('rate', 0)) * float(item.get('qty', 1))) * (float(item.get('tax', 0)) / 100)
        for item in items_data
    )
    discount_percentage = float(data.get('discount', 0))
    discount_amount = subtotal * (discount_percentage / 100)
    total = subtotal + tax_amount - discount_amount
    
    invoice = Invoice(
        tenant_id=tenant_id,
        client_id=data['client_id'],
        number=data.get('number', ''),
        date_issued=datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        date_due=datetime.strptime(data['date_due'], '%Y-%m-%d').date() if data.get('date_due') else None,
        reference=data.get('reference', ''),
        subtotal=subtotal,
        discount_percentage=discount_percentage,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        total=total,
        balance_due=total,
        status=data.get('status', 'Draft'),
        notes=data.get('notes', ''),
        terms=data.get('terms', '')
    )
    
    db.session.add(invoice)
    db.session.flush()
    
    # Add line items
    for item_data in items_data:
        item = InvoiceItem(
            invoice_id=invoice.id,
            name=item_data.get('name', ''),
            description=item_data.get('description', ''),
            rate=float(item_data.get('rate', 0)),
            qty=float(item_data.get('qty', 1)),
            tax_percentage=float(item_data.get('tax', 0)),
            amount=float(item_data.get('rate', 0)) * float(item_data.get('qty', 1))
        )
        db.session.add(item)
    
    # Update client balance
    client.balance = float(client.balance or 0) + total
    
    db.session.commit()
    
    return success_response(invoice.to_dict(), 'Invoice created successfully', 201)

@app.route('/api/invoices/<invoice_id>', methods=['PUT'])
def update_invoice(invoice_id):
    """Update invoice"""
    tenant_id = get_tenant_id()
    invoice = Invoice.query.filter_by(id=invoice_id, tenant_id=tenant_id).first()
    
    if not invoice:
        return error_response('Invoice not found', 404)
    
    data = request.json
    
    # Validation: Client is required
    if 'client_id' in data and not data['client_id']:
        return error_response('Client is required. Please select a client before saving the invoice.')
    
    # Update client if changed
    if 'client_id' in data:
        client = Client.query.filter_by(id=data['client_id'], tenant_id=tenant_id).first()
        if not client:
            return error_response('Selected client not found')
        invoice.client_id = data['client_id']
    
    # Update other fields
    if 'date' in data:
        invoice.date_issued = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if 'date_due' in data and data['date_due']:
        invoice.date_due = datetime.strptime(data['date_due'], '%Y-%m-%d').date()
    if 'reference' in data:
        invoice.reference = data['reference']
    if 'status' in data:
        invoice.status = data['status']
    if 'notes' in data:
        invoice.notes = data['notes']
    if 'terms' in data:
        invoice.terms = data['terms']
    
    # Update items if provided
    if 'items' in data:
        # Delete old items
        InvoiceItem.query.filter_by(invoice_id=invoice.id).delete()
        
        items_data = data['items']
        subtotal = sum(float(item.get('rate', 0)) * float(item.get('qty', 1)) for item in items_data)
        tax_amount = sum(
            (float(item.get('rate', 0)) * float(item.get('qty', 1))) * (float(item.get('tax', 0)) / 100)
            for item in items_data
        )
        discount_percentage = float(data.get('discount', invoice.discount_percentage or 0))
        discount_amount = subtotal * (discount_percentage / 100)
        total = subtotal + tax_amount - discount_amount
        
        invoice.subtotal = subtotal
        invoice.discount_percentage = discount_percentage
        invoice.discount_amount = discount_amount
        invoice.tax_amount = tax_amount
        invoice.total = total
        invoice.balance_due = total - float(invoice.amount_paid or 0)
        
        for item_data in items_data:
            item = InvoiceItem(
                invoice_id=invoice.id,
                name=item_data.get('name', ''),
                description=item_data.get('description', ''),
                rate=float(item_data.get('rate', 0)),
                qty=float(item_data.get('qty', 1)),
                tax_percentage=float(item_data.get('tax', 0)),
                amount=float(item_data.get('rate', 0)) * float(item_data.get('qty', 1))
            )
            db.session.add(item)
    
    db.session.commit()
    
    return success_response(invoice.to_dict(), 'Invoice updated successfully')

@app.route('/api/invoices/<invoice_id>', methods=['DELETE'])
def delete_invoice(invoice_id):
    """Delete invoice"""
    tenant_id = get_tenant_id()
    invoice = Invoice.query.filter_by(id=invoice_id, tenant_id=tenant_id).first()
    
    if not invoice:
        return error_response('Invoice not found', 404)
    
    # Update client balance
    client = Client.query.get(invoice.client_id)
    if client:
        client.balance = float(client.balance or 0) - float(invoice.balance_due or 0)
    
    db.session.delete(invoice)
    db.session.commit()
    
    return success_response(message='Invoice deleted successfully')

@app.route('/api/invoices/<invoice_id>/send-email', methods=['POST'])
def send_invoice_email(invoice_id):
    """Send invoice by email to recipient."""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    invoice = Invoice.query.filter_by(id=invoice_id, tenant_id=tenant_id).first()
    if not invoice:
        return error_response('Invoice not found', 404)
    data = request.json
    to_email = (data.get('to') or '').strip()
    if not to_email:
        return error_response('Recipient email (to) is required')
    pdf_base64 = data.get('pdf_base64') or ''
    pdf_filename = f'invoice-{invoice.number}.pdf'
    client = Client.query.get(invoice.client_id)
    client_name = client.company if client else 'Unknown'
    subject = f'Invoice #{invoice.number} from BookFlow'
    html = f'''<h2>Invoice #{invoice.number}</h2>
    <p>Hello,</p>
    <p>Please find your invoice below.</p>
    <p><strong>Client:</strong> {client_name}</p>
    <p><strong>Date issued:</strong> {invoice.date_issued.isoformat() if invoice.date_issued else ''}</p>
    <p><strong>Due date:</strong> {invoice.date_due.isoformat() if invoice.date_due else ''}</p>
    <p><strong>Total:</strong> {invoice.total} PHP</p>
    <p>If you have any questions, reply to this email.</p>
    <p>— BookFlow</p>'''
    if pdf_base64:
        def _do_send():
            _send_email(to_email, subject, html, pdf_base64=pdf_base64, pdf_filename=pdf_filename)
        threading.Thread(target=_do_send, daemon=True).start()
        return success_response({'sent': True}, 'Email sent successfully')
    if not _send_email(to_email, subject, html):
        return error_response('Failed to send email. Check SMTP settings.')
    return success_response({'sent': True}, 'Email sent successfully')

# ==================== ESTIMATE ROUTES ====================

@app.route('/api/estimates', methods=['GET'])
def get_estimates():
    """Get all estimates for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    estimates = Estimate.query.filter_by(tenant_id=tenant_id).order_by(Estimate.created_at.desc()).all()
    return success_response([est.to_dict() for est in estimates])

@app.route('/api/estimates/<estimate_id>', methods=['GET'])
def get_estimate(estimate_id):
    """Get single estimate"""
    tenant_id = get_tenant_id()
    estimate = Estimate.query.filter_by(id=estimate_id, tenant_id=tenant_id).first()
    
    if not estimate:
        return error_response('Estimate not found', 404)
    
    return success_response(estimate.to_dict())

@app.route('/api/estimates/next-number', methods=['GET'])
def get_next_estimate_number():
    """Get next estimate number"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    count = Estimate.query.filter_by(tenant_id=tenant_id).count()
    next_number = str(count + 1).zfill(7)
    
    return success_response({'number': next_number})

@app.route('/api/estimates', methods=['POST'])
def create_estimate():
    """Create new estimate"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    # Validation: Client is required
    if not data.get('client_id'):
        return error_response('Client is required. Please select a client before saving the estimate.')
    
    # Verify client exists
    client = Client.query.filter_by(id=data['client_id'], tenant_id=tenant_id).first()
    if not client:
        return error_response('Selected client not found')
    
    # Calculate totals
    items_data = data.get('items', [])
    subtotal = sum(float(item.get('rate', 0)) * float(item.get('qty', 1)) for item in items_data)
    tax_amount = sum(
        (float(item.get('rate', 0)) * float(item.get('qty', 1))) * (float(item.get('tax', 0)) / 100)
        for item in items_data
    )
    discount_percentage = float(data.get('discount', 0))
    discount_amount = subtotal * (discount_percentage / 100)
    total = subtotal + tax_amount - discount_amount
    
    estimate = Estimate(
        tenant_id=tenant_id,
        client_id=data['client_id'],
        number=data.get('number', ''),
        date_issued=datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        date_valid_until=datetime.strptime(data['date_valid_until'], '%Y-%m-%d').date() if data.get('date_valid_until') else None,
        reference=data.get('reference', ''),
        subtotal=subtotal,
        discount_percentage=discount_percentage,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        total=total,
        status=data.get('status', 'Draft'),
        notes=data.get('notes', ''),
        terms=data.get('terms', ''),
        description=data.get('description', '')
    )
    
    db.session.add(estimate)
    db.session.flush()
    
    for item_data in items_data:
        item = EstimateItem(
            estimate_id=estimate.id,
            name=item_data.get('name', ''),
            description=item_data.get('description', ''),
            rate=float(item_data.get('rate', 0)),
            qty=float(item_data.get('qty', 1)),
            tax_percentage=float(item_data.get('tax', 0)),
            amount=float(item_data.get('rate', 0)) * float(item_data.get('qty', 1))
        )
        db.session.add(item)
    
    db.session.commit()
    
    return success_response(estimate.to_dict(), 'Estimate created successfully', 201)

@app.route('/api/estimates/<estimate_id>', methods=['PUT'])
def update_estimate(estimate_id):
    """Update estimate"""
    tenant_id = get_tenant_id()
    estimate = Estimate.query.filter_by(id=estimate_id, tenant_id=tenant_id).first()
    
    if not estimate:
        return error_response('Estimate not found', 404)
    
    data = request.json
    
    # Validation
    if 'client_id' in data and not data['client_id']:
        return error_response('Client is required. Please select a client before saving the estimate.')
    
    if 'client_id' in data:
        client = Client.query.filter_by(id=data['client_id'], tenant_id=tenant_id).first()
        if not client:
            return error_response('Selected client not found')
        estimate.client_id = data['client_id']
    
    if 'date' in data:
        estimate.date_issued = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if 'reference' in data:
        estimate.reference = data['reference']
    if 'status' in data:
        estimate.status = data['status']
    if 'notes' in data:
        estimate.notes = data['notes']
    if 'terms' in data:
        estimate.terms = data['terms']
    if 'description' in data:
        estimate.description = data['description']
    
    if 'items' in data:
        EstimateItem.query.filter_by(estimate_id=estimate.id).delete()
        
        items_data = data['items']
        subtotal = sum(float(item.get('rate', 0)) * float(item.get('qty', 1)) for item in items_data)
        tax_amount = sum(
            (float(item.get('rate', 0)) * float(item.get('qty', 1))) * (float(item.get('tax', 0)) / 100)
            for item in items_data
        )
        discount_percentage = float(data.get('discount', estimate.discount_percentage or 0))
        discount_amount = subtotal * (discount_percentage / 100)
        total = subtotal + tax_amount - discount_amount
        
        estimate.subtotal = subtotal
        estimate.discount_percentage = discount_percentage
        estimate.discount_amount = discount_amount
        estimate.tax_amount = tax_amount
        estimate.total = total
        
        for item_data in items_data:
            item = EstimateItem(
                estimate_id=estimate.id,
                name=item_data.get('name', ''),
                description=item_data.get('description', ''),
                rate=float(item_data.get('rate', 0)),
                qty=float(item_data.get('qty', 1)),
                tax_percentage=float(item_data.get('tax', 0)),
                amount=float(item_data.get('rate', 0)) * float(item_data.get('qty', 1))
            )
            db.session.add(item)
    
    db.session.commit()
    
    return success_response(estimate.to_dict(), 'Estimate updated successfully')

@app.route('/api/estimates/<estimate_id>', methods=['DELETE'])
def delete_estimate(estimate_id):
    """Delete estimate"""
    tenant_id = get_tenant_id()
    estimate = Estimate.query.filter_by(id=estimate_id, tenant_id=tenant_id).first()
    
    if not estimate:
        return error_response('Estimate not found', 404)
    
    db.session.delete(estimate)
    db.session.commit()
    
    return success_response(message='Estimate deleted successfully')

@app.route('/api/estimates/<estimate_id>/send-email', methods=['POST'])
def send_estimate_email(estimate_id):
    """Send estimate by email to recipient."""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    estimate = Estimate.query.filter_by(id=estimate_id, tenant_id=tenant_id).first()
    if not estimate:
        return error_response('Estimate not found', 404)
    data = request.json
    to_email = (data.get('to') or '').strip()
    if not to_email:
        return error_response('Recipient email (to) is required')
    pdf_base64 = data.get('pdf_base64') or ''
    pdf_filename = f'estimate-{estimate.number}.pdf'
    client = Client.query.get(estimate.client_id)
    client_name = client.company if client else 'Unknown'
    subject = f'Estimate #{estimate.number} from BookFlow'
    html = f'''<h2>Estimate #{estimate.number}</h2>
    <p>Hello,</p>
    <p>Please find your estimate below.</p>
    <p><strong>Client:</strong> {client_name}</p>
    <p><strong>Date issued:</strong> {estimate.date_issued.isoformat() if estimate.date_issued else ''}</p>
    <p><strong>Total:</strong> {estimate.total} PHP</p>
    <p>If you have any questions, reply to this email.</p>
    <p>— BookFlow</p>'''
    if pdf_base64:
        def _do_send():
            _send_email(to_email, subject, html, pdf_base64=pdf_base64, pdf_filename=pdf_filename)
        threading.Thread(target=_do_send, daemon=True).start()
        return success_response({'sent': True}, 'Email sent successfully')
    if not _send_email(to_email, subject, html):
        return error_response('Failed to send email. Check SMTP settings.')
    return success_response({'sent': True}, 'Email sent successfully')

@app.route('/api/estimates/<estimate_id>/convert', methods=['POST'])
def convert_estimate_to_invoice(estimate_id):
    """Convert estimate to invoice"""
    tenant_id = get_tenant_id()
    estimate = Estimate.query.filter_by(id=estimate_id, tenant_id=tenant_id).first()
    
    if not estimate:
        return error_response('Estimate not found', 404)
    
    # Get next invoice number
    count = Invoice.query.filter_by(tenant_id=tenant_id).count()
    invoice_number = str(count + 1).zfill(7)
    
    # Create invoice from estimate
    invoice = Invoice(
        tenant_id=tenant_id,
        client_id=estimate.client_id,
        number=invoice_number,
        date_issued=datetime.now().date(),
        reference=estimate.reference,
        subtotal=estimate.subtotal,
        discount_percentage=estimate.discount_percentage,
        discount_amount=estimate.discount_amount,
        tax_amount=estimate.tax_amount,
        total=estimate.total,
        balance_due=estimate.total,
        status='Draft',
        notes=estimate.notes,
        terms=estimate.terms
    )
    
    db.session.add(invoice)
    db.session.flush()
    
    # Copy items
    for est_item in estimate.items:
        inv_item = InvoiceItem(
            invoice_id=invoice.id,
            name=est_item.name,
            description=est_item.description,
            rate=est_item.rate,
            qty=est_item.qty,
            tax_percentage=est_item.tax_percentage,
            amount=est_item.amount
        )
        db.session.add(inv_item)
    
    # Update estimate status
    estimate.status = 'Invoiced'
    estimate.converted_invoice_id = invoice.id
    
    # Update client balance
    client = Client.query.get(estimate.client_id)
    if client:
        client.balance = float(client.balance or 0) + float(invoice.total)
    
    db.session.commit()
    
    return success_response(invoice.to_dict(), 'Estimate converted to invoice successfully', 201)

# ==================== EXPENSE ROUTES ====================

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    expenses = Expense.query.filter_by(tenant_id=tenant_id).order_by(Expense.created_at.desc()).all()
    return success_response([exp.to_dict() for exp in expenses])

@app.route('/api/expenses/<expense_id>', methods=['GET'])
def get_expense(expense_id):
    """Get single expense"""
    tenant_id = get_tenant_id()
    expense = Expense.query.filter_by(id=expense_id, tenant_id=tenant_id).first()
    
    if not expense:
        return error_response('Expense not found', 404)
    
    return success_response(expense.to_dict())

@app.route('/api/expenses', methods=['POST'])
def create_expense():
    """Create new expense"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    # Validation: Merchant is required
    if not data.get('merchant'):
        return error_response('Merchant is required')
    
    # Validation: Amount is required
    if not data.get('amount') or float(data.get('amount', 0)) <= 0:
        return error_response('Valid amount is required')
    
    # Client is optional for expenses
    client_id = data.get('client_id')
    if client_id:
        client = Client.query.filter_by(id=client_id, tenant_id=tenant_id).first()
        if not client:
            return error_response('Selected client not found')
    
    receipt_data = data.get('receipt') or data.get('receipt_url')
    expense = Expense(
        tenant_id=tenant_id,
        client_id=client_id if client_id else None,
        vendor_id=data.get('vendor_id'),
        date=datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        merchant=data['merchant'],
        category=data.get('category', ''),
        description=data.get('description', ''),
        amount=float(data['amount']),
        status=data.get('status', 'Draft'),
        is_billable=data.get('is_billable', False),
        receipt_url=receipt_data if receipt_data else None
    )
    
    db.session.add(expense)
    db.session.commit()
    
    return success_response(expense.to_dict(), 'Expense created successfully', 201)

@app.route('/api/expenses/<expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update expense"""
    tenant_id = get_tenant_id()
    expense = Expense.query.filter_by(id=expense_id, tenant_id=tenant_id).first()
    
    if not expense:
        return error_response('Expense not found', 404)
    
    data = request.json
    
    if 'client_id' in data:
        if data['client_id']:
            client = Client.query.filter_by(id=data['client_id'], tenant_id=tenant_id).first()
            if not client:
                return error_response('Selected client not found')
        expense.client_id = data['client_id'] if data['client_id'] else None
    
    if 'date' in data:
        expense.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if 'merchant' in data:
        expense.merchant = data['merchant']
    if 'category' in data:
        expense.category = data['category']
    if 'description' in data:
        expense.description = data['description']
    if 'amount' in data:
        expense.amount = float(data['amount'])
    if 'status' in data:
        expense.status = data['status']
    if 'is_billable' in data:
        expense.is_billable = data['is_billable']
    if 'receipt' in data or 'receipt_url' in data:
        expense.receipt_url = data.get('receipt') or data.get('receipt_url') or None
    
    db.session.commit()
    
    return success_response(expense.to_dict(), 'Expense updated successfully')

@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete expense"""
    tenant_id = get_tenant_id()
    expense = Expense.query.filter_by(id=expense_id, tenant_id=tenant_id).first()
    
    if not expense:
        return error_response('Expense not found', 404)
    
    db.session.delete(expense)
    db.session.commit()
    
    return success_response(message='Expense deleted successfully')

# ==================== PAYMENT ROUTES ====================

@app.route('/api/payments', methods=['GET'])
def get_payments():
    """Get all payments for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    payments = Payment.query.filter_by(tenant_id=tenant_id).order_by(Payment.created_at.desc()).all()
    return success_response([pay.to_dict() for pay in payments])

@app.route('/api/payments/<payment_id>', methods=['GET'])
def get_payment(payment_id):
    """Get single payment"""
    tenant_id = get_tenant_id()
    payment = Payment.query.filter_by(id=payment_id, tenant_id=tenant_id).first()
    
    if not payment:
        return error_response('Payment not found', 404)
    
    return success_response(payment.to_dict())

@app.route('/api/payments', methods=['POST'])
def create_payment():
    """Create new payment"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    # Validation: Invoice is required
    if not data.get('invoice_id'):
        return error_response('Invoice is required. Payment must be linked to an existing invoice.')
    
    # Validation: Amount is required
    if not data.get('amount') or float(data.get('amount', 0)) <= 0:
        return error_response('Valid payment amount is required')
    
    # Verify invoice exists
    invoice = Invoice.query.filter_by(id=data['invoice_id'], tenant_id=tenant_id).first()
    if not invoice:
        return error_response('Selected invoice not found')
    
    payment = Payment(
        tenant_id=tenant_id,
        client_id=invoice.client_id,
        invoice_id=data['invoice_id'],
        date=datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        amount=float(data['amount']),
        method=data.get('method', 'Cash'),
        reference=data.get('reference', ''),
        notes=data.get('notes', ''),
        status='Confirmed'
    )
    
    db.session.add(payment)
    
    # Update invoice
    invoice.amount_paid = float(invoice.amount_paid or 0) + float(data['amount'])
    invoice.balance_due = float(invoice.total or 0) - float(invoice.amount_paid)
    
    if invoice.balance_due <= 0:
        invoice.status = 'Paid'
        invoice.balance_due = 0
    
    # Update client balance
    client = Client.query.get(invoice.client_id)
    if client:
        client.balance = float(client.balance or 0) - float(data['amount'])
        if client.balance < 0:
            client.balance = 0
    
    db.session.commit()
    
    return success_response(payment.to_dict(), 'Payment recorded successfully', 201)

@app.route('/api/payments/<payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    """Delete payment"""
    tenant_id = get_tenant_id()
    payment = Payment.query.filter_by(id=payment_id, tenant_id=tenant_id).first()
    
    if not payment:
        return error_response('Payment not found', 404)
    
    # Reverse the payment on invoice
    invoice = Invoice.query.get(payment.invoice_id)
    if invoice:
        invoice.amount_paid = float(invoice.amount_paid or 0) - float(payment.amount)
        invoice.balance_due = float(invoice.total or 0) - float(invoice.amount_paid or 0)
        if invoice.status == 'Paid':
            invoice.status = 'Sent'
    
    # Reverse client balance
    client = Client.query.get(payment.client_id)
    if client:
        client.balance = float(client.balance or 0) + float(payment.amount)
    
    db.session.delete(payment)
    db.session.commit()
    
    return success_response(message='Payment deleted successfully')

# ==================== ITEM ROUTES ====================

@app.route('/api/items', methods=['GET'])
def get_items():
    """Get all items for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    items = Item.query.filter_by(tenant_id=tenant_id, is_active=True).order_by(Item.created_at.desc()).all()
    return success_response([item.to_dict() for item in items])

@app.route('/api/items/<item_id>', methods=['GET'])
def get_item(item_id):
    """Get single item"""
    tenant_id = get_tenant_id()
    item = Item.query.filter_by(id=item_id, tenant_id=tenant_id).first()
    
    if not item:
        return error_response('Item not found', 404)
    
    return success_response(item.to_dict())

@app.route('/api/items', methods=['POST'])
def create_item():
    """Create new item"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    if not data.get('name'):
        return error_response('Item name is required')
    
    item = Item(
        tenant_id=tenant_id,
        name=data['name'],
        description=data.get('description', ''),
        rate=float(data.get('rate', 0)),
        sku=data.get('sku', ''),
        qty_on_hand=int(data.get('qty', 0)),
        item_type=data.get('item_type', 'Service')
    )
    
    db.session.add(item)
    db.session.commit()
    
    return success_response(item.to_dict(), 'Item created successfully', 201)

@app.route('/api/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    """Update item"""
    tenant_id = get_tenant_id()
    item = Item.query.filter_by(id=item_id, tenant_id=tenant_id).first()
    
    if not item:
        return error_response('Item not found', 404)
    
    data = request.json
    
    if 'name' in data:
        item.name = data['name']
    if 'description' in data:
        item.description = data['description']
    if 'rate' in data:
        item.rate = float(data['rate'])
    if 'sku' in data:
        item.sku = data['sku']
    if 'qty' in data:
        item.qty_on_hand = int(data['qty'])
    if 'item_type' in data:
        item.item_type = data['item_type']
    
    db.session.commit()
    
    return success_response(item.to_dict(), 'Item updated successfully')

@app.route('/api/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Delete (soft) item"""
    tenant_id = get_tenant_id()
    item = Item.query.filter_by(id=item_id, tenant_id=tenant_id).first()
    
    if not item:
        return error_response('Item not found', 404)
    
    item.is_active = False
    db.session.commit()
    
    return success_response(message='Item deleted successfully')

# ==================== VENDOR ROUTES ====================

@app.route('/api/vendors', methods=['GET'])
def get_vendors():
    """Get all vendors for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    vendors = Vendor.query.filter_by(tenant_id=tenant_id, is_active=True).order_by(Vendor.created_at.desc()).all()
    return success_response([v.to_dict() for v in vendors])

@app.route('/api/vendors', methods=['POST'])
def create_vendor():
    """Create new vendor"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    if not data.get('company'):
        return error_response('Company name is required')
    
    vendor = Vendor(
        tenant_id=tenant_id,
        company=data['company'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        address=data.get('address', '')
    )
    
    db.session.add(vendor)
    db.session.commit()
    
    return success_response(vendor.to_dict(), 'Vendor created successfully', 201)

@app.route('/api/vendors/<vendor_id>', methods=['PUT'])
def update_vendor(vendor_id):
    """Update vendor"""
    tenant_id = get_tenant_id()
    vendor = Vendor.query.filter_by(id=vendor_id, tenant_id=tenant_id).first()
    
    if not vendor:
        return error_response('Vendor not found', 404)
    
    data = request.json
    
    if 'company' in data:
        vendor.company = data['company']
    if 'first_name' in data:
        vendor.first_name = data['first_name']
    if 'last_name' in data:
        vendor.last_name = data['last_name']
    if 'email' in data:
        vendor.email = data['email']
    if 'phone' in data:
        vendor.phone = data['phone']
    if 'address' in data:
        vendor.address = data['address']
    
    db.session.commit()
    
    return success_response(vendor.to_dict(), 'Vendor updated successfully')

@app.route('/api/vendors/<vendor_id>', methods=['DELETE'])
def delete_vendor(vendor_id):
    """Delete (soft) vendor"""
    tenant_id = get_tenant_id()
    vendor = Vendor.query.filter_by(id=vendor_id, tenant_id=tenant_id).first()
    
    if not vendor:
        return error_response('Vendor not found', 404)
    
    vendor.is_active = False
    db.session.commit()
    
    return success_response(message='Vendor deleted successfully')

# ==================== TEAM MEMBER ROUTES ====================

@app.route('/api/team', methods=['GET'])
def get_team_members():
    """Get all team members for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    members = TeamMember.query.filter_by(tenant_id=tenant_id, is_active=True).order_by(TeamMember.created_at.desc()).all()
    return success_response([m.to_dict() for m in members])

@app.route('/api/team', methods=['POST'])
def create_team_member():
    """Create new team member"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    if not data.get('first_name'):
        return error_response('First name is required')
    
    member = TeamMember(
        tenant_id=tenant_id,
        first_name=data['first_name'],
        last_name=data.get('last_name', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        role=data.get('role', ''),
        hourly_rate=float(data.get('hourly_rate', 0))
    )
    
    db.session.add(member)
    db.session.commit()
    
    return success_response(member.to_dict(), 'Team member created successfully', 201)

@app.route('/api/team/<member_id>', methods=['PUT'])
def update_team_member(member_id):
    """Update team member"""
    tenant_id = get_tenant_id()
    member = TeamMember.query.filter_by(id=member_id, tenant_id=tenant_id).first()
    
    if not member:
        return error_response('Team member not found', 404)
    
    data = request.json
    
    if 'first_name' in data:
        member.first_name = data['first_name']
    if 'last_name' in data:
        member.last_name = data['last_name']
    if 'email' in data:
        member.email = data['email']
    if 'phone' in data:
        member.phone = data['phone']
    if 'role' in data:
        member.role = data['role']
    if 'hourly_rate' in data:
        member.hourly_rate = float(data['hourly_rate'])
    
    db.session.commit()
    
    return success_response(member.to_dict(), 'Team member updated successfully')

@app.route('/api/team/<member_id>', methods=['DELETE'])
def delete_team_member(member_id):
    """Delete (soft) team member"""
    tenant_id = get_tenant_id()
    member = TeamMember.query.filter_by(id=member_id, tenant_id=tenant_id).first()
    
    if not member:
        return error_response('Team member not found', 404)
    
    member.is_active = False
    db.session.commit()
    
    return success_response(message='Team member deleted successfully')

# ==================== BILL ROUTES ====================

@app.route('/api/bills', methods=['GET'])
def get_bills():
    """Get all bills for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    bills = Bill.query.filter_by(tenant_id=tenant_id).order_by(Bill.created_at.desc()).all()
    return success_response([b.to_dict() for b in bills])

@app.route('/api/bills', methods=['POST'])
def create_bill():
    """Create new bill"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    bill = Bill(
        tenant_id=tenant_id,
        vendor_id=data.get('vendor_id'),
        number=data.get('number', ''),
        date=datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None,
        amount=float(data.get('amount', 0)),
        status=data.get('status', 'Draft'),
        notes=data.get('notes', '')
    )
    
    db.session.add(bill)
    db.session.commit()
    
    return success_response(bill.to_dict(), 'Bill created successfully', 201)

@app.route('/api/bills/<bill_id>', methods=['DELETE'])
def delete_bill(bill_id):
    """Delete bill"""
    tenant_id = get_tenant_id()
    bill = Bill.query.filter_by(id=bill_id, tenant_id=tenant_id).first()
    
    if not bill:
        return error_response('Bill not found', 404)
    
    db.session.delete(bill)
    db.session.commit()
    
    return success_response(message='Bill deleted successfully')

# ==================== RECURRING TEMPLATE ROUTES ====================

@app.route('/api/recurring-templates', methods=['GET'])
def get_recurring_templates():
    """Get all recurring templates for tenant"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    templates = RecurringTemplate.query.filter_by(tenant_id=tenant_id, is_active=True).order_by(RecurringTemplate.created_at.desc()).all()
    return success_response([t.to_dict() for t in templates])

@app.route('/api/recurring-templates', methods=['POST'])
def create_recurring_template():
    """Create new recurring template"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    data = request.json
    
    if not data.get('client_id'):
        return error_response('Client is required for recurring template')
    
    if not data.get('name'):
        return error_response('Template name is required')
    
    template = RecurringTemplate(
        tenant_id=tenant_id,
        client_id=data['client_id'],
        name=data['name'],
        frequency=data.get('frequency', 'monthly'),
        next_date=datetime.strptime(data['next_date'], '%Y-%m-%d').date() if data.get('next_date') else None,
        amount=float(data.get('amount', 0))
    )
    
    db.session.add(template)
    db.session.commit()
    
    return success_response(template.to_dict(), 'Recurring template created successfully', 201)

@app.route('/api/recurring-templates/<template_id>', methods=['DELETE'])
def delete_recurring_template(template_id):
    """Delete recurring template"""
    tenant_id = get_tenant_id()
    template = RecurringTemplate.query.filter_by(id=template_id, tenant_id=tenant_id).first()
    
    if not template:
        return error_response('Recurring template not found', 404)
    
    template.is_active = False
    db.session.commit()
    
    return success_response(message='Recurring template deleted successfully')

# ==================== DASHBOARD / STATS ROUTES ====================

@app.route('/api/reports/send-email', methods=['POST'])
def send_report_email():
    """Send a report by email. Optional PDF attachment. No login message (customer-facing)."""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    data = request.json
    to_email = (data.get('to') or '').strip()
    if not to_email:
        return error_response('Recipient email (to) is required')
    report_type = data.get('report_type') or 'invoice-details'
    pdf_base64 = data.get('pdf_base64') or ''
    pdf_filename = data.get('pdf_filename') or 'invoice-details-report.pdf'
    subject = f'Invoice Details Report – BookFlow'
    html = '''<h2>Invoice Details Report</h2>
    <p>Please find your report attached or in this email.</p>
    <p>If you have any questions, reply to this email.</p>
    <p>— BookFlow</p>'''
    if pdf_base64:
        def _do_send():
            _send_email(to_email, subject, html, pdf_base64=pdf_base64, pdf_filename=pdf_filename)
        threading.Thread(target=_do_send, daemon=True).start()
        return success_response({'sent': True}, 'Email sent successfully')
    if not _send_email(to_email, subject, html):
        return error_response('Failed to send email. Check SMTP settings.')
    return success_response({'sent': True}, 'Email sent successfully')

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    tenant_id = get_tenant_id()
    if not tenant_id:
        return error_response('Tenant ID required', 401)
    
    # Calculate stats
    invoices = Invoice.query.filter_by(tenant_id=tenant_id).all()
    payments = Payment.query.filter_by(tenant_id=tenant_id).all()
    expenses = Expense.query.filter_by(tenant_id=tenant_id).all()
    
    received = sum(float(p.amount or 0) for p in payments)
    outstanding = sum(float(inv.balance_due or 0) for inv in invoices if inv.status != 'Paid')
    overdue = sum(float(inv.balance_due or 0) for inv in invoices if inv.status == 'Overdue')
    spent = sum(float(exp.amount or 0) for exp in expenses)
    
    return success_response({
        'received': received,
        'outstanding': outstanding,
        'overdue': overdue,
        'spent': spent
    })

# ==================== DATABASE INITIALIZATION ====================

@app.route('/api/init', methods=['POST'])
def init_database():
    """Initialize database and create default tenant if needed"""
    try:
        db.create_all()
        
        # Check if default tenant exists
        tenant = Tenant.query.first()
        if not tenant:
            # Create default tenant
            tenant = Tenant(
                name='Default Organization',
                email='admin@bookflow.local',
                phone='',
                country='Philippines',
                currency='PHP'
            )
            db.session.add(tenant)
            db.session.flush()
            
            # Create default user
            password_hash = hashlib.sha256('admin123'.encode()).hexdigest()
            user = User(
                tenant_id=tenant.id,
                email='admin@bookflow.local',
                password_hash=password_hash,
                first_name='Admin',
                last_name='User',
                role='owner'
            )
            db.session.add(user)
            db.session.commit()
            
            return success_response({
                'tenant': tenant.to_dict(),
                'user': user.to_dict(),
                'message': 'Database initialized with default tenant. Default login: admin@bookflow.local / admin123'
            }, 'Database initialized successfully', 201)
        
        return success_response({
            'tenant': tenant.to_dict()
        }, 'Database already initialized')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Database initialization failed: {str(e)}', 500)

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        return success_response({'status': 'healthy', 'database': 'connected'})
    except Exception as e:
        return error_response(f'Database connection failed: {str(e)}', 500)

# ==================== MAIN ====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(
        host='0.0.0.0',  # 👈 IMPORTANT
        port=5000,
        debug=True
    )

