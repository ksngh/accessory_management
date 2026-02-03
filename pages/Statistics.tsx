
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { MOCK_ORDERS } from '../constants';
import { OrderItem } from '../types';

interface ProductStat {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  totalQty: number;
  unitPrice: number;
  totalAmount: number;
}

const Statistics: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // 데이터에서 가능한 연도와 월 구조 추출
  const dateStructure = useMemo(() => {
    const structure: Record<string, Set<string>> = {};
    
    MOCK_ORDERS.forEach(order => {
      const [year, month] = order.date.split('.').slice(0, 2);
      const cleanYear = year.trim();
      const cleanMonth = month.trim();
      
      if (!structure[cleanYear]) {
        structure[cleanYear] = new Set<string>();
      }
      structure[cleanYear].add(cleanMonth);
    });

    // 정렬된 객체로 변환
    const sortedStructure: Record<string, string[]> = {};
    Object.keys(structure).sort((a, b) => b.localeCompare(a)).forEach(y => {
      sortedStructure[y] = Array.from(structure[y]).sort((a, b) => b.localeCompare(a));
    });

    return sortedStructure;
  }, []);

  const availableYears = Object.keys(dateStructure);
  const availableMonths = selectedYear ? dateStructure[selectedYear] : [];

  // 연도가 바뀌면 월 선택 초기화
  useEffect(() => {
    setSelectedMonth('');
  }, [selectedYear]);

  // 선택된 연도.월에 대한 상품별 합산 데이터 생성
  const productStats = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    const stats: Record<string, ProductStat> = {};
    const targetKey = `${selectedYear}.${selectedMonth}`;

    MOCK_ORDERS.forEach(order => {
      const orderMonth = order.date.split('.').slice(0, 2).join('.');
      if (orderMonth === targetKey && order.items) {
        order.items.forEach((item: OrderItem) => {
          if (!stats[item.id]) {
            stats[item.id] = {
              id: item.id,
              name: item.name,
              imageUrl: item.imageUrl,
              category: item.category,
              totalQty: 0,
              unitPrice: item.price,
              totalAmount: 0
            };
          }
          stats[item.id].totalQty += item.quantity;
          stats[item.id].totalAmount += (item.price * item.quantity);
        });
      }
    });

    return Object.values(stats).sort((a, b) => b.totalQty - a.totalQty);
  }, [selectedYear, selectedMonth]);

  const totalMonthQty = useMemo(() => {
    return productStats.reduce((acc, cur) => acc + cur.totalQty, 0);
  }, [productStats]);

  const totalMonthAmount = useMemo(() => {
    return productStats.reduce((acc, cur) => acc + cur.totalAmount, 0);
  }, [productStats]);

  return (
    <Layout title="월별 발주 통계" showBack>
      <div className="px-5 py-6 space-y-8 pb-32">
        
        {/* 선택 드롭다운 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary-dark font-black">calendar_month</span>
            <h3 className="text-xs font-black text-primary-text uppercase tracking-widest">분석 대상 선택</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black text-primary-dark z-10">YEAR</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-14 pl-4 pr-10 rounded-2xl border-2 border-primary/20 bg-white font-black text-sm text-primary-text focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none transition-all"
              >
                <option value="">연도 선택</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary-dark opacity-50">keyboard_arrow_down</span>
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black text-primary-dark z-10">MONTH</label>
              <select
                value={selectedMonth}
                disabled={!selectedYear}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`w-full h-14 pl-4 pr-10 rounded-2xl border-2 font-black text-sm outline-none appearance-none transition-all ${
                  !selectedYear 
                  ? 'bg-gray-50 border-gray-100 text-gray-300' 
                  : 'bg-white border-primary/20 text-primary-text focus:ring-4 focus:ring-primary/10 focus:border-primary'
                }`}
              >
                <option value="">월 선택</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>{parseInt(month)}월</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary-dark opacity-50">keyboard_arrow_down</span>
            </div>
          </div>
        </section>

        {/* 데이터 표시 영역 */}
        {(!selectedYear || !selectedMonth) ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center text-primary/30">
              <span className="material-symbols-outlined text-5xl font-bold">query_stats</span>
            </div>
            <div className="space-y-1">
              <p className="text-base font-black text-primary-text">데이터를 확인하려면<br/>연도와 월을 선택하세요</p>
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Select year and month to begin</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 요약 카드 */}
            <div className="bg-primary-text rounded-[2.5rem] p-7 border border-primary/20 shadow-xl shadow-primary/10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedYear}년 {parseInt(selectedMonth)}월</span>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">발주 리포트 요약</h4>
                </div>
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary/40 uppercase tracking-tighter">총 발주 수량</span>
                  <p className="text-2xl font-black text-white">{totalMonthQty.toLocaleString()}<span className="text-xs ml-1 opacity-40 uppercase">pcs</span></p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-black text-primary/40 uppercase tracking-tighter">총 발주 금액</span>
                  <p className="text-2xl font-black text-primary">₩{totalMonthAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 상품별 상세 리스트 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                   <div className="size-1.5 rounded-full bg-primary-dark" />
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">품목별 상세 분석</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-300">{productStats.length}개 품목</span>
              </div>

              <div className="space-y-4">
                {productStats.map((stat, idx) => (
                  <div 
                    key={stat.id} 
                    className="bg-white p-5 rounded-[2rem] border border-primary/5 shadow-sm flex flex-col gap-4 animate-in fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="size-16 rounded-2xl bg-gray-50 border border-gray-100 bg-center bg-cover shrink-0 relative"
                        style={{ backgroundImage: `url(${stat.imageUrl})` }}
                      >
                        {idx < 3 && (
                          <div className="absolute -top-1 -left-1 size-6 bg-primary-text text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-md border-2 border-white">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-primary-dark/60 uppercase tracking-tighter mb-0.5">{stat.category}</p>
                        <h5 className="text-sm font-black text-gray-800 truncate">{stat.name}</h5>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">ID: {stat.id}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-gray-300 uppercase">Unit Price</span>
                           <span className="text-xs font-bold text-gray-500">₩{stat.unitPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-gray-300 uppercase">Quantity</span>
                           <span className="text-sm font-black text-gray-800">{stat.totalQty}개</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-primary-dark uppercase tracking-widest block mb-0.5">Total Subtotal</span>
                        <span className="text-lg font-black text-primary-text">₩{stat.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {productStats.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in">
                <span className="material-symbols-outlined text-4xl text-gray-200">folder_off</span>
                <p className="text-xs text-gray-300 font-bold italic uppercase tracking-tighter">
                  No records found for this period.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Statistics;
