import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiDownload, FiFilter, FiCalendar } from 'react-icons/fi';

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('month');

  const dataByRange = {
    week: {
      salesData: [
        { date: 'Mon', revenue: 1200, orders: 8, customers: 5 },
        { date: 'Tue', revenue: 1500, orders: 10, customers: 7 },
        { date: 'Wed', revenue: 1800, orders: 12, customers: 8 },
        { date: 'Thu', revenue: 1400, orders: 9, customers: 6 },
        { date: 'Fri', revenue: 2000, orders: 15, customers: 10 },
        { date: 'Sat', revenue: 2200, orders: 18, customers: 12 },
        { date: 'Sun', revenue: 1900, orders: 14, customers: 9 },
      ],
      productSalesData: [
        { name: 'Running Shoes', sales: 120, revenue: 15000 },
        { name: 'Athletic Jacket', sales: 90, revenue: 8100 },
        { name: 'Training Shorts', sales: 80, revenue: 4000 },
        { name: 'Sports Watch', sales: 50, revenue: 5000 },
        { name: 'Gym Bag', sales: 40, revenue: 2000 },
      ],
    },
    month: {
      salesData: [
        { date: 'Mar 1', revenue: 4000, orders: 24, customers: 12 },
        { date: 'Mar 5', revenue: 5200, orders: 32, customers: 18 },
        { date: 'Mar 10', revenue: 4800, orders: 28, customers: 15 },
        { date: 'Mar 15', revenue: 6200, orders: 38, customers: 22 },
        { date: 'Mar 20', revenue: 7100, orders: 45, customers: 28 },
      ],
      productSalesData: [
        { name: 'Running Shoes', sales: 4200, revenue: 540000 },
        { name: 'Athletic Jacket', sales: 3200, revenue: 288000 },
        { name: 'Training Shorts', sales: 2800, revenue: 140000 },
        { name: 'Sports Watch', sales: 1900, revenue: 190000 },
        { name: 'Gym Bag', sales: 1500, revenue: 75000 },
      ],
    },
    quarter: {
      salesData: [
        { date: 'Jan', revenue: 45000, orders: 280, customers: 150 },
        { date: 'Feb', revenue: 52000, orders: 320, customers: 180 },
        { date: 'Mar', revenue: 58000, orders: 360, customers: 200 },
      ],
      productSalesData: [
        { name: 'Running Shoes', sales: 12500, revenue: 1.6e6 },
        { name: 'Athletic Jacket', sales: 9500, revenue: 855000 },
        { name: 'Training Shorts', sales: 8200, revenue: 410000 },
        { name: 'Sports Watch', sales: 5800, revenue: 580000 },
        { name: 'Gym Bag', sales: 4200, revenue: 210000 },
      ],
    },
    year: {
      salesData: [
        { date: 'Jan', revenue: 45000, orders: 280, customers: 150 },
        { date: 'Feb', revenue: 52000, orders: 320, customers: 180 },
        { date: 'Mar', revenue: 58000, orders: 360, customers: 200 },
        { date: 'Apr', revenue: 62000, orders: 380, customers: 220 },
        { date: 'May', revenue: 67000, orders: 410, customers: 240 },
        { date: 'Jun', revenue: 71000, orders: 430, customers: 260 },
        { date: 'Jul', revenue: 75000, orders: 450, customers: 280 },
        { date: 'Aug', revenue: 78000, orders: 470, customers: 300 },
        { date: 'Sep', revenue: 81000, orders: 490, customers: 320 },
        { date: 'Oct', revenue: 84000, orders: 510, customers: 340 },
        { date: 'Nov', revenue: 87000, orders: 530, customers: 360 },
        { date: 'Dec', revenue: 90000, orders: 550, customers: 380 },
      ],
      productSalesData: [
        { name: 'Running Shoes', sales: 50000, revenue: 6.4e6 },
        { name: 'Athletic Jacket', sales: 38000, revenue: 3.42e6 },
        { name: 'Training Shorts', sales: 33000, revenue: 1.65e6 },
        { name: 'Sports Watch', sales: 23000, revenue: 2.3e6 },
        { name: 'Gym Bag', sales: 17000, revenue: 850000 },
      ],
    },
  };

  const currentData = dataByRange[dateRange] || dataByRange.month;

  const analytics = {
    totalRevenue: 24850.75,
    totalOrders: 167,
    avgOrderValue: 148.74,
    conversionRate: '3.2%',
    customerRetention: '68%',
    topProduct: 'Running Shoes Pro',
    topCustomer: 'Jane Smith',
    avgProcessingTime: '2.3 days',
  };

  return (
    <div>
      <div className="admin-dashboard admin-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Revenue</span>
            <span className="admin-stat-value">£{analytics.totalRevenue.toFixed(0)}</span>
            <span className="admin-stat-change positive">↑ 12%</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Orders</span>
            <span className="admin-stat-value">{analytics.totalOrders}</span>
            <span className="admin-stat-change positive">↑ 8%</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Avg Order Value</span>
            <span className="admin-stat-value">£{analytics.avgOrderValue.toFixed(0)}</span>
            <span className="admin-stat-change positive">↑ 5%</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <span className="admin-stat-label">Conversion Rate</span>
            <span className="admin-stat-value">{analytics.conversionRate}</span>
            <span className="admin-stat-change positive">↑ 0.3%</span>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="admin-btn">
            <FiCalendar size={18} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="admin-select"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </button>
          <button className="admin-btn">
            <FiFilter size={18} /> More Filters
          </button>
          <button className="admin-btn" style={{ marginLeft: 'auto' }}>
            <FiDownload size={18} /> Export Report
          </button>
        </div>
      </div>

      <div className="admin-chart-container">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Revenue Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={currentData.salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
            <XAxis dataKey="date" stroke="var(--admin-text-muted)" />
            <YAxis stroke="var(--admin-text-muted)" />
            <Tooltip
              contentStyle={{
                background: 'var(--admin-card)',
                border: `1px solid var(--admin-border)`,
                borderRadius: '8px',
              }}
              cursor={{ stroke: 'var(--admin-accent)' }}
              formatter={(value, name) => name === 'revenue' ? [`£${value}`, 'Revenue'] : [value, name]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--admin-accent)"
              strokeWidth={2}
              dot={{ fill: 'var(--admin-accent)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-chart-container">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Revenue by Product</h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={currentData.productSalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
            <XAxis dataKey="name" stroke="var(--admin-text-muted)" />
            <YAxis stroke="var(--admin-text-muted)" />
            <Tooltip
              contentStyle={{
                background: 'var(--admin-card)',
                border: `1px solid var(--admin-border)`,
                borderRadius: '8px',
              }}
              formatter={(value, name) => name === 'revenue' ? [`£${value}`, 'Revenue'] : [value, name]}
            />
            <Legend />
            <Bar dataKey="revenue" fill="var(--admin-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-dashboard admin-grid-2">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Key Insights</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.25rem',
                }}
              >
                Top Performing Product
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {analytics.topProduct}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--admin-success)',
                  marginTop: '0.25rem',
                }}
              >
                ↑ 23% this month
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.25rem',
                }}
              >
                Top Customer
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {analytics.topCustomer}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--admin-success)',
                  marginTop: '0.25rem',
                }}
              >
                £1,240.75 total spent
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.25rem',
                }}
              >
                Customer Retention Rate
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {analytics.customerRetention}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--admin-success)',
                  marginTop: '0.25rem',
                }}
              >
                ↑ 5% improvement
              </div>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Performance Summary</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Website Traffic</span>
                <span style={{ color: 'var(--admin-accent)' }}>85%</span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '85%',
                    background: 'var(--admin-success)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Conversion Rate Target</span>
                <span style={{ color: 'var(--admin-accent)' }}>64%</span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '64%',
                    background: 'var(--admin-warning)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Customer Satisfaction</span>
                <span style={{ color: 'var(--admin-accent)' }}>92%</span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '92%',
                    background: 'var(--admin-info)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-muted)',
                  marginBottom: '0.25rem',
                }}
              >
                Avg Processing Time
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {analytics.avgProcessingTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
