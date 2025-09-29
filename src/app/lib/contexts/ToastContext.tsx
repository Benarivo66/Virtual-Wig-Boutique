'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer, { ToastData } from '../../ui/Toast/ToastContainer';
import { ToastType, ToastAction } from '../../ui/Toast/Toast';

interface ToastOptions {
    duration?: number;
    showCloseButton?: boolean;
    actions?: ToastAction[];
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message?: string, options?: ToastOptions) => string;
    hideToast: (id: string) => void;
    clearAllToasts: () => void;
    // Convenience methods
    showSuccess: (title: string, message?: string, options?: ToastOptions) => string;
    showError: (title: string, message?: string, options?: ToastOptions) => string;
    showInfo: (title: string, message?: string, options?: ToastOptions) => string;
    showWarning: (title: string, message?: string, options?: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
    children,
    position = 'top-right',
    maxToasts = 5,
}) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const generateId = useCallback(() => {
        return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }, []);

    const showToast = useCallback((
        type: ToastType,
        title: string,
        message?: string,
        options: ToastOptions = {}
    ): string => {
        const id = generateId();
        const newToast: ToastData = {
            id,
            type,
            title,
            message,
            duration: options.duration ?? 5000,
            showCloseButton: options.showCloseButton ?? true,
            actions: options.actions,
        };

        setToasts(prevToasts => {
            const updatedToasts = [newToast, ...prevToasts];
            // Limit the number of toasts
            return updatedToasts.slice(0, maxToasts);
        });

        return id;
    }, [generateId, maxToasts]);

    const hideToast = useCallback((id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const showSuccess = useCallback((title: string, message?: string, options?: ToastOptions) => {
        return showToast('success', title, message, options);
    }, [showToast]);

    const showError = useCallback((title: string, message?: string, options?: ToastOptions) => {
        return showToast('error', title, message, options);
    }, [showToast]);

    const showInfo = useCallback((title: string, message?: string, options?: ToastOptions) => {
        return showToast('info', title, message, options);
    }, [showToast]);

    const showWarning = useCallback((title: string, message?: string, options?: ToastOptions) => {
        return showToast('warning', title, message, options);
    }, [showToast]);

    const contextValue: ToastContextType = {
        showToast,
        hideToast,
        clearAllToasts,
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer
                toasts={toasts}
                onRemoveToast={hideToast}
                position={position}
            />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;