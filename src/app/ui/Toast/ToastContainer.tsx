'use client';

import React from 'react';
import Toast, { ToastProps } from './Toast';
import './ToastContainer.css';

export interface ToastData {
    id: string;
    type: ToastProps['type'];
    title: string;
    message?: string;
    duration?: number;
    showCloseButton?: boolean;
}

interface ToastContainerProps {
    toasts: ToastData[];
    onRemoveToast: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({
    toasts,
    onRemoveToast,
    position = 'top-right',
}) => {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            className={`toast-container toast-container--${position}`}
            aria-live="polite"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={onRemoveToast}
                    showCloseButton={toast.showCloseButton}
                />
            ))}
        </div>
    );
};

export default ToastContainer;