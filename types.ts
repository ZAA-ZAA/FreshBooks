export interface NavItem {
  label: string;
  subItems?: string[];
  isMega?: boolean;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  rate: number;
  qty: number;
  tax: boolean;
}

export interface Client {
  id: string;
  organization: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: string;
}

export interface InvoiceSettings {
  acceptOnlinePayments: boolean;
  customizeStyle: boolean;
  sendReminders: boolean;
  chargeLateFees: boolean;
  currency: string;
  language: string;
}

export interface InvoiceData {
  number: string;
  customerId: string | null;
  dateIssued: string;
  dateDue: string;
  reference: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  discountPercentage: number;
  depositAmount: number;
}

export enum AuthStep {
  LOGIN_START = 0,
  OTP = 1,
  SURVEY_PROFILE = 2,
  SURVEY_BUSINESS = 3,
  COMPLETED = 4
}