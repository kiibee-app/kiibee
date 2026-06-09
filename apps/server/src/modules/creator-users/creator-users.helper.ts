export const formatUserDisplayName = (user: {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
}) => {
  if (user.fullName?.trim()) return user.fullName.trim();

  const name = [user.firstName, user.lastName]
    .filter((part) => part?.trim())
    .join(' ')
    .trim();

  return name || user.email;
};

export const formatDisplayDate = (value?: Date | string | null) => {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatSalePrice = (
  price: string | number | null,
  currency?: string | null,
) => {
  if (price == null || price === '') return '';

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice)) return String(price);

  const formatted = new Intl.NumberFormat('da-DK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);

  const suffix =
    currency?.toUpperCase() === 'DKK' || !currency ? 'Kr' : currency;

  return `${formatted} ${suffix}`;
};

export const formatSaleType = (itemType: string) => {
  if (itemType === 'rental') return 'Rent';
  if (itemType === 'purchase') return 'Purchase';
  return itemType;
};
