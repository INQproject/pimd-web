
export const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400',
    coordinates: { x: 35, y: 40 },
    description: 'Safe and secure parking spot in downtown Austin. Perfect for events and business trips.',
    amenities: ['24/7 Access', 'Security Camera', 'Well Lit', 'Covered'],
    slots: [
      { 
        id: 1, 
        name: 'Slot A', 
        timeRange: '8:00 AM - 12:00 PM', 
        capacity: 2, 
        startTime: '8:00 AM', 
        endTime: '12:00 PM',
        availableDates: ['2025-06-14', '2025-06-15', '2025-06-17', '2025-06-18', '2025-06-20']
      },
      { 
        id: 2, 
        name: 'Slot B', 
        timeRange: '1:00 PM - 6:00 PM', 
        capacity: 1, 
        startTime: '1:00 PM', 
        endTime: '6:00 PM',
        availableDates: ['2025-06-14', '2025-06-16', '2025-06-17', '2025-06-19']
      }
    ]
  },
  {
    id: 2,
    name: 'Deep Ellum Private Spot',
    address: '456 Elm St, Dallas, TX',
    price: 12,
    city: 'dallas',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400',
    coordinates: { x: 65, y: 25 },
    description: 'Convenient parking spot in the heart of Deep Ellum. Close to restaurants and nightlife.',
    amenities: ['CCTV', 'Well Lit'],
    slots: [
      { 
        id: 3, 
        name: 'Slot A', 
        timeRange: '9:00 AM - 2:00 PM', 
        capacity: 3, 
        startTime: '9:00 AM', 
        endTime: '2:00 PM',
        availableDates: ['2025-06-15', '2025-06-16', '2025-06-18']
      },
      { 
        id: 4, 
        name: 'Slot B', 
        timeRange: '3:00 PM - 8:00 PM', 
        capacity: 2, 
        startTime: '3:00 PM', 
        endTime: '8:00 PM',
        availableDates: ['2025-06-14', '2025-06-15', '2025-06-17', '2025-06-19', '2025-06-20', '2025-06-21']
      }
    ]
  },
  {
    id: 3,
    name: 'Phoenix Mall Parking',
    address: '789 Phoenix Way, Austin, TX',
    price: 8,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?w=400',
    coordinates: { x: 50, y: 60 },
    description: 'Affordable parking near Phoenix Mall with easy access to shopping and dining.',
    amenities: ['24/7 Access', 'Well Lit'],
    slots: [
      { 
        id: 5, 
        name: 'Slot A', 
        timeRange: '10:00 AM - 4:00 PM', 
        capacity: 5, 
        startTime: '10:00 AM', 
        endTime: '4:00 PM',
        availableDates: ['2025-06-14', '2025-06-15', '2025-06-16']
      },
      { 
        id: 6, 
        name: 'Slot B', 
        timeRange: '5:00 PM - 10:00 PM', 
        capacity: 3, 
        startTime: '5:00 PM', 
        endTime: '10:00 PM',
        availableDates: ['2025-06-16', '2025-06-17', '2025-06-18', '2025-06-19']
      }
    ]
  }
];
