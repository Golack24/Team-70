import React, { useState } from 'react';
import {
  FiPackage,
  FiAlertTriangle,
  FiShoppingCart,
  FiUsers,
  FiBarChart,
  FiTrendingUp,
} from 'react-icons/fi';

export default function AdminDashboard({ stats, onPageChange }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const dashboardStats = [
    { label: 'Total Products', value: stats.totalProducts || 125, change: '+5%', icon: FiPackage, type: 'info' },
    { label: 'Low Stock Items', value: stats.lowStockItems || 8, change: '-2', icon: FiAlertTriangle, type: 'warning' },
    { label: 'New Orders', value: stats.newOrders || 12, change: '+3', icon: FiShoppingCart, type: 'success' },
    { label: 'Total Customers', value: stats.totalCustomers || 342, change: '+12%', icon: FiUsers, type: 'info' },
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
                <span className="admin-stat-change positive">
                  {stat.type === 'warning' ? '↓' : '↑'} {stat.change}
                </span>
              </div>
              <div className={`admin-stat-icon ${stat.type}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Overview */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Revenue Overview</h2>
            <p className="admin-panel-subtitle">Last 30 days</p>
          </div>
          <div className="admin-panel-actions">
            <button
              className={`admin-btn ${selectedPeriod === 'year' ? 'admin-btn-primary' : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
            <button
              className={`admin-btn ${selectedPeriod === 'month' ? 'admin-btn-primary' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
          </div>
        </div>

        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
          <p>📊 Chart placeholder - Connect to recharts for live data</p>
        </div>
      </div>

      {/* Recent Orders */}
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
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-001</td>
                <td>John Doe</td>
                <td>£120.50</td>
                <td><span className="admin-badge admin-badge-success">Completed</span></td>
                <td>Mar 20, 2026</td>
                <td><button className="admin-table-action">View</button></td>
              </tr>
              <tr>
                <td>#ORD-002</td>
                <td>Jane Smith</td>
                <td>£250.00</td>
                <td><span className="admin-badge admin-badge-warning">Processing</span></td>
                <td>Mar 19, 2026</td>
                <td><button className="admin-table-action">View</button></td>
              </tr>
              <tr>
                <td>#ORD-003</td>
                <td>Bob Johnson</td>
                <td>£85.75</td>
                <td><span className="admin-badge admin-badge-info">Pending</span></td>
                <td>Mar 18, 2026</td>
                <td><button className="admin-table-action">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>API Connection</span>
              <span className="admin-badge admin-badge-success">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Database</span>
              <span className="admin-badge admin-badge-success">Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Server Load</span>
              <span className="admin-badge admin-badge-accent">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
