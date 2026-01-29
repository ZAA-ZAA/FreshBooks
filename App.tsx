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
  isAuthenticated