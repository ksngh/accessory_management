
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_PRODUCTS, COLORS, RING_SIZES } from '../constants';
import { Product, Color, RingSize } from '../types';

const StockEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  
  // 상세 재고 상태 관리
  // key format: 'color' or 'color-size'
  const [detailedStock, setDetailedStock] = useState<Record<string, number>>({});

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      
      // 목업 데이터를 기반으로 초기 상세 재고 생성 (실제 앱에서는 서버에서 가져옴)
      const initial: Record<string, number> = {};
      if (found.hasSizes) {
        RING_SIZES.forEach(size => {
          COLORS.forEach(color => {
            const seed = (found.id.length + color.length + size.length) % 10;
            initial[`${color}-${size}`] = Math.floor((found.stock / 33) + seed);
          });
        });
      } else {
        COLORS.forEach(color => {
          const seed = (found.id.length + color.length) % 10;
          initial[color] = Math.floor((found.stock / 3) + seed);
        });
      }
      setDetailedStock(initial);
    }
  }, [id]);

  const totalStock = useMemo(() => {
    return Object.values(detailedStock).reduce((sum, val) => Number(sum) + Number(val), 0);
  }, [detailedStock]);

  const updateQuantity = (key: string, delta: number) => {
    setDetailedStock(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    const num = parseInt(value) || 0;
    setDetailedStock(prev => ({
      ...prev,
      [key]: Math.max(0, num)
    }));
  };

  const handleSave = () => {
    if (product) {
      product.stock = totalStock;
      // 상세 데이터 저장 로직...
    }
    navigate(-1);
  };

  if (!product) return null;

  return (
    <Layout title="재고 정밀 수정" showBack>
      <div className="px-5 py-6 space-y-8 pb-48">
        {/* 상품 정보 카드 */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-primary/10 flex items-center gap-5">
          <div 
            className="size-24 rounded-2xl bg-center bg-cover shadow-inner border border-gray-100 shrink-0"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
          <div className="space-y-1 overflow-hidden">
            <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest truncate">{product.supplier}</p>
            <h3 className="text-lg font-black text-primary-text leading-tight truncate">₩{product.price.toLocaleString()}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
              <span className="size-2 rounded-full bg-primary-dark" />
              <span className="text-[10px] font-black text-primary-dark">총 재고: {totalStock}개</span>
            </div>
          </div>
        </div>

        {/* 재고 수정 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">상세 수량 관리</h4>
            <div className="flex gap-4 text-[9px] font-black text-gray-300 uppercase">
              <span>Gold</span>
              <span>Rose</span>
              <span>Silver</span>
            </div>
          </div>

          {!product.hasSizes ? (
            <div className="bg-white rounded-3xl p-5 border border-primary/10 shadow-sm space-y-4">
              {COLORS.map(color => (
                <div key={color} className="flex items-center justify-between p-2 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <span className="text-sm font-black text-primary-text ml-2">{color}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(color, -1)} className="size-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 active:bg-gray-100">
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <input 
                      type="number"
                      value={detailedStock[color] || 0}
                      onChange={(e) => handleInputChange(color, e.target.value)}
                      className="w-16 text-center text-lg font-black bg-transparent border-none focus:ring-0 p-0 text-primary-text"
                    />
                    <button onClick={() => updateQuantity(color, 1)} className="size-9 rounded-full bg-primary flex items-center justify-center text-primary-text active:scale-90">
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
                {RING_SIZES.map((size, idx) => (
                  <div key={size} className={`flex items-center justify-between p-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} border-b border-gray-50 last:border-none`}>
                    <span className="text-xs font-black text-primary-dark min-w-[40px]">{size}</span>
                    <div className="flex gap-2">
                      {COLORS.map(color => {
                        const key = `${color}-${size}`;
                        return (
                          <div key={color} className="flex flex-col items-center gap-1">
                            <div className="flex items-center bg-gray-50 rounded-lg p-1 px-1.5 border border-gray-100">
                               <button 
                                 onClick={() => updateQuantity(key, -1)}
                                 className="text-gray-300 active:text-primary-dark"
                               >
                                 <span className="material-symbols-outlined text-[14px]">remove</span>
                               </button>
                               <input 
                                 type="number"
                                 value={detailedStock[key] || 0}
                                 onChange={(e) => handleInputChange(key, e.target.value)}
                                 className="w-8 text-center text-[11px] font-black bg-transparent border-none focus:ring-0 p-0 text-primary-text"
                               />
                               <button 
                                 onClick={() => updateQuantity(key, 1)}
                                 className="text-primary-dark active:scale-125 transition-transform"
                               >
                                 <span className="material-symbols-outlined text-[14px]">add</span>
                               </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 저장 버튼 */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 bg-background-light/95 backdrop-blur-md py-6 border-t border-primary/20 z-[80] shadow-2xl">
          <button 
            onClick={handleSave}
            className="w-full h-16 bg-primary-text text-white font-black text-lg rounded-[1.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">save_as</span>
            상세 재고 데이터 저장
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default StockEdit;
