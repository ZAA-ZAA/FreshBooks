import React, { useState, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthStep } from './types';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoicesList from './pages/InvoicesList';
import ClientsList from './pages/ClientsList';
import ExpensesList from './pages/ExpensesList';
import Reports from './pages/Reports';
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
    if (!localStorage.getItem('fb_clients')) {
        const initialClients = [
            { id: 1, name: 'John Doe', company: 'Acme Corp', email: 'john@acme.com', phone: '555-0123', balance: 0 },
            { id: 2, name: 'Jane Smith', company: 'Design Studio', email: 'jane@design.studio', phone: '555-0987', balance: 2500.00 },
        ];
        localStorage.setItem('fb_clients', JSON.stringify(initialClients));
    }
    if (!localStorage.getItem('fb_invoices')) {
        const initialInvoices = [
             { id: '1', number: '0000001', client: 'Acme Corp', date: '2026-01-27', amount: 2500.00, status: 'Draft', description: 'Web Design Services' }
        ];
        localStorage.setItem('fb_invoices', JSON.stringify(initialInvoices));
    }
    if (!localStorage.getItem('fb_estimates')) {
        const initialEstimates = [
             { id: '1', number: '0000001', client: 'Acme Corp', date: '2026-01-20', amount: 5000.00, status: 'Accepted', description: 'Q1 Marketing Plan' }
        ];
        localStorage.setItem('fb_estimates', JSON.stringify(initialEstimates));
    }
    if (!localStorage.getItem('fb_expenses')) {
        const initialExpenses = [
            { id: 1, date: '2026-01-20', merchant: 'AWS', category: 'Online Services', amount: 120.50, status: 'Billable', hasReceipt: true },
            { id: 2, date: '2026-01-15', merchant: 'Uber', category: 'Travel', amount: 24.30, status: 'Non-billable', hasReceipt: false },
        ];
        localStorage.setItem('fb_expenses', JSON.stringify(initialExpenses));
    }
    if (!localStorage.getItem('fb_items')) {
        const initialItems = [
            { id: 1, name: 'Web Design', description: 'General web design services per hour', rate: 2500, qty: 1 },
            { id: 2, name: 'SEO Audit', description: 'Comprehensive site analysis', rate: 15000, qty: 1 },
        ];
        localStorage.setItem('fb_items', JSON.stringify(initialItems));
    }
    if (!localStorage.getItem('fb_projects')) {
        const initialProjects = [
            { id: 1, title: 'Website Redesign', client: 'Acme Corp', status: 'Active', hours: 12.5, team: 3 },
            { id: 2, title: 'Mobile App Dev', client: 'Design Studio', status: 'Active', hours: 0, team: 1 },
        ];
        localStorage.setItem('fb_projects', JSON.stringify(initialProjects));
    }
    if (!localStorage.getItem('fb_payments')) {
        const initialPayments = [
            { id: 1, date: '2026-01-25', client: 'Tech Start Inc', method: 'Credit Card', amount: 14200.00, invoice: '0000003' },
            { id: 2, date: '2026-01-20', client: 'Acme Corp', method: 'Bank Transfer', amount: 15000.00, invoice: '0000002' },
        ];
        localStorage.setItem('fb_payments', JSON.stringify(initialPayments));
    }
    if (!localStorage.getItem('fb_bills')) {
        const initialBills = [
            { id: 1, date: '2026-01-15', vendor: 'Office Depot', details: 'Office Chairs', amount: 4500.00, status: 'Overdue' },
            { id: 2, date: '2026-01-25', vendor: 'AWS', details: 'Cloud Hosting', amount: 12200.00, status: 'Unpaid' },
        ];
        localStorage.setItem('fb_bills', JSON.stringify(initialBills));
    }
    if (!localStorage.getItem('fb_vendors')) {
        const initialVendors = [
            { id: 1, name: 'Office Depot', email: 'support@officedepot.com', phone: '555-0001', balance: 4500.00 },
            { id: 2, name: 'AWS', email: 'billing@aws.amazon.com', phone: '', balance: 12200.00 },
        ];
        localStorage.setItem('fb_vendors', JSON.stringify(initialVendors));
    }
    if (!localStorage.getItem('fb_team')) {
        const initialTeam = [
            { id: 1, name: 'Demo Owner', email: 'owner@demo.com', role: 'Owner', status: 'Active' },
            { id: 2, name: 'Sarah Accountant', email: 'sarah@cpa.com', role: 'Accountant', status: 'Invited' },
        ];
        localStorage.setItem('fb_team', JSON.stringify(initialTeam));
    }
    if (!localStorage.getItem('fb_time_entries')) {
        const initialTime = [
            { id: 1, date: '2026-01-26', task: 'Website Redesign', client: 'Acme Corp', duration: '2:00', durationSec: 7200 },
            { id: 2, date: '2026-01-26', task: 'Client Meeting', client: 'Acme Corp', duration: '2:30', durationSec: 9000 },
        ];
        localStorage.setItem('fb_time_entries', JSON.stringify(initialTime));
    }
    if (!localStorage.getItem('fb_user_profile')) {
        const initialProfile = { firstName: 'John', lastName: 'Doe', email: 'john.doe@demo.com', phone: '(555) 123-4567', company: 'Demo Company' };
        localStorage.setItem('fb_user_profile', JSON.stringify(initialProfile));
    }
};

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.LOGIN_START);
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
      setAuthStep(AuthStep.LOGIN_START);
      localStorage.removeItem('fb_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <HashRouter>
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            </Route>

            {/* Auth Routes */}
            <Route 
            path="/signup" 
            element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Signup authStep={authStep} setAuthStep={setAuthStep} onComplete={login} />
            } 
            />

            {/* Protected App Routes */}
            <Route 
            element={isAuthenticated ? <AppLayout /> : <Navigate to="/signup" replace />}
            >
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/invoices" element={<InvoicesList />} />
            <Route path="/invoices/new" element={<InvoiceCreate />} />
            <Route path="/invoices/:id" element={<InvoiceCreate />} />
            
            <Route path="/estimates" element={<EstimatesList />} />
            <Route path="/estimates/new" element={<InvoiceCreate />} />
            <Route path="/estimates/:id" element={<InvoiceCreate />} />

            <Route path="/clients" element={<ClientsList />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/reports" element={<Reports />} />
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