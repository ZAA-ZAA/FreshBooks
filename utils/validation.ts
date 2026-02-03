/**
 * Shared validation helpers for forms.
 * Use for email format, numbers-only, required fields, and blocking submit when invalid.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_ONLY = /^[\d\s\-+()]*$/;

export function isValidEmail(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return EMAIL_REGEX.test(value.trim());
}

export function isRequired(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/** Restrict input to digits only (e.g. phone, OTP). Returns sanitized string. */
export function digitsOnly(value: string, maxLength?: number): string {
  const out = value.replace(/\D/g, '');
  return maxLength != null ? out.slice(0, maxLength) : out;
}

/** Allow numbers and one decimal. For rate, qty, etc. */
export function numericInput(value: string): string {
  if (!value) return '';
  const match = value.match(/^\d*\.?\d*/);
  return match ? match[0] : '';
}

/** Validate phone: optional; if provided, only digits/spaces/dashes/parens and reasonable length. */
export function isValidPhone(value: string): boolean {
  if (!value || !value.trim()) return true;
  return PHONE_DIGITS_ONLY.test(value) && value.replace(/\D/g, '').length <= 15;
}

export function passwordMinLength(value: string, min = 6): boolean {
  return typeof value === 'string' && value.length >= min;
}

export function getEmailError(value: string): string | null {
  if (!isRequired(value)) return 'Email is required.';
  if (!isValidEmail(value)) return 'Please enter a valid email address.';
  return null;
}

export function getPasswordError(value: string, minLength = 6): string | null {
  if (!isRequired(value)) return 'Password is required.';
  if (!passwordMinLength(value, minLength)) return `Password must be at least ${minLength} characters.`;
  return null;
}
