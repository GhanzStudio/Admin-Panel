import React, { useState } from 'react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeCodeFile, setActiveCodeFile] = useState<'index.html' | 'style.css' | 'app.js'>('index.html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>phpMyAdmin 5.2 - Supabase PostgreSQL Cloud Dashboard</title>
  <!-- Pure Custom CSS phpMyAdmin pmahomme Theme -->
  <link rel="stylesheet" href="style.css">
  <!-- Supabase JS Client CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
</head>
<body>

  <!-- Top Header Bar -->
  <header id="pma-header">
    <div class="pma-header-left">
      <div class="pma-logo">
        <span>🐘</span> Admin Panel
      </div>
      <span class="pma-header-badge" id="pma-conn-badge">DEMO MODE</span>
      <span style="color: #cfd9e8; font-size: 11px;">(Supabase PostgreSQL Cloud)</span>
    </div>
    
    <div class="pma-header-right">
      <div class="pma-user-info">
        <span>👤</span> <span>postgres@supabase-cloud</span>
      </div>
      <button class="pma-header-btn" onclick="switchTab('config')">⚙️ Pengaturan</button>
      <button class="pma-header-btn" onclick="switchTab('guide')">📖 Panduan</button>
      <button class="pma-header-btn" onclick="alert('Static Dashboard')">🚪 Logout</button>
    </div>
  </header>

  <!-- Left Sidebar (Tree View) -->
  <aside id="pma-sidebar">
    <div class="pma-sidebar-toolbar">
      <span><strong>Database Tree</strong></span>
      <button class="pma-btn-page" style="padding: 1px 5px; font-size: 10px;" onclick="renderSidebar()">🔄</button>
    </div>
    <div class="pma-tree-group">
      <div class="pma-db-header">
        <div class="pma-db-title"><span>📂</span><span>public</span></div>
      </div>
      <ul class="pma-table-list" id="pma-sidebar-tables"></ul>
    </div>
    <div class="pma-tree-group">
      <div class="pma-db-header" onclick="switchTab('api')">
        <div class="pma-db-title"><span>🌐</span><span>External REST APIs</span></div>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main id="pma-main">
    <div class="pma-breadcrumb-bar">
      <div class="pma-breadcrumbs" id="pma-breadcrumbs-text">
        <span>Server: Supabase Cloud</span> <span class="pma-sep">&gt;</span>
        <span>Database: <strong>public</strong></span> <span class="pma-sep">&gt;</span>
        <span>Tabel: <strong>users</strong></span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="pma-nav-tabs">
      <button class="pma-tab-button active" data-tab="browse" onclick="switchTab('browse')">📊 Browse</button>
      <button class="pma-tab-button" data-tab="structure" onclick="switchTab('structure')">📄 Structure</button>
      <button class="pma-tab-button" data-tab="sql" onclick="switchTab('sql')">⚡ SQL Console</button>
      <button class="pma-tab-button" data-tab="search" onclick="switchTab('search')">🔍 Search</button>
      <button class="pma-tab-button" data-tab="insert" onclick="switchTab('insert')">➕ Insert</button>
      <button class="pma-tab-button" data-tab="export" onclick="switchTab('export')">💾 Export</button>
      <button class="pma-tab-button" data-tab="api" onclick="switchTab('api')">🌐 External API</button>
      <button class="pma-tab-button" data-tab="config" onclick="switchTab('config')">⚙️ Koneksi Supabase</button>
      <button class="pma-tab-button" data-tab="guide" onclick="switchTab('guide')">📘 Panduan</button>
    </nav>

    <!-- Tab Sections -->
    <section id="tab-content-browse" class="pma-tab-content">
      <div id="pma-browse-container"></div>
    </section>

    <section id="tab-content-structure" class="pma-tab-content" style="display:none;">
      <div id="pma-structure-container"></div>
    </section>

    <section id="tab-content-sql" class="pma-tab-content" style="display:none;">
      <div class="pma-sql-container">
        <h4 style="margin-bottom:8px;">Jalankan SQL Query:</h4>
        <div class="pma-sql-shortcuts">
          <button class="pma-shortcut-btn" onclick="insertSqlSnippet('SELECT')">SELECT *</button>
          <button class="pma-shortcut-btn" onclick="insertSqlSnippet('INSERT')">INSERT</button>
          <button class="pma-shortcut-btn" onclick="insertSqlSnippet('COUNT')">COUNT(*)</button>
        </div>
        <textarea id="sql-query-input" class="pma-sql-textarea"></textarea>
        <div class="pma-sql-action-bar">
          <button class="pma-btn-go" onclick="executeSqlQuery()">Jalankan (Go)</button>
        </div>
      </div>
      <div id="sql-result-container" style="margin-top:15px;"></div>
    </section>

    <section id="tab-content-insert" class="pma-tab-content" style="display:none;">
      <div id="pma-insert-container"></div>
    </section>

    <section id="tab-content-export" class="pma-tab-content" style="display:none;">
      <div id="pma-export-container"></div>
    </section>

    <section id="tab-content-api" class="pma-tab-content" style="display:none;">
      <div class="pma-form-container">
        <h4>🌐 Fetch API Eksternal</h4>
        <div class="pma-api-control-bar" style="margin-top:8px;">
          <select id="external-api-method" class="pma-api-method-select">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <input type="text" id="external-api-url" class="pma-api-url-input" value="https://jsonplaceholder.typicode.com/users">
          <button class="pma-btn-go" onclick="fetchExternalApiData()">Fetch API</button>
        </div>
        <div id="external-api-result" style="margin-top:10px;"></div>
      </div>
    </section>

    <section id="tab-content-config" class="pma-tab-content" style="display:none;">
      <div class="pma-form-container">
        <h4>⚙️ Pengaturan Supabase</h4>
        <table class="pma-form-table">
          <tr><td>Project URL</td><td><input type="text" id="cfg-supabase-url" class="pma-input-text"></td></tr>
          <tr><td>Anon Key</td><td><input type="password" id="cfg-supabase-key" class="pma-input-text"></td></tr>
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
        <span>✏️ Ubah Data</span>
        <button class="pma-modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="pma-modal-body" id="pma-modal-body-content"></div>
    </div>
  </div>

  <script src="app.js"><\/script>
</body>
</html>`;

  const cssCode = `:root {
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
body { background: var(--pma-bg-main); font-family: var(--pma-font-main); font-size: 12px; }

#pma-header {
  position: fixed; top: 0; left: 0; right: 0; height: 40px;
  background: linear-gradient(135deg, var(--pma-header-bg-start), var(--pma-header-bg-end));
  border-bottom: 1px solid var(--pma-header-border);
  display: flex; align-items: center; justify-content: space-between; padding: 0 15px; z-index: 1000;
}
.pma-logo { color: #fff; font-size: 14px; font-weight: bold; }
.pma-header-badge { background: rgba(255,255,255,0.2); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-family: var(--pma-font-mono); }
.pma-header-btn { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 3px 8px; font-size: 11px; cursor: pointer; border-radius: 2px; }

#pma-sidebar {
  position: fixed; top: 40px; left: 0; bottom: 0; width: 250px;
  background-color: var(--pma-bg-sidebar); border-right: 1px solid var(--pma-sidebar-border); overflow-y: auto;
}
.pma-db-header { background-color: var(--pma-sidebar-db-bg); font-weight: bold; padding: 8px; cursor: pointer; border-bottom: 1px solid #d0d0d0; }
.pma-db-header:hover { background-color: var(--pma-sidebar-hover); }
.pma-table-item { background: #fff; padding: 6px 8px 6px 24px; cursor: pointer; display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; }
.pma-table-item:hover { background-color: var(--pma-sidebar-hover); }
.pma-table-item.active { background-color: #ffffcc; font-weight: bold; border-left: 3px solid var(--pma-header-solid); padding-left: 21px; }

#pma-main { margin-left: 250px; margin-top: 40px; padding: 15px; }

.pma-nav-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--pma-tab-border); margin-bottom: 15px; }
.pma-tab-button { background: var(--pma-tab-inactive-bg); border: 1px solid var(--pma-tab-border); border-bottom: none; padding: 6px 14px; font-size: 12px; cursor: pointer; border-radius: 3px 3px 0 0; }
.pma-tab-button.active { background: var(--pma-tab-active-bg); border-bottom: 2px solid var(--pma-tab-active-border); font-weight: bold; }

.pma-table-wrapper { border: 1px solid var(--pma-table-border); background: #fff; overflow-x: auto; }
.pma-data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.pma-data-table th { background-color: var(--pma-th-bg); border: 1px solid var(--pma-th-border); text-align: left; padding: 6px 8px; font-weight: bold; }
.pma-data-table td { padding: 5px 8px; border-bottom: 1px solid var(--pma-td-border); font-family: var(--pma-font-mono); font-size: 11px; }
.pma-data-table tbody tr:nth-child(odd) { background-color: var(--pma-tr-odd); }
.pma-data-table tbody tr:nth-child(even) { background-color: var(--pma-tr-even); }
.pma-data-table tbody tr:hover { background-color: var(--pma-tr-hover) !important; }

.pma-col-check { width: 30px; text-align: center; }
.pma-col-action { width: 80px; text-align: center; }
.pma-action-btn { background: transparent; border: none; cursor: pointer; font-size: 12px; margin: 0 2px; }
.pma-action-btn:hover { color: var(--pma-header-solid); }

.pma-info-bar { background: var(--pma-info-bar-bg); padding: 8px 12px; border: 1px solid var(--pma-table-border); border-top: none; display: flex; justify-content: space-between; font-size: 11px; }
.pma-btn-page { background: var(--pma-btn-secondary); border: 1px solid var(--pma-btn-secondary-border); padding: 3px 8px; font-size: 11px; cursor: pointer; }

.pma-sql-textarea { width: 100%; height: 150px; font-family: var(--pma-font-mono); font-size: 12px; background: #fcfcfc; border: 1px solid #999; padding: 8px; }
.pma-btn-go { background: var(--pma-btn-primary); color: #fff; padding: 5px 15px; border: 1px solid #284c6c; border-radius: 2px; cursor: pointer; font-weight: bold; }
.pma-btn-go:hover { background: var(--pma-btn-primary-hover); }`;

  const jsCode = `// Inisialisasi Supabase JS Client
const SUPABASE_URL = localStorage.getItem("pma_supabase_url") || "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = localStorage.getItem("pma_supabase_anon_key") || "eyJhbGci...";

let supabaseClient = null;
if (typeof supabase !== "undefined" && !SUPABASE_URL.includes("your-project-id")) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Render data dari Supabase / Mock
async function fetchAndRenderTableData() {
  let tableData = [];
  if (supabaseClient) {
    const { data } = await supabaseClient.from(currentTable).select("*");
    tableData = data || [];
  } else {
    tableData = mockDb[currentTable]?.rows || [];
  }
  // Render rows ke <table class="pma-data-table">...
}

// Fetch API Eksternal
async function fetchExternalApiData() {
  const url = document.getElementById("external-api-url").value;
  const res = await fetch(url);
  const data = await res.json();
  // Tampilkan data pada tabel...
}`;

  const currentCode =
    activeCodeFile === 'index.html'
      ? htmlCode
      : activeCodeFile === 'style.css'
      ? cssCode
      : jsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeCodeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pma-modal-overlay">
      <div className="pma-modal-box" style={{ maxWidth: '800px' }}>
        <div className="pma-modal-header">
          <span>📦 Ekspor File Kode Siap Deploy ke GitHub Pages</span>
          <button className="pma-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pma-modal-body">
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <button
              className={`pma-btn-page ${activeCodeFile === 'index.html' ? 'active' : ''}`}
              style={activeCodeFile === 'index.html' ? { backgroundColor: '#40719c', color: '#fff' } : {}}
              onClick={() => setActiveCodeFile('index.html')}
            >
              📄 index.html
            </button>
            <button
              className={`pma-btn-page ${activeCodeFile === 'style.css' ? 'active' : ''}`}
              style={activeCodeFile === 'style.css' ? { backgroundColor: '#40719c', color: '#fff' } : {}}
              onClick={() => setActiveCodeFile('style.css')}
            >
              🎨 style.css
            </button>
            <button
              className={`pma-btn-page ${activeCodeFile === 'app.js' ? 'active' : ''}`}
              style={activeCodeFile === 'app.js' ? { backgroundColor: '#40719c', color: '#fff' } : {}}
              onClick={() => setActiveCodeFile('app.js')}
            >
              ⚡ app.js
            </button>
          </div>

          <pre className="pma-code-box" style={{ height: '320px', overflowY: 'auto' }}>
            {currentCode}
          </pre>
        </div>

        <div className="pma-modal-footer">
          <button className="pma-btn-clear" onClick={onClose}>
            Tutup
          </button>
          <button className="pma-btn-page" onClick={handleDownload}>
            📥 Unduh {activeCodeFile}
          </button>
          <button className="pma-btn-go" onClick={handleCopy}>
            {copied ? '✓ Berhasil Tersalin!' : `📋 Salin ${activeCodeFile}`}
          </button>
        </div>
      </div>
    </div>
  );
};
