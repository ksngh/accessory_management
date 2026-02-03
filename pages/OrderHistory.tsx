
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_ORDERS } from '../constants';
import { OrderStatus } from '../types';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case OrderStatus.PENDING: return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout title="발주 내역">
      <div className="px-5 py-4 space-y-5">
        
        {/* Statistics Banner */}
        <div 
          onClick={() => navigate('/statistics')}
          className="relative bg-primary-text rounded-[2rem] p-6 overflow-hidden shadow-xl shadow-primary/20 cursor-pointer active:scale-[0.98] transition-all group"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 size-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-10 -left-10 size-32 bg-primary-dark/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Analytics Dashboard</p>
              <h3 className="text-lg font-black text-white leading-tight">월별 발주 및 품목별 통계<br/><span className="text-primary font-bold">리포트 확인하기</span></h3>
            </div>
            <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl font-bold">query_stats</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-primary/40 uppercase tracking-widest group-hover:text-primary/80 transition-colors">
            Tap to view detailed statistics
            <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary-dark font-black">format_list_bulleted</span>
          <h4 className="text-xs font-black text-primary-text uppercase tracking-widest">최근 발주 목록</h4>
        </div>

        <div className="space-y-4">
          {MOCK_ORDERS.map(order => (
            <div 
              key={order.id} 
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white rounded-[2rem] border border-primary/10 shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-primary-dark">{order.orderNumber}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{order.date}</span>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${getStatusColor(order.status)} border-current opacity-80`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-dark border border-gray-100">
                    <span className="material-symbols-outlined text-2xl">storefront</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800 truncate">{order.supplier}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{order.itemCount} ITEMS ORDERED</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Amount</span>
                  <span className="text-lg font-black text-primary-text">₩{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="py-12 border-2 border-dashed border-primary/10 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-200 gap-2">
           <span className="material-symbols-outlined text-5xl">history</span>
           <p className="text-xs font-black uppercase tracking-widest">End of History</p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
