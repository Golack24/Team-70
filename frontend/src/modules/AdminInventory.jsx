import React, { useMemo, useState } from 'react';
import { FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { updateProduct } from '../../api';

export default function AdminInventory({ products = [], refreshData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');

  const inventory = useMemo(() => {
    return products.map((p) => {
      const stock = Number(p.stock || 0);
      let status = 'normal';
      if (stock === 0) status = 'critical';
      else if (stock < 10) status = 'low';

      return {
        id: p.id,
        sku: `PRD-${String(p.id).padStart(3, '0')}`,
        name: p.name,
        currentStock: stock,
        status,
      };
    });
  }, [products]);

  const lowStockItems = inventory.filter((item) => item.status !== 'normal');

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditStock(item.currentStock);
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateProduct(id, { stock: Number(editStock) });
      setEditingId(null);
      await refreshData?.();
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'admin-badge-danger';
      case 'low':
        return 'admin-badge-warning';
      default:
        return 'admin-badge-success';
    }
  };

  return (
    <div>
      {lowStockItems.length > 0 && (
        <div
          className="admin-panel"
          style={{
            borderLeft: '4px solid var(--admin-danger)',
            background: 'rgba(255, 107, 107, 0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <FiAlertTriangle size={24} color="var(--admin-danger)" style={{ marginTop: '0.25rem' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>Low Stock Alert</h3>
              <p style={{ margin: '0.5rem 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} low in stock
              </p>
            </div>
          </div>
        </div>
      )}

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
            placeholder="Search inventory by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Stock Levels</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        className="admin-input"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        style={{ width: '90px', padding: '0.4rem' }}
                      />
                    ) : (
                      item.currentStock
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <>
                        <button
                          className="admin-table-action"
                          onClick={() => handleSaveEdit(item.id)}
                        >
                          Save
                        </button>
                        <button
                          className="admin-table-action"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="admin-table-action"
                        onClick={() => handleStartEdit(item)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredInventory.length && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No inventory items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}