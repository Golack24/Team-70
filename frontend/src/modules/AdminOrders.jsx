import React, { useState } from 'react';
import { FiFilter, FiSearch, FiEye, FiPrinter } from 'react-icons/fi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: 120.5,
      status: 'completed',
      date: '2026-03-20',
      items: 2,
      paymentMethod: 'Credit Card',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: 250.0,
      status: 'shipped',
      date: '2026-03-19',
      items: 3,
      paymentMethod: 'PayPal',
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      amount: 85.75,
      status: 'pending',
      date: '2026-03-18',
      items: 1,
      paymentMethod: 'Debit Card',
    },
    {
      id: 'ORD-004',
      customer: 'Alice Williams',
      email: 'alice@example.com',
      amount: 340.0,
      status: 'processing',
      date: '2026-03-17',
      items: 4,
      paymentMethod: 'Credit Card',
    },
    {
      id: 'ORD-005',
      customer: 'Charlie Brown',
      email: 'charlie@example.com',
      amount: 95.25,
      status: 'new',
      date: '2026-03-21',
      items: 2,
      paymentMethod: 'Credit Card',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusColors = {
    new: 'admin-badge-info',
    processing: 'admin-badge-warning',
    pending: 'admin-badge-warning',
    shipped: 'admin-badge-accent',
    completed: 'admin-badge-success',
    cancelled: 'admin-badge-danger',
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const orderStats = {
    new: orders.filter((o) => o.status === 'new').length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div>
      <div className="admin-dashboard admin-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">New Orders</span>
            <span className="admin-stat-value">{orderStats.new}</span>
            <span className="admin-stat-change positive">Awaiting action</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Pending/Processing</span>
            <span className="admin-stat-value">{orderStats.pending}</span>
            <span className="admin-stat-change positive">In progress</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Shipped</span>
            <span className="admin-stat-value">{orderStats.shipped}</span>
            <span className="admin-stat-change positive">On the way</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Completed</span>
            <span className="admin-stat-value">{orderStats.completed}</span>
            <span className="admin-stat-change positive">Total</span>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem' }}>
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
              placeholder="Search by order ID, customer, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <select
            className="admin-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Orders</option>
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="admin-btn">
            <FiFilter size={18} /> More Filters
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Orders</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-accent)' }}>
                      {order.id}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{order.customer}</div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--admin-text-muted)',
                          }}
                        >
                          {order.email}
                        </div>
                      </div>
                    </td>
                    <td>£{order.amount.toFixed(2)}</td>
                    <td>{order.items}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="admin-select"
                        style={{
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.85rem',
                          minWidth: 'auto',
                        }}
                      >
                        <option value="new">New</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <button
                        className="admin-table-action"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="admin-table-action"
                        title="Print"
                      >
                        <FiPrinter size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Order Details - {selectedOrder.id}</h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>
                    Customer Name
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.customer}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>
                    Email
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.email}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>
                    Order Date
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>
                    Total Amount
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--admin-accent)' }}>
                    £{selectedOrder.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-muted)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Order Status
                </div>
                <span className={`admin-badge ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
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
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
