// Custom hook for queue operations and state management
import { useState, useEffect, useCallback, useRef } from 'react';
import queueService from '../services/queueService';
import { QUEUE_STATUS } from '../utils/constants';

export const useQueue = (shopId) => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  // Load initial queue data
  useEffect(() => {
    if (!shopId) {
      setQueue([]);
      setLoading(false);
      return;
    }

    try {
      const initialQueue = queueService.getQueue(shopId);
      setQueue(initialQueue);
      setLoading(false);

      // Subscribe to queue updates
      unsubscribeRef.current = queueService.subscribe(shopId, (updatedQueue) => {
        setQueue(updatedQueue);
      });

      // Start queue simulation
      queueService.startSimulation(shopId);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [shopId]);

  // Join queue
  const joinQueue = useCallback(async (customerData) => {
    if (!shopId) return null;

    try {
      setError(null);
      const queueItem = queueService.joinQueue(shopId, customerData);
      return queueItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [shopId]);

  // Leave queue
  const leaveQueue = useCallback(async (customerId) => {
    if (!shopId) return;

    try {
      setError(null);
      queueService.leaveQueue(shopId, customerId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [shopId]);

  // Progress customer to next status
  const progressCustomer = useCallback(async (customerId) => {
    if (!shopId) return;

    try {
      setError(null);
      queueService.progressCustomer(shopId, customerId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [shopId]);

  // Mark customer as no-show
  const markNoShow = useCallback(async (customerId) => {
    if (!shopId) return;

    try {
      setError(null);
      queueService.markNoShow(shopId, customerId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [shopId]);

  // Reorder queue (for drag and drop)
  const reorderQueue = useCallback(async (dragIndex, hoverIndex) => {
    if (!shopId) return;

    try {
      setError(null);
      queueService.reorderQueue(shopId, dragIndex, hoverIndex);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [shopId]);

  // Get customer position in queue
  const getCustomerPosition = useCallback((customerId) => {
    if (!shopId) return -1;
    return queueService.getCustomerPosition(shopId, customerId);
  }, [shopId]);

  // Get queue statistics
  const getQueueStats = useCallback(() => {
    if (!shopId) return null;
    return queueService.getQueueStats(shopId);
  }, [shopId]);

  // Computed values
  const queueLength = queue.length;
  const waitingCustomers = queue.filter(item => item.status === QUEUE_STATUS.WAITING);
  const currentCustomer = queue.find(item => item.status === QUEUE_STATUS.IN_PROGRESS);
  const averageWaitTime = queue.length > 0 ? 
    queue.reduce((sum, item) => sum + item.estimatedWaitTime, 0) / queue.length : 0;

  return {
    // State
    queue,
    loading,
    error,
    
    // Actions
    joinQueue,
    leaveQueue,
    progressCustomer,
    markNoShow,
    reorderQueue,
    
    // Utilities
    getCustomerPosition,
    getQueueStats,
    
    // Computed values
    queueLength,
    waitingCustomers,
    currentCustomer,
    averageWaitTime: Math.round(averageWaitTime),
    
    // Status checks
    isEmpty: queue.length === 0,
    hasWaitingCustomers: waitingCustomers.length > 0,
    isProcessingCustomer: !!currentCustomer,
  };
};

// Hook for customer's own queue status
export const useCustomerQueue = (shopId, customerId) => {
  const { queue, ...queueHook } = useQueue(shopId);
  const [customerItem, setCustomerItem] = useState(null);

  useEffect(() => {
    if (!customerId || !queue.length) {
      setCustomerItem(null);
      return;
    }

    const item = queue.find(q => q.customerId === customerId);
    setCustomerItem(item || null);
  }, [queue, customerId]);

  return {
    ...queueHook,
    queue,
    customerItem,
    position: customerItem?.position || -1,
    estimatedWaitTime: customerItem?.estimatedWaitTime || 0,
    status: customerItem?.status || null,
    isInQueue: !!customerItem,
    isNext: customerItem?.position === 1,
    isBeingServed: customerItem?.status === QUEUE_STATUS.IN_PROGRESS,
  };
};

// Hook for queue management (barber interface)
export const useQueueManager = (shopId) => {
  const queueHook = useQueue(shopId);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Additional manager-specific actions
  const selectCustomer = useCallback((customerId) => {
    const customer = queueHook.queue.find(q => q.customerId === customerId);
    setSelectedCustomer(customer || null);
  }, [queueHook.queue]);

  const clearSelection = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  // Batch operations
  const processNextCustomer = useCallback(async () => {
    const nextCustomer = queueHook.waitingCustomers[0];
    if (nextCustomer) {
      await queueHook.progressCustomer(nextCustomer.customerId);
    }
  }, [queueHook]);

  const completeCurrentService = useCallback(async () => {
    if (queueHook.currentCustomer) {
      await queueHook.progressCustomer(queueHook.currentCustomer.customerId);
    }
  }, [queueHook]);

  return {
    ...queueHook,
    selectedCustomer,
    selectCustomer,
    clearSelection,
    processNextCustomer,
    completeCurrentService,
  };
};