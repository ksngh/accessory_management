
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { INITIAL_CATEGORIES, MOCK_SUPPLIERS } from '../constants';

interface BulkProductEntry {
  id: string;
  image: string | null;
  category: string;
  price: string;
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(MOCK_SUPPLIERS[0].name);
  const [entries, setEntries] = useState<BulkProductEntry[]>([]);
  
  // 일괄 설정을 위한 상태
  const [bulkCategory, setBulkCategory] = useState(INITIAL_CATEGORIES[0].name);
  const [bulkPrice, setBulkPrice] = useState('');

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<BulkProductEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const applyBulkSettings = () => {
    setEntries(entries.map(e => ({
      ...e,
      category: bulkCategory,
      price: bulkPrice || e.price
    })));
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    let loadedEntries: BulkProductEntry[] = [];
    let count = 0;

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedEntries.push({
          id: Math.random().toString(36).substr(2, 9),
          image: reader.result as string,
          category: bulkCategory,
          price: bulkPrice
        });
        count++;
        if (count === fileList.length) {
          setEntries(prev => [...prev, ...loadedEntries]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const triggerFilePicker = () => {
    document.getElementById('gallery-input')?.click();
  };

  return (
    <Layout title="상품 일괄 등록" showBack>
      <div className="px-4 py-4 space-y-6 pb-40">
        {/* 거래처 선택 */}
        <section className="space-y-2">
          <label className="text-[11px] font-black text-primary-text uppercase tracking-widest px-1">거래처 선택</label>
          <select 
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full h-14 pl-5 pr-10 rounded-2xl border border-primary/30 focus:border-primary-dark focus:ring-2 focus:ring-primary/20 text-base bg-white font-bold shadow-sm transition-all outline-none"
          >
            {MOCK_SUPPLIERS.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </section>

        {/* 일괄 설정 바 */}
        {entries.length > 0 && (
          <section className="bg-primary/10 p-5 rounded-[2rem] border border-primary/20 space-y-4 shadow-inner animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-dark font-bold">auto_fix_high</span>
              <h3 className="text-sm font-black text-primary-text tracking-tight">선택한 {entries.length}개 상품 일괄 설정</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">카테고리</label>
                <select 
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border-none bg-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-dark"
                >
                  {INITIAL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">가격 (₩)</label>
                <input 
                  type="number"
                  placeholder="금액 입력"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border-none bg-white text-sm font-black shadow-sm focus:ring-2 focus:ring-primary-dark"
                />
              </div>
            </div>
            <button 
              onClick={applyBulkSettings}
              className="w-full h-12 bg-primary-dark text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all"
            >
              리스트 전체에 적용하기
            </button>
          </section>
        )}

        {/* 상품 리스트 */}
        <div className="space-y-4">
          <input 
            id="gallery-input"
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFilesChange} 
          />
          
          <button 
            onClick={triggerFilePicker}
            className="w-full py-10 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/40 rounded-[2.5rem] text-primary-dark font-black bg-white hover:bg-primary/5 transition-all active:scale-[0.98] shadow-sm group"
          >
            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
            </div>
            <span className="text-lg">갤러리에서 사진 여러 장 선택</span>
            <p className="text-xs font-medium text-gray-400">한 번에 여러 상품을 등록할 수 있습니다.</p>
          </button>

          {entries.map((entry) => (
            <div key={entry.id} className="p-4 bg-white rounded-[2rem] border border-primary/10 shadow-lg shadow-primary/5 space-y-4 relative animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex gap-5">
                <div 
                  className="size-28 bg-gray-50 border border-gray-100 rounded-[1.5rem] shrink-0 overflow-hidden bg-center bg-cover shadow-inner"
                  style={entry.image ? { backgroundImage: `url(${entry.image})` } : {}}
                />

                <div className="flex-1 space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Category</label>
                    <select 
                      value={entry.category}
                      onChange={(e) => updateEntry(entry.id, { category: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border-none bg-gray-50 text-sm font-bold focus:ring-1 focus:ring-primary-dark"
                    >
                      {INITIAL_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₩</span>
                      <input 
                        type="number"
                        value={entry.price}
                        onChange={(e) => updateEntry(entry.id, { price: e.target.value })}
                        className="w-full h-10 pl-7 pr-3 rounded-xl border-none bg-gray-50 text-sm font-black focus:ring-1 focus:ring-primary-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => removeEntry(entry.id)}
                className="absolute top-2 right-2 size-10 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined">cancel</span>
              </button>
            </div>
          ))}
        </div>

        {/* 저장 버튼 */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 z-[100]">
          <button 
            disabled={entries.length === 0}
            onClick={() => navigate('/inventory')}
            className={`w-full h-15 font-black text-lg rounded-[1.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
              entries.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-primary-text'
            }`}
          >
            <span className="material-symbols-outlined">check_circle</span>
            {entries.length > 0 ? `${entries.length}개 상품 등록 완료` : '사진을 먼저 선택하세요'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductForm;
