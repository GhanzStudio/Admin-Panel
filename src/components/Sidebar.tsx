import React, { useState } from 'react';
import { DatabaseSchema, TabType } from '../types';

interface SidebarProps {
  databaseSchema: DatabaseSchema;
  currentTable: string;
  onSelectTable: (tableName: string) => void;
  onRefresh: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  databaseSchema,
  currentTable,
  onSelectTable,
  onRefresh,
  setActiveTab
}) => {
  const [dbOpen, setDbOpen] = useState(true);
  const [filterText, setFilterText] = useState('');

  const tableNames = Object.keys(databaseSchema).filter((t) =>
    t.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <aside id="pma-sidebar">
      <div className="pma-sidebar-toolbar">
        <span><strong>Database Server Tree</strong></span>
        <button
          className="pma-btn-page"
          style={{ padding: '1px 6px', fontSize: '11px' }}
          onClick={onRefresh}
          title="Muat Ulang Database"
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ padding: '6px 8px' }}>
        <input
          type="text"
          className="pma-sidebar-search"
          placeholder="Filter nama tabel..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Database Node: public */}
      <div className="pma-tree-group">
        <div
          className="pma-db-header"
          id="db-header-public"
          onClick={() => setDbOpen(!dbOpen)}
        >
          <div className="pma-db-title">
            <span>📂</span>
            <span>public</span>
          </div>
          <span style={{ fontSize: '10px' }}>{dbOpen ? '▼' : '►'}</span>
        </div>

        {dbOpen && (
          <ul className="pma-table-list" id="pma-sidebar-tables">
            {tableNames.length === 0 ? (
              <li style={{ padding: '8px 24px', color: '#999', fontSize: '11px' }}>
                Tidak ada tabel ditemukan
              </li>
            ) : (
              tableNames.map((tableName) => {
                const isActive = tableName === currentTable;
                const rowCount = databaseSchema[tableName]?.rows?.length || 0;
                return (
                  <li
                    key={tableName}
                    id={`sidebar-table-${tableName}`}
                    className={`pma-table-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onSelectTable(tableName);
                      setActiveTab('browse');
                    }}
                  >
                    <div className="pma-table-item-name">
                      <span>📊</span>
                      <span>{tableName}</span>
                    </div>
                    <span className="pma-table-badge">{rowCount}</span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {/* External APIs Node */}
      <div className="pma-tree-group">
        <div
          className="pma-db-header"
          id="sidebar-item-api"
          onClick={() => setActiveTab('api')}
          style={{ backgroundColor: '#e9ecef' }}
        >
          <div className="pma-db-title">
            <span>🌐</span>
            <span>External REST APIs</span>
          </div>
          <span className="pma-table-badge" style={{ background: '#3498db', color: '#fff' }}>
            Live
          </span>
        </div>
      </div>
    </aside>
  );
};
