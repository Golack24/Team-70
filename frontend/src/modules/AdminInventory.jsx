import React, { useState } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiSearch } from 'react-icons/fi';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Running Shoes Pro - Size 9',
      sku: 'RSP-001-9',
      currentStock: 12,
      minStock: 10,
      maxStock: 50,
      reorderPoint: 15,
      status: 'low',
    },
    {
      id: 2,
      name: 'Athletic Jacket - M',
      sku: 'AJ-002-M',
      currentStock: 28,
      minStock: 5,
      maxStock: 40,
      reorderPoint: 15,
      status: 'normal',
    },
    {
      id: 3,
      name: 'Training Shorts - L',
      sku: 'TS-003-L',
      currentStock: 5,
      minStock: 10,
      maxStock: 30,
      reorderPoint: 15,
      status: 'critical',
    },
    {
      id: 4,
      name: 'Running Shoes Pro - Size 10',
      sku: 'RSP-001-10',
      currentStock: 45,
      minStock: 10,
      maxStock: 50,
      reorderPoint: 15,
      status: 'normal',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const lowStockItems = inventory.filter((item) => item.status !== 'normal');

  const handleUpdateStock = (id, field, value) => {
    const updatedInventory = inventory.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: parseInt(value) };
        if (updated.currentStock === 0) {
          updated.status = 'critical';
        } else if (updated.currentStock <= updated.reorderPoint) {
          updated.status = 'low';
        } else {
          updated.status = 'normal';
        }
        return updated;
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditValues({
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      reorderPoint: item.reorderPoint,
    });
  };

  const handleSaveEdit = (id) => {
    handleUpdateStock(id, 'currentStock', editValues.currentStock);
    handleUpdateStock(id, 'minStock', editValues.minStock);
    handleUpdateStock(id, 'maxStock', editValues.maxStock);
    handleUpdateStock(id, 'reorderPoint', editValues.reorderPoint);
    setEditingId(null);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} below reorder point
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {lowStockItems.map((item) => (
                  <span key={item.id} className="admin-badge admin-badge-warning">
                    {item.sku}
                  </span>
                ))}
              </div>
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
          <button className="admin-btn">
            <FiRefreshCw size={18} /> Reorder
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Min Stock</th>
                <th>Max Stock</th>
                <th>Reorder Point</th>
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
                        value={editValues.currentStock}
                        onChange={(e) =>
                          setEditValues({ ...editValues, currentStock: e.target.value })
                        }
                        style={{ width: '80px', padding: '0.4rem' }}
                      />
                    ) : (
                      item.currentStock
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        className="admin-input"
                        value={editValues.minStock}
                        onChange={(e) =>
                          setEditValues({ ...editValues, minStock: e.target.value })
                        }
                        style={{ width: '80px', padding: '0.4rem' }}
                      />
                    ) : (
                      item.minStock
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        className="admin-input"
                        value={editValues.maxStock}
                        onChange={(e) =>
                          setEditValues({ ...editValues, maxStock: e.target.value })
                        }
                        style={{ width: '80px', padding: '0.4rem' }}
                      />
                    ) : (
                      item.maxStock
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        className="admin-input"
                        value={editValues.reorderPoint}
                        onChange={(e) =>
                          setEditValues({ ...editValues, reorderPoint: e.target.value })
                        }
                        style={{ width: '80px', padding: '0.4rem' }}
                      />
                    ) : (
                      item.reorderPoint
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
                          style={{ color: 'var(--admin-success)' }}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
