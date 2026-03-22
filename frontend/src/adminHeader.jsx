import React from 'react';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

export default function AdminHeader({ currentPage, pageTitle, onLogout }) {
  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-header-title">{pageTitle}</h1>
        <div className="admin-header-breadcrumb">
          <span>Admin</span>
          <span>/</span>
          <span>{currentPage}</span>
        </div>
      </div>

      <div className="admin-header-actions">
        <button className="admin-btn" title="Settings">
          <FiSettings size={18} />
          <span className="admin-hidden-mobile">Settings</span>
        </button>
        <button className="admin-btn" title="Profile">
          <FiUser size={18} />
          <span className="admin-hidden-mobile">Profile</span>
        </button>
        <button className="admin-btn admin-btn-danger" onClick={onLogout} title="Logout">
          <FiLogOut size={18} />
          <span className="admin-hidden-mobile">Logout</span>
        </button>
      </div>
    </div>
  );
}
