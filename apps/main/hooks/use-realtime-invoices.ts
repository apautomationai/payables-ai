"use client";

import { useEffect, useCallback, useRef } from 'react';
import { wsClient } from '@/lib/websocket-client';
import { toast } from 'sonner';

interface UseRealtimeInvoicesProps {
    onRefreshNeeded?: () => void;
    onInvoiceCreated?: (invoiceId: number) => void;
    onInvoiceUpdated?: (invoiceId: number) => void;
    onInvoiceStatusUpdated?: (invoiceId: number, status: string) => void;
    onInvoiceDeleted?: (invoiceId: number) => void;
    enableToasts?: boolean;
    autoConnect?: boolean;
}

export const useRealtimeInvoices = ({
    onRefreshNeeded,
    onInvoiceCreated,
    onInvoiceUpdated,
    onInvoiceStatusUpdated,
    onInvoiceDeleted,
    enableToasts = true,
    autoConnect = true,
}: UseRealtimeInvoicesProps = {}) => {
    const isConnectedRef = useRef(false);
    const handlersRef = useRef({
        onRefreshNeeded,
        onInvoiceCreated,
        onInvoiceUpdated,
        onInvoiceStatusUpdated,
        onInvoiceDeleted,
    });

    // Update handlers ref when props change
    useEffect(() => {
        handlersRef.current = {
            onRefreshNeeded,
            onInvoiceCreated,
            onInvoiceUpdated,
            onInvoiceStatusUpdated,
            onInvoiceDeleted,
        };
    }, [onRefreshNeeded, onInvoiceCreated, onInvoiceUpdated, onInvoiceStatusUpdated, onInvoiceDeleted]);

    // WebSocket notification handler
    const handleNotification = useCallback((data: any) => {
        if (enableToasts) {
            let message = '';
            let description = '';

            switch (data.type) {
                case 'INVOICE_CREATED':
                    message = 'New invoice created';
                    description = 'A new invoice has been processed';
                    break;
                case 'INVOICE_UPDATED':
                    message = 'Invoice updated';
                    description = 'An invoice has been updated';
                    break;
                case 'INVOICE_STATUS_UPDATED':
                    const statusText = data.status?.charAt(0).toUpperCase() + data.status?.slice(1);
                    message = `Invoice ${statusText}`;
                    description = `Invoice status changed to ${statusText?.toLowerCase()}`;
                    break;
                case 'INVOICE_DELETED':
                    message = 'Invoice deleted';
                    description = 'An invoice has been removed';
                    break;
            }

            if (message) {
                toast.success(message, { description });
            }
        }

        // Call specific handlers based on notification type
        switch (data.type) {
            case 'INVOICE_CREATED':
                handlersRef.current.onInvoiceCreated?.(data.invoiceId);
                break;
            case 'INVOICE_UPDATED':
                handlersRef.current.onInvoiceUpdated?.(data.invoiceId);
                break;
            case 'INVOICE_STATUS_UPDATED':
                handlersRef.current.onInvoiceStatusUpdated?.(data.invoiceId, data.status);
                break;
            case 'INVOICE_DELETED':
                handlersRef.current.onInvoiceDeleted?.(data.invoiceId);
                break;
        }

        // Always trigger general refresh as fallback
        handlersRef.current.onRefreshNeeded?.();
    }, [enableToasts]);

    // Connect to WebSocket
    const connect = useCallback(async () => {
        try {
            if (isConnectedRef.current) return;

            await wsClient.connect();
            isConnectedRef.current = true;

            // Set up simple notification listeners
            wsClient.on('invoice_notification', handleNotification);
            wsClient.on('dashboard_notification', handleNotification);
            wsClient.on('invoice_list_notification', handleNotification);
        } catch (error) {
            isConnectedRef.current = false;
        }
    }, [handleNotification]);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        if (!isConnectedRef.current) return;

        // Remove event listeners
        wsClient.off('invoice_notification', handleNotification);
        wsClient.off('dashboard_notification', handleNotification);
        wsClient.off('invoice_list_notification', handleNotification);

        wsClient.disconnect();
        isConnectedRef.current = false;
    }, [handleNotification]);

    // Join dashboard room for dashboard-specific updates
    const joinDashboard = useCallback(() => {
        wsClient.joinDashboard();
    }, []);

    // Leave dashboard room
    const leaveDashboard = useCallback(() => {
        wsClient.leaveDashboard();
    }, []);

    // Join invoice list room for invoice list-specific updates
    const joinInvoiceList = useCallback(() => {
        wsClient.joinInvoiceList();
    }, []);

    // Leave invoice list room
    const leaveInvoiceList = useCallback(() => {
        wsClient.leaveInvoiceList();
    }, []);

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        // Cleanup on unmount
        return () => {
            if (autoConnect) {
                disconnect();
            }
        };
    }, [autoConnect, connect, disconnect]);

    return {
        connect,
        disconnect,
        joinDashboard,
        leaveDashboard,
        joinInvoiceList,
        leaveInvoiceList,
        isConnected: () => wsClient.isConnected(),
    };
};