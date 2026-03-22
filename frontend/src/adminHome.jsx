import React, { useState, useEffect } from 'react';
import AdminSidebar from './adminSidebar';
import AdminHeader from './adminHeader';
import AdminDashboard from './modules/AdminDashboard';
import AdminProducts from './modules/AdminProducts';
import AdminInventory from './modules/AdminInventory';
import AdminOrders from './modules/AdminOrders';
import AdminCustomers from './modules/AdminCustomers';
import AdminAnalytics from './modules/AdminAnalytics';

export default function AdminHome({ onLogout, onPageChange }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    newOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalProducts: 125,
        lowStockItems: 8,
        newOrders: 12,
        totalCustomers: 342,
        totalRevenue: 24850.75,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
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
        <CurrentComponent
          stats={stats}
          onStatsChange={setStats}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
