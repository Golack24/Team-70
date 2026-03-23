import React, { useState, useEffect } from 'react';
import AdminSidebar from './adminSidebar';
import AdminHeader from './adminHeader';
import AdminDashboard from './modules/AdminDashboard';
import AdminProducts from './modules/AdminProducts';
import AdminInventory from './modules/AdminInventory';
import AdminOrders from './modules/AdminOrders';
import AdminCustomers from './modules/AdminCustomers';
import AdminAnalytics from './modules/AdminAnalytics';

const BASE_URL =
  "http://cs2team70.cs2410-web01pvm.aston.ac.uk/index.php";

export default function AdminHome({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    newOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${BASE_URL}?resource=products`),
        fetch(`${BASE_URL}?resource=orders`),
        fetch(`${BASE_URL}?resource=users`)
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      const products = productsData?.data || [];
      const orders = Array.isArray(ordersData) ? ordersData : [];
      const users = Array.isArray(usersData) ? usersData : [];

      // Calculate stats
      const lowStock = products.filter(p => Number(p.stock) < 10).length;

      const revenue = orders.reduce(
        (sum, o) => sum + Number(o.total || 0),
        0
      );

      setStats({
        totalProducts: products.length,
        lowStockItems: lowStock,
        newOrders: orders.length,
        totalCustomers: users.length,
        totalRevenue: revenue,
      });

    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
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
      {/* Sidebar */}
      <AdminSidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />

      {/* Header */}
      <AdminHeader
        currentPage={activePage}
        pageTitle={currentPageConfig.title}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="admin-main">
        {loading && activePage === "dashboard" ? (
          <p style={{ padding: "20px" }}>Loading dashboard...</p>
        ) : (
          <CurrentComponent
            stats={stats}
            onStatsChange={setStats}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}