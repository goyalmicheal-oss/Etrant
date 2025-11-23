import { NextResponse } from 'next/server';

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate file upload
 */
export interface FileValidationConfig {
    maxSizeBytes: number;
    allowedTypes: string[];
    allowedExtensions: string[];
}

export function validateFile(
    file: File,
    config: FileValidationConfig
): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.maxSizeBytes) {
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${config.maxSizeBytes / 1024 / 1024}MB`,
        };
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
        };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !config.allowedExtensions.includes(extension)) {
        return {
            valid: false,
            error: `File extension .${extension} is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`,
        };
    }

    return { valid: true };
}

/**
 * Sanitize filename to prevent directory traversal attacks
 */
export function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
        .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
        .replace(/^\.+/, '') // Remove leading dots
        .substring(0, 255); // Limit length
}

/**
 * Validate request body against schema
 */
export function validateRequestBody<T>(
    body: any,
    requiredFields: (keyof T)[]
): { valid: boolean; error?: string; data?: T } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' };
    }

    for (const field of requiredFields) {
        if (!(field in body) || body[field] === null || body[field] === undefined) {
            return { valid: false, error: `Missing required field: ${String(field)}` };
        }
    }

    return { valid: true, data: body as T };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
    message: string,
    status: number = 400,
    details?: any
): NextResponse {
    return NextResponse.json(
        {
            error: message,
            ...(details && { details }),
            timestamp: new Date().toISOString(),
        },
        { status }
    );
}

/**
 * Validate environment variables
 */
export function validateEnvVars(requiredVars: string[]): void {
    const missing: string[] = [];

    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
}

/**
 * File upload configurations
 */
export const fileUploadConfigs = {
    pdf: {
        maxSizeBytes: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['pdf'],
    },
    document: {
        maxSizeBytes: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown',
        ],
        allowedExtensions: ['pdf', 'docx', 'txt', 'md'],
    },
    image: {
        maxSizeBytes: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
};
