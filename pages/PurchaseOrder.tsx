
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS, COLORS, RING_SIZES } from '../constants';
import { Product, Color, RingSize } from '../types';

interface OrderRow {
  rowId: string;
  product?: Product;
  quantities: Record<string, number>;
  selectedSizes: RingSize[];
  isStockVisible?: boolean;
}

const PurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState<string>(MOCK_SUPPLIERS[0]?.name ?? '');
  const [rows, setRows] = useState<OrderRow[]>([
    { rowId: 'r-' + Math.random().toString(36).substr(2, 9), quantities: {}, selectedSizes: ['11호'], isStockVisible: false }
  ]);
  
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [pickerRows, setPickerRows] = useState<Product[][]>([]);

  // 상세 재고 데이터 생성을 위한 헬퍼 (목업)
  const getDetailedStock = (product: Product, color: Color, size?: RingSize) => {
    const seed = (product.id.length + color.length + (size?.length || 0)) % 10;
    return Math.floor((product.stock / 5) + seed);
  };

  useEffect(() => {
    const filtered = MOCK_PRODUCTS.filter(p => p.supplier === selectedSupplier);
    const chunked: Product[][] = [];
    for (let i = 0; i < filtered.length; i += 6) {
      chunked.push(filtered.slice(i, i + 6));
    }
    setPickerRows(chunked);
  }, [selectedSupplier, isProductPickerOpen]);

  const addRow = () => {
    setRows([...rows, { rowId: 'r-' + Math.random().toString(36).substr(2, 9), quantities: {}, selectedSizes: ['11호'], isStockVisible: false }]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.rowId !== rowId));
    } else {
      setRows([{ rowId: 'r-' + Math.random().toString(36).substr(2, 9), quantities: {}, selectedSizes: ['11호'], isStockVisible: false }]);
    }
  };

  const toggleStockVisibility = (rowId: string) => {
    setRows(rows.map(r => r.rowId === rowId ? { ...r, isStockVisible: !r.isStockVisible } : r));
  };

  const updateRowQuantity = (rowId: string, color: Color, size: RingSize | undefined, delta: number) => {
    const key = size ? `${color}-${size}` : color;
    setRows(rows.map(row => {
      if (row.rowId !== rowId) return row;
      const current = row.quantities[key] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...row,
        quantities: { ...row.quantities, [key]: next }
      };
    }));
  };

  const addSizeToRow = (rowId: string, size: RingSize) => {
    setRows(rows.map(row => {
      if (row.rowId === rowId && !row.selectedSizes.includes(size)) {
        const newSizes = [...row.selectedSizes, size].sort((a, b) => {
          const numA = parseInt(a.replace('호', ''));
          const numB = parseInt(b.replace('호', ''));
          return numA - numB;
        });
        return { ...row, selectedSizes: newSizes };
      }
      return row;
    }));
  };

  const removeSizeFromRow = (rowId: string, size: RingSize) => {
    setRows(rows.map(row => {
      if (row.rowId === rowId) {
        const newQuantities = { ...row.quantities };
        COLORS.forEach(c => delete newQuantities[`${c}-${size}`]);
        return { 
          ...row, 
          selectedSizes: row.selectedSizes.filter(s => s !== size),
          quantities: newQuantities
        };
      }
      return row;
    }));
  };

  const openPicker = (rowId: string) => {
    setActiveRowId(rowId);
    setIsProductPickerOpen(true);
  };

  const selectProduct = (product: Product) => {
    if (activeRowId) {
      setRows(rows.map(r => r.rowId === activeRowId ? { 
        ...r, 
        product, 
        quantities: {}, 
        selectedSizes: product.hasSizes ? ['11호'] : [],
        isStockVisible: false
      } : r));
      setIsProductPickerOpen(false);
      setActiveRowId(null);
    }
  };

  const totalItems = rows.reduce((sum, row) => sum + Object.values(row.quantities).reduce((s, q) => Number(s) + Number(q), 0), 0);
  const totalAmount = rows.reduce((sum, row) => {
    if (!row.product) return sum;
    const rowQty = Object.values(row.quantities).reduce((s, q) => Number(s) + Number(q), 0);
    return Number(sum) + (Number(row.product.price) * Number(rowQty));
  }, 0);

  return (
    <Layout title="발주 등록">
      <div className="px-4 py-6 space-y-6 pb-48">
        <section className="space-y-3 px-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">거래처 선택</label>
          <select 
            value={selectedSupplier}
            onChange={(e) => {
              setSelectedSupplier(e.target.value);
              setRows([{ rowId: 'r-' + Math.random().toString(36).substr(2, 9), quantities: {}, selectedSizes: ['11호'], isStockVisible: false }]);
            }}
            className="w-full h-14 pl-5 pr-10 rounded-2xl border border-primary/30 focus:border-primary-dark focus:ring-2 focus:ring-primary/20 text-sm bg-white font-bold shadow-sm transition-all outline-none"
          >
            {MOCK_SUPPLIERS.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          <div className="space-y-4">
            {rows.map((row) => (
              <div 
                key={row.rowId}
                className="bg-white p-5 rounded-[2.5rem] border border-primary/10 shadow-lg shadow-primary/5 space-y-4 relative animate-in fade-in"
              >
                <div className="flex gap-5 items-start">
                  <div 
                    onClick={() => openPicker(row.rowId)}
                    className={`size-24 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer border-2 transition-all shrink-0 shadow-inner overflow-hidden ${
                      row.product ? 'border-primary/40 bg-center bg-cover bg-white' : 'border-dashed border-gray-200 bg-gray-50 hover:bg-primary/5'
                    }`}
                    style={row.product ? { backgroundImage: `url(${row.product.imageUrl})` } : {}}
                  >
                    {!row.product && (
                      <span className="material-symbols-outlined text-gray-300 text-3xl">add_photo_alternate</span>
                    )}
                  </div>

                  <div className="flex-1 pt-1 space-y-2">
                    {row.product ? (
                      <>
                        <div className="flex justify-between items-start">
                           <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-3 py-1 rounded-full uppercase tracking-tighter">SELECTED</span>
                           <button onClick={() => removeRow(row.rowId)} className="text-gray-300 hover:text-red-400 active:scale-90 transition-all p-1">
                             <span className="material-symbols-outlined text-2xl">cancel</span>
                           </button>
                        </div>
                        <p className="text-xl font-black text-primary-text leading-none">₩{row.product.price.toLocaleString()}</p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-lg w-fit">
                             <span className="size-1.5 rounded-full bg-green-500" />
                             <p className="text-[10px] font-bold text-green-700">총 재고: {row.product.stock}개</p>
                          </div>
                          <button 
                            onClick={() => toggleStockVisibility(row.rowId)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${row.isStockVisible ? 'bg-primary text-primary-text shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          >
                            {row.isStockVisible ? '재고 닫기' : '재고 확인'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2 h-full flex flex-col justify-center" onClick={() => openPicker(row.rowId)}>
                        <p className="text-sm font-bold text-gray-400 leading-tight">상품을 선택하세요.</p>
                        <p className="text-[10px] text-gray-300 mt-1 italic font-medium">카탈로그 열기</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 상세 재고 확인 패널 */}
                {row.product && row.isStockVisible && (
                  <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10 animate-in slide-in-from-top-2 duration-300 space-y-4">
                    <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary-dark">dashboard</span>
                        <span className="text-[11px] font-black text-primary-dark uppercase tracking-tight">전체 보유 재고 현황</span>
                      </div>
                      <div className="flex gap-3 text-[8px] font-black text-gray-300 uppercase">
                        <span>Gold</span>
                        <span>Rose</span>
                        <span>Silver</span>
                      </div>
                    </div>
                    
                    {!row.product.hasSizes ? (
                      <div className="grid grid-cols-3 gap-2">
                        {COLORS.map(color => (
                          <div key={color} className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-primary/5">
                            <span className="text-[9px] font-bold text-gray-400 mb-1">{color}</span>
                            <span className="text-sm font-black text-primary-text">{getDetailedStock(row.product!, color)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto hide-scrollbar pr-1">
                        {RING_SIZES.map((size, idx) => (
                          <div key={size} className={`flex items-center justify-between p-3 rounded-xl border border-primary/5 ${idx % 2 === 0 ? 'bg-white' : 'bg-white/50'}`}>
                            <span className="text-xs font-black text-primary-dark min-w-[36px]">{size}</span>
                            <div className="flex gap-4">
                              {COLORS.map(color => (
                                <div key={color} className="flex flex-col items-center min-w-[30px]">
                                  <span className="text-[10px] font-black text-gray-700">{getDetailedStock(row.product!, color, size)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {row.product && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-gray-50 pt-4">
                    {!row.product.hasSizes ? (
                      <div className="grid grid-cols-3 gap-2">
                        {COLORS.map(color => (
                          <div key={color} className="bg-gray-50/70 p-3 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{color}</span>
                            <div className="flex items-center justify-between w-full px-1">
                              <button onClick={() => updateRowQuantity(row.rowId, color, undefined, -1)} className="size-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 active:bg-gray-100"><span className="material-symbols-outlined text-sm">remove</span></button>
                              <span className={`text-sm font-black ${row.quantities[color] > 0 ? 'text-primary-text' : 'text-gray-200'}`}>{row.quantities[color] || 0}</span>
                              <button onClick={() => updateRowQuantity(row.rowId, color, undefined, 1)} className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-text active:scale-90"><span className="material-symbols-outlined text-sm">add</span></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {row.selectedSizes.map(size => (
                            <div key={size} className="shrink-0 w-[180px] p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4 shadow-inner relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-primary-dark">{size}</span>
                                <button 
                                  onClick={() => removeSizeFromRow(row.rowId, size)} 
                                  className="size-6 flex items-center justify-center rounded-full bg-white text-gray-300 hover:text-red-400 shadow-sm transition-all"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </div>
                              <div className="space-y-2">
                                {COLORS.map(color => {
                                  const key = `${color}-${size}`;
                                  return (
                                    <div key={color} className="flex items-center justify-between bg-white rounded-xl p-2 border border-gray-50 shadow-sm">
                                      <span className="text-[10px] font-bold text-gray-400 ml-1">{color}</span>
                                      <div className="flex items-center gap-3">
                                        <button onClick={() => updateRowQuantity(row.rowId, color, size, -1)} className="text-gray-300"><span className="material-symbols-outlined text-xs">remove</span></button>
                                        <span className={`text-xs font-black ${row.quantities[key] > 0 ? 'text-primary-text' : 'text-gray-200'}`}>{row.quantities[key] || 0}</span>
                                        <button onClick={() => updateRowQuantity(row.rowId, color, size, 1)} className="text-primary-dark"><span className="material-symbols-outlined text-xs">add</span></button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                          {RING_SIZES.filter(s => !row.selectedSizes.includes(s)).map(s => (
                            <button 
                              key={s} 
                              onClick={() => addSizeToRow(row.rowId, s)}
                              className="shrink-0 px-4 py-2 text-[11px] font-black border border-primary/30 rounded-xl text-primary-dark bg-white hover:bg-primary/10 active:scale-95 transition-all shadow-sm"
                            >
                              +{s.replace('호','')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={addRow}
            className="w-full py-6 flex items-center justify-center gap-3 border-2 border-dashed border-primary/30 rounded-[2.5rem] text-primary-dark font-black bg-white/50 hover:bg-primary/5 transition-all active:scale-[0.98] shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">add_circle</span>
            발주 상품(행) 추가
          </button>
        </section>

        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 bg-background-light/95 backdrop-blur-2xl py-6 border-t border-primary/20 z-[80] shadow-2xl">
          <div className="flex justify-between items-center mb-6 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">총 수량</span>
              <span className="text-2xl font-black text-primary-text">{totalItems} <span className="text-xs font-bold text-gray-500 opacity-60">pcs</span></span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">발주 예정액</span>
              <span className="text-2xl font-black text-primary-text">₩{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <button 
            disabled={totalItems === 0}
            onClick={() => navigate('/orders')}
            className={`w-full h-16 font-black text-lg rounded-[1.5rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
              totalItems === 0 ? 'bg-gray-100 text-gray-400' : 'bg-primary text-primary-text shadow-primary/40'
            }`}
          >
            <span className="material-symbols-outlined">send</span>
            발주 전송하기
          </button>
        </div>
      </div>

      {isProductPickerOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white w-full max-w-[480px] rounded-t-[4rem] p-7 space-y-8 animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[94vh] shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="font-black text-2xl text-gray-800 tracking-tight">상품 카탈로그</h4>
                <div className="flex items-center gap-1.5">
                   <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedSupplier}</p>
                </div>
              </div>
              <button onClick={() => setIsProductPickerOpen(false)} className="size-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:rotate-90 transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-10 pb-12 px-1">
              {pickerRows.map((row, rowIndex) => (
                <div key={rowIndex} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest opacity-50">LINE {rowIndex + 1}</span>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
                    {row.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="shrink-0 w-28 snap-start flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform group"
                      >
                        <div className="relative aspect-square">
                          <div 
                            className="w-full h-full rounded-[1.8rem] border border-gray-100 shadow-md bg-center bg-cover bg-white transition-shadow group-hover:shadow-xl"
                            style={{ backgroundImage: `url(${product.imageUrl})` }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-[1.8rem] transition-colors" />
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/95 backdrop-blur-md rounded-lg text-[8px] font-black text-primary-text shadow-sm border border-primary/20">
                            재고 {product.stock}
                          </div>
                        </div>
                        <div className="px-1 text-center">
                          <p className="text-[11px] font-black text-gray-800 leading-tight">₩{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PurchaseOrder;
