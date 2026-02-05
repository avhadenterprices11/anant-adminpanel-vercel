import type { Customer, Address } from '../types/order.types';

// Mock Customers Data
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    gstin: '29ABCDE1234F1Z5',
    type: 'B2B',
  },
  {
    id: 'CUST-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 87654 32109',
    type: 'B2C',
  },
  {
    id: 'CUST-003',
    name: 'SportZone Retail Pvt Ltd',
    email: 'contact@sportzone.com',
    phone: '+91 76543 21098',
    gstin: '27XYZAB5678C2D9',
    type: 'B2B',
  },
  {
    id: 'CUST-004',
    name: 'Amit Patel',
    email: 'amit.patel@yahoo.com',
    phone: '+91 65432 10987',
    type: 'B2C',
  },
  {
    id: 'CUST-005',
    name: 'FitLife Enterprises',
    email: 'orders@fitlife.in',
    phone: '+91 54321 09876',
    gstin: '19PQRST9012G3H4',
    type: 'B2B',
  },
  {
    id: 'CUST-006',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@hotmail.com',
    phone: '+91 43210 98765',
    type: 'B2C',
  },
  {
    id: 'CUST-007',
    name: 'Champion Sports Academy',
    email: 'admin@championsports.com',
    phone: '+91 32109 87654',
    gstin: '33LMNOP3456I4J5',
    type: 'B2B',
  },
  {
    id: 'CUST-008',
    name: 'Vikram Singh',
    email: 'vikram.singh@outlook.com',
    phone: '+91 21098 76543',
    type: 'B2C',
  },
  {
    id: 'CUST-009',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    phone: '+91 10987 65432',
    type: 'B2C',
  },
  {
    id: 'CUST-010',
    name: 'Metro Sports Distributors',
    email: 'sales@metrosports.co.in',
    phone: '+91 09876 54321',
    gstin: '06UVWXY6789K5L6',
    type: 'B2B',
  },
  {
    id: 'CUST-011',
    name: 'Kavya Menon',
    email: 'kavya.menon@example.com',
    phone: '+91 98765 12340',
    type: 'B2C',
  },
  {
    id: 'CUST-012',
    name: 'ProFit Gym Equipment Ltd',
    email: 'procurement@profitgym.com',
    phone: '+91 87654 01239',
    gstin: '24DEFGH7890M6N7',
    type: 'B2B',
  },
];

// Mock Addresses Data (organized by customer)
export const MOCK_ADDRESSES: Record<string, Address[]> = {
  'CUST-001': [
    {
      id: 'ADDR-001-01',
      label: 'Office',
      address: '123 MG Road, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
    },
    {
      id: 'ADDR-001-02',
      label: 'Warehouse',
      address: '456 Industrial Area, Peenya',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560058',
    },
  ],
  'CUST-002': [
    {
      id: 'ADDR-002-01',
      label: 'Home',
      address: '789 Park Avenue, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
    },
  ],
  'CUST-003': [
    {
      id: 'ADDR-003-01',
      label: 'Headquarters',
      address: '12 Sector 18, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
    },
    {
      id: 'ADDR-003-02',
      label: 'Retail Store',
      address: '34 Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    {
      id: 'ADDR-003-03',
      label: 'Distribution Center',
      address: '56 Faridabad Industrial Estate',
      city: 'Faridabad',
      state: 'Haryana',
      pincode: '121003',
    },
  ],
  'CUST-004': [
    {
      id: 'ADDR-004-01',
      label: 'Home',
      address: '78 Law Garden Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009',
    },
  ],
  'CUST-005': [
    {
      id: 'ADDR-005-01',
      label: 'Office',
      address: '90 Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
    },
  ],
  'CUST-006': [
    {
      id: 'ADDR-006-01',
      label: 'Home',
      address: '23 Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
    },
    {
      id: 'ADDR-006-02',
      label: 'Office',
      address: '45 IT Corridor, OMR',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600096',
    },
  ],
  'CUST-007': [
    {
      id: 'ADDR-007-01',
      label: 'Academy Campus',
      address: '67 Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
    },
  ],
  'CUST-008': [
    {
      id: 'ADDR-008-01',
      label: 'Home',
      address: '89 Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302006',
    },
  ],
  'CUST-009': [
    {
      id: 'ADDR-009-01',
      label: 'Apartment',
      address: '101 HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
    },
  ],
  'CUST-010': [
    {
      id: 'ADDR-010-01',
      label: 'Main Office',
      address: '123 Rajouri Garden',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110027',
    },
    {
      id: 'ADDR-010-02',
      label: 'Warehouse',
      address: '145 Mundka Industrial Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110041',
    },
  ],
  'CUST-011': [
    {
      id: 'ADDR-011-01',
      label: 'Home',
      address: '167 Koramangala 4th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
  ],
  'CUST-012': [
    {
      id: 'ADDR-012-01',
      label: 'Showroom',
      address: '189 Linking Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    {
      id: 'ADDR-012-02',
      label: 'Godown',
      address: '201 Bhiwandi MIDC',
      city: 'Bhiwandi',
      state: 'Maharashtra',
      pincode: '421302',
    },
  ],
};

// Helper functions
export function getCustomerById(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find((customer) => customer.id === id);
}

export function getAddressesByCustomerId(customerId: string): Address[] {
  return MOCK_ADDRESSES[customerId] || [];
}

export function searchCustomers(query: string): Customer[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query) ||
      customer.gstin?.toLowerCase().includes(lowerQuery)
  );
}

// Indian States (for address validation and tax calculation)
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;
