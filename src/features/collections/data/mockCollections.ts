import type { Product, Collection } from '../types/collection.types';

// Mock products for collection preview
export const mockProducts: Product[] = [
  {
    id: 'PRD-SS-001',
    title: 'Kashmir Willow Cricket Bat',
    price: 2499,
    status: 'Active',
    tags: ['Cricket', 'Bat', 'Kashmir Willow'],
    sku: 'CRI-BAT-001',
    image: '/products/cricket-bat.jpg'
  },
  {
    id: 'PRD-SS-002',
    title: 'Professional Football Size 5',
    price: 899,
    status: 'Active',
    tags: ['Football', 'Size 5', 'Match Ball'],
    sku: 'FB-BALL-002',
    image: '/products/football.jpg'
  },
  {
    id: 'PRD-SS-003',
    title: 'Graphite Badminton Racket',
    price: 3200,
    status: 'Active',
    tags: ['Badminton', 'Racket', 'Graphite'],
    sku: 'BAD-RAC-003',
    image: '/products/badminton-racket.jpg'
  },
  {
    id: 'PRD-SS-004',
    title: 'Wilson Tennis Racket Pro',
    price: 5600,
    status: 'Active',
    tags: ['Tennis', 'Wilson', 'Professional'],
    sku: 'TEN-RAC-004',
    image: '/products/tennis-racket.jpg'
  },
  {
    id: 'PRD-SS-005',
    title: 'Spalding Basketball Official',
    price: 2100,
    status: 'Active',
    tags: ['Basketball', 'Spalding', 'Official'],
    sku: 'BB-BALL-005',
    image: '/products/basketball.jpg'
  },
  {
    id: 'PRD-SS-006',
    title: 'Professional Swimming Goggles',
    price: 799,
    status: 'Active',
    tags: ['Swimming', 'Goggles', 'Professional'],
    sku: 'SWM-GOG-006',
    image: '/products/swimming-goggles.jpg'
  },
  {
    id: 'PRD-SS-007',
    title: 'Premium Yoga Mat 6mm',
    price: 1299,
    status: 'Active',
    tags: ['Yoga', 'Mat', 'Premium'],
    sku: 'YOG-MAT-007',
    image: '/products/yoga-mat.jpg'
  },
  {
    id: 'PRD-SS-008',
    title: 'Running Shoes Pro Series',
    price: 4500,
    status: 'Active',
    tags: ['Running', 'Shoes', 'Pro'],
    sku: 'RUN-SHO-008',
    image: '/products/running-shoes.jpg'
  },
];

// Mock collections
export const mockCollections: Collection[] = [
  {
    id: 'COL-001',
    title: 'Cricket Equipment Collection',
    description: '<p>Premium cricket equipment for professional and amateur players</p>',
    bannerImage: '/banners/cricket-collection.jpg',
    bannerImageMobile: '/banners/cricket-collection-mobile.jpg',
    collectionType: 'automated',
    conditionMatchType: 'all',
    conditions: [
      { id: '1', field: 'tags', condition: 'contains', value: 'Cricket' }
    ],
    sortOrder: 'manually',
    status: 'active',
    publishDate: '2025-01-01',
    publishTime: '00:00',
    tags: ['Sports', 'Cricket', 'Featured'],
    urlHandle: 'cricket-equipment-collection',
    metaTitle: 'Cricket Equipment - Store',
    metaDescription: 'Shop premium cricket bats, balls, and accessories',
    adminComment: 'Featured cricket collection for the homepage',
    productCount: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
  },
  {
    id: 'COL-002',
    title: 'Premium Sports Collection',
    description: '<p>High-end sports equipment for professionals</p>',
    bannerImage: '/banners/premium-collection.jpg',
    bannerImageMobile: '/banners/premium-collection-mobile.jpg',
    collectionType: 'automated',
    conditionMatchType: 'all',
    conditions: [
      { id: '1', field: 'price', condition: 'is_greater_than', value: '3000' }
    ],
    sortOrder: 'price_high',
    status: 'active',
    publishDate: '2025-01-05',
    publishTime: '09:00',
    tags: ['Premium', 'Professional', 'High-End'],
    urlHandle: 'premium-sports-collection',
    metaTitle: 'Premium Sports Equipment',
    metaDescription: 'Discover our premium collection of professional sports equipment',
    adminComment: 'High-end products for professional athletes',
    productCount: 3,
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
  },
  {
    id: 'COL-003',
    title: 'Summer Sale 2025',
    description: '<p>Amazing deals on all sports equipment this summer</p>',
    bannerImage: '/banners/summer-sale.jpg',
    bannerImageMobile: '/banners/summer-sale-mobile.jpg',
    collectionType: 'manual',
    conditionMatchType: 'all',
    conditions: [],
    sortOrder: 'manually',
    status: 'active',
    publishDate: '2025-06-01',
    publishTime: '00:00',
    tags: ['Sale', 'Summer', 'Discount'],
    urlHandle: 'summer-sale-2025',
    metaTitle: 'Summer Sale 2025',
    metaDescription: 'Get amazing discounts on sports equipment this summer',
    adminComment: 'Seasonal sale collection for summer 2025',
    productCount: 0,
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-15T10:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
  },
];

// Helper function to get collection by ID
export const getCollectionById = (id: string): Collection | undefined => {
  return mockCollections.find(collection => collection.id === id);
};

// Helper function to filter products based on conditions
export const getMatchingProducts = (
  conditions: Array<{ field: string; condition: string; value: string }>,
  matchType: 'all' | 'any'
): Product[] => {
  if (conditions.length === 0 || conditions.some(c => !c.field || !c.condition)) {
    return [];
  }

  return mockProducts.filter(product => {
    const conditionResults = conditions.map(condition => {
      if (!condition.field || !condition.condition || !condition.value) return false;

      const { field, condition: condType, value } = condition;

      if (field === 'title') {
        const productTitle = product.title.toLowerCase();
        const searchValue = value.toLowerCase();

        switch (condType) {
          case 'starts_with':
            return productTitle.startsWith(searchValue);
          case 'ends_with':
            return productTitle.endsWith(searchValue);
          case 'contains':
            return productTitle.includes(searchValue);
          case 'is_equal_to':
            return productTitle === searchValue;
          case 'does_not_contain':
            return !productTitle.includes(searchValue);
          case 'is_not_equal_to':
            return productTitle !== searchValue;
          default:
            return false;
        }
      }

      if (field === 'price') {
        const productPrice = product.price;
        const searchPrice = parseFloat(value);

        switch (condType) {
          case 'is_equal_to':
            return productPrice === searchPrice;
          case 'is_greater_than':
            return productPrice > searchPrice;
          case 'is_less_than':
            return productPrice < searchPrice;
          case 'is_not_equal_to':
            return productPrice !== searchPrice;
          default:
            return false;
        }
      }

      if (field === 'tags') {
        const productTags = product.tags.map(t => t.toLowerCase());
        const searchValue = value.toLowerCase();

        switch (condType) {
          case 'is_equal_to':
            return productTags.some(tag => tag === searchValue);
          case 'contains':
            return productTags.some(tag => tag.includes(searchValue));
          case 'does_not_contain':
            return !productTags.some(tag => tag.includes(searchValue));
          case 'is_not_equal_to':
            return !productTags.some(tag => tag === searchValue);
          default:
            return false;
        }
      }

      return false;
    });

    // Apply AND or OR logic
    if (matchType === 'all') {
      return conditionResults.every(result => result);
    } else {
      return conditionResults.some(result => result);
    }
  });
};
