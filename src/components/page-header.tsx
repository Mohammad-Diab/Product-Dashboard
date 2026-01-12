import { ReactNode } from 'react';

export type PageHeaderProps = {
    title: string;
    description?: string;
    className?: string;
    actions?: ReactNode;
};

export function PageHeader({ title, description, className = '', actions }: PageHeaderProps) {
    const hasActions = !!actions;

    return (
        <div className={`mb-6 ${hasActions ? 'flex justify-between items-center' : ''} ${className}`}>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {description && <p className="text-gray-600 mt-2">{description}</p>}
            </div>
            {actions && <div>{actions}</div>}
        </div>
    );
}
