
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  rightAction?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack, showMenu, rightAction }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/inventory', label: '재고', icon: 'inventory_2' },
    { path: '/order/new', label: '발주', icon: 'shopping_cart' },
    { path: '/orders', label: '내역', icon: 'analytics' },
    { path: '/categories', label: '설정', icon: 'settings' },
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
            {showMenu && (
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center truncate px-2">{title}</h2>
          <div className="w-12 flex justify-end">
            {rightAction || <div className="size-10" />}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-32">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full bg-white/90 backdrop-blur-xl border-t border-primary/20 px-6 pt-3 pb-8 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === item.path ? 'text-primary-dark opacity-100' : 'text-[#8E8E93] opacity-60'
            }`}
          >
            <span className={`material-symbols-outlined ${location.pathname === item.path ? 'fill-1' : ''}`} style={{ fontVariationSettings: location.pathname === item.path ? "'FILL' 1" : "" }}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="h-6 bg-white fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full z-40"></div>
    </div>
  );
};

export default Layout;
