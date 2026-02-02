
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory.tsx';
import ProductForm from './pages/ProductForm.tsx';
import CategorySettings from './pages/CategorySettings.tsx';
import PurchaseOrder from './pages/PurchaseOrder.tsx';
import OrderHistory from './pages/OrderHistory.tsx';

const App: React.FC = () => {
  console.log('App component rendering...');
  return (
    <Router>
      <div className="max-w-[480px] mx-auto min-h-screen relative shadow-2xl bg-white overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/product/add" element={<ProductForm />} />
          <Route path="/product/edit/:id" element={<ProductForm />} />
          <Route path="/categories" element={<CategorySettings />} />
          <Route path="/order/new" element={<PurchaseOrder />} />
          <Route path="/orders" element={<OrderHistory />} />
          {/* Catch-all for safety */}
          <Route path="*" element={<Navigate to="/inventory" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
