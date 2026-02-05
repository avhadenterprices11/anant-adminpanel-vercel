/**
 * Notification Context
 *
 * Provides real-time notification functionality:
 * - Socket.IO connection for real-time updates
 * - Unread count state management
 * - Toast notifications for new messages
 * - API integration for read/mark actions
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ENV } from '@/lib/config/env';
import {
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    type Notification,
} from '@/lib/api/notifications.api';

// ============================================
// TYPES
// ============================================

interface NotificationContextType {
    unreadCount: number;
    isConnected: boolean;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshUnreadCount: () => Promise<void>;
}

interface NewNotificationPayload {
    notification: Notification;
}

// ============================================
// CONTEXT
// ============================================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ============================================
// SOCKET URL HELPER
// ============================================

/**
 * Get Socket.IO server URL from API base URL
 * API: http://localhost:8000/api/v1/
 * Socket: http://localhost:8000
 */
function getSocketUrl(): string {
    const apiUrl = ENV.API_BASE_URL;
    // Remove /api/v1/ or /api/ suffix to get base server URL
    const baseUrl = apiUrl.replace(/\/api\/v\d+\/?$/, '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    return baseUrl || 'http://localhost:8000';
}

// ============================================
// PROVIDER
// ============================================

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { session, user } = useAuth();
    const queryClient = useQueryClient();

    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Fetch initial unread count
    const refreshUnreadCount = useCallback(async () => {
        try {
            const response = await getUnreadCount();
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    // Mark single notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setUnreadCount((prev) => Math.max(0, prev - 1));
            // Invalidate notifications query to refresh list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }, [queryClient]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead();
            setUnreadCount(0);
            // Invalidate notifications query to refresh list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            throw error;
        }
    }, [queryClient]);

    // Initialize Socket.IO connection when authenticated
    useEffect(() => {
        if (!session?.access_token || !user?.id) {
            // No session - cleanup and return
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setIsConnected(false);
            return;
        }

        // Fetch initial unread count
        refreshUnreadCount();

        // Initialize Socket.IO connection
        const socketUrl = getSocketUrl();
        console.log('[NotificationContext] Connecting to socket:', socketUrl);

        const socket = io(socketUrl, {
            path: '/socket.io',
            auth: {
                token: session.access_token,
            },
            // Use polling first, then upgrade to websocket (more reliable)
            transports: ['polling', 'websocket'],
            upgrade: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
        });

        socketRef.current = socket;

        // Connection events
        socket.on('connect', () => {
            console.log('[NotificationContext] Socket connected:', socket.id);
            setIsConnected(true);

            // Manually join user room (backup in case middleware didn't)
            socket.emit('notification:subscribe', { userId: user.id });
        });

        socket.on('disconnect', (reason) => {
            console.log('[NotificationContext] Socket disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('[NotificationContext] Socket connection error:', error.message);
            setIsConnected(false);
        });

        // Listen for new notifications
        socket.on('notification:new', (payload: NewNotificationPayload) => {
            console.log('[NotificationContext] New notification received:', payload);

            const { notification } = payload;

            // Increment unread count
            setUnreadCount((prev) => prev + 1);

            // Invalidate notifications query to refresh list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            // Show toast notification
            toast(notification.title, {
                description: notification.message,
                action: notification.action_url
                    ? {
                          label: notification.action_text || 'View',
                          onClick: () => {
                              window.location.href = notification.action_url!;
                          },
                      }
                    : undefined,
                duration: 5000,
            });
        });

        // Cleanup on unmount or session change
        return () => {
            console.log('[NotificationContext] Cleaning up socket connection');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [session?.access_token, user?.id, queryClient, refreshUnreadCount]);

    const value: NotificationContextType = {
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        refreshUnreadCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}

// Export context for direct use if needed
export { NotificationContext };
