
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProductStatistics } from '../src/api/statistics';
import { getSuppliers } from '../src/api/suppliers';
import { getCategories } from '../src/api/categories';
import { ProductStat, ProductStatisticsResponse, Supplier, Category, Color } from '../types';
import { COLORS } from '../constants';

const Statistics: React.FC = () => {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString();

  // --- States for Range ---
  const [startYear, setStartYear] = useState<string>(currentYear);
  const [startMonth, setStartMonth] = useState<string>('1');
  const [endYear, setEndYear] = useState<string>(currentYear);
  const [endMonth, setEndMonth] = useState<string>(currentMonth);

  // --- States for Filters ---
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'quantity'>('quantity');

  const [statsData, setStatsData] = useState<ProductStatisticsResponse | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [suppliersData, categoriesData] = await Promise.all([
          getSuppliers(),
          getCategories(),
        ]);
        setSuppliers(suppliersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchInitialData();
  }, []);

  const years = useMemo(() => {
    const start = 2020;
    const end = new Date().getFullYear();
    return Array.from({ length: end - start + 1 }, (_, i) => (end - i).toString());
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const dateToVal = (y: string, m: string) => (parseInt(y) * 12) + parseInt(m);
  const isRangeValid = startYear && startMonth && endYear && endMonth && (dateToVal(startYear, startMonth) <= dateToVal(endYear, endMonth));

  useEffect(() => {
    if (!isRangeValid) {
      setStatsData(null);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          startYear, startMonth, endYear, endMonth, sortBy,
        };
        if (supplierFilter !== 'all') params.supplierId = supplierFilter;
        if (categoryFilter !== 'all') params.category = categoryFilter;
        if (colorFilter !== 'all') params.color = colorFilter;
        
        const data = await getProductStatistics(params);
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch statistics", error);
        setStatsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [startYear, startMonth, endYear, endMonth, supplierFilter, categoryFilter, colorFilter, sortBy, isRangeValid]);
  

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
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                  <select 
                    value={startMonth} onChange={e => setStartMonth(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-black outline-none"
                  >
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
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
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                  <select 
                    value={endMonth} onChange={e => setEndMonth(e.target.value)}
                    className="flex-1 h-11 px-2 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-black outline-none"
                  >
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
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
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select 
              value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
              className="h-11 px-2 rounded-xl border-none bg-white text-[10px] font-black shadow-sm focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="all">모든 품목</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
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
        ) : isLoading ? (
          <div className="py-24 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-gray-200 animate-spin">sync</span>
             <p className="text-sm font-black text-gray-300 italic uppercase">Loading Analytics...</p>
          </div>
        ) : !statsData ? (
          <div className="py-24 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-gray-100">error_outline</span>
            <p className="text-sm font-black text-gray-300 italic uppercase">Could not load data</p>
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
                    <p className="text-xs font-bold text-white opacity-80">{statsData.range.start} ~ {statsData.range.end}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-white/10 rounded-lg">Realtime Analytics</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-primary/40 uppercase">Total Volume</p>
                    <p className="text-2xl font-black text-white">{statsData.totals.qty.toLocaleString()}<span className="text-[10px] opacity-40 ml-1">PCS</span></p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-primary/40 uppercase">Total Valuation</p>
                    <p className="text-2xl font-black text-primary">₩{statsData.totals.amount.toLocaleString()}</p>
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
                <span className="text-[10px] font-bold text-gray-300">{statsData.items.length}개 품목 검색됨</span>
              </div>

              <div className="space-y-4">
                {statsData.items.map((stat, idx) => (
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
                          <span className="text-[9px] font-bold text-gray-300 truncate max-w-[100px]">{stat.supplierName}</span>
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

                {statsData.items.length === 0 && (
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
