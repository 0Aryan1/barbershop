// API service layer for future backend integration
import { mockData } from '../data/mockData';
import { calculateDistance } from '../utils/helpers';
import { DEFAULT_LOCATION } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '';
    this.isUsingMockData = !this.baseUrl;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    if (this.isUsingMockData) {
      return this.mockRequest(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error.message, success: false };
    }
  }

  // Mock request handler for development
  async mockRequest(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;

    try {
      const result = this.handleMockEndpoint(endpoint, method, body);
      return { data: result, success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Handle mock endpoints
  handleMockEndpoint(endpoint, method, body) {
    const [, resource, id] = endpoint.split('/').filter(Boolean);

    switch (resource) {
      case 'barbershops':
        return this.handleBarbershopsEndpoint(method, id, body);
      case 'queue':
        return this.handleQueueEndpoint(method, id, body);
      case 'appointments':
        return this.handleAppointmentsEndpoint(method, id, body);
      case 'services':
        return this.handleServicesEndpoint(method, id, body);
      case 'users':
        return this.handleUsersEndpoint(method, id, body);
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  // Barbershops API handlers
  handleBarbershopsEndpoint(method, id, body) {
    switch (method) {
      case 'GET':
        if (id) {
          const shop = mockData.barbershops.find(s => s.id === id);
          if (!shop) throw new Error('Barbershop not found');
          return shop;
        }
        return mockData.barbershops;
      
      case 'POST':
        // Create new barbershop
        const newShop = {
          id: `shop-${Date.now()}`,
          ...body,
          rating: 0,
          reviewCount: 0,
          currentQueue: 0,
          averageWaitTime: 0,
        };
        mockData.barbershops.push(newShop);
        return newShop;
      
      case 'PUT':
        // Update barbershop
        const shopIndex = mockData.barbershops.findIndex(s => s.id === id);
        if (shopIndex === -1) throw new Error('Barbershop not found');
        mockData.barbershops[shopIndex] = { ...mockData.barbershops[shopIndex], ...body };
        return mockData.barbershops[shopIndex];
      
      default:
        throw new Error(`Method ${method} not supported for barbershops`);
    }
  }

  // Queue API handlers
  handleQueueEndpoint(method, id, body) {
    // Queue operations are handled by queueService
    // This is just for API compatibility
    switch (method) {
      case 'GET':
        if (id) {
          // Get queue for specific shop
          return mockData.generateQueue(id);
        }
        return [];
      
      default:
        throw new Error(`Method ${method} not supported for queue`);
    }
  }

  // Appointments API handlers
  handleAppointmentsEndpoint(method, id, body) {
    switch (method) {
      case 'GET':
        if (id) {
          const appointment = mockData.appointments.find(a => a.id === id);
          if (!appointment) throw new Error('Appointment not found');
          return appointment;
        }
        return mockData.appointments;
      
      case 'POST':
        // Create new appointment
        const newAppointment = {
          id: `apt-${Date.now()}`,
          ...body,
          createdAt: new Date(),
        };
        mockData.appointments.push(newAppointment);
        return newAppointment;
      
      case 'PUT':
        // Update appointment
        const aptIndex = mockData.appointments.findIndex(a => a.id === id);
        if (aptIndex === -1) throw new Error('Appointment not found');
        mockData.appointments[aptIndex] = { ...mockData.appointments[aptIndex], ...body };
        return mockData.appointments[aptIndex];
      
      case 'DELETE':
        // Cancel appointment
        const cancelIndex = mockData.appointments.findIndex(a => a.id === id);
        if (cancelIndex === -1) throw new Error('Appointment not found');
        mockData.appointments.splice(cancelIndex, 1);
        return { success: true };
      
      default:
        throw new Error(`Method ${method} not supported for appointments`);
    }
  }

  // Services API handlers
  handleServicesEndpoint(method, id, body) {
    switch (method) {
      case 'GET':
        if (id) {
          const service = mockData.services.find(s => s.id === id);
          if (!service) throw new Error('Service not found');
          return service;
        }
        return mockData.services;
      
      default:
        throw new Error(`Method ${method} not supported for services`);
    }
  }

  // Users API handlers
  handleUsersEndpoint(method, id, body) {
    switch (method) {
      case 'GET':
        if (id) {
          const user = mockData.users.find(u => u.id === id);
          if (!user) throw new Error('User not found');
          return user;
        }
        return mockData.users;
      
      case 'POST':
        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          ...body,
          createdAt: new Date(),
        };
        mockData.users.push(newUser);
        return newUser;
      
      case 'PUT':
        // Update user
        const userIndex = mockData.users.findIndex(u => u.id === id);
        if (userIndex === -1) throw new Error('User not found');
        mockData.users[userIndex] = { ...mockData.users[userIndex], ...body };
        return mockData.users[userIndex];
      
      default:
        throw new Error(`Method ${method} not supported for users`);
    }
  }

  // Specific API methods

  // Get all barbershops
  async getBarbershops() {
    return this.request('/api/barbershops');
  }

  // Get barbershop by ID
  async getBarbershop(id) {
    return this.request(`/api/barbershops/${id}`);
  }

  // Search barbershops by location and filters
  async searchBarbershops(filters = {}) {
    const result = await this.getBarbershops();
    if (!result.success) return result;

    let shops = result.data;

    // Apply location filter
    if (filters.location) {
      shops = shops.map(shop => ({
        ...shop,
        distance: calculateDistance(
          filters.location.latitude,
          filters.location.longitude,
          shop.location.latitude,
          shop.location.longitude
        ),
      }));

      if (filters.radius) {
        shops = shops.filter(shop => shop.distance <= filters.radius);
      }

      shops.sort((a, b) => a.distance - b.distance);
    }

    // Apply service filter
    if (filters.services && filters.services.length > 0) {
      shops = shops.filter(shop =>
        filters.services.every(serviceId =>
          shop.services.some(service => service.id === serviceId)
        )
      );
    }

    // Apply rating filter
    if (filters.minRating) {
      shops = shops.filter(shop => shop.rating >= filters.minRating);
    }

    // Apply price range filter
    if (filters.priceRange) {
      // This would need more sophisticated price range matching
      // For now, just return all shops
    }

    // Apply open status filter
    if (filters.openNow) {
      shops = shops.filter(shop => shop.isOpen);
    }

    return { data: shops, success: true };
  }

  // Get services
  async getServices() {
    return this.request('/api/services');
  }

  // Get appointments for user
  async getUserAppointments(userId) {
    const result = await this.request('/api/appointments');
    if (!result.success) return result;

    const userAppointments = result.data.filter(apt => apt.customerId === userId);
    return { data: userAppointments, success: true };
  }

  // Create appointment
  async createAppointment(appointmentData) {
    return this.request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  // Update appointment
  async updateAppointment(id, appointmentData) {
    return this.request(`/api/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  // Cancel appointment
  async cancelAppointment(id) {
    return this.request(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Get nearby barbershops
  async getNearbyBarbershops(location = DEFAULT_LOCATION, radius = 10) {
    return this.searchBarbershops({
      location,
      radius,
      openNow: false,
    });
  }

  // Get popular services
  async getPopularServices() {
    const result = await this.getServices();
    if (!result.success) return result;

    const popularServices = result.data.filter(service => service.popular);
    return { data: popularServices, success: true };
  }
}

export default new ApiService();