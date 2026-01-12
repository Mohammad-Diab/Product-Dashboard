'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
};

const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [shake, setShake] = useState(false);
    const [mounted, setMounted] = useState(false);

    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const shakeTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
        if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);

        const originalOverflow = document.body.style.overflow;

        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';

            openTimerRef.current = window.setTimeout(() => {
                setIsAnimating(true);
            }, 10);

            return () => {
                if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
                document.body.style.overflow = originalOverflow;
            };
        }

        setIsAnimating(false);
        document.body.style.overflow = originalOverflow;

        closeTimerRef.current = window.setTimeout(() => {
            setShouldRender(false);
        }, 300);

        return () => {
            if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, mounted]);

    useEffect(() => {
        if (!mounted) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, mounted]);

    const handleBackdropClick = () => {
        setShake(true);
        if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
        shakeTimerRef.current = window.setTimeout(() => setShake(false), 750);
    };

    useEffect(() => {
        return () => {
            if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
        };
    }, []);

    if (!shouldRender || !mounted) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'bg-black/25' : 'bg-black/0'
                }`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${sizeStyles[size]} transform transition-all duration-300 ease-out ${isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                    } ${shake ? 'animate-shake' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                )}
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>,
        document.body
    );
}
