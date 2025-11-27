"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PaymentCancelPage() {
    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Set flag to prevent auto-redirect after login
                sessionStorage.setItem('payment_canceled', 'true');

                // Clear cookies by calling the logout API
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                });

                // Use window.location.href for full page refresh
                window.location.href = '/sign-in';
            } catch (error) {
                console.error('Logout error:', error);
                // Fallback: redirect anyway with full page refresh
                window.location.href = '/sign-in';
            }
        };

        handleLogout();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Logging out...</p>
            </div>
        </div>
    );
}
