import React, { useMemo, useState } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import { updateOrder } from '../api';

export default function AdminOrders({ orders = [], users = [], refreshData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const enrichedOrders = useMemo(() => {
    return orders.map((order) => {
      const user = users.find((u) => Number(u.id) === Number(order.user_id));
      const customerName =
        [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
        user?.username ||
        'Unknown User';

      return {
        ...order,
        customer: customerName,
        email: user?.email || 'N/A',
      };
    });
  }, [orders, users]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      await refreshData?.();
    } catch (err) {
      alert(err.message || 'Failed to update order');
    }
  };

  const filteredOrders = enrichedOrders.filter((order) => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.customer).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.email).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || String(order.status).toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const orderStats = {
    new: enrichedOrders.filter((o) => o.status === 'pending').length,
    pending: enrichedOrders.filter((o) => o.status === 'paid').length,
    shipped: enrichedOrders.filter((o) => o.status === 'shipped').length,
    completed: enrichedOrders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div>
      <div className="admin-dashboard admin-grid-4">
        <div className="admin-stat-card"><div className="admin-stat-content"><span className="admin-stat-label">Pending</span><span className="admin-stat-value">{orderStats.new}</span></div></div>
        <div className="admin-stat-card"><div className="admin-stat-content"><span className="admin-stat-label">Paid</span><span className="admin-stat-value">{orderStats.pending}</span></div></div>
        <div className="admin-stat-card"><div className="admin-stat-content"><span className="admin-stat-label">Shipped</span><span className="admin-stat-value">{orderStats.shipped}</span></div></div>
        <div className="admin-stat-card"><div className="admin-stat-content"><span className="admin-stat-label">Delivered</span><span className="admin-stat-value">{orderStats.completed}</span></div></div>
      </div>

      <div className="admin-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{order.customer}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          {order.email}
                        </div>
                      </div>
                    </td>
                    <td>£{Number(order.total || 0).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="admin-select"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem', minWidth: 'auto' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
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
              <h2 className="admin-modal-title">Order Details - #{selectedOrder.id}</h2>
              <button className="admin-modal-close" onClick={() => setShowDetails(false)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <p><strong>Customer:</strong> {selectedOrder.customer}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Total:</strong> £{Number(selectedOrder.total || 0).toFixed(2)}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
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