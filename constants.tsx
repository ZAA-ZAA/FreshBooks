import React from 'react';
import { NavItem } from './types';
import { 
  LayoutDashboard, Users, FileText, Clock, CreditCard, 
  Receipt, Briefcase, Calculator, BarChart3, Settings,
  Package, Plug, UserPlus, FileOutput, Store
} from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Features', isMega: true, subItems: ['Invoicing', 'Payments', 'Time Tracking', 'Expenses', 'Reporting'] },
  { label: 'Small Business', isMega: true, subItems: ['Freelancers', 'Contractors', 'Self-Employed'] },
  { label: 'Accountants', subItems: ['Partner Program', 'Accountant Hub'] },
  { label: 'Resources', subItems: ['Blog', 'Glossary', 'Learning Center'] },
  { label: 'Compare', subItems: ['vs QuickBooks', 'vs Xero'] },
];

export const SIDEBAR_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <Users size={20} />, label: 'Clients', path: '/clients' },
  { icon: <FileText size={20} />, label: 'Invoices', path: '/invoices' },
  { icon: <CreditCard size={20} />, label: 'Payments', path: '/payments' },
  { icon: <Receipt size={20} />, label: 'Expenses', path: '/expenses' },
  { icon: <FileText size={20} />, label: 'Estimates', path: '/estimates' },
  { icon: <Briefcase size={20} />, label: 'Projects', path: '/projects' },
  { icon: <Clock size={20} />, label: 'Time Tracking', path: '/time-tracking' },
  { icon: <FileOutput size={20} />, label: 'Bills', path: '/bills' },
  { icon: <Store size={20} />, label: 'Vendors', path: '/vendors' },
  { icon: <Package size={20} />, label: 'Items & Services', path: '/items' },
  { icon: <Calculator size={20} />, label: 'Accounting', path: '/accounting' },
  { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
  { icon: <UserPlus size={20} />, label: 'Team', path: '/team' },
  { icon: <Plug size={20} />, label: 'Apps', path: '/apps' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
];

export const MOCK_REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];