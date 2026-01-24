
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import ProductForm from './pages/ProductForm';
import CategorySettings from './pages/CategorySettings';
import PurchaseOrder from './pages/PurchaseOrder';
import OrderHistory from './pages/OrderHistory';

const App: React.FC = () => {
  return (
    <Router>
      <div className="max-w-[480px] mx-auto min-h-screen relative shadow-2xl bg-white">
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/product/add" element={<ProductForm />} />
          <Route path="/categories" element={<CategorySettings />} />
          <Route path="/order/new" element={<PurchaseOrder />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
