// @ts-nocheck
import React, { useState, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthStep } from './types';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoicesList from './pages/InvoicesList';
import RecurringTemplatesList from './pages/RecurringTemplatesList';
import RetainersList from './pages/RetainersList';
import ClientsList from './pages/ClientsList';
import ClientDetail from './pages/ClientDetail';
import ClientEdit from './pages/ClientEdit';
import ExpensesList from './pages/ExpensesList';
import ExpenseCreate from './pages/ExpenseCreate';
import Reports from './pages/Reports';
import InvoiceDetailsReport from './pages/InvoiceDetailsReport';
import ExpenseReport from './pages/ExpenseReport';
import ItemSalesReport from './pages/ItemSalesReport';
import SettingsPage from './pages/SettingsPage';
import EstimatesList from './pages/EstimatesList';
import TimeTracking from './pages/TimeTracking';
import ProjectsList from './pages/ProjectsList';
import PaymentsList from './pages/PaymentsList';
import Accounting from './pages/Accounting';
import ItemsList from './pages/ItemsList';
import BillsList from './pages/BillsList';
import VendorsList from './pages/VendorsList';
import TeamList from './pages/TeamList';
import AppsList from './pages/AppsList';

// --- Auth Context ---
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// --- Data Seeding ---
const seedData = () => {
    const defaultInvoices = [
        { 
            id: '1', 
            number: '0000001', 
            client: 'ABC Inc.', 
            date: '2026-01-27', 
            amount: 29.24, 
            status: 'Paid', 
            items: [
                { id: 'i1', name: 'can edit add item name', rate: 2.00, qty: 3, tax: 0 },
                { id: 'i2', name: 'can also edit rate add and change qty and line total', rate: 1.00, qty: 11, tax: 0 },
                { id: 'i3', name: '', rate: 12.00, qty: 1, tax: 2 }
            ],
            notes: '',
            terms: ''
        }
    ];
    const defaultClients = [
        { id: '775437', name: 'Zoen Aldueza', company: 'ABC Inc.', email: 'zoen@abc.com', phone: '0912', balance: 0 },
        { id: '1', name: 'John Doe', company: 'Acme Corp', email: 'john@acme.com', phone: '555-0123', balance: 2500.00 },
        { id: '2', name: 'Jane Smith', company: 'Design Studio', email: 'jane@design.studio', phone: '555-0987', balance: 0 },
    ];
    const defaultExpenses = [
        { id: '1', date: '2026-01-29', merchant: 'ABC', category: 'Rent or Lease', amount: 1321.00, status: 'Draft', description: 'test', client: 'John Doe' }
    ];
    const defaultItems = [
        { id: 1, name: 'Web Design', description: 'General web design services per hour', rate: 2500, qty: 1 },
        { id: 2, name: 'SEO Audit', description: 'Comprehensive site analysis', rate: 15000, qty: 1 },
    ];

    if (!localStorage.getItem('fb_clients')) localStorage.setItem('fb_clients', JSON.stringify(defaultClients));
    if (!localStorage.getItem('fb_invoices')) localStorage.setItem('fb_invoices', JSON.stringify(defaultInvoices));
    if (!localStorage.getItem('fb_estimates')) localStorage.setItem('fb_estimates', JSON.stringify([]));
    if (!localStorage.getItem('fb_expenses')) localStorage.setItem('fb_expenses', JSON.stringify(defaultExpenses));
    if (!localStorage.getItem('fb_items')) localStorage.setItem('fb_items', JSON.stringify(defaultItems));
    if (!localStorage.getItem('fb_payments')) localStorage.setItem('fb_payments', JSON.stringify([]));
    if (!localStorage.getItem('fb_bills')) localStorage.setItem('fb_bills', JSON.stringify([]));
    if (!localStorage.getItem('fb_vendors')) localStorage.setItem('fb_vendors', JSON.stringify([]));
    if (!localStorage.getItem('fb_team')) localStorage.setItem('fb_team', JSON.stringify([]));
    if (!localStorage.getItem('fb_templates')) localStorage.setItem('fb_templates', JSON.stringify([]));
};

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.SIGNUP_START);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      return localStorage.getItem('fb_auth') === 'true';
  });

  useEffect(() => {
      seedData();
  }, []);

  const login = () => {
      setAuthStep(AuthStep.COMPLETED);
      setIsAuthenticated(true);
      localStorage.setItem('fb_auth', 'true');
  };

  const logout = () => {
      setIsAuthenticated(false);
      setAuthStep(AuthStep.SIGNUP_START);
      localStorage.removeItem('fb_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <HashRouter>
        <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
            </Route>

            <Route 
              path="/signup" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup authStep={authStep} setAuthStep={setAuthStep} onComplete={login} />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
            />

            <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/invoices" element={<InvoicesList />} />
              <Route path="/recurring-templates" element={<RecurringTemplatesList />} />
              <Route path="/retainers" element={<RetainersList />} />
              <Route path="/invoices/new" element={<InvoiceCreate />} />
              <Route path="/invoices/:id" element={<InvoiceCreate />} />
              <Route path="/invoices/:id/edit" element={<InvoiceCreate />} />
              
              <Route path="/estimates" element={<EstimatesList />} />
              <Route path="/estimates/new" element={<InvoiceCreate />} />
              <Route path="/estimates/:id" element={<InvoiceCreate />} />
              <Route path="/estimates/:id/edit" element={<InvoiceCreate />} />

              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/new" element={<ClientEdit />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/clients/:id/edit" element={<ClientEdit />} />

              <Route path="/expenses" element={<ExpensesList />} />
              <Route path="/expenses/new" element={<ExpenseCreate />} />
              <Route path="/expenses/:id" element={<ExpenseCreate />} />
              <Route path="/expenses/:id/edit" element={<ExpenseCreate />} />

              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/invoice-details" element={<InvoiceDetailsReport />} />
              <Route path="/reports/expense-report" element={<ExpenseReport />} />
              <Route path="/reports/item-sales" element={<ItemSalesReport />} />
              
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/payments" element={<PaymentsList />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/items" element={<ItemsList />} />
              <Route path="/bills" element={<BillsList />} />
              <Route path="/vendors" element={<VendorsList />} />
              <Route path="/team" element={<TeamList />} />
              <Route path="/apps" element={<AppsList />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
        </HashRouter>
    </AuthContext.Provider>
  );
}
