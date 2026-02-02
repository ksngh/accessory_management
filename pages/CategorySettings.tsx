
import React from 'react';
import Layout from '../components/Layout.tsx';
import { INITIAL_CATEGORIES } from '../constants.tsx';

const CategorySettings: React.FC = () => {
  return (
    <Layout title="카테고리 설정" showBack>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-primary-text">카테고리 목록</h3>
          <button className="flex items-center gap-1 text-sm font-bold text-[#8B7E66] px-3 py-1.5 rounded-lg bg-primary/20">
            <span className="material-symbols-outlined text-sm">add</span>
            추가
          </button>
        </div>

        <div className="space-y-3">
          {INITIAL_CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-[#2D2926]">{cat.name}</p>
                  <p className="text-xs text-[#8E8E93]">{cat.count}개의 상품</p>
                </div>
              </div>
              <button className="size-8 flex items-center justify-center text-[#C7C7CC] hover:text-[#FF3B30] transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[#F2F2F7] border border-dashed border-[#D1D1D6] flex flex-col items-center justify-center gap-2 py-8">
          <span className="material-symbols-outlined text-3xl text-[#AEAEB2]">info</span>
          <p className="text-sm text-[#8E8E93] text-center px-4">
            카테고리를 삭제하면 해당 카테고리에 속한 상품의 카테고리가 '미분류'로 변경됩니다.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CategorySettings;
