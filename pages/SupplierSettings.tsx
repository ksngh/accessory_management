
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { MOCK_SUPPLIERS } from '../constants';
import { Supplier } from '../types';

const SupplierSettings: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    setEditingSupplier(null);
    setNewName('');
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewName(supplier.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 거래처를 삭제하시겠습니까? 관련 상품의 거래처 정보가 소실될 수 있습니다.')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const handleSave = () => {
    if (!newName.trim()) return;

    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, name: newName } : s));
    } else {
      const newSupplier: Supplier = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setIsModalOpen(false);
  };

  return (
    // Removed showMenu as it is not defined in LayoutProps
    <Layout title="거래처 설정">
      <div className="px-5 py-6 space-y-8 pb-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-dark font-black">storefront</span>
            <h3 className="text-sm font-black text-primary-text uppercase tracking-widest">관리 리스트</h3>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-text rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm font-black">add</span>
            거래처 추가
          </button>
        </div>

        <div className="space-y-4">
          {suppliers.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-[2rem] border border-primary/10 shadow-lg shadow-primary/5 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
                  <span className="material-symbols-outlined text-2xl font-bold">domain</span>
                </div>
                <div>
                  <p className="font-black text-primary-text text-base leading-tight">{s.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Registered Supplier</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEdit(s)}
                  className="size-10 flex items-center justify-center text-gray-300 hover:text-primary-dark transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(s.id)}
                  className="size-10 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined">delete_forever</span>
                </button>
              </div>
            </div>
          ))}

          {suppliers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-gray-300 space-y-4">
              <span className="material-symbols-outlined text-6xl opacity-20">storefront</span>
              <p className="text-sm font-black italic">등록된 거래처가 없습니다.</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-[2.5rem] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-center">
          <span className="material-symbols-outlined text-2xl text-gray-300">help</span>
          <p className="text-[11px] font-bold text-gray-400 px-4 leading-relaxed">
            거래처를 삭제하면 해당 거래처의 상품 데이터 필터링 시<br/>보이지 않을 수 있으니 주의해 주세요.
          </p>
        </div>
      </div>

      {/* 추가/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-[3rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <h4 className="text-lg font-black text-primary-text">
                {editingSupplier ? '거래처 수정' : '새 거래처 등록'}
              </h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplier Name</p>
            </div>

            <div className="space-y-4">
              <input 
                type="text"
                autoFocus
                placeholder="거래처 이름을 입력하세요"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full h-14 px-6 rounded-2xl border border-primary/20 bg-gray-50 text-center font-black text-primary-text placeholder:text-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-black text-gray-400 bg-gray-100 active:scale-95 transition-all text-sm"
                >
                  취소
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-2 h-14 rounded-2xl font-black text-primary-text bg-primary active:scale-95 transition-all shadow-lg shadow-primary/20 text-sm px-6"
                >
                  {editingSupplier ? '변경 저장' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SupplierSettings;
