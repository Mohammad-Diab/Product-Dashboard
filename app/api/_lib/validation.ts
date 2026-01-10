import { ZodError } from 'zod';
import type { ApiError } from '@/lib/api/types';

export function formatZodError(error: ZodError): ApiError {
    const validationErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const path = issue.path.join('.') || 'root';
        if (!validationErrors[path]) {
            validationErrors[path] = [];
        }
        validationErrors[path].push(issue.message);
    });

    return {
        message: 'Validation failed',
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        validationErrors,
    }
};
