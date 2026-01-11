'use client';

import { ReactNode } from 'react';

export type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
};

export function FormField({
  label,
  error,
  children,
  htmlFor,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
