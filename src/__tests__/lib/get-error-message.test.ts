import { getErrorMessage } from '@/lib/get-error-message';
import { ApiClientError } from '@/lib/api/types';

describe('getErrorMessage', () => {
  describe('ApiClientError handling', () => {
    it('should return message from ApiClientError', () => {
      const error = new ApiClientError('API error occurred', 400);

      expect(getErrorMessage(error)).toBe('API error occurred');
    });

    it('should return message from ApiClientError with code', () => {
      const error = new ApiClientError('Validation failed', 400, 'VALIDATION_ERROR');

      expect(getErrorMessage(error)).toBe('Validation failed');
    });

    it('should return message from ApiClientError with validation errors', () => {
      const error = new ApiClientError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        { email: ['Invalid email'] }
      );

      expect(getErrorMessage(error)).toBe('Validation failed');
    });
  });

  describe('Error object handling', () => {
    it('should return message from standard Error', () => {
      const error = new Error('Standard error message');

      expect(getErrorMessage(error)).toBe('Standard error message');
    });

    it('should return message from custom Error subclass', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const error = new CustomError('Custom error message');

      expect(getErrorMessage(error)).toBe('Custom error message');
    });

    it('should handle Error with empty message', () => {
      const error = new Error('');

      expect(getErrorMessage(error)).toBe('');
    });
  });

  describe('string handling', () => {
    it('should return string error as-is', () => {
      const error = 'String error message';

      expect(getErrorMessage(error)).toBe('String error message');
    });

    it('should handle empty string', () => {
      const error = '';

      expect(getErrorMessage(error)).toBe('');
    });
  });

  describe('null and undefined', () => {
    it('should return default message for null', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    });

    it('should return default message for undefined', () => {
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    });
  });

  describe('primitive types', () => {
    it('should return default message for number', () => {
      expect(getErrorMessage(123)).toBe('An unexpected error occurred');
    });

    it('should return default message for boolean', () => {
      expect(getErrorMessage(true)).toBe('An unexpected error occurred');
      expect(getErrorMessage(false)).toBe('An unexpected error occurred');
    });
  });

  describe('object without message', () => {
    it('should return default message for empty object', () => {
      expect(getErrorMessage({})).toBe('An unexpected error occurred');
    });

    it('should return default message for object with other properties', () => {
      expect(getErrorMessage({ code: 400, status: 'error' })).toBe(
        'An unexpected error occurred'
      );
    });
  });

  describe('custom fallback message', () => {
    it('should use custom fallback message', () => {
      expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
      expect(getErrorMessage(undefined, 'Custom fallback')).toBe('Custom fallback');
      expect(getErrorMessage({}, 'Custom fallback')).toBe('Custom fallback');
      expect(getErrorMessage(123, 'Custom fallback')).toBe('Custom fallback');
    });

    it('should not use fallback for valid errors', () => {
      const error = new Error('Real error');
      expect(getErrorMessage(error, 'Fallback')).toBe('Real error');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle network error', () => {
      const error = new Error('Network request failed');

      expect(getErrorMessage(error)).toBe('Network request failed');
    });

    it('should handle validation error', () => {
      const error = new ApiClientError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        {
          email: ['Invalid email format'],
          password: ['Password too short'],
        }
      );

      expect(getErrorMessage(error)).toBe('Validation failed');
    });

    it('should handle timeout error', () => {
      const error = new Error('Request timeout');

      expect(getErrorMessage(error)).toBe('Request timeout');
    });

    it('should handle unknown error with custom message', () => {
      const unknownError = { someProperty: 'value' };

      expect(getErrorMessage(unknownError, 'Something went wrong')).toBe(
        'Something went wrong'
      );
    });
  });
});
