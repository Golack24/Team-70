import React, { useMemo } from 'react';
import {
  FiPackage,
  FiAlertTriangle,
  FiShoppingCart,
  FiUsers,
} from 'react-icons/fi';

export default function AdminDashboard({ stats, orders = [], users = [], onPageChange }) {
  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5);
  }, [orders]);

  const getCustomerName = (order) => {
    const user = users.find((u) => Number(u.id) === Number(order.user_id));
    return (
      [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
      user?.username ||
      'Unknown User'
    );
  };

  const dashboardStats = [
    { label: 'Total Products', value: stats.totalProducts || 0, icon: FiPackage, type: 'info' },
    { label: 'Low Stock Items', value: stats.lowStockItems || 0, icon: FiAlertTriangle, type: 'warning' },
    { label: 'New Orders', value: stats.newOrders || 0, icon: FiShoppingCart, type: 'success' },
    { label: 'Total Customers', value: stats.totalCustomers || 0, icon: FiUsers, type: 'info' },
  ];

  return (
    <div>
      <div className="admin-dashboard admin-grid-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat-card">
              <div className="admin-stat-content">
                <span className="admin-stat-label">{stat.label}</span>
                <span className="admin-stat-value">{stat.value}</span>
              </div>
              <div className={`admin-stat-icon ${stat.type}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Revenue Overview</h2>
            <p className="admin-panel-subtitle">Live total revenue</p>
          </div>
        </div>

        <div style={{ padding: '1rem 0', fontSize: '2rem', fontWeight: '700' }}>
          £{Number(stats.totalRevenue || 0).toFixed(2)}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Recent Orders</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{getCustomerName(order)}</td>
                    <td>£{Number(order.total || 0).toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-dashboard admin-grid-2">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="admin-btn admin-btn-primary" style={{ width: '100%' }} onClick={() => onPageChange?.('products')}>
              <FiPackage size={18} /> Add New Product
            </button>
            <button className="admin-btn" style={{ width: '100%' }} onClick={() => onPageChange?.('orders')}>
              <FiShoppingCart size={18} /> View All Orders
            </button>
            <button className="admin-btn" style={{ width: '100%' }} onClick={() => onPageChange?.('customers')}>
              <FiUsers size={18} /> Manage Customers
            </button>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">System Status</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>API Connection</span>
              <span className="admin-badge admin-badge-success">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Database</span>
              <span className="admin-badge admin-badge-success">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}