'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ error, className = '', children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`
          w-full px-3 py-2 rounded-md border
          bg-white text-gray-900
          focus:outline-none focus:ring-2
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }
          ${className}
        `}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';
