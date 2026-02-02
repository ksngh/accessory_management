
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim() && password.trim()) {
      onLogin();
    } else {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center px-8 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="size-20 bg-primary rounded-[2rem] shadow-xl flex items-center justify-center text-primary-text">
            <span className="material-symbols-outlined text-4xl font-bold">diamond</span>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-primary-text tracking-tighter">Luxury Shine</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inventory Management</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark opacity-50">person</span>
              <input 
                type="text" 
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full h-15 pl-12 pr-6 rounded-2xl border-none bg-white shadow-sm font-bold text-primary-text placeholder:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark opacity-50">lock</span>
              <input 
                type="password" 
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-15 pl-12 pr-6 rounded-2xl border-none bg-white shadow-sm font-bold text-primary-text placeholder:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-15 bg-primary text-primary-text font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            로그인
            <span className="material-symbols-outlined font-black">arrow_forward</span>
          </button>
        </form>
      </div>

      <div className="absolute bottom-12 text-center">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">© 2024 Luxury Shine Lab. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
