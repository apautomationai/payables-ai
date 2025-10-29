"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { ExternalLink, CreditCard, Clock, CheckCircle, AlertCircle } from "lucide-react";
import client from '@/lib/fetch-client';
import type { SubscriptionStatus } from '@/lib/types/subscription';

interface SubscriptionTabProps {
    setupRequired?: boolean; // Show setup required message
}

export function SubscriptionTab({ setupRequired = false }: SubscriptionTabProps) {
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchSubscriptionStatus();

        // Check for payment success/cancel parameters and refresh if present
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true' || urlParams.get('canceled') === 'true') {
            // Force a fresh check after a short delay to allow webhook processing
            setTimeout(() => {
                console.log('Payment flow completed, refreshing subscription status...');
                fetchSubscriptionStatus();
            }, 2000);
        }
    }, []);

    const fetchSubscriptionStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get<{ data: SubscriptionStatus }>('api/v1/subscription/status');
            setSubscription(response.data);
        } catch (err: any) {
            setError(err?.message || 'Failed to load subscription information');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (!subscription) return;

        try {
            setActionLoading(true);
            const response = await client.post<{ data: { url: string } }>('api/v1/subscription/create-checkout');
            // Redirect to Stripe checkout
            window.location.href = response.data.url;
        } catch (err: any) {
            setError(err?.message || 'Failed to create checkout session');
            setActionLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        if (!subscription) return;

        try {
            setActionLoading(true);
            const response = await client.post<{ data: { url: string } }>('api/v1/subscription/create-portal');
            // Redirect to Stripe customer portal
            window.location.href = response.data.url;
        } catch (err: any) {
            setError(err?.message || 'Failed to create customer portal session');
            setActionLoading(false);
        }
    };

    const getTierDisplayName = (tier: string) => {
        switch (tier) {
            case 'free':
                return 'Free';
            case 'promotional':
                return 'Promotional';
            case 'standard':
                return 'Standard';
            default:
                return tier;
        }
    };

    const getTierBadgeVariant = (tier: string) => {
        switch (tier) {
            case 'free':
                return 'secondary' as const;
            case 'promotional':
                return 'default' as const;
            case 'standard':
                return 'default' as const;
            default:
                return 'secondary' as const;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'trialing':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'past_due':
            case 'unpaid':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'canceled':
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusDisplayName = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'trialing':
                return 'Trial';
            case 'past_due':
                return 'Past Due';
            case 'unpaid':
                return 'Unpaid';
            case 'canceled':
                return 'Canceled';
            case 'incomplete':
                return 'Incomplete';
            default:
                return status;
        }
    };

    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button
                        onClick={fetchSubscriptionStatus}
                        variant="outline"
                        className="mt-4"
                    >
                        Refresh Status
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!subscription) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>No subscription information found</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Setup Required Alert - only show if payment setup is actually required */}
                {setupRequired && subscription.requiresPaymentSetup && (
                    <Alert className="border-orange-200 bg-orange-50">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                            <strong>Payment Setup Required:</strong> You need to set up a payment method to start your trial and access the dashboard.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Tier Information */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Plan:</span>
                        <Badge variant={getTierBadgeVariant(subscription.tier)}>
                            {getTierDisplayName(subscription.tier)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            (Registration #{subscription.registrationOrder})
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusIcon(subscription.status)}
                        <span className="text-sm">{getStatusDisplayName(subscription.status)}</span>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Price:</span>
                        <span className="text-sm">
                            {subscription.tier === 'free'
                                ? 'Free forever'
                                : `${formatPrice(subscription.monthlyPrice)}/month`
                            }
                        </span>
                    </div>
                </div>

                {/* Trial Information */}
                {subscription.status === 'trialing' && subscription.daysRemaining !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Trial Status:</span>
                        </div>
                        <div className="pl-6">
                            <p className="text-sm">
                                {subscription.daysRemaining > 0
                                    ? `${subscription.daysRemaining} days remaining in your trial`
                                    : 'Trial expires today'
                                }
                            </p>
                            {subscription.trialEnd && (
                                <p className="text-xs text-muted-foreground">
                                    Trial ends: {new Date(subscription.trialEnd).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Payment Setup Required - only show for incomplete subscriptions */}
                {subscription.requiresPaymentSetup && subscription.status === 'incomplete' && (
                    <Alert>
                        <CreditCard className="h-4 w-4" />
                        <AlertDescription>
                            {subscription.tier === 'free'
                                ? 'You are on the free plan with full access.'
                                : 'Set up your payment method to start your trial and continue using the service.'
                            }
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success Alert - show when user has active trial */}
                {subscription.status === 'trialing' && subscription.hasPaymentMethod && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            <strong>Trial Active:</strong> Your payment method is set up and your trial is active. You have full access to all features.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {subscription.requiresPaymentSetup && subscription.tier !== 'free' && (
                        <Button
                            onClick={handleSubscribe}
                            disabled={actionLoading}
                            className="flex items-center gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            {actionLoading ? 'Loading...' : 'Set Up Payment'}
                        </Button>
                    )}

                    {subscription.hasPaymentMethod && (
                        <Button
                            onClick={handleManageSubscription}
                            disabled={actionLoading}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            {actionLoading ? 'Loading...' : 'Manage Subscription'}
                        </Button>
                    )}

                    {/* Refresh button for troubleshooting */}
                    <Button
                        onClick={fetchSubscriptionStatus}
                        disabled={loading}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </Button>

                    {/* Retry Access button for users having access issues */}
                    {subscription.status === 'trialing' && subscription.hasPaymentMethod && (
                        <Button
                            onClick={() => {
                                // Force refresh and redirect to dashboard
                                fetchSubscriptionStatus().then(() => {
                                    window.location.href = '/dashboard';
                                });
                            }}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Retry Access
                        </Button>
                    )}

                    {/* Debug button - temporary for troubleshooting */}
                    {subscription.status === 'trialing' && (
                        <Button
                            onClick={() => {
                                console.log('🔍 Debug: Full subscription object:', subscription);
                                alert(`Debug Info:\nStatus: ${subscription.status}\nTier: ${subscription.tier}\nHas Payment: ${subscription.hasPaymentMethod}\nRequires Setup: ${subscription.requiresPaymentSetup}\nTrial End: ${subscription.trialEnd}\n\nCheck console for full details.`);
                            }}
                            disabled={loading}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-xs"
                        >
                            🔍 Debug
                        </Button>
                    )}
                </div>

                {/* Additional Information */}
                {subscription.tier !== 'free' && (
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Payment processing is handled securely by Stripe</p>
                        <p>• You can cancel or modify your subscription at any time</p>
                        {subscription.status === 'trialing' && (
                            <p>• You will not be charged until your trial period ends</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}