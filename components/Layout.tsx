
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 설정 모달 관련 상태
  const [storeName, setStoreName] = useState(() => localStorage.getItem('storeName') || 'vanilla');
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [tempName, setTempName] = useState(storeName);

  // 매장 이름이 변경될 때마다 헤더에 반영하기 위해 effect 사용
  useEffect(() => {
    const savedName = localStorage.getItem('storeName');
    if (savedName) setStoreName(savedName);
  }, [isSettingsOpen]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/'; // 강제 새로고침으로 로그인 페이지 이동
  };

  const handleSaveStoreName = () => {
    if (tempName.trim()) {
      setStoreName(tempName);
      localStorage.setItem('storeName', tempName);
      setIsEditingStore(false);
    }
  };

  const navItems = [
    { path: '/inventory', label: '재고', icon: 'inventory_2', type: 'link' },
    { path: '/order/new', label: '발주', icon: 'shopping_cart', type: 'link' },
    { path: '/orders', label: '내역', icon: 'analytics', type: 'link' },
    { path: '/suppliers', label: '거래처', icon: 'storefront', type: 'link' },
    { label: '내정보', icon: 'person', type: 'modal' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-[#E5E5EA]">
        <div className="flex items-center p-4 justify-between w-full h-16">
          <div className="w-12 flex justify-start">
            {showBack && (
              <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
              </button>
            )}
          </div>
          {/* 헤더 제목을 매장 이름으로 통일 */}
          <h2 className="text-xl font-black leading-tight tracking-tighter flex-1 text-center truncate px-2 text-primary-text uppercase">
            {storeName}
          </h2>
          <div className="w-12 flex justify-end" />
        </div>
      </header>

      <main className="flex-1 pb-32">
        {children}
      </main>

      {/* 내비게이션 바 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full bg-white/90 backdrop-blur-xl border-t border-primary/20 px-4 pt-3 pb-8 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.type === 'link' ? navigate(item.path!) : setIsSettingsOpen(true)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${
              (item.type === 'link' && location.pathname === item.path) || (item.type === 'modal' && isSettingsOpen)
                ? 'text-primary-dark opacity-100' 
                : 'text-[#8E8E93] opacity-60'
            }`}
          >
            <span 
              className={`material-symbols-outlined ${(item.type === 'link' && location.pathname === item.path) || (item.type === 'modal' && isSettingsOpen) ? 'fill-1' : ''}`}
              style={{ fontVariationSettings: ((item.type === 'link' && location.pathname === item.path) || (item.type === 'modal' && isSettingsOpen)) ? "'FILL' 1" : "" }}
            >
              {item.icon}
            </span>
            <span className="text-[9px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="h-6 bg-white fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full z-40"></div>

      {/* 내 정보 관리 모달 (창) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-[3rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => { setIsSettingsOpen(false); setIsEditingStore(false); }}
              className="absolute top-6 right-6 size-10 flex items-center justify-center text-gray-300 hover:text-gray-500"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
                <span className="material-symbols-outlined text-4xl font-bold">store</span>
              </div>
              <div className="text-center w-full">
                {isEditingStore ? (
                  <div className="space-y-3">
                    <input 
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                      className="w-full h-12 px-4 text-center text-sm font-black border-2 border-primary rounded-xl outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingStore(false)} className="flex-1 py-2 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-bold">취소</button>
                      <button onClick={handleSaveStoreName} className="flex-1 py-2 bg-primary text-primary-text rounded-xl text-[10px] font-black">저장</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-primary-text">{storeName}</h3>
                      <button onClick={() => { setIsEditingStore(true); setTempName(storeName); }} className="text-gray-300 hover:text-primary-dark">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Store Management</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full h-14 bg-red-50 border border-red-100 text-red-400 font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                로그아웃
              </button>
              <p className="text-center text-[9px] font-bold text-gray-300 tracking-tighter">v1.0.4 Premium Store</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
