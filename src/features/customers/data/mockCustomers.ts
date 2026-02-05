import type { Customer, Address } from '../types/customer.types';

// Mock Customers Data for Anant Enterprises
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'SS-001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    gstin: '29ABCDE1234F1Z5',
    type: 'WholeSale', // Mapping B2B -> Wholesale for now
    created_at: '2024-01-15T10:30:00Z',
    total_orders: 45,
    total_spent: 125000,
    status: 'Active',
  },
  {
    id: 'SS-002',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43211',
    type: 'Retail', // Mapping B2C -> Retail
    created_at: '2024-01-20T14:15:00Z',
    total_orders: 12,
    total_spent: 25000,
    status: 'Active',
  },
  {
    id: 'SS-003',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@example.com',
    phone: '+91 98765 43212',
    gstin: '27XYZAB5678C2D9',
    type: 'Distributor', // Mapping B2B -> Distributor
    created_at: '2024-02-01T09:00:00Z',
    total_orders: 78,
    total_spent: 350000,
    status: 'Active',
  },
  {
    id: 'SS-004',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91 98765 43213',
    type: 'Retail',
    created_at: '2024-02-10T11:45:00Z',
    total_orders: 8,
    total_spent: 15000,
    status: 'Active',
  },
  {
    id: 'SS-005',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 98765 43214',
    gstin: '19PQRST9012G3H4',
    type: 'Distributor',
    created_at: '2024-02-15T08:20:00Z',
    total_orders: 56,
    total_spent: 180000,
    status: 'Active',
  },
  {
    id: 'SS-006',
    firstName: 'Anjali',
    lastName: 'Gupta',
    email: 'anjali.gupta@example.com',
    phone: '+91 98765 43215',
    type: 'Retail',
    created_at: '2024-02-20T16:30:00Z',
    total_orders: 5,
    total_spent: 8500,
    status: 'Active',
  },
  {
    id: 'SS-007',
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43216',
    type: 'Retail',
    created_at: '2024-03-01T10:00:00Z',
    total_orders: 15,
    total_spent: 32000,
    status: 'Active',
  },
  {
    id: 'SS-008',
    firstName: 'Kavita',
    lastName: 'Joshi',
    email: 'kavita.joshi@example.com',
    phone: '+91 98765 43217',
    gstin: '33LMNOP3456I4J5',
    type: 'Wholesale',
    created_at: '2024-03-05T13:15:00Z',
    total_orders: 92,
    total_spent: 420000,
    status: 'Active',
  },
  {
    id: 'SS-009',
    firstName: 'Suresh',
    lastName: 'Nair',
    email: 'suresh.nair@example.com',
    phone: '+91 98765 43218',
    type: 'Retail',
    created_at: '2024-03-10T09:30:00Z',
    total_orders: 3,
    total_spent: 5500,
    status: 'Inactive',
  },
  {
    id: 'SS-010',
    firstName: 'Deepa',
    lastName: 'Menon',
    email: 'deepa.menon@example.com',
    phone: '+91 98765 43219',
    type: 'Retail',
    created_at: '2024-03-15T15:45:00Z',
    total_orders: 7,
    total_spent: 12000,
    status: 'Active',
  },
  {
    id: 'SS-011',
    firstName: 'Arjun',
    lastName: 'Malhotra',
    email: 'arjun.malhotra@example.com',
    phone: '+91 98765 43220',
    gstin: '06UVWXY6789K5L6',
    type: 'Distributor',
    created_at: '2024-03-20T11:00:00Z',
    total_orders: 34,
    total_spent: 98000,
    status: 'Active',
  },
  {
    id: 'SS-012',
    firstName: 'Meera',
    lastName: 'Krishnan',
    email: 'meera.krishnan@example.com',
    phone: '+91 98765 43221',
    type: 'Retail',
    created_at: '2024-03-25T14:20:00Z',
    total_orders: 19,
    total_spent: 45000,
    status: 'Active',
  },
  {
    id: 'SS-013',
    firstName: 'Sanjay',
    lastName: 'Rao',
    email: 'sanjay.rao@example.com',
    phone: '+91 98765 43222',
    gstin: '24DEFGH7890M6N7',
    type: 'Distributor',
    created_at: '2024-04-01T10:15:00Z',
    total_orders: 67,
    total_spent: 245000,
    status: 'Active',
  },
  {
    id: 'SS-014',
    firstName: 'Pooja',
    lastName: 'Desai',
    email: 'pooja.desai@example.com',
    phone: '+91 98765 43223',
    type: 'Retail',
    created_at: '2024-04-05T12:30:00Z',
    total_orders: 11,
    total_spent: 22000,
    status: 'Active',
  },
  {
    id: 'SS-015',
    firstName: 'Karthik',
    lastName: 'Subramanian',
    email: 'karthik.subramanian@example.com',
    phone: '+91 98765 43224',
    type: 'Retail',
    created_at: '2024-04-10T16:00:00Z',
    total_orders: 6,
    total_spent: 9800,
    status: 'Active',
  },
] as Customer[];

// Mock Addresses Data (organized by customer)
export const MOCK_ADDRESSES: Record<string, Address[]> = {
  'SS-001': [
    {
      addressLine1: '123 MG Road, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560066',
      country: 'India'
    },
  ],
  'SS-002': [
    {
      addressLine1: '789 Park Avenue, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400058',
      country: 'India'
    },
  ],
  'SS-003': [
    {
      addressLine1: '12 Sector 18, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201301',
      country: 'India'
    },
  ],
};

// Helper functions
export function getCustomerById(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find((customer) => customer.id === id);
}

export function searchCustomers(query: string): Customer[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_CUSTOMERS.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(lowerQuery) ||
      customer.lastName.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query) ||
      customer.id.toLowerCase().includes(lowerQuery)
  );
}
