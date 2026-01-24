
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { INITIAL_CATEGORIES } from '../constants';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC06OKP9APHBsJaBLHxET-ap4AtIBKLNKissZ9ieVP7m4yguMVLKh32xXCdAd1M57FX4nRfnfj7R6hI-3QJn7d38qIUTo1WGLP1n456Piwzzd27IEYI_-kIFNUBcolksCMp6BNrVPQZ_HN8HBsPOBpJ8oUynZzI5SQZNGD3BjndMSi_cn7DNpzrHFNz8Saywkw7cKoyi9QmPBSNyP7TkRaqniTzyWsiVPSj19gfRCCRXI3OmodVU3wqUU6Lf6ncoDbJbec5NWxQ'
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout title="새 상품 등록" showBack>
      <div className="px-4 py-4 space-y-6">
        {/* Image Picker */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer"
        >
          <div 
            className="w-full h-72 bg-white border-2 border-dashed border-[#D1D1D6] rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary-dark bg-center bg-cover"
            style={image ? { backgroundImage: `url(${image})` } : {}}
          >
            {!image && (
              <>
                <span className="material-symbols-outlined text-4xl text-[#8E8E93] mb-2">add_a_photo</span>
                <p className="text-[#8E8E93] text-sm font-medium">상품 사진 업로드</p>
              </>
            )}
            {image && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">edit</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-primary-text px-1">상품명</label>
            <input 
              type="text" 
              placeholder="예: 실버 오픈 링"
              className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:border-primary-dark focus:ring-0 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-primary-text px-1">SKU (코드)</label>
              <input 
                type="text" 
                placeholder="코드 입력"
                className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:border-primary-dark focus:ring-0 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-primary-text px-1">카테고리</label>
              <select className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:border-primary-dark focus:ring-0 text-base appearance-none bg-white">
                {INITIAL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-primary-text px-1">가격 (원)</label>
            <input 
              type="number" 
              placeholder="0"
              className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:border-primary-dark focus:ring-0 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-primary-text px-1">상품 설명</label>
            <textarea 
              rows={3}
              placeholder="상품에 대한 간단한 설명을 입력하세요."
              className="w-full px-4 py-3 rounded-xl border border-primary/30 focus:border-primary-dark focus:ring-0 text-base resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/inventory')}
          className="w-full h-14 bg-primary text-primary-text font-bold text-lg rounded-2xl shadow-lg active:scale-[0.98] transition-all mt-4"
        >
          상품 등록하기
        </button>
      </div>
    </Layout>
  );
};

export default ProductForm;
