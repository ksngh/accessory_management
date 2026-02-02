
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory.tsx';
import ProductForm from './pages/ProductForm.tsx';
import SupplierSettings from './pages/SupplierSettings.tsx';
import PurchaseOrder from './pages/PurchaseOrder.tsx';
import OrderHistory from './pages/OrderHistory.tsx';
import OrderDetail from './pages/OrderDetail.tsx';
import StockEdit from './pages/StockEdit.tsx';
import Login from './pages/Login.tsx';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
