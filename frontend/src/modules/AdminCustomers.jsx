import React, { useState } from 'react';
import { FiSearch, FiMail, FiPhone, FiMapPin, FiEye, FiTrash2 } from 'react-icons/fi';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 000-0001',
      location: 'New York, NY',
      joinDate: '2025-06-15',
      totalOrders: 8,
      totalSpent: 850.5,
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 000-0002',
      location: 'Los Angeles, CA',
      joinDate: '2025-08-20',
      totalOrders: 12,
      totalSpent: 1240.75,
      status: 'active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 000-0003',
      location: 'Chicago, IL',
      joinDate: '2025-10-10',
      totalOrders: 3,
      totalSpent: 245.0,
      status: 'active',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '+1 (555) 000-0004',
      location: 'Houston, TX',
      joinDate: '2025-12-05',
      totalOrders: 5,
      totalSpent: 520.25,
      status: 'active',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure? This will remove all customer data.')) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === 'active').length,
    avgOrderValue:
      customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div>
      {/* Customer Statistics */}
      <div className="admin-dashboard admin-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Customers</span>
            <span className="admin-stat-value">{stats.totalCustomers}</span>
            <span className="admin-stat-change positive">+2 this month</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Active Customers</span>
            <span className="admin-stat-value">{stats.activeCustomers}</span>
            <span className="admin-stat-change positive">100% active</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Avg Order Value</span>
            <span className="admin-stat-value">
              £{stats.avgOrderValue.toFixed(0)}
            </span>
            <span className="admin-stat-change positive">Per customer</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Revenue</span>
            <span className="admin-stat-value">
              £{stats.totalRevenue.toFixed(0)}
            </span>
            <span className="admin-stat-change positive">All time</span>
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Customers Table */}
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
                <th>Location</th>
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
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--admin-text-muted)',
                        }}
                      >
                        <FiMail size={14} />
                        {customer.email}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--admin-text-muted)',
                        }}
                      >
                        <FiPhone size={14} />
                        {customer.phone}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--admin-text-muted)',
                        }}
                      >
                        <FiMapPin size={14} />
                        {customer.location}
                      </div>
                    </td>
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
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Customer Profile</h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--admin-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    color: '#000',
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {selectedCustomer.name.charAt(0)}
                </div>

                <h3 style={{ margin: '0 0 0.5rem' }}>{selectedCustomer.name}</h3>
                <span className="admin-badge admin-badge-success">Active</span>
              </div>

              <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Email
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedCustomer.email}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Phone
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedCustomer.phone}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Location
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedCustomer.location}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Member Since
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedCustomer.joinDate}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Total Orders
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedCustomer.totalOrders}</div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Total Spent
                  </div>
                  <div
                    style={{
                      fontWeight: '600',
                      color: 'var(--admin-accent)',
                      fontSize: '1.2rem',
                    }}
                  >
                    £{selectedCustomer.totalSpent.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
              <button className="admin-btn admin-btn-primary">
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
