import uuid
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

# ==================== MULTI-TENANT BASE ====================
# All models include tenant_id for multi-tenancy support
# This allows multiple organizations to use the same database

class Tenant(db.Model):
    """Organization/Company - Root of multi-tenancy"""
    __tablename__ = 'tenants'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    country = db.Column(db.String(100), default='Philippines')
    currency = db.Column(db.String(10), default='PHP')
    logo_data = db.Column(db.Text)  # base64 data URL for tenant logo (syncs across devices)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = db.relationship('User', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    clients = db.relationship('Client', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    invoices = db.relationship('Invoice', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    estimates = db.relationship('Estimate', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    payments = db.relationship('Payment', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    items = db.relationship('Item', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    vendors = db.relationship('Vendor', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    team_members = db.relationship('TeamMember', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    bills = db.relationship('Bill', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    recurring_templates = db.relationship('RecurringTemplate', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'country': self.country,
            'currency': self.currency,
            'logo': self.logo_data,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class User(db.Model):
    """User account for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    role = db.Column(db.String(50), default='owner')  # owner, admin, member
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Client(db.Model):
    """Client/Customer entity"""
    __tablename__ = 'clients'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    
    # Organization info
    company = db.Column(db.String(255), nullable=False)
    
    # Primary contact
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    mobile = db.Column(db.String(50))
    
    # Address
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100), default='Philippines')
    
    # Computed/cached balance (updated via triggers or application logic)
    balance = db.Column(db.Numeric(12, 2), default=0)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    invoices = db.relationship('Invoice', backref='client', lazy='dynamic')
    estimates = db.relationship('Estimate', backref='client', lazy='dynamic')
    expenses = db.relationship('Expense', backref='client', lazy='dynamic')
    payments = db.relationship('Payment', backref='client', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'company': self.company,
            'name': f"{self.first_name or ''} {self.last_name or ''}".strip() or self.company,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'mobile': self.mobile,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'balance': float(self.balance) if self.balance else 0,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Invoice(db.Model):
    """Invoice entity"""
    __tablename__ = 'invoices'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    client_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clients.id'), nullable=False)
    
    # Invoice details
    number = db.Column(db.String(50), nullable=False)
    date_issued = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    date_due = db.Column(db.Date)
    reference = db.Column(db.String(100))
    
    # Amounts
    subtotal = db.Column(db.Numeric(12, 2), default=0)
    discount_percentage = db.Column(db.Numeric(5, 2), default=0)
    discount_amount = db.Column(db.Numeric(12, 2), default=0)
    tax_amount = db.Column(db.Numeric(12, 2), default=0)
    total = db.Column(db.Numeric(12, 2), default=0)
    amount_paid = db.Column(db.Numeric(12, 2), default=0)
    balance_due = db.Column(db.Numeric(12, 2), default=0)
    
    # Status: Draft, Sent, Viewed, Paid, Overdue, Cancelled
    status = db.Column(db.String(20), default='Draft')
    
    # Additional info
    notes = db.Column(db.Text)
    terms = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('InvoiceItem', backref='invoice', lazy='dynamic', cascade='all, delete-orphan')
    payments = db.relationship('Payment', backref='invoice', lazy='dynamic')
    
    def to_dict(self):
        client = Client.query.get(self.client_id)
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'client_id': str(self.client_id),
            'client': client.company if client else 'Unknown',
            'number': self.number,
            'date': self.date_issued.isoformat() if self.date_issued else None,
            'date_issued': self.date_issued.isoformat() if self.date_issued else None,
            'date_due': self.date_due.isoformat() if self.date_due else None,
            'reference': self.reference,
            'subtotal': float(self.subtotal) if self.subtotal else 0,
            'discount': float(self.discount_percentage) if self.discount_percentage else 0,
            'discount_amount': float(self.discount_amount) if self.discount_amount else 0,
            'tax_amount': float(self.tax_amount) if self.tax_amount else 0,
            'amount': float(self.total) if self.total else 0,
            'total': float(self.total) if self.total else 0,
            'amount_paid': float(self.amount_paid) if self.amount_paid else 0,
            'balance_due': float(self.balance_due) if self.balance_due else 0,
            'status': self.status,
            'notes': self.notes,
            'terms': self.terms,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class InvoiceItem(db.Model):
    """Line items for invoices"""
    __tablename__ = 'invoice_items'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id = db.Column(UUID(as_uuid=True), db.ForeignKey('invoices.id'), nullable=False)
    
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    rate = db.Column(db.Numeric(12, 2), default=0)
    qty = db.Column(db.Numeric(10, 2), default=1)
    tax_percentage = db.Column(db.Numeric(5, 2), default=0)
    amount = db.Column(db.Numeric(12, 2), default=0)  # rate * qty
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'invoice_id': str(self.invoice_id),
            'name': self.name,
            'description': self.description,
            'rate': float(self.rate) if self.rate else 0,
            'qty': float(self.qty) if self.qty else 1,
            'tax': float(self.tax_percentage) if self.tax_percentage else 0,
            'amount': float(self.amount) if self.amount else 0
        }


class Estimate(db.Model):
    """Estimate/Proposal entity"""
    __tablename__ = 'estimates'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    client_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clients.id'), nullable=False)
    
    # Estimate details
    number = db.Column(db.String(50), nullable=False)
    date_issued = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    date_valid_until = db.Column(db.Date)
    reference = db.Column(db.String(100))
    
    # Amounts
    subtotal = db.Column(db.Numeric(12, 2), default=0)
    discount_percentage = db.Column(db.Numeric(5, 2), default=0)
    discount_amount = db.Column(db.Numeric(12, 2), default=0)
    tax_amount = db.Column(db.Numeric(12, 2), default=0)
    total = db.Column(db.Numeric(12, 2), default=0)
    
    # Status: Draft, Sent, Viewed, Accepted, Declined, Invoiced
    status = db.Column(db.String(20), default='Draft')
    
    # Additional info
    notes = db.Column(db.Text)
    terms = db.Column(db.Text)
    description = db.Column(db.Text)
    
    # Link to invoice if converted
    converted_invoice_id = db.Column(UUID(as_uuid=True), db.ForeignKey('invoices.id'), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('EstimateItem', backref='estimate', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        client = Client.query.get(self.client_id)
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'client_id': str(self.client_id),
            'client': client.company if client else 'Unknown',
            'number': self.number,
            'date': self.date_issued.isoformat() if self.date_issued else None,
            'date_issued': self.date_issued.isoformat() if self.date_issued else None,
            'date_valid_until': self.date_valid_until.isoformat() if self.date_valid_until else None,
            'reference': self.reference,
            'subtotal': float(self.subtotal) if self.subtotal else 0,
            'discount': float(self.discount_percentage) if self.discount_percentage else 0,
            'discount_amount': float(self.discount_amount) if self.discount_amount else 0,
            'tax_amount': float(self.tax_amount) if self.tax_amount else 0,
            'amount': float(self.total) if self.total else 0,
            'total': float(self.total) if self.total else 0,
            'status': self.status,
            'notes': self.notes,
            'terms': self.terms,
            'description': self.description,
            'converted_invoice_id': str(self.converted_invoice_id) if self.converted_invoice_id else None,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class EstimateItem(db.Model):
    """Line items for estimates"""
    __tablename__ = 'estimate_items'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    estimate_id = db.Column(UUID(as_uuid=True), db.ForeignKey('estimates.id'), nullable=False)
    
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    rate = db.Column(db.Numeric(12, 2), default=0)
    qty = db.Column(db.Numeric(10, 2), default=1)
    tax_percentage = db.Column(db.Numeric(5, 2), default=0)
    amount = db.Column(db.Numeric(12, 2), default=0)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'estimate_id': str(self.estimate_id),
            'name': self.name,
            'description': self.description,
            'rate': float(self.rate) if self.rate else 0,
            'qty': float(self.qty) if self.qty else 1,
            'tax': float(self.tax_percentage) if self.tax_percentage else 0,
            'amount': float(self.amount) if self.amount else 0
        }


class Expense(db.Model):
    """Expense tracking entity"""
    __tablename__ = 'expenses'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    client_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clients.id'), nullable=True)  # Optional - can be internal
    vendor_id = db.Column(UUID(as_uuid=True), db.ForeignKey('vendors.id'), nullable=True)
    
    # Expense details
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    merchant = db.Column(db.String(255))
    category = db.Column(db.String(100))
    description = db.Column(db.Text)
    amount = db.Column(db.Numeric(12, 2), default=0)
    
    # Status: Draft, Pending, Approved, Reimbursed
    status = db.Column(db.String(20), default='Draft')
    
    # Receipt attachment
    receipt_url = db.Column(db.Text)
    
    # Billable to client?
    is_billable = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        client = Client.query.get(self.client_id) if self.client_id else None
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'client_id': str(self.client_id) if self.client_id else None,
            'client': client.company if client else 'Internal',
            'vendor_id': str(self.vendor_id) if self.vendor_id else None,
            'date': self.date.isoformat() if self.date else None,
            'merchant': self.merchant,
            'category': self.category,
            'description': self.description,
            'amount': float(self.amount) if self.amount else 0,
            'status': self.status,
            'receipt_url': self.receipt_url,
            'is_billable': self.is_billable,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Payment(db.Model):
    """Payment tracking entity"""
    __tablename__ = 'payments'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    client_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clients.id'), nullable=False)
    invoice_id = db.Column(UUID(as_uuid=True), db.ForeignKey('invoices.id'), nullable=False)
    
    # Payment details
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    method = db.Column(db.String(50))  # Cash, Bank Transfer, Credit Card, Check, etc.
    reference = db.Column(db.String(100))  # Transaction reference
    notes = db.Column(db.Text)
    
    # Status: Pending, Confirmed, Failed, Refunded
    status = db.Column(db.String(20), default='Confirmed')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        client = Client.query.get(self.client_id)
        invoice = Invoice.query.get(self.invoice_id)
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'client_id': str(self.client_id),
            'client': client.company if client else 'Unknown',
            'invoice_id': str(self.invoice_id),
            'invoice': invoice.number if invoice else 'Unknown',
            'date': self.date.isoformat() if self.date else None,
            'amount': float(self.amount) if self.amount else 0,
            'method': self.method,
            'reference': self.reference,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Item(db.Model):
    """Product/Service catalog item"""
    __tablename__ = 'items'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    rate = db.Column(db.Numeric(12, 2), default=0)
    
    # For inventory tracking (optional)
    sku = db.Column(db.String(50))
    qty_on_hand = db.Column(db.Integer, default=0)
    
    # Type: Service, Product
    item_type = db.Column(db.String(20), default='Service')
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'name': self.name,
            'description': self.description,
            'rate': float(self.rate) if self.rate else 0,
            'sku': self.sku,
            'qty': self.qty_on_hand,
            'item_type': self.item_type,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Vendor(db.Model):
    """Vendor/Supplier entity"""
    __tablename__ = 'vendors'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    
    company = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    expenses = db.relationship('Expense', backref='vendor', lazy='dynamic')
    bills = db.relationship('Bill', backref='vendor', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'company': self.company,
            'name': f"{self.first_name or ''} {self.last_name or ''}".strip() or self.company,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Bill(db.Model):
    """Bills payable entity"""
    __tablename__ = 'bills'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    vendor_id = db.Column(UUID(as_uuid=True), db.ForeignKey('vendors.id'), nullable=True)
    
    number = db.Column(db.String(50))
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    due_date = db.Column(db.Date)
    
    amount = db.Column(db.Numeric(12, 2), default=0)
    status = db.Column(db.String(20), default='Draft')  # Draft, Due, Paid, Overdue
    
    notes = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        vendor = Vendor.query.get(self.vendor_id) if self.vendor_id else None
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'vendor_id': str(self.vendor_id) if self.vendor_id else None,
            'vendor': vendor.company if vendor else 'Unknown',
            'number': self.number,
            'date': self.date.isoformat() if self.date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'amount': float(self.amount) if self.amount else 0,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class TeamMember(db.Model):
    """Team members for the organization"""
    __tablename__ = 'team_members'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    role = db.Column(db.String(100))  # Job title/role
    hourly_rate = db.Column(db.Numeric(10, 2), default=0)
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'name': f"{self.first_name} {self.last_name or ''}".strip(),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'hourly_rate': float(self.hourly_rate) if self.hourly_rate else 0,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class RecurringTemplate(db.Model):
    """Recurring invoice templates"""
    __tablename__ = 'recurring_templates'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    client_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clients.id'), nullable=False)
    
    name = db.Column(db.String(255), nullable=False)
    frequency = db.Column(db.String(20))  # weekly, monthly, quarterly, yearly
    next_date = db.Column(db.Date)
    
    # Template data (JSON or separate items table)
    amount = db.Column(db.Numeric(12, 2), default=0)
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        client = Client.query.get(self.client_id)
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'client_id': str(self.client_id),
            'client': client.company if client else 'Unknown',
            'name': self.name,
            'frequency': self.frequency,
            'next_date': self.next_date.isoformat() if self.next_date else None,
            'amount': float(self.amount) if self.amount else 0,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
