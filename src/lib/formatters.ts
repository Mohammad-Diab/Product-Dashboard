const CURRENCY_CONFIG = {
  locale: 'en-US',
  currency: 'USD',
} as const;

const DATE_CONFIG = {
  locale: 'en-US',
  options: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  } as const,
} as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(DATE_CONFIG.locale, DATE_CONFIG.options).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(DATE_CONFIG.locale, {
    ...DATE_CONFIG.options,
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}
