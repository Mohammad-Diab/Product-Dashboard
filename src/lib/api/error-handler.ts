import { ApiResponse, ApiClientError } from './types';

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data };
}

export function createErrorResponse(
    message: string,
    statusCode: number,
    code?: string,
    validationErrors?: Record<string, string[]>
): ApiResponse<never> {
    return {
        success: false,
        error: {
            message,
            statusCode,
            code,
            validationErrors,
        },
    };
}

export async function handleApiError(response: Response): Promise<never> {
    let errorData: ApiResponse<never> | null = null;

    try {
        errorData = await response.json();
    } catch {
        // If response is not JSON, use default error message
    }

    const message = errorData?.success === false && errorData.error 
        ? errorData.error.message 
        : getDefaultErrorMessage(response.status);
    const code = errorData?.success === false && errorData.error ? errorData.error.code : undefined;
    const validationErrors = errorData?.success === false && errorData.error 
        ? errorData.error.validationErrors 
        : undefined;

    throw new ApiClientError(message, response.status, code, validationErrors);
}

function getDefaultErrorMessage(statusCode: number): string {
    switch (statusCode) {
        case 400:
            return 'Invalid request. Please check your input.';
        case 401:
            return 'Unauthorized. Please log in again.';
        case 403:
            return 'You do not have permission to perform this action.';
        case 404:
            return 'Resource not found.';
        case 500:
            return 'Internal server error. Please try again later.';
        default:
            return 'An unexpected error occurred.';
    }
}

export function isApiError(error: unknown): error is ApiClientError {
    return error instanceof ApiClientError;
}

export function handleAuthError(error: unknown): void {
    if (isApiError(error) && error.statusCode === 401) {
        console.error('Authentication error: ', error.message);
        // TODO: Need double check this in the future
        // if (typeof window !== 'undefined') {
        //     window.location.href = '/login';
        // }
    }
}
