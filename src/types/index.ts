export type UserRole = 'CLIENT' | 'BARBER' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Barber {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  bio: string;
  commissionPercentage: number;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  image?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  price: number;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  newClients: number;
  avgRating: number;
  bookingsChange: number;
  revenueChange: number;
  clientsChange: number;
}

export interface LoyaltyPoints {
  userId: string;
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  totalEarned: number;
}
