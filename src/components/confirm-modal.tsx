'use client';

import { ReactNode } from 'react';
import { Modal } from './modal';
import { Button } from './button';

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'primary',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="text-gray-700">{message}</div>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            type="button"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
