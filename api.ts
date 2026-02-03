/**
 * API Service Layer
 * Handles all communication with the Python/PostgreSQL backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Store tenant ID in memory (set after login/init)
let currentTenantId: string | null = null;

// ==================== HTTP HELPERS ====================

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(currentTenantId ? { 'X-Tenant-ID': currentTenantId } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP error ${response.status}`,
            };
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error. Make sure the backend server is running.',
        };
    }
}

// HTTP Methods
const get = <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' });

const post = <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });

const put = <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

const del = <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' });

// ==================== TENANT MANAGEMENT ====================

export function setTenantId(tenantId: string) {
    currentTenantId = tenantId;
    localStorage.setItem('fb_tenant_id', tenantId);
}

export function getTenantId(): string | null {
    if (!currentTenantId) {
        currentTenantId = localStorage.getItem('fb_tenant_id');
    }
    return currentTenantId;
}

export function clearTenantId() {
    currentTenantId = null;
    localStorage.removeItem('fb_tenant_id');
}

// ==================== INITIALIZATION ====================

export async function initDatabase() {
    const response = await post<{
        tenant: any;
        user?: any;
        message?: string;
    }>('/init', {});
    
    if (response.success && response.data?.tenant) {
        setTenantId(response.data.tenant.id);
    }
    
    return response;
}

export async function healthCheck() {
    return get<{ status: string; database: string }>('/health');
}

// ==================== AUTH API ====================

export const authApi = {
    async checkEmail(email: string) {
        const response = await get<{ available: boolean; exists?: boolean }>(
            `/auth/check-email?email=${encodeURIComponent(email.trim())}`
        );
        return response;
    },

    async sendOtp(email: string) {
        return post<{ sent?: boolean }>('/auth/send-otp', { email: email.trim() });
    },

    async verifyOtp(email: string, otp: string) {
        return post<{ verified?: boolean }>('/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
    },

    async register(data: {
        email: string;
        password: string;
        otp: string;
        company_name?: string;
        first_name?: string;
        last_name?: string;
        phone?: string;
    }) {
        const response = await post<{ user: any; tenant: any }>('/auth/register', data);
        if (response.success && response.data?.tenant) {
            setTenantId(response.data.tenant.id);
        }
        return response;
    },

    async login(email: string, password: string) {
        const response = await post<{ user: any; tenant: any }>('/auth/login', { email, password });
        if (response.success && response.data?.tenant) {
            setTenantId(response.data.tenant.id);
        }
        return response;
    },

    async getCurrentUser() {
        return get<{ user: any; tenant: any }>('/auth/me');
    },

    logout() {
        clearTenantId();
        localStorage.removeItem('fb_user');
    },
};

// ==================== CLIENT API ====================

export interface ClientData {
    id?: string;
    company: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    balance?: number;
}

export const clientsApi = {
    async getAll(): Promise<ApiResponse<ClientData[]>> {
        return get<ClientData[]>('/clients');
    },

    async getById(id: string): Promise<ApiResponse<ClientData>> {
        return get<ClientData>(`/clients/${id}`);
    },

    async create(data: ClientData): Promise<ApiResponse<ClientData>> {
        return post<ClientData>('/clients', data);
    },

    async update(id: string, data: Partial<ClientData>): Promise<ApiResponse<ClientData>> {
        return put<ClientData>(`/clients/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/clients/${id}`);
    },
};

// ==================== INVOICE API ====================

export interface InvoiceItemData {
    id?: string;
    name: string;
    description?: string;
    rate: number;
    qty: number;
    tax?: number;
}

export interface InvoiceData {
    id?: string;
    client_id?: string;
    client?: string;
    number?: string;
    date?: string;
    date_due?: string;
    reference?: string;
    items?: InvoiceItemData[];
    notes?: string;
    terms?: string;
    discount?: number;
    status?: string;
    amount?: number;
    total?: number;
}

export const invoicesApi = {
    async getAll(): Promise<ApiResponse<InvoiceData[]>> {
        return get<InvoiceData[]>('/invoices');
    },

    async getById(id: string): Promise<ApiResponse<InvoiceData>> {
        return get<InvoiceData>(`/invoices/${id}`);
    },

    async getNextNumber(): Promise<ApiResponse<{ number: string }>> {
        return get<{ number: string }>('/invoices/next-number');
    },

    async create(data: InvoiceData): Promise<ApiResponse<InvoiceData>> {
        return post<InvoiceData>('/invoices', data);
    },

    async update(id: string, data: Partial<InvoiceData>): Promise<ApiResponse<InvoiceData>> {
        return put<InvoiceData>(`/invoices/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/invoices/${id}`);
    },

    async sendEmail(invoiceId: string, to: string, options?: { attachPdf?: boolean; pdfBase64?: string }): Promise<ApiResponse<{ sent?: boolean }>> {
        return post<{ sent?: boolean }>(`/invoices/${invoiceId}/send-email`, { to: to.trim(), attach_pdf: options?.attachPdf, pdf_base64: options?.pdfBase64 });
    },
};

// ==================== ESTIMATE API ====================

export interface EstimateData {
    id?: string;
    client_id?: string;
    client?: string;
    number?: string;
    date?: string;
    date_valid_until?: string;
    reference?: string;
    items?: InvoiceItemData[];
    notes?: string;
    terms?: string;
    description?: string;
    discount?: number;
    status?: string;
    amount?: number;
    total?: number;
}

export const estimatesApi = {
    async getAll(): Promise<ApiResponse<EstimateData[]>> {
        return get<EstimateData[]>('/estimates');
    },

    async getById(id: string): Promise<ApiResponse<EstimateData>> {
        return get<EstimateData>(`/estimates/${id}`);
    },

    async getNextNumber(): Promise<ApiResponse<{ number: string }>> {
        return get<{ number: string }>('/estimates/next-number');
    },

    async create(data: EstimateData): Promise<ApiResponse<EstimateData>> {
        return post<EstimateData>('/estimates', data);
    },

    async update(id: string, data: Partial<EstimateData>): Promise<ApiResponse<EstimateData>> {
        return put<EstimateData>(`/estimates/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/estimates/${id}`);
    },

    async convertToInvoice(id: string): Promise<ApiResponse<InvoiceData>> {
        return post<InvoiceData>(`/estimates/${id}/convert`, {});
    },

    async sendEmail(estimateId: string, to: string, options?: { attachPdf?: boolean; pdfBase64?: string }): Promise<ApiResponse<{ sent?: boolean }>> {
        return post<{ sent?: boolean }>(`/estimates/${estimateId}/send-email`, { to: to.trim(), attach_pdf: options?.attachPdf, pdf_base64: options?.pdfBase64 });
    },
};

// ==================== EXPENSE API ====================

export interface ExpenseData {
    id?: string;
    client_id?: string;
    client?: string;
    vendor_id?: string;
    date?: string;
    merchant?: string;
    category?: string;
    description?: string;
    amount?: number;
    status?: string;
    is_billable?: boolean;
}

export const expensesApi = {
    async getAll(): Promise<ApiResponse<ExpenseData[]>> {
        return get<ExpenseData[]>('/expenses');
    },

    async getById(id: string): Promise<ApiResponse<ExpenseData>> {
        return get<ExpenseData>(`/expenses/${id}`);
    },

    async create(data: ExpenseData): Promise<ApiResponse<ExpenseData>> {
        return post<ExpenseData>('/expenses', data);
    },

    async update(id: string, data: Partial<ExpenseData>): Promise<ApiResponse<ExpenseData>> {
        return put<ExpenseData>(`/expenses/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/expenses/${id}`);
    },
};

// ==================== PAYMENT API ====================

export interface PaymentData {
    id?: string;
    client_id?: string;
    client?: string;
    invoice_id?: string;
    invoice?: string;
    date?: string;
    amount?: number;
    method?: string;
    reference?: string;
    notes?: string;
    status?: string;
}

export const paymentsApi = {
    async getAll(): Promise<ApiResponse<PaymentData[]>> {
        return get<PaymentData[]>('/payments');
    },

    async getById(id: string): Promise<ApiResponse<PaymentData>> {
        return get<PaymentData>(`/payments/${id}`);
    },

    async create(data: PaymentData): Promise<ApiResponse<PaymentData>> {
        return post<PaymentData>('/payments', data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/payments/${id}`);
    },
};

// ==================== ITEM API ====================

export interface ItemData {
    id?: string;
    name: string;
    description?: string;
    rate?: number;
    sku?: string;
    qty?: number;
    item_type?: string;
}

export const itemsApi = {
    async getAll(): Promise<ApiResponse<ItemData[]>> {
        return get<ItemData[]>('/items');
    },

    async getById(id: string): Promise<ApiResponse<ItemData>> {
        return get<ItemData>(`/items/${id}`);
    },

    async create(data: ItemData): Promise<ApiResponse<ItemData>> {
        return post<ItemData>('/items', data);
    },

    async update(id: string, data: Partial<ItemData>): Promise<ApiResponse<ItemData>> {
        return put<ItemData>(`/items/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/items/${id}`);
    },
};

// ==================== VENDOR API ====================

export interface VendorData {
    id?: string;
    company: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export const vendorsApi = {
    async getAll(): Promise<ApiResponse<VendorData[]>> {
        return get<VendorData[]>('/vendors');
    },

    async create(data: VendorData): Promise<ApiResponse<VendorData>> {
        return post<VendorData>('/vendors', data);
    },

    async update(id: string, data: Partial<VendorData>): Promise<ApiResponse<VendorData>> {
        return put<VendorData>(`/vendors/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/vendors/${id}`);
    },
};

// ==================== TEAM API ====================

export interface TeamMemberData {
    id?: string;
    first_name: string;
    last_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    hourly_rate?: number;
}

export const teamApi = {
    async getAll(): Promise<ApiResponse<TeamMemberData[]>> {
        return get<TeamMemberData[]>('/team');
    },

    async create(data: TeamMemberData): Promise<ApiResponse<TeamMemberData>> {
        return post<TeamMemberData>('/team', data);
    },

    async update(id: string, data: Partial<TeamMemberData>): Promise<ApiResponse<TeamMemberData>> {
        return put<TeamMemberData>(`/team/${id}`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/team/${id}`);
    },
};

// ==================== BILL API ====================

export interface BillData {
    id?: string;
    vendor_id?: string;
    vendor?: string;
    number?: string;
    date?: string;
    due_date?: string;
    amount?: number;
    status?: string;
    notes?: string;
}

export const billsApi = {
    async getAll(): Promise<ApiResponse<BillData[]>> {
        return get<BillData[]>('/bills');
    },

    async create(data: BillData): Promise<ApiResponse<BillData>> {
        return post<BillData>('/bills', data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/bills/${id}`);
    },
};

// ==================== RECURRING TEMPLATE API ====================

export interface RecurringTemplateData {
    id?: string;
    client_id?: string;
    client?: string;
    name: string;
    frequency?: string;
    next_date?: string;
    amount?: number;
}

export const recurringTemplatesApi = {
    async getAll(): Promise<ApiResponse<RecurringTemplateData[]>> {
        return get<RecurringTemplateData[]>('/recurring-templates');
    },

    async create(data: RecurringTemplateData): Promise<ApiResponse<RecurringTemplateData>> {
        return post<RecurringTemplateData>('/recurring-templates', data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/recurring-templates/${id}`);
    },
};

// ==================== REPORTS API ====================

export const reportsApi = {
    async sendEmail(to: string, options?: { attachPdf?: boolean; pdfBase64?: string; pdfFilename?: string }): Promise<ApiResponse<{ sent?: boolean }>> {
        return post<{ sent?: boolean }>('/reports/send-email', {
            to: to.trim(),
            attach_pdf: options?.attachPdf,
            pdf_base64: options?.pdfBase64,
            pdf_filename: options?.pdfFilename || 'invoice-details-report.pdf',
        });
    },
};

// ==================== DASHBOARD API ====================

export interface DashboardStats {
    received: number;
    outstanding: number;
    overdue: number;
    spent: number;
}

export const dashboardApi = {
    async getStats(): Promise<ApiResponse<DashboardStats>> {
        return get<DashboardStats>('/dashboard/stats');
    },
};

// ==================== EXPORT DEFAULT ====================

export default {
    init: initDatabase,
    health: healthCheck,
    setTenantId,
    getTenantId,
    clearTenantId,
    auth: authApi,
    clients: clientsApi,
    invoices: invoicesApi,
    estimates: estimatesApi,
    expenses: expensesApi,
    payments: paymentsApi,
    reports: reportsApi,
    items: itemsApi,
    vendors: vendorsApi,
    team: teamApi,
    bills: billsApi,
    recurringTemplates: recurringTemplatesApi,
    dashboard: dashboardApi,
};
