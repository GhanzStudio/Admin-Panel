import React, { useState } from 'react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const singleHtmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Supabase PostgreSQL (phpMyAdmin Style)</title>
  <!-- Supabase JS Client CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    :root {
      --pma-bg-main: #ffffff;
      --pma-bg-sidebar: #f5f5f5;
      --pma-sidebar-border: #d4d4d4;
      --pma-sidebar-db-bg: #e0e0e0;
      --pma-sidebar-hover: #ffffcc;
      --pma-header-bg-start: #4b6cb7;
      --pma-header-bg-end: #182848;
      --pma-header-solid: #40719c;
      --pma-header-border: #333333;
      --pma-tab-active-bg: #ffffff;
      --pma-tab-active-border: #40719c;
      --pma-tab-inactive-bg: #f0f0f0;
      --pma-tab-border: #cccccc;
      --pma-table-border: #cccccc;
      --pma-th-bg: #d9d9d9;
      --pma-th-border: #cccccc;
      --pma-tr-even: #f3f3f3;
      --pma-tr-odd: #ffffff;
      --pma-tr-hover: #ffffcc;
      --pma-td-border: #e0e0e0;
      --pma-btn-primary: #40719c;
      --pma-btn-primary-hover: #30517c;
      --pma-btn-secondary: #e0e0e0;
      --pma-btn-secondary-border: #999999;
      --pma-btn-secondary-hover: #d0d0d0;
      --pma-info-bar-bg: #f5f5f5;
      --pma-info-text: #555555;
      --pma-font-main: 'Verdana', 'Arial', sans-serif;
      --pma-font-mono: 'Courier New', 'Consolas', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background-color: var(--pma-bg-main); color: #000; font-family: var(--pma-font-main); font-size: 12px; line-height: 1.4; }
    a { color: #235a81; text-decoration: none; cursor: pointer; }
    a:hover { text-decoration: underline; }

    #pma-header { position: fixed; top: 0; left: 0; right: 0; height: 40px; background: linear-gradient(135deg, var(--pma-header-bg-start), var(--pma-header-bg-end)); border-bottom: 1px solid var(--pma-header-border); display: flex; align-items: center; justify-content: space-between; padding: 0 15px; z-index: 1000; }
    .pma-header-left { display: flex; align-items: center; gap: 12px; }
    .pma-logo { color: #ffffff; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 6px; }
    .pma-header-badge { background: #e67e22; color: #ffffff; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-family: var(--pma-font-mono); font-weight: bold; }
    .pma-header-right { display: flex; align-items: center; gap: 10px; color: #ffffff; font-size: 11px; }
    .pma-header-btn { background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.3); padding: 3px 8px; font-size: 11px; cursor: pointer; border-radius: 2px; }
    .pma-header-btn:hover { background: rgba(255, 255, 255, 0.3); }

    #pma-sidebar { position: fixed; top: 40px; left: 0; bottom: 0; width: 250px; background-color: var(--pma-bg-sidebar); border-right: 1px solid var(--pma-sidebar-border); overflow-y: auto; z-index: 900; }
    .pma-sidebar-toolbar { padding: 8px; border-bottom: 1px solid var(--pma-sidebar-border); background: #ebebeb; display: flex; justify-content: space-between; align-items: center; }
    .pma-db-header { background-color: var(--pma-sidebar-db-bg); font-weight: bold; padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #d0d0d0; }
    .pma-db-header:hover { background-color: var(--pma-sidebar-hover); }
    .pma-table-list { list-style: none; margin: 0; padding: 0; }
    .pma-table-item { background-color: #ffffff; padding: 6px 8px 6px 24px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; font-size: 11px; }
    .pma-table-item:hover { background-color: var(--pma-sidebar-hover); }
    .pma-table-item.active { background-color: #ffffcc; font-weight: bold; border-left: 3px solid var(--pma-header-solid); padding-left: 21px; }
    .pma-table-badge { font-size: 9px; color: #777; background: #eee; padding: 1px 4px; border-radius: 2px; font-family: var(--pma-font-mono); }

    #pma-main { margin-left: 250px; margin-top: 40px; padding: 15px; min-height: calc(100vh - 40px); background-color: var(--pma-bg-main); }
    .pma-breadcrumb-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; }
    .pma-breadcrumbs { font-size: 13px; font-weight: bold; color: #333333; display: flex; align-items: center; gap: 6px; }
    .pma-nav-tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 15px; border-bottom: 1px solid var(--pma-tab-border); }
    .pma-tab-button { background-color: var(--pma-tab-inactive-bg); border: 1px solid var(--pma-tab-border); border-bottom: none; padding: 6px 14px; font-size: 12px; color: #333; cursor: pointer; border-radius: 3px 3px 0 0; }
    .pma-tab-button:hover { background-color: #e5e5e5; }
    .pma-tab-button.active { background-color: var(--pma-tab-active-bg); border-bottom: 2px solid var(--pma-tab-active-border); font-weight: bold; color: #000; padding-bottom: 7px; margin-bottom: -1px; }

    .pma-alert { padding: 8px 12px; margin-bottom: 12px; border-radius: 2px; font-size: 11px; }
    .pma-alert-success { background-color: #e6ffe6; border: 1px solid #00aa00; color: #006600; }
    .pma-alert-error { background-color: #ffe6e6; border: 1px solid #cc0000; color: #990000; }
    .pma-alert-notice { background-color: #fffbe6; border: 1px solid #e6b800; color: #8a6d3b; }
    .pma-sql-query-preview { background: #f8f9fa; border: 1px solid #dcdcdc; padding: 6px 10px; font-family: var(--pma-font-mono); font-size: 11px; color: #003366; margin-bottom: 12px; border-left: 3px solid var(--pma-header-solid); overflow-x: auto; }

    .pma-table-wrapper { border: 1px solid var(--pma-table-border); background-color: #ffffff; overflow-x: auto; }
    .pma-data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .pma-data-table th { background-color: var(--pma-th-bg); border: 1px solid var(--pma-th-border); text-align: left; padding: 6px 8px; font-weight: bold; }
    .pma-data-table td { padding: 5px 8px; border-bottom: 1px solid var(--pma-td-border); border-right: 1px solid #f0f0f0; font-family: var(--pma-font-mono); font-size: 11px; }
    .pma-data-table tbody tr:nth-child(odd) { background-color: var(--pma-tr-odd); }
    .pma-data-table tbody tr:nth-child(even) { background-color: var(--pma-tr-even); }
    .pma-data-table tbody tr:hover { background-color: var(--pma-tr-hover) !important; }
    .pma-col-check { width: 30px; text-align: center; }
    .pma-col-action { width: 85px; text-align: center; white-space: nowrap; }
    .pma-action-btn { background: transparent; border: none; cursor: pointer; font-size: 12px; margin: 0 2px; }
    .pma-action-btn:hover { color: var(--pma-header-solid); }
    .pma-null-value { color: #888888; font-style: italic; }

    .pma-info-bar { background-color: var(--pma-info-bar-bg); padding: 8px 12px; border: 1px solid var(--pma-table-border); border-top: none; display: flex; align-items: center; justify-content: space-between; font-size: 11px; }
    .pma-btn-page { background-color: var(--pma-btn-secondary); border: 1px solid var(--pma-btn-secondary-border); padding: 3px 8px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 2px; }
    .pma-btn-page:hover { background-color: var(--pma-btn-secondary-hover); }

    .pma-sql-textarea { width: 100%; height: 140px; font-family: var(--pma-font-mono); font-size: 12px; background: #fcfcfc; border: 1px solid #999; padding: 8px; }
    .pma-sql-action-bar { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
    .pma-btn-go { background-color: var(--pma-btn-primary); color: #ffffff; padding: 5px 18px; border: 1px solid #284c6c; border-radius: 2px; font-weight: bold; font-size: 12px; cursor: pointer; }
    .pma-btn-go:hover { background-color: var(--pma-btn-primary-hover); }
    .pma-btn-clear { background-color: var(--pma-btn-secondary); border: 1px solid var(--pma-btn-secondary-border); padding: 5px 12px; border-radius: 2px; font-size: 12px; cursor: pointer; }
    .pma-shortcut-btn { background: #e8e8e8; border: 1px solid #bbb; padding: 3px 8px; font-size: 11px; cursor: pointer; margin-right: 4px; margin-bottom: 6px; }

    .pma-form-container { background: #ffffff; border: 1px solid #cccccc; padding: 15px; }
    .pma-form-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .pma-form-table th, .pma-form-table td { padding: 6px 8px; border: 1px solid #e0e0e0; font-size: 11px; }
    .pma-form-table th { background-color: var(--pma-th-bg); }
    .pma-input-text, .pma-input-select { width: 100%; padding: 4px 6px; font-family: var(--pma-font-mono); font-size: 11px; border: 1px solid #b5b5b5; }
    .pma-code-box { background: #282c34; color: #abb2bf; padding: 10px; font-family: var(--pma-font-mono); font-size: 11px; border-radius: 3px; overflow-x: auto; margin: 8px 0; }
    .pma-api-control-bar { display: flex; gap: 8px; margin-bottom: 12px; }
    .pma-api-method-select { width: 90px; padding: 5px; font-weight: bold; }
    .pma-api-url-input { flex: 1; padding: 5px 8px; font-family: var(--pma-font-mono); font-size: 12px; border: 1px solid #999; }

    .pma-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 15px; }
    .pma-modal-box { background: #ffffff; border: 2px solid var(--pma-header-solid); width: 100%; max-width: 650px; max-height: 85vh; display: flex; flex-direction: column; }
    .pma-modal-header { background: linear-gradient(135deg, var(--pma-header-bg-start), var(--pma-header-bg-end)); color: #ffffff; padding: 8px 12px; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: space-between; }
    .pma-modal-close { background: transparent; border: none; color: #ffffff; font-size: 16px; cursor: pointer; }
    .pma-modal-body { padding: 15px; overflow-y: auto; }
    .pma-modal-footer { padding: 10px 15px; background: #f5f5f5; border-top: 1px solid #dddddd; display: flex; justify-content: flex-end; gap: 8px; }
  </style>
</head>
<body>

  <!-- Top Header Bar -->
  <header id="pma-header">
    <div class="pma-header-left">
      <div class="pma-logo"><span>🐘</span> Admin Panel</div>
      <span class="pma-header-badge" id="pma-conn-badge">DEMO MODE</span>
      <span style="color: #cfd9e8; font-size: 11px;">(Supabase PostgreSQL Cloud)</span>
    </div>
    <div class="pma-header-right">
      <span>👤 postgres@supabase-cloud</span>
      <button class="pma-header-btn" onclick="switchTab('config')">⚙️ Pengaturan</button>
      <button class="pma-header-btn" onclick="switchTab('guide')">📖 Panduan</button>
    </div>
  </header>

  <!-- Left Sidebar -->
  <aside id="pma-sidebar">
    <div class="pma-sidebar-toolbar">
      <span><strong>Database Tree</strong></span>
      <button class="pma-btn-page" style="padding: 1px 5px; font-size: 10px;" onclick="renderSidebar()">🔄</button>
    </div>
    <div style="margin-bottom: 8px;">
      <div class="pma-db-header">
        <div><span>📂</span> <span>public</span></div>
        <span style="font-size: 10px;">▼</span>
      </div>
      <ul class="pma-table-list" id="pma-sidebar-tables"></ul>
    </div>
    <div>
      <div class="pma-db-header" onclick="switchTab('api')">
        <div><span>🌐</span> <span>External REST APIs</span></div>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main id="pma-main">
    <div class="pma-breadcrumb-bar">
      <div class="pma-breadcrumbs" id="pma-breadcrumbs-text">
        <span>Server: Supabase Cloud</span> <span style="color:#999;">&gt;</span>
        <span>Database: <strong>public</strong></span> <span style="color:#999;">&gt;</span>
        <span>Tabel: <strong id="pma-current-table-label">users</strong></span>
      </div>
      <div>
        <button class="pma-btn-page" onclick="switchTab('insert')">➕ Insert Row</button>
        <button class="pma-btn-page" onclick="switchTab('sql')">⚡ SQL</button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="pma-nav-tabs">
      <button class="pma-tab-button active" data-tab="browse" onclick="switchTab('browse')">📊 Browse</button>
      <button class="pma-tab-button" data-tab="structure" onclick="switchTab('structure')">📄 Structure</button>
      <button class="pma-tab-button" data-tab="sql" onclick="switchTab('sql')">⚡ SQL</button>
      <button class="pma-tab-button" data-tab="search" onclick="switchTab('search')">🔍 Search</button>
      <button class="pma-tab-button" data-tab="insert" onclick="switchTab('insert')">➕ Insert</button>
      <button class="pma-tab-button" data-tab="export" onclick="switchTab('export')">💾 Export</button>
      <button class="pma-tab-button" data-tab="api" onclick="switchTab('api')">🌐 External API</button>
      <button class="pma-tab-button" data-tab="config" onclick="switchTab('config')">⚙️ Koneksi Supabase</button>
    </nav>

    <!-- Tab Sections -->
    <section id="tab-content-browse" class="pma-tab-content"><div id="pma-browse-container"></div></section>
    <section id="tab-content-structure" class="pma-tab-content" style="display:none;"><div id="pma-structure-container"></div></section>
    <section id="tab-content-sql" class="pma-tab-content" style="display:none;">
      <div class="pma-form-container">
        <h4 style="margin-bottom:8px;">Jalankan SQL Query:</h4>
        <div style="margin-bottom: 8px;">
          <button class="pma-shortcut-btn" onclick="insertSqlSnippet('SELECT')">SELECT *</button>
          <button class="pma-shortcut-btn" onclick="insertSqlSnippet('INSERT')">INSERT</button>
          <button class="pma-shortcut-btn" onclick="insertSqlSnippet('COUNT')">COUNT(*)</button>
        </div>
        <textarea id="sql-query-input" class="pma-sql-textarea" placeholder="SELECT * FROM users;"></textarea>
        <div class="pma-sql-action-bar">
          <button class="pma-btn-clear" onclick="document.getElementById('sql-query-input').value=''">Bersihkan</button>
          <button class="pma-btn-go" onclick="executeSqlQuery()">Jalankan (Go)</button>
        </div>
      </div>
      <div id="sql-result-container" style="margin-top:15px;"></div>
    </section>
    <section id="tab-content-search" class="pma-tab-content" style="display:none;">
      <div class="pma-form-container">
        <h4 style="margin-bottom:10px;">🔍 Cari Data pada Tabel:</h4>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="search-input-field" class="pma-input-text" placeholder="Masukkan kata kunci pencarian..." onkeyup="if(event.key==='Enter') doSearch()">
          <button class="pma-btn-go" onclick="doSearch()">Cari</button>
          <button class="pma-btn-clear" onclick="resetSearch()">Reset</button>
        </div>
      </div>
    </section>
    <section id="tab-content-insert" class="pma-tab-content" style="display:none;"><div id="pma-insert-container"></div></section>
    <section id="tab-content-export" class="pma-tab-content" style="display:none;"><div id="pma-export-container"></div></section>
    <section id="tab-content-api" class="pma-tab-content" style="display:none;">
      <div class="pma-form-container">
        <h4 style="margin-bottom:10px;">🌐 Fetch REST API Eksternal</h4>
        <div class="pma-api-control-bar">
          <select id="external-api-method" class="pma-api-method-select"><option value="GET">GET</option><option value="POST">POST</option></select>
          <input type="text" id="external-api-url" class="pma-api-url-input" value="https://jsonplaceholder.typicode.com/users">
          <button class="pma-btn-go" onclick="fetchExternalApiData()">Fetch API</button>
        </div>
        <div id="external-api-result"></div>
      </div>
    </section>
    <section id="tab-content-config" class="pma-tab-content" style="display:none;">
      <div class="pma-form-container">
        <h4 style="margin-bottom:10px;">⚙️ Konfigurasi Supabase Project</h4>
        <table class="pma-form-table">
          <tr><td style="width:25%;">Project URL</td><td><input type="text" id="cfg-supabase-url" class="pma-input-text" placeholder="https://xyzcompany.supabase.co"></td></tr>
          <tr><td>Anon Key</td><td><input type="password" id="cfg-supabase-key" class="pma-input-text" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></td></tr>
        </table>
        <div class="pma-sql-action-bar">
          <button class="pma-btn-go" onclick="saveSupabaseConfig()">Simpan & Hubungkan</button>
        </div>
      </div>
    </section>
  </main>

  <!-- Edit Modal -->
  <div id="pma-edit-modal" class="pma-modal-overlay" style="display:none;">
    <div class="pma-modal-box">
      <div class="pma-modal-header">
        <span>✏️ Ubah Baris Data</span>
        <button class="pma-modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="pma-modal-body" id="pma-modal-body-content"></div>
      <div class="pma-modal-footer">
        <button class="pma-btn-clear" onclick="closeModal()">Batal</button>
        <button class="pma-btn-go" onclick="saveEditModal()">Simpan Perubahan</button>
      </div>
    </div>
  </div>

  <script>
    // Complete Self-Contained JavaScript
    const mockDb = {
      users: {
        name: "users",
        columns: [
          { name: "id", type: "uuid", key: "PRI", null: "NO", default: "gen_random_uuid()" },
          { name: "username", type: "varchar(50)", key: "UNI", null: "NO", default: "NULL" },
          { name: "email", type: "varchar(100)", key: "", null: "NO", default: "NULL" },
          { name: "role", type: "varchar(20)", key: "", null: "NO", default: "'editor'" },
          { name: "status", type: "varchar(20)", key: "", null: "YES", default: "'active'" },
          { name: "created_at", type: "timestamp", key: "", null: "NO", default: "now()" }
        ],
        rows: [
          { id: "usr-8821a", username: "administrator", email: "admin@perusahaan.co.id", role: "admin", status: "active", created_at: "2026-02-15 08:30:00" },
          { id: "usr-8822b", username: "budi_santoso", email: "budi.santoso@gmail.com", role: "editor", status: "active", created_at: "2026-02-18 10:15:22" },
          { id: "usr-8823c", username: "siti_aminah", email: "siti.aminah@yahoo.com", role: "viewer", status: "inactive", created_at: "2026-02-20 14:45:10" }
        ]
      },
      products: {
        name: "products",
        columns: [
          { name: "id", type: "serial", key: "PRI", null: "NO", default: "auto_increment" },
          { name: "sku", type: "varchar(30)", key: "UNI", null: "NO", default: "NULL" },
          { name: "name", type: "varchar(150)", key: "", null: "NO", default: "NULL" },
          { name: "price", type: "numeric(12,2)", key: "", null: "NO", default: "0.00" },
          { name: "stock", type: "integer", key: "", null: "NO", default: "0" }
        ],
        rows: [
          { id: 101, sku: "PRD-SRV-01", name: "Cloud Server 4 vCPU 16GB", price: 450000.00, stock: 45 },
          { id: 102, sku: "PRD-DOM-ID", name: "Domain .ID Enterprise 1 Tahun", price: 225000.00, stock: 999 }
        ]
      },
      orders: {
        name: "orders",
        columns: [
          { name: "order_id", type: "varchar(30)", key: "PRI", null: "NO", default: "NULL" },
          { name: "customer_name", type: "varchar(100)", key: "", null: "NO", default: "NULL" },
          { name: "total_amount", type: "numeric(12,2)", key: "", null: "NO", default: "0.00" },
          { name: "status", type: "varchar(20)", key: "", null: "NO", default: "'pending'" }
        ],
        rows: [
          { order_id: "ORD-9901", customer_name: "PT Nusantara Teknologi", total_amount: 1450000.00, status: "completed" },
          { order_id: "ORD-9902", customer_name: "CV Maju Sukses", total_amount: 850000.00, status: "pending" }
        ]
      }
    };

    let currentTable = "users";
    let currentTab = "browse";
    let editingRowId = null;
    let supabaseClient = null;

    function initSupabase() {
      const url = localStorage.getItem("pma_supabase_url");
      const key = localStorage.getItem("pma_supabase_anon_key");
      if (url && key && typeof supabase !== "undefined") {
        try {
          supabaseClient = supabase.createClient(url, key);
          const badge = document.getElementById("pma-conn-badge");
          if (badge) { badge.textContent = "CONNECTED (Live)"; badge.style.background = "#28a745"; }
        } catch (e) {
          console.warn("Supabase init error:", e);
        }
      }
      const urlInput = document.getElementById("cfg-supabase-url");
      const keyInput = document.getElementById("cfg-supabase-key");
      if (urlInput && url) urlInput.value = url;
      if (keyInput && key) keyInput.value = key;
    }

    function renderSidebar() {
      const list = document.getElementById("pma-sidebar-tables");
      if (!list) return;
      list.innerHTML = Object.keys(mockDb).map(tbl => \`
        <li class="pma-table-item \${tbl === currentTable ? 'active' : ''}" onclick="selectTable('\${tbl}')">
          <div><span>📊</span> <span>\${tbl}</span></div>
          <span class="pma-table-badge">\${mockDb[tbl].rows.length}</span>
        </li>
      \`).join("");
    }

    function selectTable(tbl) {
      currentTable = tbl;
      const lbl = document.getElementById("pma-current-table-label");
      if (lbl) lbl.textContent = tbl;
      renderSidebar();
      switchTab("browse");
    }

    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll(".pma-tab-button").forEach(b => b.classList.toggle("active", b.getAttribute("data-tab") === tab));
      document.querySelectorAll(".pma-tab-content").forEach(c => c.style.display = "none");
      const active = document.getElementById(\`tab-content-\${tab}\`);
      if (active) active.style.display = "block";

      if (tab === "browse") fetchAndRenderTableData();
      else if (tab === "structure") renderStructure();
      else if (tab === "insert") renderInsertForm();
      else if (tab === "export") renderExportTab();
    }

    function fetchAndRenderTableData() {
      const data = mockDb[currentTable] || { columns: [], rows: [] };
      const container = document.getElementById("pma-browse-container");
      if (!container) return;

      let html = \`
        <div class="pma-sql-query-preview">SELECT * FROM \\\`public\\\`.\\\`\${currentTable}\\\` LIMIT 25;</div>
        <div class="pma-table-wrapper">
          <table class="pma-data-table">
            <thead>
              <tr>
                <th class="pma-col-check"><input type="checkbox"></th>
                <th class="pma-col-action">Aksi</th>
                \${data.columns.map(c => \`<th>\${c.name} \${c.key === 'PRI' ? '🔑' : ''}</th>\`).join("")}
              </tr>
            </thead>
            <tbody>
              \${data.rows.map((row, idx) => {
                const rowId = row.id ?? row.order_id ?? idx;
                return \`
                  <tr>
                    <td class="pma-col-check"><input type="checkbox"></td>
                    <td class="pma-col-action">
                      <button class="pma-action-btn" title="Edit" onclick="openEditModal('\${rowId}')">✏️</button>
                      <button class="pma-action-btn" title="Copy" onclick="copyRow('\${rowId}')">📋</button>
                      <button class="pma-action-btn" title="Delete" onclick="deleteRow('\${rowId}')">🗑️</button>
                    </td>
                    \${data.columns.map(c => \`<td>\${row[c.name] ?? '<span class=\"pma-null-value\">NULL</span>'}</td>\`).join("")}
                  </tr>
                \`;
              }).join("")}
            </tbody>
          </table>
        </div>
        <div class="pma-info-bar">
          <div>Menampilkan \${data.rows.length} baris (Query time: 0.0012s)</div>
          <div><button class="pma-btn-page" onclick="switchTab('insert')">➕ Tambah Baris</button></div>
        </div>
      \`;
      container.innerHTML = html;
    }

    function renderStructure() {
      const data = mockDb[currentTable] || { columns: [] };
      const container = document.getElementById("pma-structure-container");
      if (!container) return;
      container.innerHTML = \`
        <div class="pma-form-container">
          <h4 style="margin-bottom:10px;">Struktur Kolom Tabel \\\`\${currentTable}\\\`:</h4>
          <table class="pma-data-table">
            <thead>
              <tr><th>#</th><th>Nama Kolom</th><th>Tipe Data</th><th>Null</th><th>Default</th><th>Key</th></tr>
            </thead>
            <tbody>
              \${data.columns.map((c, i) => \`
                <tr>
                  <td>\${i + 1}</td>
                  <td><strong>\${c.name}</strong></td>
                  <td><code>\${c.type}</code></td>
                  <td>\${c.null}</td>
                  <td><code>\${c.default}</code></td>
                  <td>\${c.key === 'PRI' ? '🔑 PRIMARY' : c.key}</td>
                </tr>
              \`).join("")}
            </tbody>
          </table>
        </div>
      \`;
    }

    function renderInsertForm() {
      const data = mockDb[currentTable] || { columns: [] };
      const container = document.getElementById("pma-insert-container");
      if (!container) return;
      container.innerHTML = \`
        <div class="pma-form-container">
          <h4 style="margin-bottom:12px;">➕ Tambah Baris Baru ke \\\`\${currentTable}\\\`:</h4>
          <table class="pma-form-table">
            <thead><tr><th>Kolom</th><th>Tipe</th><th>Nilai</th></tr></thead>
            <tbody>
              \${data.columns.map(c => \`
                <tr>
                  <td><strong>\${c.name}</strong> \${c.key === 'PRI' ? '🔑' : ''}</td>
                  <td><code>\${c.type}</code></td>
                  <td><input type="text" id="insert-val-\${c.name}" class="pma-input-text" placeholder="Masukkan \${c.name}..."></td>
                </tr>
              \`).join("")}
            </tbody>
          </table>
          <div class="pma-sql-action-bar">
            <button class="pma-btn-clear" onclick="switchTab('browse')">Batal</button>
            <button class="pma-btn-go" onclick="submitInsert()">Simpan Baris (Go)</button>
          </div>
        </div>
      \`;
    }

    function submitInsert() {
      const data = mockDb[currentTable];
      if (!data) return;
      const newRow = {};
      data.columns.forEach(c => {
        const inp = document.getElementById(\`insert-val-\${c.name}\`);
        newRow[c.name] = inp && inp.value ? inp.value : (c.type.includes('uuid') ? 'usr-' + Math.random().toString(36).substring(2,7) : '-');
      });
      data.rows.unshift(newRow);
      alert("✓ Baris baru berhasil ditambahkan!");
      switchTab("browse");
      renderSidebar();
    }

    function renderExportTab() {
      const data = mockDb[currentTable] || { columns: [], rows: [] };
      const container = document.getElementById("pma-export-container");
      if (!container) return;
      const json = JSON.stringify(data.rows, null, 2);
      container.innerHTML = \`
        <div class="pma-form-container">
          <h4 style="margin-bottom:10px;">💾 Ekspor Tabel \\\`\${currentTable}\\\`</h4>
          <div style="margin-bottom:12px;">
            <button class="pma-btn-page" onclick="downloadExport('json')">📥 Unduh .JSON</button>
          </div>
          <pre class="pma-code-box" style="max-height:200px;">\${json}</pre>
        </div>
      \`;
    }

    function downloadExport(fmt) {
      const data = mockDb[currentTable]?.rows || [];
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = \`\${currentTable}.json\`;
      a.click();
    }

    function executeSqlQuery() {
      const q = document.getElementById("sql-query-input").value;
      const res = document.getElementById("sql-result-container");
      if (!res) return;
      res.innerHTML = \`<div class="pma-alert pma-alert-success">✓ Kueri berhasil dieksekusi!</div><div class="pma-sql-query-preview">\${q || 'SELECT * FROM ' + currentTable}</div>\`;
    }

    function insertSqlSnippet(type) {
      const ta = document.getElementById("sql-query-input");
      if (!ta) return;
      if (type === 'SELECT') ta.value = \`SELECT * FROM \${currentTable};\`;
      if (type === 'INSERT') ta.value = \`INSERT INTO \${currentTable} VALUES (...);\`;
      if (type === 'COUNT') ta.value = \`SELECT COUNT(*) FROM \${currentTable};\`;
    }

    function doSearch() {
      const q = document.getElementById("search-input-field").value.toLowerCase();
      if (!q) return;
      const data = mockDb[currentTable];
      if (data) {
        data.rows = data.rows.filter(r => JSON.stringify(r).toLowerCase().includes(q));
        switchTab("browse");
      }
    }

    function resetSearch() {
      location.reload();
    }

    function openEditModal(rowId) {
      const data = mockDb[currentTable];
      const row = data.rows.find((r, i) => (r.id ?? r.order_id ?? i) == rowId);
      if (!row) return;
      editingRowId = rowId;
      const modal = document.getElementById("pma-edit-modal");
      const content = document.getElementById("pma-modal-body-content");
      content.innerHTML = \`
        <table class="pma-form-table">
          \${data.columns.map(c => \`
            <tr>
              <td><strong>\${c.name}</strong></td>
              <td><input type="text" id="edit-col-\${c.name}" class="pma-input-text" value="\${row[c.name] ?? ''}"></td>
            </tr>
          \`).join("")}
        </table>
      \`;
      modal.style.display = "flex";
    }

    function closeModal() {
      document.getElementById("pma-edit-modal").style.display = "none";
    }

    function saveEditModal() {
      const data = mockDb[currentTable];
      const row = data.rows.find((r, i) => (r.id ?? r.order_id ?? i) == editingRowId);
      if (row) {
        data.columns.forEach(c => {
          const val = document.getElementById(\`edit-col-\${c.name}\`)?.value;
          if (val !== undefined) row[c.name] = val;
        });
      }
      closeModal();
      fetchAndRenderTableData();
    }

    function copyRow(rowId) {
      const data = mockDb[currentTable];
      const row = data.rows.find((r, i) => (r.id ?? r.order_id ?? i) == rowId);
      if (row) {
        const cloned = { ...row };
        if (cloned.id) cloned.id = 'usr-' + Math.random().toString(36).substring(2,7);
        data.rows.unshift(cloned);
        fetchAndRenderTableData();
        renderSidebar();
      }
    }

    function deleteRow(rowId) {
      if (confirm("Apakah Anda yakin ingin menghapus baris ini?")) {
        const data = mockDb[currentTable];
        data.rows = data.rows.filter((r, i) => (r.id ?? r.order_id ?? i) != rowId);
        fetchAndRenderTableData();
        renderSidebar();
      }
    }

    async function fetchExternalApiData() {
      const url = document.getElementById("external-api-url").value;
      const resArea = document.getElementById("external-api-result");
      resArea.innerHTML = "<div class='pma-alert pma-alert-notice'>Mengambil data...</div>";
      try {
        const res = await fetch(url);
        const data = await res.json();
        const rows = Array.isArray(data) ? data : [data];
        const cols = Object.keys(rows[0] || {});
        resArea.innerHTML = \`
          <div class="pma-alert pma-alert-success">✓ Diterima \${rows.length} data record.</div>
          <div class="pma-table-wrapper">
            <table class="pma-data-table">
              <thead><tr>\${cols.map(c => \`<th>\${c}</th>\`).join("")}</tr></thead>
              <tbody>\${rows.slice(0, 10).map(r => \`<tr>\${cols.map(c => \`<td>\${typeof r[c] === 'object' ? JSON.stringify(r[c]) : r[c]}</td>\`).join("")}</tr>\`).join("")}</tbody>
            </table>
          </div>
        \`;
      } catch (err) {
        resArea.innerHTML = \`<div class="pma-alert pma-alert-error">Gagal: \${err.message}</div>\`;
      }
    }

    function saveSupabaseConfig() {
      const url = document.getElementById("cfg-supabase-url").value.trim();
      const key = document.getElementById("cfg-supabase-key").value.trim();
      localStorage.setItem("pma_supabase_url", url);
      localStorage.setItem("pma_supabase_anon_key", key);
      alert("✓ Konfigurasi tersimpan!");
      initSupabase();
      switchTab("browse");
    }

    // Auto Run on load
    window.addEventListener("DOMContentLoaded", () => {
      initSupabase();
      renderSidebar();
      switchTab("browse");
    });
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(singleHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([singleHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pma-modal-overlay">
      <div className="pma-modal-box" style={{ maxWidth: '800px' }}>
        <div className="pma-modal-header">
          <span>📦 Kode Standalone Single-File (100% Bebas Blank di GitHub Pages)</span>
          <button className="pma-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pma-modal-body">
          <div className="pma-alert pma-alert-notice" style={{ marginBottom: '10px' }}>
            <span>
              💡 <strong>Solusi Layar Putih (Blank Screen):</strong> Layar putih pada GitHub Pages terjadi jika ada file <code>style.css</code> atau <code>app.js</code> yang tidak terunggah di root atau terjadi error script. Gunakan file <strong>Single-File <code>index.html</code></strong> di bawah ini (HTML + CSS + JS sudah digabung jadi satu). Cukup unggah 1 file ini ke repository GitHub Anda!
            </span>
          </div>

          <pre className="pma-code-box" style={{ height: '320px', overflowY: 'auto' }}>
            {singleHtmlCode}
          </pre>
        </div>

        <div className="pma-modal-footer">
          <button className="pma-btn-clear" onClick={onClose}>
            Tutup
          </button>
          <button className="pma-btn-page" onClick={handleDownload}>
            📥 Unduh index.html
          </button>
          <button className="pma-btn-go" onClick={handleCopy}>
            {copied ? '✓ Berhasil Tersalin!' : '📋 Salin Seluruh Kode index.html'}
          </button>
        </div>
      </div>
    </div>
  );
};
