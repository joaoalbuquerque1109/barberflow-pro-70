import { Barber, Service, Booking, TimeSlot, DashboardMetrics } from '@/types';

export const mockBarbers: Barber[] = [
  {
    id: '1',
    userId: 'u1',
    name: 'Carlos Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    specialties: ['Fade', 'Beard Trim', 'Hot Towel Shave'],
    rating: 4.9,
    reviewCount: 234,
    bio: 'Master barber with 10 years of experience specializing in modern fades and classic cuts.',
    commissionPercentage: 50,
    isAvailable: true,
  },
  {
    id: '2',
    userId: 'u2',
    name: 'Miguel Santos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    specialties: ['Classic Cuts', 'Razor Fade', 'Hair Design'],
    rating: 4.8,
    reviewCount: 189,
    bio: 'Creative stylist known for precision cuts and unique hair designs.',
    commissionPercentage: 45,
    isAvailable: true,
  },
  {
    id: '3',
    userId: 'u3',
    name: 'André Costa',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    specialties: ['Beard Sculpting', 'Skin Fade', 'Afro Cuts'],
    rating: 4.7,
    reviewCount: 156,
    bio: 'Beard specialist and expert in textured cuts for all hair types.',
    commissionPercentage: 50,
    isAvailable: false,
  },
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    description: 'Traditional haircut with scissors and clippers, includes wash and style.',
    price: 45,
    duration: 30,
    category: 'Haircuts',
  },
  {
    id: '2',
    name: 'Fade Haircut',
    description: 'Modern fade with seamless blending from skin to longer lengths.',
    price: 55,
    duration: 45,
    category: 'Haircuts',
  },
  {
    id: '3',
    name: 'Beard Trim',
    description: 'Professional beard shaping and trimming with hot towel treatment.',
    price: 25,
    duration: 20,
    category: 'Beard',
  },
  {
    id: '4',
    name: 'Hot Towel Shave',
    description: 'Luxurious straight razor shave with hot towel and premium products.',
    price: 40,
    duration: 35,
    category: 'Shave',
  },
  {
    id: '5',
    name: 'Haircut + Beard',
    description: 'Complete grooming package with haircut and beard styling.',
    price: 65,
    duration: 50,
    category: 'Combos',
  },
  {
    id: '6',
    name: 'Premium Package',
    description: 'Haircut, beard trim, hot towel shave, and scalp massage.',
    price: 95,
    duration: 75,
    category: 'Combos',
  },
];

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 20;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        id: `${date}-${time}`,
        time,
        isAvailable: Math.random() > 0.3,
      });
    }
  }
  
  return slots;
};

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    clientId: 'c1',
    clientName: 'João Pereira',
    barberId: '1',
    barberName: 'Carlos Silva',
    serviceId: '2',
    serviceName: 'Fade Haircut',
    date: '2024-12-03',
    time: '10:00',
    status: 'CONFIRMED',
    price: 55,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'b2',
    clientId: 'c2',
    clientName: 'Pedro Lima',
    barberId: '1',
    barberName: 'Carlos Silva',
    serviceId: '5',
    serviceName: 'Haircut + Beard',
    date: '2024-12-03',
    time: '11:00',
    status: 'CONFIRMED',
    price: 65,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'b3',
    clientId: 'c3',
    clientName: 'Lucas Mendes',
    barberId: '2',
    barberName: 'Miguel Santos',
    serviceId: '1',
    serviceName: 'Classic Haircut',
    date: '2024-12-03',
    time: '09:30',
    status: 'PENDING',
    price: 45,
    createdAt: new Date('2024-12-02'),
  },
  {
    id: 'b4',
    clientId: 'c1',
    clientName: 'João Pereira',
    barberId: '2',
    barberName: 'Miguel Santos',
    serviceId: '3',
    serviceName: 'Beard Trim',
    date: '2024-11-28',
    time: '14:00',
    status: 'COMPLETED',
    price: 25,
    createdAt: new Date('2024-11-25'),
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalBookings: 156,
  totalRevenue: 8450,
  newClients: 23,
  avgRating: 4.8,
  bookingsChange: 12,
  revenueChange: 18,
  clientsChange: 8,
};

export const weeklyRevenue = [
  { day: 'Mon', revenue: 980 },
  { day: 'Tue', revenue: 1250 },
  { day: 'Wed', revenue: 890 },
  { day: 'Thu', revenue: 1420 },
  { day: 'Fri', revenue: 1780 },
  { day: 'Sat', revenue: 2100 },
  { day: 'Sun', revenue: 650 },
];

export const serviceDistribution = [
  { name: 'Fade Haircut', value: 35, color: 'hsl(38, 92%, 50%)' },
  { name: 'Classic Haircut', value: 25, color: 'hsl(38, 80%, 60%)' },
  { name: 'Beard Trim', value: 20, color: 'hsl(38, 70%, 70%)' },
  { name: 'Combos', value: 15, color: 'hsl(38, 60%, 80%)' },
  { name: 'Shave', value: 5, color: 'hsl(38, 50%, 85%)' },
];
