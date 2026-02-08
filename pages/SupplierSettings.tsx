
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Supplier } from '../types';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../src/api/suppliers';

const SupplierSettings: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (confirm('정말로 이 거래처를 삭제하시겠습니까? 관련 상품의 거래처 정보가 소실될 수 있습니다.')) {
      try {
        await deleteSupplier(id);
        setSuppliers(suppliers.filter(s => s.id !== id));
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async () => {
    if (!newName.trim()) return;

    try {
      if (editingSupplier) {
        const updated = await updateSupplier(editingSupplier.id, newName);
        setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? updated : s));
      } else {
        const newSupplier = await addSupplier(newName);
        setSuppliers([...suppliers, newSupplier]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('저장에 실패했습니다.');
    }
  };

  return (
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

        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-300 space-y-4">
            <span className="material-symbols-outlined text-6xl opacity-20 animate-spin">sync</span>
            <p className="text-sm font-black italic">로딩 중...</p>
          </div>
        )}

        {error && (
          <div className="py-20 flex flex-col items-center justify-center text-red-400 space-y-4">
            <span className="material-symbols-outlined text-6xl opacity-50">error</span>
            <p className="text-sm font-black italic">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {suppliers.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-[2rem] border border-primary/10 shadow-lg shadow-primary/5 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
                    <span className="material-symbols-outlined text-2xl font-bold">domain</span>
                  </div>
                  <div>
                    <p className="font-black text-primary-text text-base leading-tight">{s.name}</p>
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
        )}
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
