// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { User, Building, CreditCard, CheckCircle2, Loader2, Shield, Bell, Save } from 'lucide-react';
import { useAuth } from '../App';
import { tenantApi } from '../api';

export default function SettingsPage() {
  const { user, tenant } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    industry: 'Technology',
    currency: 'PHP — Philippine Peso'
  });

  const TOAST_DURATION_MS = 4000;

  useEffect(() => {
    if (user) {
      const [first = '', last = ''] = (user.first_name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user?.id, user?.first_name, user?.last_name, user?.email]);

  useEffect(() => {
    if (tenant) {
      setFormData(prev => ({
        ...prev,
        companyName: tenant.name || prev.companyName,
        phone: tenant.phone || prev.phone,
        address: tenant.address || prev.address,
        currency: tenant.currency ? `${tenant.currency} — ${tenant.currency === 'PHP' ? 'Philippine Peso' : tenant.currency === 'USD' ? 'US Dollar' : tenant.currency === 'EUR' ? 'Euro' : tenant.currency}` : prev.currency,
      }));
    }
  }, [tenant?.id, tenant?.name, tenant?.phone, tenant?.address, tenant?.currency]);

  useEffect(() => {
    const stored = localStorage.getItem('fb_user_profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [showToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'business') {
        const currencyCode = formData.currency?.split(' ')[0] || 'PHP';
        const res = await tenantApi.update({
          name: formData.companyName,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          currency: currencyCode,
        });
        if (res.success) setShowToast(true);
      } else {
        localStorage.setItem('fb_user_profile', JSON.stringify(formData));
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'business', label: 'Business Information', icon: Building },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] bg-[#28303f] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10">
          <CheckCircle2 className="text-fb-green mr-3" size={20} />
          <span className="font-bold">Settings Saved Successfully</span>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-fb-navy mb-2">Settings</h1>
        <p className="text-gray-500">Manage your personal information, business details, and subscription plans.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-none">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-fb-blue text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Form Area */}
        <main className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-fb-navy border-b border-gray-100 pb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-fb-navy border-b border-gray-100 pb-4">Business Information</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Address</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all resize-none"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Currency</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-fb-blue outline-none transition-all bg-white"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option>PHP — Philippine Peso</option>
                    <option>USD — US Dollar</option>
                    <option>EUR — Euro</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-fb-navy border-b border-gray-100 pb-4">Plan & Billing</h3>
                
                <div className="bg-fb-cream border border-blue-100 p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-fb-navy text-lg mb-1">Plus Plan</div>
                    <p className="text-sm text-gray-600">Your next billing date is Feb 28, 2026.</p>
                  </div>
                  <button className="bg-fb-blue hover:bg-fb-darkBlue text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all">
                    Manage Plan
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-600">Payment Method</span>
                    <span className="text-sm text-fb-navy font-bold">Visa ending in 4242</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-600">Next Invoice</span>
                    <span className="text-sm text-gray-400">Feb 28, 2026</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="button" className="text-red-500 text-sm font-bold hover:underline">Cancel Subscription</button>
                </div>
              </div>
            )}

            {(activeTab === 'notifications' || activeTab === 'security') && (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-fb-blue">
                   {activeTab === 'notifications' ? <Bell size={32} /> : <Shield size={32} />}
                </div>
                <h3 className="text-xl font-bold text-fb-navy">Coming Soon</h3>
                <p className="text-gray-500">This configuration panel is part of our upcoming Pro update.</p>
              </div>
            )}

            {activeTab !== 'billing' && activeTab !== 'notifications' && activeTab !== 'security' && (
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-fb-green hover:brightness-110 text-white font-bold py-3 px-10 rounded-lg shadow-lg flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  Save Settings
                </button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}