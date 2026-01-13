import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
    readJsonFile,
    addToJsonFile,
    setAuthToken,
    signJWT,
    UsersSchema,
    RegisterRequestSchema,
    formatZodError,
    type User,
} from '@/app/api/_lib';
import type { ApiResponse } from '@/lib/api/types';

type RegisterResponse = {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'user';
    };
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { body } = await request.json();

        const validation = RegisterRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: formatZodError(validation.error),
                },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;

        const users = await readJsonFile<User>('users.json', UsersSchema);
        const existingUser = users.find((u) => u.email === email);

        if (existingUser) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: {
                        message: 'User already exists',
                        statusCode: 400,
                        code: 'USER_EXISTS',
                        validationErrors: {
                            email: ['User with this email already exists'],
                        },
                    },
                },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await addToJsonFile<User>('users.json', UsersSchema, {
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });

        const token = await signJWT({ sub: newUser.id, email: newUser.email, role: newUser.role });

        await setAuthToken(token);

        const response: RegisterResponse = {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        };

        return NextResponse.json<ApiResponse<RegisterResponse>>(
            {
                success: true,
                data: response,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json<ApiResponse<never>>(
            {
                success: false,
                error: {
                    message: 'Internal server error',
                    statusCode: 500,
                    code: 'INTERNAL_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
