'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, className = '', ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`
          w-full px-3 py-2 rounded-md border
          bg-white text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }
          ${className}
        `}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
