
import { Product, Category, Order, OrderStatus } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: '팔찌', count: 24, icon: 'diamond' },
  { id: '2', name: '목걸이', count: 18, icon: 'auto_awesome' },
  { id: '3', name: '귀걸이', count: 42, icon: 'all_out' },
  { id: '4', name: '반지', count: 31, icon: 'radio_button_unchecked' },
  { id: '5', name: '시계', count: 0, icon: 'watch' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '골드 체인 목걸이',
    sku: 'NK-001',
    price: 45000,
    category: '목걸이',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDdXfQUE36onbqbI922IVllWpxvq-hQoOlCeK1wDPoP_OA_aWI5mrGEkNPCKCy8llHZzoODiNlXap8mM_mJXmt-_jFBfQNQRiAZBuKrC01z8FkR1cz74Ns11VIYhccuPfHMl8Dhs9k9YiLN_8FWw9xGDrNexa98DpaKQi9OEgM7KxIsPBycLHRo-7krdex6lzlOEcAmKfA1lOJqhsiEfYC2t1dOCicDqjxuSoBevuSnHV0NtfuHCJGtnfffkMbCovq5JRHFkUL'
  },
  {
    id: 'p2',
    name: '실버 커프 팔찌',
    sku: 'BR-052',
    price: 30000,
    category: '팔찌',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvOigo7sJP8WniuWbkrQ9maMGtzpCTS51IruKLMp-cJ7enfkspjPr3-VHTk_CNRl4RbGErA0rBz1v_Q2lenPvG3WaIzeo6jd7nmHHuSKO_dzKbDDAgAuzZb-NfFdR0UcxKzMRXo7lbeeJotJ6p-SPF4Q3a88KJgr4PHxZBa_dSqmxaRf05GI-ZUvWBqbXml7Ev-f2n7s0uQpwfgg3rPloUIfAmfTg--M866UDc2K_RrAp8zv0y1_3xaKS5uwyiQLituRvmkQQ3'
  },
  {
    id: 'p3',
    name: '클래식 진주 귀걸이',
    sku: 'ER-012',
    price: 55000,
    category: '귀걸이',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0dD8CSqMdX4-pEvPfhopcUtnACEKV00c6cf-2gWJ6G9Iv9VHn5u-JRaZLKwkiOCK4fDSVB5RMRV2vjsF9v2VIzkYs2W5WjYQ9SQrxp3hIVt-XIpAlVzZkVo1qXsljXD0kf-PQMuS_BOjlIDYTM12ZukuCvT6EO8pHfQTjyXzvr0QjKcUWjrMVDX0cbR-jzA9a74mR12QFoe67xeySvemC-GmGO1BUe8PmULoiv_nzbY6B2aCV49M3OIVdFA1SxYx27lLS8azI'
  },
  {
    id: 'p4',
    name: '로즈 골드 반지',
    sku: 'RG-088',
    price: 120000,
    category: '반지',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsRL8Y8Mnh-PGZaJ5sjNwvlTgBBRZwiaFLaabtMBN_ZKJdUkeXKBYNXwTcxXsHAWi_4_k8zRaoIJwBQ3Ga79dgzG0F4LV3acSxsfmF_oXhRGxAFT7yi9RmbLLZSmb1Gw-QVVJeelFaVihnPJq-Nzs5DpjJAAWb4-yuXBecZvZ8SivthbCJVKpucH0h2ZFhUS94skE5L77fdPbw5PGMPSfXRa73qd8ygAYO05xpnIuPoyA7h4iwFoZM7HzE3bGYNG3aIMNgB-PA'
  }
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
  },
  {
    id: 'o2',
    orderNumber: 'PO-8825',
    date: '2023.10.20 • 오전 11:15',
    supplier: 'Global Trends Inc',
    itemCount: 45,
    totalAmount: 4850500,
    status: OrderStatus.PENDING
  },
  {
    id: 'o3',
    orderNumber: 'PO-8812',
    date: '2023.10.15 • 오전 09:45',
    supplier: 'Prime Wholesale',
    itemCount: 8,
    totalAmount: 210000,
    status: OrderStatus.CANCELED
  }
];
