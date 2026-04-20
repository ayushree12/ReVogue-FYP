import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SellerProfile from './pages/SellerProfile';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Checkout from './pages/Checkout';
import SellerVerification from './pages/SellerVerification';
import SellerLayout from './components/SellerLayout';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrders from './pages/seller/Orders';
import SellerChats from './pages/seller/Chats';
import SellerAnalytics from './pages/seller/Analytics';
import SellerSettings from './pages/seller/Settings';
import NewProduct from './pages/NewProduct';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminReports from './pages/AdminReports';
import AdminVerification from './pages/AdminVerification';
import AdminLayout from './components/AdminLayout';
import NotFound from './pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="collections" element={<Collections />} />
      <Route path="products" element={<Products />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="seller/:id" element={<SellerProfile />} />
      <Route
        path="account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="messages" element={<Messages />} />
      <Route path="seller/verification" element={<SellerVerification />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route
      path="admin"
      element={
        <RoleGuard allowedRoles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="verification" element={<AdminVerification />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route
      path="seller"
      element={
        <RoleGuard allowedRoles={['seller']}>
          <SellerLayout />
        </RoleGuard>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<SellerDashboard />} />
      <Route path="products" element={<SellerProducts />} />
      <Route path="products/new" element={<NewProduct />} />
      <Route path="orders" element={<SellerOrders />} />
      <Route path="chats" element={<SellerChats />} />
      <Route path="analytics" element={<SellerAnalytics />} />
      <Route path="settings" element={<SellerSettings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
