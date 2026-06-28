import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationsApi } from '../api/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationsApi.getCount();
      setUnreadCount(data.count ?? data.unread ?? 0);
    } catch {
      // silent — badge should never crash the app
    }
  }, [isAuthenticated]);

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await notificationsApi.getAll(params);
      setNotifications(data.notifications || data.data || []);
      setUnreadCount(data.unreadCount ?? unreadCount);
      return data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [unreadCount]);

  const markRead = useCallback(async (id) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {/* silent */}
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {/* silent */}
  }, []);

  const deleteNotification = useCallback(async (id) => {
    const target = notifications.find(n => n._id === id);
    try {
      await notificationsApi.deleteOne(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (target && !target.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {/* silent */}
  }, [notifications]);

  const clearAll = useCallback(async () => {
    try {
      await notificationsApi.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch {/* silent */}
  }, []);

  // Poll for new notifications every 60s when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCount();
      intervalRef.current = setInterval(fetchCount, 60_000);
    } else {
      setUnreadCount(0);
      setNotifications([]);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAuthenticated, fetchCount]);

  return (
    <NotificationContext.Provider value={{
      unreadCount, notifications, loading,
      fetchCount, fetchNotifications,
      markRead, markAllRead, deleteNotification, clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
