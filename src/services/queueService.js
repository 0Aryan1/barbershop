// Queue service for managing queue operations and state
import { generateId } from '../utils/helpers';
import { QUEUE_STATUS, QUEUE_CONFIG } from '../utils/constants';
import storageService from './storageService';
import { mockData } from '../data/mockData';

class QueueService {
  constructor() {
    this.queues = new Map();
    this.listeners = new Map();
    this.simulationIntervals = new Map();
    this.initializeQueues();
  }

  // Initialize queues with mock data
  initializeQueues() {
    mockData.barbershops.forEach(shop => {
      const queueData = storageService.getQueueData(shop.id);
      if (queueData.length === 0) {
        // Generate initial queue if none exists
        const initialQueue = mockData.generateQueue(shop.id, shop.currentQueue);
        this.queues.set(shop.id, initialQueue);
        storageService.setQueueData(shop.id, initialQueue);
      } else {
        this.queues.set(shop.id, queueData);
      }
    });
  }

  // Get queue for a specific shop
  getQueue(shopId) {
    return this.queues.get(shopId) || [];
  }

  // Get queue position for a customer
  getCustomerPosition(shopId, customerId) {
    const queue = this.getQueue(shopId);
    const customer = queue.find(item => item.customerId === customerId);
    return customer ? customer.position : -1;
  }

  // Join queue
  joinQueue(shopId, customerData) {
    const queue = this.getQueue(shopId);
    const newPosition = queue.length + 1;
    
    const queueItem = {
      id: generateId(),
      shopId,
      customerId: customerData.id || generateId(),
      customerName: customerData.name,
      service: customerData.service,
      position: newPosition,
      status: QUEUE_STATUS.WAITING,
      joinTime: new Date(),
      estimatedWaitTime: this.calculateWaitTime(newPosition),
      priority: customerData.priority || 'normal',
      notes: customerData.notes || '',
      phone: customerData.phone,
      email: customerData.email,
    };

    const updatedQueue = [...queue, queueItem];
    this.updateQueue(shopId, updatedQueue);
    
    return queueItem;
  }

  // Leave queue
  leaveQueue(shopId, customerId) {
    const queue = this.getQueue(shopId);
    const updatedQueue = queue
      .filter(item => item.customerId !== customerId)
      .map((item, index) => ({
        ...item,
        position: index + 1,
        estimatedWaitTime: this.calculateWaitTime(index + 1),
      }));
    
    this.updateQueue(shopId, updatedQueue);
    return updatedQueue;
  }

  // Move customer to next status
  progressCustomer(shopId, customerId) {
    const queue = this.getQueue(shopId);
    const customerIndex = queue.findIndex(item => item.customerId === customerId);
    
    if (customerIndex === -1) return queue;

    const customer = queue[customerIndex];
    let updatedQueue = [...queue];

    if (customer.status === QUEUE_STATUS.WAITING && customer.position === 1) {
      // Start service for first person in queue
      updatedQueue[customerIndex] = {
        ...customer,
        status: QUEUE_STATUS.IN_PROGRESS,
        serviceStartTime: new Date(),
      };
    } else if (customer.status === QUEUE_STATUS.IN_PROGRESS) {
      // Complete service and remove from queue
      updatedQueue = updatedQueue
        .filter((_, index) => index !== customerIndex)
        .map((item, index) => ({
          ...item,
          position: index + 1,
          estimatedWaitTime: this.calculateWaitTime(index + 1),
        }));
    }

    this.updateQueue(shopId, updatedQueue);
    return updatedQueue;
  }

  // Mark customer as no-show
  markNoShow(shopId, customerId) {
    const queue = this.getQueue(shopId);
    const updatedQueue = queue
      .filter(item => item.customerId !== customerId)
      .map((item, index) => ({
        ...item,
        position: index + 1,
        estimatedWaitTime: this.calculateWaitTime(index + 1),
      }));
    
    this.updateQueue(shopId, updatedQueue);
    return updatedQueue;
  }

  // Reorder queue (drag and drop)
  reorderQueue(shopId, dragIndex, hoverIndex) {
    const queue = [...this.getQueue(shopId)];
    const draggedItem = queue[dragIndex];
    
    queue.splice(dragIndex, 1);
    queue.splice(hoverIndex, 0, draggedItem);
    
    const updatedQueue = queue.map((item, index) => ({
      ...item,
      position: index + 1,
      estimatedWaitTime: this.calculateWaitTime(index + 1),
    }));
    
    this.updateQueue(shopId, updatedQueue);
    return updatedQueue;
  }

  // Calculate estimated wait time
  calculateWaitTime(position) {
    return Math.max(0, (position - 1) * QUEUE_CONFIG.averageServiceTime);
  }

  // Update queue and notify listeners
  updateQueue(shopId, queue) {
    this.queues.set(shopId, queue);
    storageService.setQueueData(shopId, queue);
    this.notifyListeners(shopId, queue);
  }

  // Subscribe to queue updates
  subscribe(shopId, callback) {
    if (!this.listeners.has(shopId)) {
      this.listeners.set(shopId, new Set());
    }
    this.listeners.get(shopId).add(callback);

    // Return unsubscribe function
    return () => {
      const shopListeners = this.listeners.get(shopId);
      if (shopListeners) {
        shopListeners.delete(callback);
      }
    };
  }

  // Notify all listeners of queue changes
  notifyListeners(shopId, queue) {
    const shopListeners = this.listeners.get(shopId);
    if (shopListeners) {
      shopListeners.forEach(callback => callback(queue));
    }
  }

  // Start queue simulation for automatic progression
  startSimulation(shopId) {
    if (this.simulationIntervals.has(shopId)) {
      return; // Already running
    }

    const interval = setInterval(() => {
      this.simulateQueueProgression(shopId);
    }, QUEUE_CONFIG.autoProgressInterval);

    this.simulationIntervals.set(shopId, interval);
  }

  // Stop queue simulation
  stopSimulation(shopId) {
    const interval = this.simulationIntervals.get(shopId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(shopId);
    }
  }

  // Simulate automatic queue progression
  simulateQueueProgression(shopId) {
    const queue = this.getQueue(shopId);
    
    // Randomly progress the first customer
    if (queue.length > 0 && Math.random() < 0.3) {
      const firstCustomer = queue[0];
      if (firstCustomer.status === QUEUE_STATUS.WAITING) {
        this.progressCustomer(shopId, firstCustomer.customerId);
      } else if (firstCustomer.status === QUEUE_STATUS.IN_PROGRESS) {
        // Check if service time has elapsed
        const serviceTime = Date.now() - new Date(firstCustomer.serviceStartTime).getTime();
        if (serviceTime > firstCustomer.service.duration * 60 * 1000) {
          this.progressCustomer(shopId, firstCustomer.customerId);
        }
      }
    }

    // Randomly add new customers during business hours
    if (this.isBusinessHours() && queue.length < QUEUE_CONFIG.maxQueueSize && Math.random() < 0.2) {
      this.addRandomCustomer(shopId);
    }
  }

  // Add a random customer to simulate real queue activity
  addRandomCustomer(shopId) {
    const randomNames = [
      'Alex Johnson', 'Sam Wilson', 'Chris Davis', 'Taylor Brown',
      'Jordan Lee', 'Casey Miller', 'Riley Garcia', 'Avery Martinez'
    ];
    
    const services = mockData.services.filter(s => s.popular);
    
    const customerData = {
      name: randomNames[Math.floor(Math.random() * randomNames.length)],
      service: services[Math.floor(Math.random() * services.length)],
      priority: Math.random() > 0.9 ? 'high' : 'normal',
    };

    this.joinQueue(shopId, customerData);
  }

  // Check if it's business hours
  isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 20;
  }

  // Get queue statistics
  getQueueStats(shopId) {
    const queue = this.getQueue(shopId);
    const totalWaiting = queue.filter(item => item.status === QUEUE_STATUS.WAITING).length;
    const inProgress = queue.filter(item => item.status === QUEUE_STATUS.IN_PROGRESS).length;
    const averageWaitTime = queue.length > 0 ? 
      queue.reduce((sum, item) => sum + item.estimatedWaitTime, 0) / queue.length : 0;

    return {
      totalInQueue: queue.length,
      totalWaiting,
      inProgress,
      averageWaitTime: Math.round(averageWaitTime),
      nextAvailableSlot: this.getNextAvailableTime(shopId),
    };
  }

  // Get next available time slot
  getNextAvailableTime(shopId) {
    const queue = this.getQueue(shopId);
    const totalWaitTime = queue.reduce((sum, item) => sum + item.service.duration, 0);
    
    const nextAvailable = new Date();
    nextAvailable.setMinutes(nextAvailable.getMinutes() + totalWaitTime);
    
    return nextAvailable;
  }

  // Clear all queues
  clearAllQueues() {
    this.queues.clear();
    this.listeners.clear();
    this.simulationIntervals.forEach(interval => clearInterval(interval));
    this.simulationIntervals.clear();
    storageService.clearQueueData();
  }
}

export default new QueueService();