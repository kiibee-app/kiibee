import { createHash } from 'crypto';

const VISA = 'visa';
const MASTERCARD = 'mastercard';

export function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4')) return VISA;
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return MASTERCARD;
  return VISA;
}

export function hashCardToken(cardNumber: string, userId: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  return createHash('sha256').update(`${userId}:${digits}`).digest('hex');
}

export function parseExpiryDate(expiryDate: string) {
  const match = expiryDate.match(/^(\d{2})\/(\d{2,4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  let year = Number(match[2]);
  if (match[2].length === 2) {
    year = Number(`20${match[2]}`);
  }

  if (month < 1 || month > 12) return null;

  return { month, year };
}

export function formatBrandLabel(brand: string, lastFour: string) {
  const label = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  return `${label} **** ${lastFour}`;
}

export function formatExpiryDisplay(month: number, year: number) {
  return `${String(month).padStart(2, '0')}/${year}`;
}

export function formatMaskedCardNumber(lastFour: string) {
  return `**** **** **** ${lastFour}`;
}

export function toPaymentMethodResponse(row: {
  id: string;
  brand: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}) {
  return {
    id: row.id,
    brand: row.brand,
    label: formatBrandLabel(row.brand, row.lastFour),
    lastFour: row.lastFour,
    cardNumber: formatMaskedCardNumber(row.lastFour),
    expiresAt: formatExpiryDisplay(row.expiryMonth, row.expiryYear),
    isDefault: row.isDefault,
  };
}
