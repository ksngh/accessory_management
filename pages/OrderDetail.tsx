
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getOrder, updateOrderStatus, deleteOrder } from '../src/api/orders';
import { Order, OrderStatus, OrderItem } from '../types';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(id);
        setOrder(orderData);
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    };
    fetchOrder();
  }, [id]);

  // 상품별로 그룹화 (SKU 기준)
  const groupedItems = useMemo(() => {
    if (!order?.items) return [];
    
    const groups: Record<string, { product: OrderItem; variants: OrderItem[] }> = {};
    
    order.items.forEach(item => {
      const key = item.sku || item.id;
      if (!groups[key]) {
        groups[key] = {
          product: item,
          variants: []
        };
      }
      groups[key].variants.push(item);
    });
    
    return Object.values(groups);
  }, [order]);

  if (!order) {
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

  const toggleStatus = async () => {
    const nextStatus = order.status === OrderStatus.PENDING ? OrderStatus.COMPLETED : OrderStatus.PENDING;
    try {
      const updatedOrder = await updateOrderStatus(order.id, nextStatus);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Failed to update order status", error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    if (!confirm('이 발주 내역을 삭제할까요? 삭제하면 복구할 수 없습니다.')) return;
    try {
      await deleteOrder(order.id);
      navigate('/orders');
    } catch (error) {
      console.error('Failed to delete order', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <Layout title="발주 상세 내역" showBack>
      <div className="px-5 py-6 space-y-6 pb-48">
        {/* 상단 발주 요약 정보 */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-primary/10 shadow-lg shadow-primary/5 space-y-2 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Number</span>
              <h3 className="text-2xl font-black text-primary-text tracking-tighter">{order.orderNumber}</h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={toggleStatus}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-black transition-all active:scale-95 shadow-sm ${getStatusColor(order.status)}`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {order.status === OrderStatus.COMPLETED ? 'check_circle' : 'schedule'}
                </span>
                {order.status}
                <span className="material-symbols-outlined text-[12px] opacity-50 ml-1">sync_alt</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-[10px] font-black text-red-500 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[12px]">delete</span>
                삭제
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-5 border-t border-gray-50">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">발주 일시</span>
              <p className="text-xs font-black text-gray-700">{new Date(order.date).toLocaleString()}</p>
            </div>
            <div className="space-y-1 text-right border-l border-gray-50 pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">거래처명</span>
              <p className="text-xs font-black text-primary-text">{order.supplierName}</p>
            </div>
          </div>
        </section>

        {/* 품목 리스트 (상품별 그룹화) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary-dark font-black">inventory_2</span>
            <h3 className="text-sm font-black text-primary-text uppercase tracking-tight">발주 품목 리스트</h3>
          </div>

          <div className="space-y-5">
            {groupedItems.map((group, groupIdx) => (
              <div 
                key={group.product.id + groupIdx}
                className="bg-white rounded-[2rem] border border-primary/10 shadow-sm overflow-hidden animate-in fade-in"
                style={{ animationDelay: `${groupIdx * 80}ms` }}
              >
                {/* 상품 메인 헤더 - 중복 SKU 제거됨 */}
                <div className="p-4 bg-gray-50/50 flex gap-4 items-center border-b border-gray-100">
                  <div 
                    className="size-16 rounded-2xl bg-white border border-gray-200 bg-center bg-cover shrink-0 shadow-sm"
                    style={{ backgroundImage: `url(${group.product.imageUrl})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary-dark uppercase tracking-tighter mb-0.5">{group.product.category}</p>
                    <h4 className="text-base font-black text-gray-800 leading-tight truncate">{group.product.name}</h4>
                  </div>
                </div>

                {/* 옵션 및 수량 (가독성 중심) */}
                <div className="divide-y divide-gray-50">
                  {group.variants.map((variant, vIdx) => (
                    <div key={vIdx} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex gap-1.5 items-center">
                          <span className="px-2 py-1 rounded-lg bg-white border border-primary/30 text-[10px] font-black text-primary-text shadow-sm">
                            {variant.selectedColor}
                          </span>
                          {variant.selectedSize && (
                            <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-[10px] font-black text-gray-500">
                              {variant.selectedSize}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 ml-1">
                          단가 ₩{Number(variant.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="flex items-center gap-5 pl-4 border-l border-gray-50">
                        <div className="flex flex-col items-center min-w-[40px]">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Qty</span>
                          <span className="text-xl font-black text-primary-text leading-none">{variant.quantity}</span>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter block mb-0.5">Subtotal</span>
                          <span className="text-sm font-black text-primary-dark">₩{Number(variant.price * variant.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 고정 합계 바 */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 bg-background-light/90 backdrop-blur-xl py-6 border-t border-primary/20 z-[80] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">최종 품목 수량</span>
              <span className="text-2xl font-black text-primary-text">
                {order.items?.reduce((acc, cur) => acc + cur.quantity, 0)} <span className="text-xs font-bold text-gray-400 opacity-60">pcs</span>
              </span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">최종 발주 합계</span>
              <span className="text-2xl font-black text-primary-text">₩{Number(order.totalAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
