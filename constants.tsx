
import { Product, Category, Order, OrderStatus, Supplier, Color, RingSize } from './types';

export const COLORS: Color[] = ['골드', '로즈', '실버'];
export const RING_SIZES: RingSize[] = ['3호', '5호', '7호', '9호', '11호', '13호', '15호', '17호', '19호', '21호', '23호'];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: '팔찌', count: 24, icon: 'diamond' },
  { id: '2', name: '목걸이', count: 18, icon: 'auto_awesome' },
  { id: '3', name: '귀걸이', count: 42, icon: 'all_out' },
  { id: '4', name: '반지', count: 31, icon: 'radio_button_unchecked' },
  { id: '6', name: '기타', count: 5, icon: 'category' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Lux Accessories' },
  { id: 's2', name: 'Global Trends Inc' },
  { id: 's3', name: 'Prime Wholesale' },
];

const IMAGES = {
  반지: [
    '1605100804763-247f67b3557e',
    '1588444837941-ad2c6275b09a',
    '1617114770295-690a61821033',
    '1598560917505-59a3ad559071'
  ],
  목걸이: [
    '1599643478123-242f279105ea',
    '1611591437281-460bfbe1220a',
    '1611085583191-a3b1a308c1db',
    '1512163143273-b02f4faad74c'
  ],
  귀걸이: [
    '1535633302704-b02f4faad74c',
    '1601121141461-9d6647bca1ed',
    '1612450800052-759c39abf922'
  ],
  팔찌: [
    '1515562141207-7a88fb7ce338',
    '1603912627214-1213ae408a6b',
    '1573408302357-a99f1807353b'
  ]
};

const createProducts = (supplier: string, prefix: string, count: number): Product[] => {
  const categories = ['목걸이', '귀걸이', '반지', '팔찌'];
  return Array.from({ length: count }).map((_, i) => {
    const category = categories[i % categories.length] as keyof typeof IMAGES;
    const imageList = IMAGES[category] || IMAGES['목걸이'];
    const imageId = imageList[i % imageList.length];
    
    return {
      id: `${prefix}-${i}`,
      name: `${prefix.toUpperCase()}-${i + 100}`, 
      sku: `${prefix.toUpperCase()}${i + 100}`,
      price: (Math.floor(Math.random() * 20) + 5) * 10000,
      category,
      supplier,
      stock: Math.floor(Math.random() * 60) + 5,
      hasSizes: category === '반지',
      imageUrl: `https://images.unsplash.com/photo-${imageId}?q=80&w=500&auto=format&fit=crop`
    };
  });
};

export const MOCK_PRODUCTS: Product[] = [
  ...createProducts('Lux Accessories', 'lx', 12),
  ...createProducts('Global Trends Inc', 'gt', 10),
  ...createProducts('Prime Wholesale', 'pw', 11),
];

// 반지 제품 하나를 선택하여 동일 품목의 다른 옵션 시나리오 구성
const sampleRing = MOCK_PRODUCTS.find(p => p.category === '반지') || MOCK_PRODUCTS[0];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'PO-8829',
    date: '2023.10.24 • 오후 2:30',
    supplier: 'Lux Accessories',
    itemCount: 4,
    totalAmount: 480000,
    status: OrderStatus.COMPLETED,
    items: [
      // 동일 품목(반지), 다른 색상/호수 예시
      { ...sampleRing, quantity: 2, selectedColor: '골드', selectedSize: '11호' },
      { ...sampleRing, quantity: 2, selectedColor: '실버', selectedSize: '11호' },
      { ...sampleRing, quantity: 1, selectedColor: '골드', selectedSize: '15호' },
      { ...MOCK_PRODUCTS[1], quantity: 5, selectedColor: '골드' },
    ]
  },
  {
    id: 'o2',
    orderNumber: 'PO-9012',
    date: '2023.11.12 • 오전 10:15',
    supplier: 'Global Trends Inc',
    itemCount: 2,
    totalAmount: 220000,
    status: OrderStatus.PENDING,
    items: [
      { ...MOCK_PRODUCTS[12], quantity: 2, selectedColor: '실버' },
      { ...MOCK_PRODUCTS[12], quantity: 2, selectedColor: '골드' },
    ]
  }
];
