
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from '../constants.tsx';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState(MOCK_SUPPLIERS[0].name);
  
  // 행(Row) 단위로 상품 관리: Product[][]
  const [rows, setRows] = useState<Product[][]>([]);
  
  // 드래그 앤 드롭 참조
  const dragItem = useRef<{ rowIndex: number; colIndex: number } | null>(null);
  const dragOverItem = useRef<{ rowIndex: number; colIndex: number } | null>(null);

  // 거래처 변경 시 초기 행 구성 (예: 4개씩 한 행)
  useEffect(() => {
    const filtered = MOCK_PRODUCTS.filter(p => p.supplier === selectedSupplier);
    const chunked: Product[][] = [];
    for (let i = 0; i < filtered.length; i += 4) {
      chunked.push(filtered.slice(i, i + 4));
    }
    // 최소 1개의 행은 보장
    if (chunked.length === 0) chunked.push([]);
    setRows(chunked);
  }, [selectedSupplier]);

  const addRow = () => {
    setRows(prev => [...prev, []]);
  };

  const handleSort = () => {
    if (!dragItem.current || !dragOverItem.current) return;
    
    const newRows = [...rows.map(r => [...r])];
    const { rowIndex: fromRow, colIndex: fromCol } = dragItem.current;
    const { rowIndex: toRow, colIndex: toCol } = dragOverItem.current;

    // 아이템 추출
    const [movedItem] = newRows[fromRow].splice(fromCol, 1);
    // 대상 위치에 삽입
    newRows[toRow].splice(toCol, 0, movedItem);

    setRows(newRows);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <Layout 
      title="카탈로그 관리" 
      showMenu 
      rightAction={
        <button className="size-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-primary-dark">
          <span className="material-symbols-outlined text-2xl">sync</span>
        </button>
      }
    >
      {/* 거래처 선택 UI */}
      <div className="sticky top-16 bg-background-light/95 backdrop-blur-md z-40 border-b border-primary/10 py-4">
        <div className="px-4 flex gap-2 overflow-x-auto hide-scrollbar">
          {MOCK_SUPPLIERS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSupplier(s.name)}
              className={`shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                selectedSupplier === s.name 
                ? 'bg-primary border-primary-dark text-primary-text shadow-md scale-105' 
                : 'bg-white border-gray-200 text-gray-400 opacity-60'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6 space-y-8 pb-40">
        <div className="px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-dark font-bold">Table_Rows</span>
            <h3 className="text-sm font-black text-primary-text uppercase tracking-widest">상품 카탈로그</h3>
          </div>
          <p className="text-[10px] font-bold text-gray-400 italic">스와이프 & 드래그 이동</p>
        </div>

        {/* 행(Row) 리스트 */}
        <div className="space-y-10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="space-y-3">
              <div className="px-5 flex items-center justify-between">
                <span className="text-[10px] font-black text-primary-dark/40 uppercase tracking-tighter">ROW {rowIndex + 1}</span>
                {row.length === 0 && (
                  <span className="text-[10px] font-bold text-gray-300">이 행은 비어 있습니다. 상품을 드래그해 오세요.</span>
                )}
              </div>
              
              {/* 가로 스와이프 컨테이너 */}
              <div 
                className="flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-4 min-h-[180px]"
                onDragOver={(e) => e.preventDefault()}
              >
                {row.map((product, colIndex) => (
                  <div 
                    key={product.id}
                    draggable
                    onDragStart={() => (dragItem.current = { rowIndex, colIndex })}
                    onDragEnter={() => (dragOverItem.current = { rowIndex, colIndex })}
                    onDragEnd={handleSort}
                    className="shrink-0 w-40 flex flex-col gap-3 group animate-in fade-in zoom-in-95"
                  >
                    <div className="relative aspect-square">
                      <div 
                        className="w-full h-full rounded-[2.5rem] shadow-lg border border-primary/10 bg-center bg-cover bg-white overflow-hidden transition-all group-active:scale-95 group-active:rotate-1 cursor-grab active:cursor-grabbing"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </div>
                      
                      {/* 수정 버튼 */}
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/edit/${product.id}`);
                          }}
                          className="size-8 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-primary/20 flex items-center justify-center text-primary-dark active:scale-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-lg font-bold">edit</span>
                        </button>
                      </div>

                      {/* 재고 정보 */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-primary/90 backdrop-blur-md rounded-xl text-[9px] font-black text-primary-text border border-primary/20 shadow-sm">
                        재고 {product.stock}
                      </div>
                    </div>

                    <div className="px-1">
                      <p className="text-primary-text font-black text-sm">₩{product.price.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-gray-300 uppercase truncate">{product.supplier}</p>
                    </div>
                  </div>
                ))}

                {/* 행 끝부분 드롭 타겟 (비어있는 공간으로 드래그할 수 있게) */}
                <div 
                  className="shrink-0 w-20 border-2 border-dashed border-gray-100 rounded-[2rem] flex items-center justify-center text-gray-200"
                  onDragEnter={() => {
                    if (dragItem.current) {
                      dragOverItem.current = { rowIndex, colIndex: row.length };
                    }
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 행 추가 버튼 */}
        <div className="px-5">
          <button 
            onClick={addRow}
            className="w-full py-5 flex items-center justify-center gap-3 border-2 border-dashed border-primary/40 rounded-[2.5rem] text-primary-dark font-black bg-white/50 hover:bg-primary/5 transition-all active:scale-[0.98] shadow-sm"
          >
            <span className="material-symbols-outlined">add_circle</span>
            새로운 행 추가하기
          </button>
        </div>

        {rows.every(r => r.length === 0) && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-300 space-y-4">
            <span className="material-symbols-outlined text-6xl opacity-20">inventory_2</span>
            <p className="text-sm font-black italic">상품 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상품 개별 추가 버튼 */}
      <div className="fixed bottom-28 right-6 z-[60]">
        <button 
          onClick={() => navigate('/product/add')}
          className="flex size-15 items-center justify-center rounded-full bg-primary text-primary-text shadow-[0_10px_30px_rgba(243,229,171,0.5)] active:scale-95 transition-all border-4 border-white"
        >
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </div>
    </Layout>
  );
};

export default Inventory;
