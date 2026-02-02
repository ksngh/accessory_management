
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_ORDERS } from '../constants';
import { OrderStatus } from '../types';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initialOrder = MOCK_ORDERS.find(o => o.id === id);

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialOrder?.status || OrderStatus.PENDING);

  if (!initialOrder) {
    return (
      <Layout title="발주 상세" showBack>
        <div className="p-10 text-center text-gray-400">발주 내역을 찾을 수 없습니다.</div>
      </Layout>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case OrderStatus.PENDING: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleStatus = () => {
    const nextStatus = currentStatus === OrderStatus.PENDING ? OrderStatus.COMPLETED : OrderStatus.PENDING;
    setCurrentStatus(nextStatus);
    // 실제 애플리케이션에서는 여기서 API를 호출하여 데이터베이스의 상태를 업데이트합니다.
    const orderIdx = MOCK_ORDERS.findIndex(o => o.id === id);
    if (orderIdx !== -1) {
      MOCK_ORDERS[orderIdx].status = nextStatus;
    }
  };

  return (
    <Layout title="발주 상세 내역" showBack>
      <div className="px-5 py-6 space-y-6 pb-40">
        {/* 상단 발주 요약 정보 */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-primary/10 shadow-lg shadow-primary/5 space-y-5 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Number</span>
              <h3 className="text-2xl font-black text-primary-text tracking-tighter">{initialOrder.orderNumber}</h3>
            </div>
            
            <button 
              onClick={toggleStatus}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-black transition-all active:scale-95 shadow-sm ${getStatusColor(currentStatus)}`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {currentStatus === OrderStatus.COMPLETED ? 'check_circle' : 'schedule'}
              </span>
              {currentStatus}
              <span className="material-symbols-outlined text-[12px] opacity-50">sync_alt</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400">발주 일시</span>
              <p className="text-xs font-black text-gray-700">{initialOrder.date}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-bold text-gray-400">거래처</span>
              <p className="text-xs font-black text-gray-700">{initialOrder.supplier}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-text">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <div>
              <p className="text-xs font-black text-primary-text">{initialOrder.supplier}</p>
              <p className="text-[10px] font-bold text-gray-400">정식 등록 거래처</p>
            </div>
          </div>
        </section>

        {/* 품목 리스트 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary-dark font-black">inventory_2</span>
            <h3 className="text-sm font-black text-primary-text uppercase tracking-tight">발주 품목 ({initialOrder.items?.length || 0})</h3>
          </div>

          <div className="space-y-3">
            {initialOrder.items?.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="bg-white p-4 rounded-3xl border border-primary/10 shadow-sm flex gap-4 items-center animate-in fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div 
                  className="size-20 rounded-2xl bg-gray-50 border border-gray-100 bg-center bg-cover shrink-0"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{item.category}</p>
                    <span className="text-xs font-black text-primary-dark">₩{item.price.toLocaleString()}</span>
                  </div>
                  <h4 className="text-sm font-black text-gray-800 leading-tight">SKU: {item.sku || 'N/A'}</h4>
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-primary/20 text-[9px] font-black text-primary-dark">
                      {item.selectedColor}
                    </span>
                    {item.selectedSize && (
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-[9px] font-black text-gray-500">
                        {item.selectedSize}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pl-2 border-l border-gray-100 flex flex-col items-center justify-center min-w-[50px]">
                  <span className="text-[10px] font-bold text-gray-300">QTY</span>
                  <span className="text-lg font-black text-primary-text">{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 최종 합계 요약 바 */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 bg-background-light/95 backdrop-blur-md py-6 border-t border-primary/20 z-[80] shadow-2xl">
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">최종 품목 수량</span>
              <span className="text-2xl font-black text-primary-text">
                {initialOrder.items?.reduce((acc, cur) => acc + cur.quantity, 0)} <span className="text-xs font-bold text-gray-500 opacity-60">pcs</span>
              </span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">최종 발주 금액</span>
              <span className="text-2xl font-black text-primary-text">₩{initialOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
