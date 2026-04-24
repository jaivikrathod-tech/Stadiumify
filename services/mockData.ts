export const MOCK_PROFILES = [
  {
    id: 'user-1',
    ticket_id: 'TKT-12345',
    user_name: 'John Doe',
    section_id: '105',
    row_id: 'G',
    seat_number: '12',
    current_location: { latitude: 37.7749, longitude: -122.4194 },
    last_active: new Date().toISOString(),
  },
];

export const MOCK_STALLS = [
  {
    id: 'stall-1',
    name: 'Burger Boss',
    cuisine_type: 'American',
    coordinates: { latitude: 37.7750, longitude: -122.4190 },
    is_open: true,
    current_load: 5, // Green
  },
  {
    id: 'stall-2',
    name: 'Taco Tornado',
    cuisine_type: 'Mexican',
    coordinates: { latitude: 37.7748, longitude: -122.4198 },
    is_open: true,
    current_load: 25, // Yellow
  },
  {
    id: 'stall-3',
    name: 'Pizza Planet',
    cuisine_type: 'Italian',
    coordinates: { latitude: 37.7752, longitude: -122.4195 },
    is_open: true,
    current_load: 65, // Red
  },
];

export const MOCK_ORDERS = [];

export const MOCK_GATES = [
  {
    id: 'gate-a',
    gate_name: 'Gate A',
    location_description: 'North Entrance',
    congestion_level: 1, // Empty
    recommended_sections: ['101', '102', '103', '104', '105'],
  },
  {
    id: 'gate-b',
    gate_name: 'Gate B',
    location_description: 'East Entrance',
    congestion_level: 4, // Heavy
    recommended_sections: ['106', '107', '108', '109', '110'],
  },
];

// Helper functions for mock data
export const validateTicket = (ticketId: string, userName: string) => {
  return MOCK_PROFILES.find(
    (p) => p.ticket_id === ticketId && p.user_name.toLowerCase() === userName.toLowerCase()
  );
};
