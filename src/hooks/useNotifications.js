// Custom hook for notification management
import { useState, useCallback, useEffect } from 'react';
import { NOTIFICATION_TYPES } from '../utils/constants';

let notificationId = 0;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Add a notification
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
    const id = ++notificationId;
    const notification = {
      id,
      message,
      type,
      timestamp: new Date(),
      duration: options.duration || 5000,
      persistent: options.persistent || false,
      action: options.action || null,
      ...options,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove non-persistent notifications
    if (!notification.persistent && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear notifications by type
  const clearNotificationsByType = useCallback((type) => {
    setNotifications(prev => prev.filter(n => n.type !== type));
  }, []);

  // Specific notification type helpers
  const success = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, options);
  }, [addNotification]);

  const error = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, {
      duration: 8000,
      ...options,
    });
  }, [addNotification]);

  const warning = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, {
      duration: 6000,
      ...options,
    });
  }, [addNotification]);

  const info = useCallback((message, options) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, options);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    clearNotificationsByType,
    success,
    error,
    warning,
    info,
  };
};

// Hook for queue-specific notifications
export const useQueueNotifications = (shopId, customerId) => {
  const notifications = useNotifications();

  // Notify when position changes
  const notifyPositionChange = useCallback((newPosition, oldPosition) => {
    if (newPosition < oldPosition) {
      notifications.success(`You're now #${newPosition} in line!`, {
        duration: 4000,
      });
    }
  }, [notifications]);

  // Notify when it's almost their turn
  const notifyAlmostReady = useCallback((position) => {
    if (position <= 3) {
      notifications.warning(`You're #${position} in line. Get ready!`, {
        duration: 6000,
        persistent: position === 1,
      });
    }
  }, [notifications]);

  // Notify when service is starting
  const notifyServiceStarting = useCallback(() => {
    notifications.success("It's your turn! Please proceed to the barber chair.", {
      duration: 10000,
      persistent: true,
    });
  }, [notifications]);

  // Notify about queue delays
  const notifyDelay = useCallback((extraMinutes) => {
    notifications.warning(`There's a ${extraMinutes} minute delay. Thank you for your patience.`, {
      duration: 8000,
    });
  }, [notifications]);

  return {
    ...notifications,
    notifyPositionChange,
    notifyAlmostReady,
    notifyServiceStarting,
    notifyDelay,
  };
};

// Hook for appointment notifications
export const useAppointmentNotifications = () => {
  const notifications = useNotifications();

  const notifyAppointmentBooked = useCallback((appointment) => {
    notifications.success(
      `Appointment booked for ${appointment.date} at ${appointment.time}`,
      { duration: 6000 }
    );
  }, [notifications]);

  const notifyAppointmentCanceled = useCallback(() => {
    notifications.info('Appointment has been canceled', { duration: 4000 });
  }, [notifications]);

  const notifyAppointmentReminder = useCallback((appointment) => {
    notifications.warning(
      `Reminder: Your appointment is in 30 minutes at ${appointment.shopName}`,
      { duration: 10000, persistent: true }
    );
  }, [notifications]);

  const notifyAppointmentConfirmation = useCallback(() => {
    notifications.success('Appointment confirmed!', { duration: 4000 });
  }, [notifications]);

  return {
    ...notifications,
    notifyAppointmentBooked,
    notifyAppointmentCanceled,
    notifyAppointmentReminder,
    notifyAppointmentConfirmation,
  };
};