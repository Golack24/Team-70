import React from 'react';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

export default function AdminSidebar({ activePage, onPageChange, onLogout }) {
  const navSections = [
    {
      name: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome },
      ],
    },
    {
      name: 'MANAGEMENT',
      items: [
        { id: 'products', label: 'Products', icon: FiPackage },
        { id: 'inventory', label: 'Inventory', icon: FiBarChart },
        { id: 'orders', label: 'Orders', icon: FiShoppingCart },
        { id: 'customers', label: 'Customers', icon: FiUsers },
      ],
    },
    {
      name: 'ANALYTICS',
      items: [
        { id: 'analytics', label: 'Sales Analytics', icon: FiBarChart },
      ],
    },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-logo">
          METRIC <span style={{ color: 'var(--admin-text-muted)' }}>Admin</span>
        </h2>
      </div>

      <nav className="admin-sidebar-nav">
        {navSections.map((section) => (
          <div key={section.name} className="admin-nav-section">
            <div className="admin-nav-section-title">{section.name}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`admin-nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-user-profile">
          <div className="admin-user-avatar">A</div>
          <div className="admin-user-info">
            <span className="admin-user-name">Admin</span>
            <span className="admin-user-role">Manager</span>
          </div>
        </div>
        <button
          className="admin-nav-item"
          onClick={onLogout}
          style={{ marginTop: '0.5rem' }}
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
