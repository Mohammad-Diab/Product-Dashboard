import { toast } from 'sonner';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  isApiError,
  handleAuthError,
} from '@/lib/api/error-handler';
import { ApiClientError } from '@/lib/api/types';

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('error-handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSuccessResponse', () => {
    it('should create a success response with data', () => {
      const data = { id: '1', name: 'Test' };
      const result = createSuccessResponse(data);

      expect(result).toEqual({
        success: true,
        data,
      });
    });

    it('should handle null data', () => {
      const result = createSuccessResponse(null);

      expect(result).toEqual({
        success: true,
        data: null,
      });
    });

    it('should handle array data', () => {
      const data = [1, 2, 3];
      const result = createSuccessResponse(data);

      expect(result).toEqual({
        success: true,
        data,
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with required fields', () => {
      const result = createErrorResponse('Error occurred', 400);

      expect(result).toEqual({
        success: false,
        error: {
          message: 'Error occurred',
          statusCode: 400,
          code: undefined,
          validationErrors: undefined,
        },
      });
    });

    it('should create an error response with all fields', () => {
      const validationErrors = { email: ['Invalid email'] };
      const result = createErrorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validationErrors
      );

      expect(result).toEqual({
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          validationErrors,
        },
      });
    });

    it('should handle different status codes', () => {
      const codes = [400, 401, 403, 404, 500];

      codes.forEach((code) => {
        const result = createErrorResponse('Error', code);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.statusCode).toBe(code);
        }
      });
    });
  });
  describe('isApiError', () => {
    it('should return true for ApiClientError instances', () => {
      const error = new ApiClientError('Test error', 400);

      expect(isApiError(error)).toBe(true);
    });

    it('should return false for regular Error instances', () => {
      const error = new Error('Regular error');

      expect(isApiError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isApiError('error string')).toBe(false);
      expect(isApiError({ message: 'error' })).toBe(false);
      expect(isApiError(123)).toBe(false);
    });

    it('should return false for objects with similar structure', () => {
      const fakeError = {
        message: 'Test',
        statusCode: 400,
        code: 'TEST',
      };

      expect(isApiError(fakeError)).toBe(false);
    });
  });

  describe('handleAuthError', () => {
    it('should show toast for 401 errors', () => {
      const error = new ApiClientError('Unauthorized', 401);

      handleAuthError(error);

      expect(toast.error).toHaveBeenCalledWith(
        'Your session has expired. Please log in again.'
      );
    });

    it('should not show toast for non-401 errors', () => {
      const error = new ApiClientError('Bad request', 400);

      handleAuthError(error);

      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle non-ApiClientError gracefully', () => {
      const error = new Error('Regular error');

      handleAuthError(error);

      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle null and undefined', () => {
      handleAuthError(null);
      handleAuthError(undefined);

      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('ApiClientError', () => {
    it('should create error with all properties', () => {
      const validationErrors = { field: ['error'] };
      const error = new ApiClientError(
        'Test error',
        400,
        'TEST_CODE',
        validationErrors
      );

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_CODE');
      expect(error.validationErrors).toEqual(validationErrors);
      expect(error.name).toBe('ApiClientError');
    });

    it('should create error with minimal properties', () => {
      const error = new ApiClientError('Test error', 500);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBeUndefined();
      expect(error.validationErrors).toBeUndefined();
    });

    it('should be an instance of Error', () => {
      const error = new ApiClientError('Test', 400);

      expect(error).toBeInstanceOf(Error);
    });
  });
});
