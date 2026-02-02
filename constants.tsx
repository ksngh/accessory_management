
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

// Helper to generate IDs
const createProducts = (supplier: string, prefix: string, count: number): Product[] => {
  const categories = ['목걸이', '귀걸이', '반지', '팔찌'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i}`,
    name: '', 
    sku: '',
    price: (Math.floor(Math.random() * 20) + 5) * 10000,
    category: categories[i % categories.length],
    supplier,
    stock: Math.floor(Math.random() * 60) + 5, // 5~65 사이의 랜덤 재고
    hasSizes: categories[i % categories.length] === '반지',
    imageUrl: `https://images.unsplash.com/photo-${[
      '1605100804763-247f67b3557e', // ring
      '1611591437281-460bfbe1220a', // jewelry
      '1611085583191-a3b1a308c1db', // necklace
      '1515562141207-7a88fb7ce338', // bracelet
      '1603912627214-1213ae408a6b', // earrings
      '1626784215021-2e39ccf541e5', // ring
      '1512163143273-b02f4faad74c', // jewelry
      '1601121141461-9d6647bca1ed', // necklace
      '1599643478123-242f279105ea', // bracelet
      '1535633302704-b02f4faad74c', // earrings
      '1602173578636-1b5b0b0b0b0b', // ring
      '1611652023410-1b5b0b0b0b0b', // jewelry
      '1605100804763-247f67b3557e', // necklace
      '1611085583191-a3b1a308c1db', // bracelet
      '1515562141207-7a88fb7ce338', // earrings
      '1603912627214-1213ae408a6b', // ring
      '1626784215021-2e39ccf541e5', // jewelry
      '1512163143273-b02f4faad74c', // necklace
      '1601121141461-9d6647bca1ed', // bracelet
      '1599643478123-242f279105ea'  // earrings
    ][i % 20]}?q=80&w=500&auto=format&fit=crop` // Unsplash jewelry 이미지 URL
  }));
};

export const MOCK_PRODUCTS: Product[] = [
  ...createProducts('Lux Accessories', 'lx', 12),
  ...createProducts('Global Trends Inc', 'gt', 10),
  ...createProducts('Prime Wholesale', 'pw', 11),
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'PO-8829',
    date: '2023.10.24 • 오후 2:30',
    supplier: 'Lux Accessories',
    itemCount: 12,
    totalAmount: 1240000,
    status: OrderStatus.COMPLETED
  }
];
