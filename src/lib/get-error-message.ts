import { isApiError } from '@/lib/api/error-handler';

export function getErrorMessage(error: unknown, fallbackMessage: string = 'An unexpected error occurred'): string {
    if (isApiError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return fallbackMessage;
}
