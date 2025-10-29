"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/lib/axios-client';
import type { SubscriptionStatus } from '@/lib/types';

interface SubscriptionGuardProps {
    children: React.ReactNode;
    requiresAccess?: boolean; // If true, blocks incomplete users
    loadingType?: 'fullscreen' | 'skeleton'; // Type of loading state to show
}

export function SubscriptionGuard({ children, requiresAccess = true, loadingType = 'fullscreen' }: SubscriptionGuardProps) {
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Verifying your subscription status...');
    const router = useRouter();

    useEffect(() => {
        checkSubscriptionAccess();

        // Check for payment success parameter and refresh if present
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment_success') === 'true') {
            // Remove the parameter from URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            // Force a fresh check after a short delay to allow webhook processing
            setTimeout(() => {
                console.log('Payment success detected, refreshing subscription status...');
                checkSubscriptionAccess();
            }, 2000);

            // Also try refreshing multiple times to ensure webhook has processed
            setTimeout(() => {
                console.log('Second refresh attempt after payment...');
                checkSubscriptionAccess();
            }, 5000);
        }

        // Add window focus listener to refresh subscription status when user returns
        const handleWindowFocus = () => {
            console.log('Window focused, checking if subscription status needs refresh...');
            // Only refresh if we don't currently have access
            if (!hasAccess && !isChecking) {
                console.log('Refreshing subscription status on window focus...');
                checkSubscriptionAccess();
            }
        };

        window.addEventListener('focus', handleWindowFocus);

        // Timeout fallback - if checking takes too long, redirect to profile
        const timeout = setTimeout(() => {
            if (isChecking) {
                console.warn('Subscription check timed out, redirecting to profile');
                setLoadingMessage('Connection timeout, redirecting...');
                setTimeout(() => {
                    router.replace('/profile?tab=subscription');
                }, 1000);
            }
        }, 10000); // 10 second timeout

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, []);

    const checkSubscriptionAccess = async () => {
        try {
            setIsChecking(true);
            setLoadingMessage('Verifying your subscription status...');

            // Add a small delay to show loading state (optional)
            await new Promise(resolve => setTimeout(resolve, 300));

            // Update loading message
            setLoadingMessage('Checking access permissions...');

            // Get subscription status with cache busting
            const cacheBuster = Date.now();
            const response = await client.get<SubscriptionStatus>(`api/v1/subscription/status?_t=${cacheBuster}`);
            const subscription = response as unknown as SubscriptionStatus;

            console.log('Subscription status received:', {
                tier: subscription.tier,
                status: subscription.status,
                trialEnd: subscription.trialEnd,
                requiresPaymentSetup: subscription.requiresPaymentSetup,
                hasPaymentMethod: subscription.hasPaymentMethod,
                fullResponse: subscription
            });

            // Debug: Log the exact API response
            console.log('Full API response:', response);

            if (!requiresAccess) {
                // If access is not required, always allow
                setHasAccess(true);
                setIsChecking(false);
                return;
            }

            // Check if user has access
            const userHasAccess = checkUserAccess(subscription);

            // Debug: Check for force access parameter
            const urlParams = new URLSearchParams(window.location.search);
            const forceAccess = urlParams.get('force_access') === 'true';

            if (forceAccess) {
                console.log('🚨 FORCE ACCESS ENABLED - Bypassing access check');
                setHasAccess(true);
                setIsChecking(false);
                return;
            }

            // TEMPORARY: Auto-grant access for trialing users
            if (subscription.status === 'trialing') {
                console.log('🚨 TEMPORARY FIX: Auto-granting access for trialing users');
                setHasAccess(true);
                setIsChecking(false);
                return;
            }

            if (!userHasAccess) {
                console.log('❌ User does not have access, redirecting to payment setup');
                console.log('❌ Subscription details that failed access check:', {
                    tier: subscription.tier,
                    status: subscription.status,
                    trialEnd: subscription.trialEnd,
                    trialValid: subscription.trialEnd ? new Date() < new Date(subscription.trialEnd) : false
                });
                setLoadingMessage('Redirecting to payment setup...');
                // Small delay before redirect for better UX
                await new Promise(resolve => setTimeout(resolve, 500));
                // Redirect to payment setup
                router.replace('/profile?tab=subscription&setup=required');
                return;
            }

            console.log('✅ Access granted! User can proceed.');

            setHasAccess(true);
        } catch (error: any) {
            console.error('Error checking subscription access:', error);

            if (requiresAccess) {
                // If we can't check subscription and access is required, redirect to profile
                router.replace('/profile?tab=subscription');
                return;
            }

            // If access is not required, allow through
            setHasAccess(true);
        } finally {
            setIsChecking(false);
        }
    };

    const checkUserAccess = (subscription: SubscriptionStatus): boolean => {
        console.log('🔍 Checking user access with subscription:', subscription);

        // Free tier always has access
        if (subscription.tier === 'free') {
            console.log('✅ Access granted: Free tier');
            return true;
        }

        // Check if subscription is active
        if (subscription.status === 'active') {
            console.log('✅ Access granted: Active subscription');
            return true;
        }

        // TEMPORARY FIX: Grant access to ALL trialing users regardless of trial end date
        if (subscription.status === 'trialing') {
            console.log('✅ Access granted: Trialing status (temporary fix)');
            console.log('🔍 Trial details:', {
                status: subscription.status,
                trialEnd: subscription.trialEnd,
                hasPaymentMethod: subscription.hasPaymentMethod,
                requiresPaymentSetup: subscription.requiresPaymentSetup
            });
            return true;
        }

        // Check if in trial period (original logic - keeping for reference)
        // if (subscription.status === 'trialing' && subscription.trialEnd) {
        //     const trialValid = new Date() < new Date(subscription.trialEnd);
        //     console.log('Trial status:', { status: subscription.status, trialEnd: subscription.trialEnd, trialValid });
        //     if (trialValid) {
        //         console.log('Access granted: Valid trial period');
        //         return true;
        //     }
        // }

        // Incomplete subscriptions have no access until payment is set up
        if (subscription.status === 'incomplete') {
            console.log('❌ Access denied: Incomplete subscription');
            return false;
        }

        console.log('❌ Access denied: No matching conditions');
        console.log('🔍 Subscription details:', {
            tier: subscription.tier,
            status: subscription.status,
            trialEnd: subscription.trialEnd
        });
        return false;
    };

    // Show loading state while checking
    if (isChecking) {
        if (loadingType === 'skeleton') {
            return (
                <div className="space-y-6 p-6 bg-white dark:bg-gray-900 min-h-screen">
                    <div className="space-y-2">
                        <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                                <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br transition-colors duration-300">
                <div className="text-center space-y-4 p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl dark:shadow-2xl">
                    {/* Loading Spinner */}
                    <div className="relative">
                        {/* Glow effect for dark mode */}
                        <div className="absolute inset-0 rounded-full h-12 w-12 bg-blue-500/20 dark:bg-blue-400/30 blur-md animate-pulse mx-auto"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-600 border-t-primary dark:border-t-primary mx-auto relative z-10"></div>
                        <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-primary dark:border-t-primary animate-spin mx-auto z-10" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>



                    {/* Loading Dots Animation */}
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full animate-bounce shadow-sm dark:shadow-blue-400/50" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full animate-bounce shadow-sm dark:shadow-blue-400/50" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full animate-bounce shadow-sm dark:shadow-blue-400/50" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // If access is required but user doesn't have it, don't render children
    if (requiresAccess && !hasAccess) {
        return null;
    }

    // Render children if access is granted or not required
    return <>{children}</>;
}