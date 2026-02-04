
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { MOCK_ORDERS, MOCK_SUPPLIERS, INITIAL_CATEGORIES, COLORS } from '../constants';
import { OrderItem, Color } from '../types';

interface ProductStat {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  supplier: string;
  totalQty: number;
  unitPrice: number;
  totalAmount: number;
}

const Statistics: React.FC = () => {
  // --- States for Range ---
  const [startYear, setStartYear] = useState<string>('');
  const [startMonth, setStartMonth] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [endMonth, setEndMonth] = useState<string>('');

  // --- States for Filters ---
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'quantity'>('quantity');

  // --- Extract Date Structure from Mock Data ---
  const dateStructure = useMemo(() => {
    const structure: Record<string, string[]> = {};
    MOCK_ORDERS.forEach(order => {
      const [year, month] = order.date.split('.').slice(0, 2);
      const y = year.trim();
      const m = month.trim();
      if (!structure[y]) structure[y] = [];
      if (!structure[y].includes(m)) structure[y].push(m);
    });
    // Sort years and months
    const sortedYears = Object.keys(structure).sort((a, b) => b.localeCompare(a));
    sortedYears.forEach(y => structure[y].sort((a, b) => b.localeCompare(a)));
    return { years: sortedYears, structure };
  }, []);

  // --- Helper: Date to Value for comparison ---
  const dateToVal = (y: string, m: string) => (parseInt(y) * 12) + parseInt(m);

  // --- Core Analytics Logic ---
  const productStats = useMemo(() => {
    if (!startYear || !startMonth || !endYear || !endMonth) return [];

    const startVal = dateToVal(startYear, startMonth);
    const endVal = dateToVal(endYear, endMonth);
    
    // 유효하지 않은 범위 처리 (시작이 종료보다 클 경우 빈 배열)
    if (startVal > endVal) return [];

    const stats: Record<string, ProductStat> = {};

    MOCK_ORDERS.forEach(order => {
      const [y, m] = order.date.split('.').slice(0, 2);
      const currentVal = dateToVal(y.trim(), m.trim());

      // 1. 기간 필터
      if (currentVal >= startVal && currentVal <= endVal && order.items) {
        order.items.forEach((item: OrderItem) => {
          // 2. 거래처 필터
          if (supplierFilter !== 'all' && item.supplier !== supplierFilter) return;
          // 3. 카테고리 필터
          if (categoryFilter !== 'all' && item.category !== categoryFilter) return;
          // 4. 색상 필터
          if (colorFilter !== 'all' && item.selectedColor !== colorFilter) return;

          if (!stats[item.id]) {
            stats[item.id] = {
              id: item.id,
              name: item.name,
              imageUrl: item.imageUrl,
              category: item.category,
              supplier: item.supplier,
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

    // --- Sort Result ---
    return Object.values(stats).sort((a, b) => {
      if (sortBy === 'amount') return b.totalAmount - a.totalAmount;
      return b.totalQty - a.totalQty;
    });
  }, [startYear, startMonth, endYear, endMonth, supplierFilter, categoryFilter, colorFilter, sortBy]);

  const totals = useMemo(() => {
    return productStats.reduce((acc, cur) => ({
      qty: acc.qty + cur.totalQty,
      amount: acc.amount + cur.totalAmount
    }), { qty: 0, amount: 0 });
  }, [productStats]);

  const isRangeValid = startYear && startMonth && endYear && endMonth && (dateToVal(startYear, startMonth) <= dateToVal(endYear, endMonth));

  return (
    <Layout title="종합 발주 통계" showBack>
      <div className="px-5 py-6 space-y-8 pb-40">
        
        {/* 1. 기간 범위 설정 섹션 */}
        <section className="bg-white p-5 rounded-[2.5rem] border border-primary/20 shadow-sm space-y-5">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary-dark font-black">date_range</span>
            <h3 className="text-xs font-black text-primary-text uppercase tracking-widest">기간 범위 설정</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-gray-300 uppercase ml-2">From</span>
                <div className="flex gap-1">
                  <select 
                    value={startYear} onChange={e => setStartYear(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-black outline-none"
                  >
                    <option value="">년도</option>
                    {dateStructure.years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                  <select 
                    value={startMonth} onChange={e => setStartMonth(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-black outline-none"
                  >
                    <option value="">월</option>
                    {startYear && dateStructure.structure[startYear]?.map(m => <option key={m} value={m}>{parseInt(m)}월</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-gray-300 uppercase ml-2">To</span>
                <div className="flex gap-1">
                  <select 
                    value={endYear} onChange={e => setEndYear(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-black outline-none"
                  >
                    <option value="">년도</option>
                    {dateStructure.years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                  <select 
                    value={endMonth} onChange={e => setEndMonth(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-black outline-none"
                  >
                    <option value="">월</option>
                    {endYear && dateStructure.structure[endYear]?.map(m => <option key={m} value={m}>{parseInt(m)}월</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            {!isRangeValid && startYear && startMonth && endYear && endMonth && (
              <p className="text-[10px] text-red-400 font-bold text-center animate-pulse">시작일이 종료일보다 늦을 수 없습니다.</p>
            )}
          </div>
        </section>

        {/* 2. 정밀 필터 및 정렬 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary-dark font-black">filter_list</span>
            <h3 className="text-xs font-black text-primary-text uppercase tracking-widest">상세 필터 및 정렬</h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select 
              value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}
              className="h-11 px-2 rounded-xl border-none bg-white text-[10px] font-black shadow-sm focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="all">모든 거래처</option>
              {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <select 
              value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
              className="h-11 px-2 rounded-xl border-none bg-white text-[10px] font-black shadow-sm focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="all">모든 품목</option>
              {INITIAL_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select 
              value={colorFilter} onChange={e => setColorFilter(e.target.value as Color | 'all')}
              className="h-11 px-2 rounded-xl border-none bg-white text-[10px] font-black shadow-sm focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="all">모든 색상</option>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-primary/10">
            <button 
              onClick={() => setSortBy('quantity')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${sortBy === 'quantity' ? 'bg-primary-text text-white' : 'text-gray-400'}`}
            >
              발주량 많은 순
            </button>
            <button 
              onClick={() => setSortBy('amount')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${sortBy === 'amount' ? 'bg-primary-text text-white' : 'text-gray-400'}`}
            >
              금액 높은 순
            </button>
          </div>
        </section>

        {/* 3. 분석 결과 표시 */}
        {!isRangeValid ? (
          <div className="py-24 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-gray-100">monitoring</span>
            <p className="text-sm font-black text-gray-300 italic uppercase">Please set a valid period</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 총 요약 카드 */}
            <div className="bg-primary-text rounded-[2.5rem] p-7 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl text-white">analytics</span>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">Selected Range</p>
                    <p className="text-xs font-bold text-white opacity-80">{startYear}.{startMonth} ~ {endYear}.{endMonth}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-white/10 rounded-lg">Realtime Analytics</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-primary/40 uppercase">Total Volume</p>
                    <p className="text-2xl font-black text-white">{totals.qty.toLocaleString()}<span className="text-[10px] opacity-40 ml-1">PCS</span></p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-primary/40 uppercase">Total Valuation</p>
                    <p className="text-2xl font-black text-primary">₩{totals.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 개별 품목 리스트 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-primary-dark" />
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">품목별 통계 리스트</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-300">{productStats.length}개 품목 검색됨</span>
              </div>

              <div className="space-y-4">
                {productStats.map((stat, idx) => (
                  <div 
                    key={stat.id} 
                    className="bg-white p-5 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-5 animate-in fade-in"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex gap-4 items-center">
                      <div 
                        className="size-16 rounded-[1.5rem] bg-gray-50 bg-center bg-cover border border-gray-100 shrink-0 relative shadow-inner"
                        style={{ backgroundImage: `url(${stat.imageUrl})` }}
                      >
                         <div className="absolute -top-1 -left-1 size-6 bg-primary-text text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-md border-2 border-white">
                           {idx + 1}
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-black text-primary-dark uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded-md">{stat.category}</span>
                          <span className="text-[9px] font-bold text-gray-300 truncate max-w-[100px]">{stat.supplier}</span>
                        </div>
                        <h4 className="text-sm font-black text-gray-800 truncate">{stat.name}</h4>
                        <p className="text-[9px] font-bold text-gray-300 uppercase">Product ID: {stat.id}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-black text-gray-300 uppercase w-12 text-right">Unit</span>
                           <span className="text-xs font-bold text-gray-500">₩{stat.unitPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-black text-gray-300 uppercase w-12 text-right">Volume</span>
                           <span className="text-sm font-black text-primary-text">{stat.totalQty.toLocaleString()} pcs</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-300 uppercase mb-0.5">Aggregated Total</p>
                        <p className="text-lg font-black text-primary-text">₩{stat.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {productStats.length === 0 && (
                   <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in">
                      <span className="material-symbols-outlined text-4xl text-gray-200">folder_off</span>
                      <p className="text-xs text-gray-300 font-bold italic uppercase tracking-tighter">
                        No records match the current filters.
                      </p>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Statistics;
