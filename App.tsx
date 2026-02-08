
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import ProductForm from './pages/ProductForm';
import SupplierSettings from './pages/SupplierSettings';
import PurchaseOrder from './pages/PurchaseOrder';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import StockEdit from './pages/StockEdit';
import Login from './pages/Login';
import Statistics from './pages/Statistics';
import { fetcher } from './src/api/fetcher';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    let isActive = true;

    const checkAuth = async () => {
      try {
        await fetcher('/auth/me');
        if (isActive) setIsLoggedIn(true);
      } catch {
        if (isActive) setIsLoggedIn(false);
      }
    };

    checkAuth();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen flex items-center justify-center bg-white">
        <span className="text-xs font-bold text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="max-w-[480px] mx-auto min-h-screen relative shadow-2xl bg-white overflow-x-hidden">
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/inventory" replace /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route path="/" element={<Navigate to={isLoggedIn ? "/inventory" : "/login"} replace />} />
          
          {/* Protected Routes */}
          <Route 
            path="/inventory" 
            element={isLoggedIn ? <Inventory /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/product/add" 
            element={isLoggedIn ? <ProductForm /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/product/edit/:id" 
            element={isLoggedIn ? <ProductForm /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/stock/edit/:id" 
            element={isLoggedIn ? <StockEdit /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/suppliers" 
            element={isLoggedIn ? <SupplierSettings /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/order/new" 
            element={isLoggedIn ? <PurchaseOrder /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/orders" 
            element={isLoggedIn ? <OrderHistory /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/orders/:id" 
            element={isLoggedIn ? <OrderDetail /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/statistics" 
            element={isLoggedIn ? <Statistics /> : <Navigate to="/login" replace />} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
