// Comprehensive mock data for the barbershop application
import { generateId } from '../utils/helpers';
import { SERVICE_CATEGORIES, QUEUE_STATUS, USER_ROLES, APPOINTMENT_STATUS } from '../utils/constants';

// Mock Services Data
export const mockServices = [
  {
    id: 'service-1',
    name: 'Classic Haircut',
    description: 'Traditional scissor cut with styling',
    duration: 30,
    price: 25,
    category: SERVICE_CATEGORIES.HAIRCUT,
    popular: true,
  },
  {
    id: 'service-2',
    name: 'Beard Trim',
    description: 'Professional beard shaping and trimming',
    duration: 20,
    price: 15,
    category: SERVICE_CATEGORIES.BEARD,
    popular: true,
  },
  {
    id: 'service-3',
    name: 'Hot Towel Shave',
    description: 'Traditional straight razor shave with hot towel',
    duration: 45,
    price: 35,
    category: SERVICE_CATEGORIES.SHAVE,
    popular: false,
  },
  {
    id: 'service-4',
    name: 'Hair Wash & Style',
    description: 'Shampoo, conditioning, and professional styling',
    duration: 25,
    price: 20,
    category: SERVICE_CATEGORIES.STYLING,
    popular: true,
  },
  {
    id: 'service-5',
    name: 'Fade Cut',
    description: 'Modern fade haircut with precise blending',
    duration: 40,
    price: 30,
    category: SERVICE_CATEGORIES.HAIRCUT,
    popular: true,
  },
  {
    id: 'service-6',
    name: 'Full Service Combo',
    description: 'Haircut, beard trim, and styling package',
    duration: 60,
    price: 50,
    category: SERVICE_CATEGORIES.COMBO,
    popular: true,
  },
  {
    id: 'service-7',
    name: 'Mustache Trim',
    description: 'Precision mustache grooming and styling',
    duration: 15,
    price: 12,
    category: SERVICE_CATEGORIES.BEARD,
    popular: false,
  },
  {
    id: 'service-8',
    name: 'Hair Color Touch-up',
    description: 'Root touch-up and color refresh',
    duration: 90,
    price: 65,
    category: SERVICE_CATEGORIES.STYLING,
    popular: false,
  },
];

// Mock Barbershops Data
export const mockBarbershops = [
  {
    id: 'shop-1',
    name: 'Classic Cuts Barbershop',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'info@classiccuts.com',
    description: 'Traditional barbershop experience with modern convenience. Serving the community for over 20 years.',
    image: '/images/shop1.jpg',
    rating: 4.8,
    reviewCount: 156,
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      city: 'New York',
      state: 'NY',
    },
    businessHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '08:00', close: '19:00' },
      sunday: { open: '10:00', close: '17:00' },
    },
    services: mockServices.slice(0, 6),
    barbers: [
      {
        id: 'barber-1',
        name: 'Tony Martinez',
        specialties: ['Classic Cuts', 'Beard Styling'],
        experience: 8,
        rating: 4.9,
        image: '/images/barber1.jpg',
      },
      {
        id: 'barber-2',
        name: 'Mike Johnson',
        specialties: ['Fades', 'Modern Styles'],
        experience: 5,
        rating: 4.7,
        image: '/images/barber2.jpg',
      },
    ],
    amenities: ['WiFi', 'Coffee', 'Magazines', 'Air Conditioning'],
    priceRange: '$15-$65',
    currentQueue: 7,
    averageWaitTime: 25,
    isOpen: true,
  },
  {
    id: 'shop-2',
    name: 'Modern Gentleman',
    address: '456 Oak Avenue, Midtown',
    phone: '+1 (555) 234-5678',
    email: 'contact@moderngentleman.com',
    description: 'Contemporary barbershop focusing on modern cuts and grooming. Premium service in a stylish environment.',
    image: '/images/shop2.jpg',
    rating: 4.6,
    reviewCount: 203,
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      city: 'New York',
      state: 'NY',
    },
    businessHours: {
      monday: { open: '10:00', close: '19:00' },
      tuesday: { open: '10:00', close: '19:00' },
      wednesday: { open: '10:00', close: '19:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '11:00', close: '16:00' },
    },
    services: mockServices.slice(0, 7),
    barbers: [
      {
        id: 'barber-3',
        name: 'David Chen',
        specialties: ['Precision Cuts', 'Hair Styling'],
        experience: 12,
        rating: 4.8,
        image: '/images/barber3.jpg',
      },
      {
        id: 'barber-4',
        name: 'Alex Rodriguez',
        specialties: ['Color', 'Beard Design'],
        experience: 6,
        rating: 4.6,
        image: '/images/barber4.jpg',
      },
    ],
    amenities: ['Premium Coffee', 'Complimentary Drinks', 'TV', 'Leather Chairs'],
    priceRange: '$20-$70',
    currentQueue: 4,
    averageWaitTime: 15,
    isOpen: true,
  },
  {
    id: 'shop-3',
    name: 'The Vintage Barber',
    address: '789 Elm Street, Old Town',
    phone: '+1 (555) 345-6789',
    email: 'hello@vintagebarber.com',
    description: 'Step back in time with authentic vintage barbering. Hot towel shaves and classic cuts in a nostalgic setting.',
    image: '/images/shop3.jpg',
    rating: 4.9,
    reviewCount: 89,
    location: {
      latitude: 40.7282,
      longitude: -73.9942,
      city: 'New York',
      state: 'NY',
    },
    businessHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '19:00' },
      friday: { open: '08:00', close: '19:00' },
      saturday: { open: '07:00', close: '17:00' },
      sunday: { open: 'closed', close: 'closed' },
    },
    services: mockServices.slice(0, 5),
    barbers: [
      {
        id: 'barber-5',
        name: 'Frank Sullivan',
        specialties: ['Traditional Shaves', 'Classic Cuts'],
        experience: 25,
        rating: 4.9,
        image: '/images/barber5.jpg',
      },
    ],
    amenities: ['Vintage Atmosphere', 'Newspapers', 'Classic Music', 'Straight Razor Shaves'],
    priceRange: '$18-$45',
    currentQueue: 12,
    averageWaitTime: 35,
    isOpen: true,
  },
  {
    id: 'shop-4',
    name: 'Quick Clips Express',
    address: '321 Pine Street, Business District',
    phone: '+1 (555) 456-7890',
    email: 'info@quickclips.com',
    description: 'Fast, professional cuts for busy professionals. No appointment necessary, quality guaranteed.',
    image: '/images/shop4.jpg',
    rating: 4.3,
    reviewCount: 298,
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      city: 'New York',
      state: 'NY',
    },
    businessHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '09:00', close: '18:00' },
    },
    services: mockServices.slice(0, 4),
    barbers: [
      {
        id: 'barber-6',
        name: 'Sarah Wilson',
        specialties: ['Quick Cuts', 'Business Styles'],
        experience: 4,
        rating: 4.4,
        image: '/images/barber6.jpg',
      },
      {
        id: 'barber-7',
        name: 'James Brown',
        specialties: ['Efficient Service', 'Clean Cuts'],
        experience: 7,
        rating: 4.2,
        image: '/images/barber7.jpg',
      },
    ],
    amenities: ['Express Service', 'Credit Cards', 'Business Hours', 'Professional Setting'],
    priceRange: '$12-$35',
    currentQueue: 3,
    averageWaitTime: 10,
    isOpen: true,
  },
  {
    id: 'shop-5',
    name: 'Premium Grooming Lounge',
    address: '654 Luxury Lane, Uptown',
    phone: '+1 (555) 567-8901',
    email: 'concierge@premiumgrooming.com',
    description: 'Luxury grooming experience with premium services. Relaxation and style in an upscale environment.',
    image: '/images/shop5.jpg',
    rating: 4.7,
    reviewCount: 124,
    location: {
      latitude: 40.7738,
      longitude: -73.9663,
      city: 'New York',
      state: 'NY',
    },
    businessHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '08:00', close: '19:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    services: mockServices,
    barbers: [
      {
        id: 'barber-8',
        name: 'Marcus Williams',
        specialties: ['Luxury Cuts', 'Scalp Treatments'],
        experience: 15,
        rating: 4.8,
        image: '/images/barber8.jpg',
      },
      {
        id: 'barber-9',
        name: 'Isabella Garcia',
        specialties: ['Color Specialist', 'Premium Styling'],
        experience: 10,
        rating: 4.7,
        image: '/images/barber9.jpg',
      },
    ],
    amenities: ['Luxury Environment', 'Massage Chairs', 'Complimentary Beverages', 'Scalp Treatments'],
    priceRange: '$35-$120',
    currentQueue: 8,
    averageWaitTime: 40,
    isOpen: true,
  },
];

// Mock Users Data
export const mockUsers = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 111-2222',
    role: USER_ROLES.CUSTOMER,
    preferences: {
      favoriteShops: ['shop-1', 'shop-3'],
      preferredServices: ['service-1', 'service-2'],
      notifications: true,
      theme: 'light',
    },
    avatar: '/images/user1.jpg',
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 222-3333',
    role: USER_ROLES.CUSTOMER,
    preferences: {
      favoriteShops: ['shop-2', 'shop-5'],
      preferredServices: ['service-4', 'service-8'],
      notifications: true,
      theme: 'auto',
    },
    avatar: '/images/user2.jpg',
  },
  {
    id: 'barber-1',
    firstName: 'Tony',
    lastName: 'Martinez',
    email: 'tony@classiccuts.com',
    phone: '+1 (555) 333-4444',
    role: USER_ROLES.BARBER,
    shopId: 'shop-1',
    specialties: ['Classic Cuts', 'Beard Styling'],
    experience: 8,
    rating: 4.9,
    avatar: '/images/barber1.jpg',
  },
];

// Mock Queue Data
export const generateMockQueue = (shopId, size = 8) => {
  const queue = [];
  const customerNames = [
    'Michael Chen', 'Sarah Johnson', 'David Wilson', 'Emily Davis',
    'Robert Martinez', 'Lisa Anderson', 'Kevin Brown', 'Amanda Taylor',
    'Christopher Lee', 'Jennifer Garcia', 'Daniel Rodriguez', 'Michelle White'
  ];
  
  for (let i = 0; i < size; i++) {
    queue.push({
      id: generateId(),
      shopId,
      customerId: generateId(),
      customerName: customerNames[i % customerNames.length],
      service: mockServices[Math.floor(Math.random() * mockServices.length)],
      position: i + 1,
      status: i === 0 ? QUEUE_STATUS.IN_PROGRESS : QUEUE_STATUS.WAITING,
      joinTime: new Date(Date.now() - (size - i) * 5 * 60 * 1000), // Staggered join times
      estimatedWaitTime: (i) * 30, // 30 minutes per person ahead
      priority: Math.random() > 0.8 ? 'high' : 'normal',
      notes: Math.random() > 0.7 ? 'Regular customer' : '',
    });
  }
  
  return queue;
};

// Mock Appointments Data
export const mockAppointments = [
  {
    id: 'apt-1',
    customerId: 'user-1',
    customerName: 'John Doe',
    shopId: 'shop-1',
    barberId: 'barber-1',
    service: mockServices[0],
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    time: '14:00',
    status: APPOINTMENT_STATUS.CONFIRMED,
    notes: 'Prefer shorter on the sides',
    createdAt: new Date(),
  },
  {
    id: 'apt-2',
    customerId: 'user-2',
    customerName: 'Jane Smith',
    shopId: 'shop-2',
    barberId: 'barber-3',
    service: mockServices[3],
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    time: '10:30',
    status: APPOINTMENT_STATUS.SCHEDULED,
    notes: '',
    createdAt: new Date(),
  },
];

// Mock Reviews Data
export const mockReviews = [
  {
    id: 'review-1',
    shopId: 'shop-1',
    customerId: 'user-1',
    customerName: 'John D.',
    rating: 5,
    comment: 'Excellent service! Tony is a master barber. The shop has a great atmosphere.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    verified: true,
  },
  {
    id: 'review-2',
    shopId: 'shop-1',
    customerId: 'user-2',
    customerName: 'Jane S.',
    rating: 4,
    comment: 'Good haircut, friendly staff. Wait time was reasonable.',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    verified: true,
  },
  {
    id: 'review-3',
    shopId: 'shop-2',
    customerId: generateId(),
    customerName: 'Mike R.',
    rating: 5,
    comment: 'Modern, clean, professional. Great fade cut. Will definitely return.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    verified: true,
  },
];

// Export all mock data
export const mockData = {
  barbershops: mockBarbershops,
  services: mockServices,
  users: mockUsers,
  appointments: mockAppointments,
  reviews: mockReviews,
  generateQueue: generateMockQueue,
};

export default mockData;