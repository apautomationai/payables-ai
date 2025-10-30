"use client";

import { useEffect, useState } from 'react';
import client from '@/lib/axios-client';

export default function DebugSubscriptionPage() {
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const fetchSubscriptionData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('api/v1/subscription/status');
            setSubscriptionData((response as any)?.data);

        } catch (err: any) {
            console.error('❌ API Error:', err);
            setError(err.message || 'Failed to fetch subscription data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Subscription Status</h1>
                <p>Loading subscription data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Subscription Status</h1>
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <h3 className="font-semibold text-red-800">Error:</h3>
                    <p className="text-red-700">{error}</p>
                </div>
                <button
                    onClick={fetchSubscriptionData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    const shouldHaveAccess = () => {
        if (!subscriptionData) return false;

        if (subscriptionData.tier === 'free') return true;
        if (subscriptionData.status === 'active') return true;
        if (subscriptionData.status === 'trialing' && subscriptionData.trialEnd) {
            return new Date() < new Date(subscriptionData.trialEnd);
        }

        return false;
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Debug Subscription Status</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Data */}
                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Subscription Data</h2>
                    <div className="space-y-2 text-sm">
                        <div><strong>Tier:</strong> {subscriptionData?.tier}</div>
                        <div><strong>Status:</strong> {subscriptionData?.status}</div>
                        <div><strong>Trial End:</strong> {subscriptionData?.trialEnd || 'None'}</div>
                        <div><strong>Has Payment Method:</strong> {subscriptionData?.hasPaymentMethod ? 'Yes' : 'No'}</div>
                        <div><strong>Requires Payment Setup:</strong> {subscriptionData?.requiresPaymentSetup ? 'Yes' : 'No'}</div>
                        <div><strong>Days Remaining:</strong> {subscriptionData?.daysRemaining || 'N/A'}</div>
                    </div>
                </div>

                {/* Access Check */}
                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Access Check</h2>
                    <div className={`p-4 rounded ${shouldHaveAccess() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="font-semibold">
                            {shouldHaveAccess() ? '✅ Should Have Access' : '❌ Should NOT Have Access'}
                        </div>
                        <div className="text-sm mt-2">
                            Based on current subscription data, this user {shouldHaveAccess() ? 'should be able to' : 'should NOT be able to'} access protected pages.
                        </div>
                    </div>
                </div>
            </div>

            {/* Raw Data */}
            <div className="mt-6 bg-gray-50 border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Raw API Response</h2>
                <pre className="text-xs bg-white p-4 rounded border overflow-auto">
                    {JSON.stringify(subscriptionData, null, 2)}
                </pre>
            </div>

            {/* Actions */}
            <div className="mt-6 space-x-4">
                <button
                    onClick={fetchSubscriptionData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Refresh Data
                </button>

                <a
                    href="/dashboard"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
                >
                    Try Dashboard
                </a>

                <a
                    href="/dashboard?force_access=true"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block"
                >
                    Force Access Dashboard
                </a>
            </div>
        </div>
    );
}