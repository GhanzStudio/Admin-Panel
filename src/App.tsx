import React, { useState, useEffect } from 'react';
import { DatabaseSchema, TabType } from './types';
import { initialMockDatabase } from './data/mockData';
import { getSupabaseClient, getStoredConfig } from './services/supabaseService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BrowseTab } from './components/BrowseTab';
import { StructureTab } from './components/StructureTab';
import { SqlConsoleTab } from './components/SqlConsoleTab';
import { SearchTab } from './components/SearchTab';
import { InsertTab } from './components/InsertTab';
import { ExportTab } from './components/ExportTab';
import { ExternalApiTab } from './components/ExternalApiTab';
import { GuideTab } from './components/GuideTab';
import { ConfigModal } from './components/ConfigModal';
import { EditRowModal } from './components/EditRowModal';
import { CodeExportModal } from './components/CodeExportModal';

export default function App() {
  const [databaseSchema, setDatabaseSchema] = useState<DatabaseSchema>(initialMockDatabase);
  const [currentTable, setCurrentTable] = useState<string>('users');
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [queryTime, setQueryTime] = useState<string>('0.0012');

  // Modals
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<{ id: any; data: Record<string, any> } | null>(null);

  // Load config on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    const cfg = getStoredConfig();
    setIsConnected(cfg.isConfigured);
    if (cfg.isConfigured) {
      loadSupabaseData(currentTable);
    }
  };

  const loadSupabaseData = async (tableName: string) => {
    const client = getSupabaseClient();
    if (!client) return;

    const start = performance.now();
    try {
      const { data, error } = await client.from(tableName).select('*');
      const duration = ((performance.now() - start) / 1000).toFixed(4);
      setQueryTime(duration);

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        return;
      }

      if (data) {
        setDatabaseSchema((prev) => ({
          ...prev,
          [tableName]: {
            ...prev[tableName],
            rows: data
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    }
  };

  const handleTableChange = (tableName: string) => {
    setCurrentTable(tableName);
    if (isConnected) {
      loadSupabaseData(tableName);
    }
  };

  const currentTableData = databaseSchema[currentTable] || {
    name: currentTable,
    columns: [],
    rows: []
  };

  // CRUD Operations
  const handleEditRow = (rowId: any, row: Record<string, any>) => {
    setEditingRow({ id: rowId, data: row });
  };

  const handleSaveEdit = (rowId: any, updatedRow: Record<string, any>) => {
    setDatabaseSchema((prev) => {
      const currentRows = prev[currentTable]?.rows || [];
      const updated = currentRows.map((r, i) => {
        const id = r.id ?? r.order_id ?? r.log_id ?? i;
        return id === rowId ? { ...r, ...updatedRow } : r;
      });
      return {
        ...prev,
        [currentTable]: {
          ...prev[currentTable],
          rows: updated
        }
      };
    });
  };

  const handleCopyRow = (row: Record<string, any>) => {
    const cloned = { ...row };
    if (cloned.id) cloned.id = 'usr-' + Math.random().toString(36).substring(2, 8);
    if (cloned.order_id) cloned.order_id = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
    if (cloned.log_id) cloned.log_id = Math.floor(Math.random() * 9000 + 5000);
    if (cloned.username) cloned.username += '_salinan';
    if (cloned.name) cloned.name += ' (Copy)';

    setDatabaseSchema((prev) => ({
      ...prev,
      [currentTable]: {
        ...prev[currentTable],
        rows: [cloned, ...(prev[currentTable]?.rows || [])]
      }
    }));
  };

  const handleDeleteRow = (rowId: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus baris id '${rowId}'?`)) {
      setDatabaseSchema((prev) => ({
        ...prev,
        [currentTable]: {
          ...prev[currentTable],
          rows: (prev[currentTable]?.rows || []).filter((r, i) => {
            const id = r.id ?? r.order_id ?? r.log_id ?? i;
            return id !== rowId;
          })
        }
      }));
    }
  };

  const handleDeleteMultiple = (ids: any[]) => {
    const idSet = new Set(ids);
    setDatabaseSchema((prev) => ({
      ...prev,
      [currentTable]: {
        ...prev[currentTable],
        rows: (prev[currentTable]?.rows || []).filter((r, i) => {
          const id = r.id ?? r.order_id ?? r.log_id ?? i;
          return !idSet.has(id);
        })
      }
    }));
  };

  const handleInsertRow = (newRow: Record<string, any>) => {
    setDatabaseSchema((prev) => ({
      ...prev,
      [currentTable]: {
        ...prev[currentTable],
        rows: [newRow, ...(prev[currentTable]?.rows || [])]
      }
    }));
    alert(`✓ Berhasil menambahkan 1 baris baru ke tabel '${currentTable}'!`);
    setActiveTab('browse');
  };

  const handleSearch = (column: string, operator: string, value: string) => {
    const allRows = initialMockDatabase[currentTable]?.rows || [];
    const filtered = allRows.filter((r) => {
      const cellVal = String(r[column] ?? '').toLowerCase();
      const searchVal = value.toLowerCase();
      if (operator === 'LIKE') return cellVal.includes(searchVal);
      if (operator === '=') return cellVal === searchVal;
      if (operator === '!=') return cellVal !== searchVal;
      if (operator === '>') return Number(cellVal) > Number(searchVal);
      if (operator === '<') return Number(cellVal) < Number(searchVal);
      if (operator === 'IS NULL') return r[column] === null || r[column] === undefined;
      if (operator === 'IS NOT NULL') return r[column] !== null && r[column] !== undefined;
      return true;
    });

    setDatabaseSchema((prev) => ({
      ...prev,
      [currentTable]: {
        ...prev[currentTable],
        rows: filtered
      }
    }));
    setActiveTab('browse');
  };

  const handleResetSearch = () => {
    setDatabaseSchema((prev) => ({
      ...prev,
      [currentTable]: {
        ...prev[currentTable],
        rows: initialMockDatabase[currentTable]?.rows || []
      }
    }));
    setActiveTab('browse');
  };

  // Raw SQL Execution handler
  const handleExecuteSql = async (query: string) => {
    const startTime = performance.now();
    const upper = query.toUpperCase();

    // If live Supabase client is available and RPC or table select query is executed:
    const client = getSupabaseClient();
    if (client && upper.startsWith('SELECT')) {
      try {
        const { data, error } = await client.from(currentTable).select('*').limit(50);
        if (!error && data) {
          const duration = Math.round(performance.now() - startTime);
          return {
            success: true,
            rows: data,
            affected: data.length,
            durationMs: duration
          };
        }
      } catch (e) {
        // fallback to mock executor
      }
    }

    // Mock SQL Evaluator
    const duration = Math.round(performance.now() - startTime);
    if (upper.startsWith('SELECT')) {
      return {
        success: true,
        rows: currentTableData.rows,
        affected: currentTableData.rows.length,
        durationMs: duration
      };
    } else if (upper.startsWith('INSERT')) {
      return {
        success: true,
        affected: 1,
        message: '1 baris berhasil ditambahkan.',
        durationMs: duration
      };
    } else if (upper.startsWith('UPDATE')) {
      return {
        success: true,
        affected: currentTableData.rows.length,
        message: `${currentTableData.rows.length} baris berhasil diperbarui.`,
        durationMs: duration
      };
    } else if (upper.startsWith('DELETE')) {
      return {
        success: true,
        affected: 1,
        message: '1 baris berhasil dihapus.',
        durationMs: duration
      };
    } else {
      return {
        success: true,
        affected: 0,
        message: 'Perintah DDL/DML berhasil diproses.',
        durationMs: duration
      };
    }
  };

  const handleAddColumn = () => {
    const colName = prompt('Masukkan nama kolom baru:');
    if (!colName) return;
    const colType = prompt('Masukkan tipe data (e.g. varchar(100), integer, boolean):', 'varchar(100)') || 'varchar(100)';

    setDatabaseSchema((prev) => ({
      ...prev,
      [currentTable]: {
        ...prev[currentTable],
        columns: [
          ...prev[currentTable].columns,
          { name: colName, type: colType, key: '', null: 'YES', default: 'NULL' }
        ]
      }
    }));
    alert(`✓ Kolom '${colName}' (${colType}) berhasil ditambahkan ke tabel '${currentTable}'!`);
  };

  return (
    <div id="pma-root">
      {/* 1. Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
      />

      {/* 2. Left Sidebar (Tree View) */}
      <Sidebar
        databaseSchema={databaseSchema}
        currentTable={currentTable}
        onSelectTable={handleTableChange}
        onRefresh={() => {
          if (isConnected) loadSupabaseData(currentTable);
          else alert('Database view dimuat ulang.');
        }}
        setActiveTab={setActiveTab}
      />

      {/* 3. Main Content Area */}
      <main id="pma-main">
        {/* Breadcrumb Bar */}
        <div className="pma-breadcrumb-bar">
          <div className="pma-breadcrumbs" id="pma-breadcrumbs-text">
            <span>Server: Supabase Cloud (PostgreSQL)</span>
            <span className="pma-sep">&gt;</span>
            <span>Database: <strong>public</strong></span>
            <span className="pma-sep">&gt;</span>
            <span>Tabel: <strong>{currentTable}</strong></span>
          </div>
          <div className="pma-top-actions">
            <button
              className="pma-btn-page"
              onClick={() => setActiveTab('insert')}
              title="Tambah Baris Baru"
            >
              ➕ Insert Row
            </button>
            <button
              className="pma-btn-page"
              onClick={() => setActiveTab('sql')}
              title="Buka SQL Console"
            >
              ⚡ SQL
            </button>
          </div>
        </div>

        {/* 4. Tab Navigation Bar */}
        <nav className="pma-nav-tabs" id="pma-tabs-navbar">
          <button
            className={`pma-tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            📊 Browse
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            📄 Structure
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'sql' ? 'active' : ''}`}
            onClick={() => setActiveTab('sql')}
          >
            ⚡ SQL
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'insert' ? 'active' : ''}`}
            onClick={() => setActiveTab('insert')}
          >
            ➕ Insert
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            💾 Export
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            🌐 External API
          </button>
          <button
            className={`pma-tab-button ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            📘 Panduan GitHub Pages
          </button>
        </nav>

        {/* Active Tab View Rendering */}
        {activeTab === 'browse' && (
          <BrowseTab
            tableData={currentTableData}
            queryTime={queryTime}
            onEditRow={handleEditRow}
            onCopyRow={handleCopyRow}
            onDeleteRow={handleDeleteRow}
            onDeleteMultiple={handleDeleteMultiple}
          />
        )}

        {activeTab === 'structure' && (
          <StructureTab
            tableData={currentTableData}
            onAddColumnClick={handleAddColumn}
          />
        )}

        {activeTab === 'sql' && (
          <SqlConsoleTab
            currentTable={currentTable}
            tableData={currentTableData}
            onExecuteSql={handleExecuteSql}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            tableData={currentTableData}
            onSearch={handleSearch}
            onReset={handleResetSearch}
          />
        )}

        {activeTab === 'insert' && (
          <InsertTab
            tableData={currentTableData}
            onInsertRow={handleInsertRow}
            onCancel={() => setActiveTab('browse')}
          />
        )}

        {activeTab === 'export' && <ExportTab tableData={currentTableData} />}

        {activeTab === 'api' && <ExternalApiTab />}

        {activeTab === 'guide' && <GuideTab />}
      </main>

      {/* Modals */}
      <EditRowModal
        isOpen={Boolean(editingRow)}
        rowId={editingRow?.id}
        row={editingRow?.data || null}
        tableData={currentTableData}
        onClose={() => setEditingRow(null)}
        onSave={handleSaveEdit}
      />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onConfigSaved={checkConnection}
      />

      <CodeExportModal
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
      />
    </div>
  );
}
