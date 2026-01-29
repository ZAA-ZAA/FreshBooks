import React from 'react';
import { NavItem } from './types';
import { 
  LayoutDashboard, Users, Calculator, FileText, CreditCard, 
  Receipt, Briefcase, Clock, BarChart3, Settings, Grid, UserCheck, Package, Landmark
} from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Features', isMega: true, subItems: ['Invoicing', 'Payments', 'Time Tracking', 'Expenses', 'Reporting'] },
  { label: 'Small Business', isMega: true, subItems: ['Freelancers', 'Contractors', 'Self-Employed'] },
  { label: 'Accountants', subItems: ['Partner Program', 'Accountant Hub'] },
  { label: 'Resources', subItems: ['Blog', 'Glossary', 'Learning Center'] },
  { label: 'Compare', subItems: ['vs QuickBooks', 'vs Xero'] },
];

export const SIDEBAR_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard', hasChevron: false },
  { icon: <Users size={20} />, label: 'Clients', path: '/clients', hasChevron: false },
  { icon: <Calculator size={20} />, label: 'Estimates', path: '/estimates', hasChevron: false },
  { icon: <FileText size={20} />, label: 'Invoices', path: '/invoices', hasChevron: true },
  { icon: <CreditCard size={20} />, label: 'Payments', path: '/payments', hasChevron: true },
  { icon: <Receipt size={20} />, label: 'Expenses', path: '/expenses', hasChevron: true },
  { icon: <Briefcase size={20} />, label: 'Projects', path: '/projects', hasChevron: false },
  { icon: <Clock size={20} />, label: 'Time Tracking', path: '/time-tracking', hasChevron: false },
  { icon: <BarChart3 size={20} />, label: 'Accounting', path: '/accounting', hasChevron: true },
  { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports', hasChevron: false },
];

export const SIDEBAR_BOTTOM_ITEMS = [
  { label: 'Apps', path: '/apps' },
  { label: 'Team Members', path: '/team' },
  { label: 'Items and Services', path: '/items' },
  { label: 'Bank Connections', path: '/bank-connections' },
  { label: 'Settings', path: '/settings' },
];

export const MOCK_REVENUE_DATA = [
  { name: '0', val: 0 },
  { name: '2k', val: 1500 },
  { name: '4k', val: 3200 },
  { name: '6k', val: 4500 },
  { name: '8k', val: 6200 },
  { name: '10k', val: 8100 },
];