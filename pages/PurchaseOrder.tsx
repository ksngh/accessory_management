
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_PRODUCTS } from '../constants';

const PurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Layout title="새 발주 작성" showBack>
      <div className="px-4 py-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-primary-text">공급처 선택</h3>
          <select className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:border-primary-dark focus:ring-0 text-base appearance-none bg-white">
            <option>Lux Accessories</option>
            <option>Global Trends Inc</option>
            <option>Prime Wholesale</option>
          </select>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary-text">상품 추가</h3>
            <span className="text-xs font-bold text-[#8E8E93]">카탈로그에서 선택</span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar border-y border-primary/10 py-2">
            {MOCK_PRODUCTS.slice(0, 3).map(product => (
              <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-colors">
                <div className="size-12 rounded-lg bg-center bg-cover border border-primary/10 shrink-0" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                <div className="flex-1">
                  <p className="text-sm font-bold truncate">{product.name}</p>
                  <p className="text-xs text-[#8B7E66]">₩{product.price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary-text">발주 목록 ({cart.length})</h3>
          {cart.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#AEAEB2] gap-2">
              <span className="material-symbols-outlined text-4xl">shopping_basket</span>
              <p className="text-sm font-medium">추가된 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-primary/10">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-sm">{item.name}</p>
                    <span className="text-xs font-bold text-[#8E8E93]">x{item.quantity}</span>
                  </div>
                  <p className="text-sm font-bold text-primary-dark">₩{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="pt-4 border-t border-primary/20 flex justify-between items-center">
                <p className="font-bold text-[#2D2926]">합계</p>
                <p className="text-xl font-black text-primary-text">₩{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          )}
        </section>

        <button 
          disabled={cart.length === 0}
          onClick={() => navigate('/orders')}
          className={`w-full h-14 font-bold text-lg rounded-2xl shadow-lg active:scale-[0.98] transition-all ${
            cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-primary-text'
          }`}
        >
          발주 요청하기
        </button>
      </div>
    </Layout>
  );
};

export default PurchaseOrder;
