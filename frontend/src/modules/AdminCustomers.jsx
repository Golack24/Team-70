import React, { useMemo, useState } from 'react';
import { FiSearch, FiMail, FiPhone, FiEye, FiTrash2 } from 'react-icons/fi';
import { deleteUser } from '../api';

export default function AdminCustomers({ users = [], orders = [], refreshData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const customers = useMemo(() => {
    return users
      .filter((u) => u.role !== 'admin' && u.role !== 'staff')
      .map((u) => {
        const userOrders = orders.filter((o) => Number(o.user_id) === Number(u.id));
        const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

        return {
          id: u.id,
          name:
            [u.first_name, u.last_name].filter(Boolean).join(' ').trim() ||
            u.username ||
            'Unnamed Customer',
          email: u.email || '',
          phone: u.phone || 'N/A',
          location: 'N/A',
          joinDate: u.created_at || 'N/A',
          totalOrders: userOrders.length,
          totalSpent,
          status: 'active',
          raw: u,
        };
      });
  }, [users, orders]);

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure? This will remove this customer account.')) return;

    try {
      await deleteUser(id);
      await refreshData?.();
    } catch (err) {
      alert(err.message || 'Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = customers.length ? totalRevenue / customers.length : 0;

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.length,
    avgOrderValue,
    totalRevenue,
  };

  return (
    <div>
      <div className="admin-dashboard admin-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Customers</span>
            <span className="admin-stat-value">{stats.totalCustomers}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Active Customers</span>
            <span className="admin-stat-value">{stats.activeCustomers}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Avg Value</span>
            <span className="admin-stat-value">£{stats.avgOrderValue.toFixed(0)}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Revenue</span>
            <span className="admin-stat-value">£{stats.totalRevenue.toFixed(0)}</span>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div style={{ position: 'relative' }}>
          <FiSearch
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            className="admin-input"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Customer Database</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={{ fontWeight: '500' }}>{customer.name}</td>
                    <td><FiMail size={14} style={{ marginRight: 6 }} />{customer.email}</td>
                    <td><FiPhone size={14} style={{ marginRight: 6 }} />{customer.phone}</td>
                    <td>{customer.totalOrders}</td>
                    <td style={{ color: 'var(--admin-accent)', fontWeight: '600' }}>
                      £{customer.totalSpent.toFixed(2)}
                    </td>
                    <td>{customer.joinDate}</td>
                    <td>
                      <button
                        className="admin-table-action"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetails(true);
                        }}
                        title="View"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="admin-table-action danger"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Customer Profile</h2>
              <button className="admin-modal-close" onClick={() => setShowDetails(false)}>
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <h3 style={{ marginBottom: '1rem' }}>{selectedCustomer.name}</h3>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Orders:</strong> {selectedCustomer.totalOrders}</p>
              <p><strong>Total Spent:</strong> £{selectedCustomer.totalSpent.toFixed(2)}</p>
              <p><strong>Joined:</strong> {selectedCustomer.joinDate}</p>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn" onClick={() => setShowDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}