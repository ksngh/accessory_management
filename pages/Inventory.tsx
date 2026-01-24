
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_PRODUCTS, INITIAL_CATEGORIES } from '../constants';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [search, setSearch] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === '전체' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Layout 
      title="재고 관리" 
      showMenu 
      rightAction={
        <button className="size-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </button>
      }
    >
      <div className="px-4 py-3 sticky top-16 bg-background-light z-40 space-y-3">
        {/* Search Bar */}
        <div className="flex w-full items-stretch rounded-xl h-12 shadow-sm border border-primary/20 bg-white">
          <div className="text-primary-dark flex items-center justify-center pl-4">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="flex-1 border-none bg-transparent placeholder:text-[#A89D85] px-3 focus:ring-0 text-base"
            placeholder="상품 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 py-1">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`h-9 shrink-0 px-5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              selectedCategory === '전체' ? 'bg-primary text-primary-text' : 'bg-white border border-primary/30 text-gray-600'
            }`}
          >
            전체
          </button>
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`h-9 shrink-0 px-5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                selectedCategory === cat.name ? 'bg-primary text-primary-text' : 'bg-white border border-primary/30 text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="flex flex-col gap-2 pb-3 group">
            <div 
              className="w-full aspect-square rounded-xl shadow-sm border border-primary/10 bg-center bg-cover"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            />
            <div className="px-1">
              <p className="text-[#2D2926] text-sm font-semibold leading-tight truncate">{product.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[#8B7E66] font-bold text-sm">₩{product.price.toLocaleString()}</p>
                <p className="text-[10px] font-medium bg-primary/20 text-[#8B7E66] px-1.5 py-0.5 rounded">#{product.sku}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-28 right-5 z-[60]">
        <button 
          onClick={() => navigate('/product/add')}
          className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-text shadow-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>
      </div>
    </Layout>
  );
};

export default Inventory;
