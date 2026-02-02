
import React from 'react';
import Layout from '../components/Layout.tsx';
import { MOCK_ORDERS } from '../constants.tsx';
import { OrderStatus } from '../types';

const OrderHistory: React.FC = () => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case OrderStatus.PENDING: return 'bg-orange-100 text-orange-700';
      case OrderStatus.CANCELED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout title="발주 내역" showMenu>
      <div className="px-4 py-4 space-y-4">
        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div className="bg-white p-3 rounded-2xl border border-primary/10 shadow-sm text-center">
            <p className="text-[10px] font-bold text-[#8E8E93] mb-1">총 발주</p>
            <p className="text-lg font-black text-primary-text">42</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-primary/10 shadow-sm text-center">
            <p className="text-[10px] font-bold text-[#8E8E93] mb-1">대기중</p>
            <p className="text-lg font-black text-orange-600">5</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-primary/10 shadow-sm text-center">
            <p className="text-[10px] font-bold text-[#8E8E93] mb-1">금월 합계</p>
            <p className="text-lg font-black text-primary-text">1.2M</p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_ORDERS.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-primary-dark">{order.orderNumber}</span>
                    <span className="text-[10px] text-[#8E8E93] font-medium">{order.date}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark">
                    <span className="material-symbols-outlined">store</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#2D2926]">{order.supplier}</p>
                    <p className="text-xs text-[#8E8E93] font-medium">{order.itemCount}개의 품목</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8B7E66]">총 결제 금액</span>
                  <span className="text-base font-black text-primary-text">₩{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Mockup */}
        <div className="py-12 border-2 border-dashed border-primary/10 rounded-3xl flex flex-col items-center justify-center text-[#D1D1D6] gap-2">
           <span className="material-symbols-outlined text-5xl">history</span>
           <p className="text-sm font-bold">이전 내역이 더 없습니다.</p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
