import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format large numbers with commas', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-50.25)).toBe('-$50.25');
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
    });

    it('should handle decimal precision correctly', () => {
      expect(formatCurrency(99.999)).toBe('$100.00');
      expect(formatCurrency(99.994)).toBe('$99.99');
    });

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(0.001)).toBe('$0.00');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/Jan 15, 2024/);
    });

    it('should format Date objects correctly', () => {
      const date = new Date('2024-03-20T15:45:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/Mar 20, 2024/);
    });

    it('should handle different months', () => {
      expect(formatDate('2024-12-25T00:00:00Z')).toMatch(/Dec 25, 2024/);
      expect(formatDate('2024-06-01T00:00:00Z')).toMatch(/Jun 1, 2024/);
    });

    it('should handle ISO date strings', () => {
      const result = formatDate('2024-05-10');
      expect(result).toMatch(/May 10, 2024/);
    });

    it('should maintain consistency across Date objects and strings', () => {
      const dateString = '2024-07-04T12:00:00Z';
      const dateObject = new Date(dateString);
      
      expect(formatDate(dateString)).toBe(formatDate(dateObject));
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time from string', () => {
      const result = formatDateTime('2024-01-15T10:30:00Z');
      expect(result).toMatch(/Jan 15, 2024/);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format date and time from Date object', () => {
      const date = new Date('2024-03-20T15:45:00Z');
      const result = formatDateTime(date);
      expect(result).toMatch(/Mar 20, 2024/);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should include time component unlike formatDate', () => {
      const dateString = '2024-08-15T14:30:00Z';
      const dateResult = formatDate(dateString);
      const dateTimeResult = formatDateTime(dateString);
      
      expect(dateTimeResult).not.toBe(dateResult);
      expect(dateTimeResult.length).toBeGreaterThan(dateResult.length);
    });

    it('should maintain consistency across Date objects and strings', () => {
      const dateString = '2024-09-20T18:45:00Z';
      const dateObject = new Date(dateString);
      
      expect(formatDateTime(dateString)).toBe(formatDateTime(dateObject));
    });
  });
});
