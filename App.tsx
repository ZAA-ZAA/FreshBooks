// @ts-nocheck
import React, { useState, useContext, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthStep } from './types';
import { initDatabase, getTenantId, setTenantId, authApi, clearTenantId } from './api';
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
  isLoading: boolean;
  user: any | null;
  tenant: any | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  tenant: null,
  login: async () => ({ success: false }),
  logout: () => {},
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.SIGNUP_START);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [tenant, setTenant] = useState<any | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Initialize app and check authentication
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database (creates default tenant if needed)
        const initResponse = await initDatabase();
        
        if (!initResponse.success) {
          setBackendError('Unable to connect to backend. Make sure the Python server is running on http://localhost:5000');
          setIsLoading(false);
          return;
        }

        // Check if user was previously logged in
        const storedUser = localStorage.getItem('fb_user');
        const storedTenant = localStorage.getItem('fb_tenant');
        
        if (storedUser && storedTenant) {
          try {
            const userData = JSON.parse(storedUser);
            const tenantData = JSON.parse(storedTenant);
            setUser(userData);
            setTenant(tenantData);
            setTenantId(tenantData.id);
            setIsAuthenticated(true);
          } catch (e) {
            // Invalid stored data, clear it
            localStorage.removeItem('fb_user');
            localStorage.removeItem('fb_tenant');
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setBackendError('Unable to connect to backend. Make sure the Python server is running on http://localhost:5000');
      }
      
      setIsLoading(false);
    };

    initApp();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    
    if (response.success && response.data) {
      setUser(response.data.user);
      setTenant(response.data.tenant);
      setIsAuthenticated(true);
      setAuthStep(AuthStep.COMPLETED);
      
      // Store for persistence
      localStorage.setItem('fb_user', JSON.stringify(response.data.user));
      localStorage.setItem('fb_tenant', JSON.stringify(response.data.tenant));
      
      return { success: true };
    }
    
    return { success: false, error: response.error || 'Login failed' };
  };

  const register = async (data: any) => {
    const response = await authApi.register(data);
    
    if (response.success && response.data) {
      setUser(response.data.user);
      setTenant(response.data.tenant);
      setIsAuthenticated(true);
      setAuthStep(AuthStep.COMPLETED);
      
      // Store for persistence
      localStorage.setItem('fb_user', JSON.stringify(response.data.user));
      localStorage.setItem('fb_tenant', JSON.stringify(response.data.tenant));
      
      return { success: true };
    }
    
    return { success: false, error: response.error || 'Registration failed' };
  };

  const logout = () => {
    // Apply auth state synchronously so navigation sees updated isAuthenticated
    flushSync(() => {
      setIsAuthenticated(false);
      setUser(null);
      setTenant(null);
      setAuthStep(AuthStep.SIGNUP_START);
    });
    authApi.logout();
    localStorage.removeItem('fb_user');
    localStorage.removeItem('fb_tenant');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="text-center">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="bg-[#0075dd] p-2 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center text-white font-black text-2xl leading-none">f</div>
            </div>
            <span className="text-3xl font-black text-[#002a63] tracking-tight">FreshBooks</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0075dd] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show backend error
  if (backendError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9] p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg text-center">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="bg-[#0075dd] p-2 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center text-white font-black text-2xl leading-none">f</div>
            </div>
            <span className="text-3xl font-black text-[#002a63] tracking-tight">FreshBooks</span>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-red-700 font-bold text-lg mb-2">Backend Connection Error</h2>
            <p className="text-red-600 text-sm">{backendError}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-bold text-gray-700 mb-2">To start the backend:</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Open a terminal in the <code className="bg-gray-200 px-1 rounded">backend</code> folder</li>
              <li>Create a <code className="bg-gray-200 px-1 rounded">.env</code> file from <code className="bg-gray-200 px-1 rounded">.env.example</code></li>
              <li>Set your PostgreSQL password in <code className="bg-gray-200 px-1 rounded">.env</code></li>
              <li>Run: <code className="bg-gray-200 px-1 rounded">pip install -r requirements.txt</code></li>
              <li>Run: <code className="bg-gray-200 px-1 rounded">python app.py</code></li>
            </ol>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-[#0075dd] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#005aab]"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, tenant, login, logout, register }}>
        <HashRouter>
        <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
            </Route>

            <Route 
              path="/signup" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup authStep={authStep} setAuthStep={setAuthStep} onComplete={() => {}} />} 
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
