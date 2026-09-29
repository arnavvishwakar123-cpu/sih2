// ResourceInventoryView.jsx - Relief Inventory & Critical Stock Alerts
import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Truck, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../api';

export default function ResourceInventoryView({ resources = [], onRefreshData }) {
  const handleUpdateStock = async (resourceId, newStock) => {
    try {
      await api.updateResourceStock(resourceId, Math.max(0, newStock));
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert('Failed to update stock: ' + e.message);
    }
  };

  const criticalItems = resources.filter(r => r.status === 'CRITICAL_LOW' || r.status === 'LOW');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--blue-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={22} color="var(--blue-primary)" />
            Relief Logistics & Critical Inventory Control
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
            Threshold Alerts • Medical Supplies & Oxygen Depot • Supply Depots
          </p>
        </div>

        {criticalItems.length > 0 && (
          <div style={{ padding: '8px 14px', background: 'var(--emergency-red-bg)', border: '1px solid var(--emergency-red-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="var(--emergency-red)" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--emergency-red)' }}>
              {criticalItems.length} CRITICAL STOCK LEVEL WARNINGS
            </span>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Centralized Relief Depot Stock Ledger ({resources.length} Items)
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
            Auto-Flagged at Minimum Safety Buffer
          </span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource Item & Category</th>
                <th>Current Stock</th>
                <th>Minimum Threshold</th>
                <th>Safety Status</th>
                <th>Depot Location</th>
                <th>Responsible Agency</th>
                <th>Quick Restock</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => {
                const isCritical = res.status === 'CRITICAL_LOW';
                const isLow = res.status === 'LOW';

                return (
                  <tr key={res.id} style={{ background: isCritical ? '#FEF2F2' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {res.item}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                        Category: {res.category}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: isCritical ? 'var(--emergency-red)' : 'var(--blue-navy)' }}>
                        {res.stock.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '400' }}>{res.unit}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Buffer: {res.threshold.toLocaleString()} {res.unit}
                      </div>
                    </td>

                    <td>
                      {isCritical ? (
                        <span className="badge badge-critical">
                          CRITICAL STOCK LEVEL
                        </span>
                      ) : isLow ? (
                        <span className="badge badge-warning">
                          LOW BUFFER
                        </span>
                      ) : (
                        <span className="badge badge-safe">
                          SAFE SUPPLY
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: '12px' }}>📍 {res.location}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-light)' }}>
                        {res.responsibleOrg}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleUpdateStock(res.id, res.stock - 20)}
                          style={{ padding: '3px 6px', fontSize: '10px' }}
                          title="Dispatch 20 units"
                        >
                          <Minus size={11} /> 20
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleUpdateStock(res.id, res.stock + 50)}
                          style={{ padding: '3px 6px', fontSize: '10px' }}
                          title="Restock 50 units"
                        >
                          <Plus size={11} /> 50
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
