import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './adminSidebar';
import AdminHeader from './adminHeader';
import AdminDashboard from './modules/AdminDashboard';
import AdminProducts from './modules/AdminProducts';
import AdminInventory from './modules/AdminInventory';
import AdminOrders from './modules/AdminOrders';
import AdminCustomers from './modules/AdminCustomers';
import AdminAnalytics from './modules/AdminAnalytics';
import { fetchProducts, fetchOrders, fetchUsers } from './api';

export default function AdminHome({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchUsers(),
      ]);

      setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const stats = {
    totalProducts: products.length,
    lowStockItems: products.filter((p) => Number(p.stock || 0) < 10).length,
    newOrders: orders.filter((o) => ['pending', 'paid'].includes(String(o.status || '').toLowerCase())).length,
    totalCustomers: users.filter((u) => u.role !== 'admin' && u.role !== 'staff').length,
    totalRevenue: orders.reduce((sum, o) => sum + Number(o.total || 0), 0),
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const pageConfig = {
    dashboard: { title: 'Dashboard', component: AdminDashboard },
    products: { title: 'Product Management', component: AdminProducts },
    inventory: { title: 'Inventory Management', component: AdminInventory },
    orders: { title: 'Order Management', component: AdminOrders },
    customers: { title: 'Customer Management', component: AdminCustomers },
    analytics: { title: 'Sales Analytics', component: AdminAnalytics },
  };

  const currentPageConfig = pageConfig[activePage] || pageConfig.dashboard;
  const CurrentComponent = currentPageConfig.component;

  return (
    <div className="admin-app">
      <AdminSidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />

      <AdminHeader
        currentPage={activePage}
        pageTitle={currentPageConfig.title}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading admin data...</p>
        ) : error ? (
          <div style={{ padding: '20px', color: 'crimson' }}>
            Failed to load admin data: {error}
          </div>
        ) : (
          <CurrentComponent
            stats={stats}
            products={products}
            orders={orders}
            users={users}
            refreshData={loadAdminData}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}