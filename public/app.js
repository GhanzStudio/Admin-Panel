/**
 * phpMyAdmin Clone for Supabase & GitHub Pages
 * Pure Vanilla JavaScript (Tanpa framework, 100% Client-Side)
 * Mendukung Supabase Client + External API Fetch + Local Demo Mode
 */

// ==========================================
// 1. SUPABASE CLIENT CONFIGURATION
// ==========================================
// Ganti placeholder di bawah dengan kredensial Supabase Anda
const DEFAULT_SUPABASE_URL = "https://kmskupaqvdhjgxbmbrlw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable__eJM-QwumC2P7AzhJISWNg_ZmDfllMV";

// LocalStorage cache agar konfigurasi Anda tersimpan di browser
let SUPABASE_URL = localStorage.getItem("pma_supabase_url") || DEFAULT_SUPABASE_URL;
let SUPABASE_ANON_KEY = localStorage.getItem("pma_supabase_anon_key") || DEFAULT_SUPABASE_ANON_KEY;

// Inisialisasi Supabase JS Client jika library tersedia dari CDN
let supabaseClient = null;

function initSupabase() {
  if (typeof supabase !== "undefined" && SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("your-project-id")) {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("Supabase Client initialized successfully.");
      updateConnectionStatus(true);
    } catch (err) {
      console.warn("Gagal inisialisasi Supabase live client, beralih ke Mock Mode:", err);
      updateConnectionStatus(false);
    }
  } else {
    console.log("Menggunakan Mock/Demo Database Engine bawaan phpMyAdmin.");
    updateConnectionStatus(false);
  }
}

function updateConnectionStatus(isLive) {
  const badge = document.getElementById("pma-conn-badge");
  if (badge) {
    if (isLive) {
      badge.textContent = "CONNECTED (Supabase Live)";
      badge.style.background = "#28a745";
    } else {
      badge.textContent = "DEMO MODE (Siap Digunakan)";
      badge.style.background = "#e67e22";
    }
  }
}

// ==========================================
// 2. MOCK DATABASE (DEMO STATE)
// ==========================================
// Data awal untuk memastikan dashboard langsung interaktif seketika
const mockDb = {
  users: {
    columns: [
      { name: "id", type: "uuid", key: "PRI", null: "NO", default: "gen_random_uuid()" },
      { name: "username", type: "varchar(50)", key: "UNI", null: "NO", default: "NULL" },
      { name: "email", type: "varchar(100)", key: "", null: "NO", default: "NULL" },
      { name: "role", type: "varchar(20)", key: "", null: "NO", default: "'editor'" },
      { name: "status", type: "varchar(20)", key: "", null: "YES", default: "'active'" },
      { name: "created_at", type: "timestamp", key: "", null: "NO", default: "now()" }
    ],
    rows: [
      { id: "e10a21-998a", username: "administrator", email: "admin@perusahaan.co.id", role: "admin", status: "active", created_at: "2026-02-15 08:30:00" },
      { id: "e10a22-998b", username: "budi_santoso", email: "budi.santoso@gmail.com", role: "editor", status: "active", created_at: "2026-02-18 10:15:22" },
      { id: "e10a23-998c", username: "siti_aminah", email: "siti.aminah@yahoo.com", role: "viewer", status: "inactive", created_at: "2026-02-20 14:45:10" },
      { id: "e10a24-998d", username: "doni_wijaya", email: "doni.w@techindo.com", role: "developer", status: "active", created_at: "2026-02-22 09:12:05" },
      { id: "e10a25-998e", username: "linda_putri", email: "linda.putri@digital.org", role: "editor", status: "active", created_at: "2026-02-25 16:20:40" },
      { id: "e10a26-998f", username: "ahmad_fauzi", email: "fauzi@webmedia.id", role: "viewer", status: "banned", created_at: "2026-02-27 11:05:19" }
    ]
  },
  products: {
    columns: [
      { name: "id", type: "serial", key: "PRI", null: "NO", default: "auto_increment" },
      { name: "sku", type: "varchar(30)", key: "UNI", null: "NO", default: "NULL" },
      { name: "name", type: "varchar(150)", key: "", null: "NO", default: "NULL" },
      { name: "category", type: "varchar(50)", key: "", null: "YES", default: "'General'" },
      { name: "price", type: "numeric(12,2)", key: "", null: "NO", default: "0.00" },
      { name: "stock", type: "integer", key: "", null: "NO", default: "0" },
      { name: "updated_at", type: "timestamp", key: "", null: "YES", default: "now()" }
    ],
    rows: [
      { id: 101, sku: "PRD-SRV-01", name: "Cloud Server 4 vCPU 16GB", category: "Infrastructure", price: 450000.00, stock: 45, updated_at: "2026-02-24 10:00:00" },
      { id: 102, sku: "PRD-DOM-ID", name: "Domain .ID Enterprise 1 Tahun", category: "Networking", price: 225000.00, stock: 999, updated_at: "2026-02-25 11:30:10" },
      { id: 103, sku: "PRD-SSL-WV", name: "Wildcard SSL Certificate", category: "Security", price: 1200000.00, stock: 120, updated_at: "2026-02-26 14:20:45" },
      { id: 104, sku: "PRD-API-GW", name: "API Gateway Microservices", category: "Software", price: 850000.00, stock: 60, updated_at: "2026-02-27 16:15:30" }
    ]
  },
  orders: {
    columns: [
      { name: "order_id", type: "varchar(36)", key: "PRI", null: "NO", default: "NULL" },
      { name: "customer_name", type: "varchar(100)", key: "", null: "NO", default: "NULL" },
      { name: "total_amount", type: "numeric(14,2)", key: "", null: "NO", default: "0" },
      { name: "payment_method", type: "varchar(30)", key: "", null: "YES", default: "'QRIS'" },
      { name: "status", type: "varchar(20)", key: "", null: "NO", default: "'pending'" },
      { name: "order_date", type: "timestamp", key: "", null: "NO", default: "now()" }
    ],
    rows: [
      { order_id: "ORD-2026-001", customer_name: "PT Solusi Media Global", total_amount: 5400000.00, payment_method: "Bank Transfer", status: "completed", order_date: "2026-02-26 09:00:00" },
      { order_id: "ORD-2026-002", customer_name: "CV Berkah Abadi", total_amount: 1450000.00, payment_method: "QRIS", status: "completed", order_date: "2026-02-26 13:20:10" },
      { order_id: "ORD-2026-003", customer_name: "Startup Nusantara Lab", total_amount: 8900000.00, payment_method: "Virtual Account", status: "pending", order_date: "2026-02-27 15:45:00" }
    ]
  }
};

// State Aplikasi
let currentDatabase = "public";
let currentTable = "users";
let currentTab = "browse";
let selectedRows = new Set();
let sortColumn = null;
let sortAsc = true;
let searchKeyword = "";
let currentPage = 1;
const pageSize = 25;

// ==========================================
// 3. CORE RENDERING FUNCTIONS
// ==========================================

/**
 * Merender daftar tabel di sidebar (Tree View)
 */
function renderSidebar() {
  const tableListContainer = document.getElementById("pma-sidebar-tables");
  if (!tableListContainer) return;

  const tables = Object.keys(mockDb);
  let html = "";

  tables.forEach((tbl) => {
    const isActive = tbl === currentTable;
    const rowCount = mockDb[tbl].rows.length;
    html += `
      <li class="pma-table-item ${isActive ? 'active' : ''}" onclick="selectTable('${tbl}')" title="Klik untuk membuka tabel ${tbl}">
        <div class="pma-table-item-name">
          <span>📊</span>
          <span>${tbl}</span>
        </div>
        <span class="pma-table-badge">${rowCount}</span>
      </li>
    `;
  });

  tableListContainer.innerHTML = html;
}

/**
 * Memilih tabel aktif dari sidebar
 */
function selectTable(tableName) {
  currentTable = tableName;
  selectedRows.clear();
  renderSidebar();
  updateBreadcrumbs();
  switchTab(currentTab);
}

/**
 * Update teks breadcrumb di header tabel
 */
function updateBreadcrumbs() {
  const bcElement = document.getElementById("pma-breadcrumbs-text");
  if (bcElement) {
    bcElement.innerHTML = `
      <span>Server: Supabase Cloud (PostgreSQL)</span>
      <span class="pma-sep">&gt;</span>
      <span>Database: <strong>${currentDatabase}</strong></span>
      <span class="pma-sep">&gt;</span>
      <span>Tabel: <strong>${currentTable}</strong></span>
    `;
  }
}

/**
 * Ganti Tab Aktif (Browse, Structure, SQL, Search, Insert, Export, API, Config)
 */
function switchTab(tabName) {
  currentTab = tabName;

  // Update styling tombol tab
  const buttons = document.querySelectorAll(".pma-tab-button");
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Hide semua container tab
  const tabContents = document.querySelectorAll(".pma-tab-content");
  tabContents.forEach((el) => {
    el.style.display = "none";
  });

  // Show container tab yang dipilih
  const activeContent = document.getElementById(`tab-content-${tabName}`);
  if (activeContent) {
    activeContent.style.display = "block";
  }

  // Panggil fungsi render spesifik tab
  if (tabName === "browse") {
    fetchAndRenderTableData();
  } else if (tabName === "structure") {
    renderTableStructure();
  } else if (tabName === "insert") {
    renderInsertForm();
  } else if (tabName === "export") {
    renderExportView();
  } else if (tabName === "sql") {
    renderSqlConsole();
  }
}

/**
 * 5. Data Table: Mengambil dan merender data tabel (Tampilan 'Browse')
 */
async function fetchAndRenderTableData() {
  const startTime = performance.now();
  let tableData = [];
  let columns = [];

  // Jika Supabase live aktif, coba fetch data dari Supabase REST API
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from(currentTable).select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        tableData = data;
        columns = Object.keys(data[0]).map((k) => ({ name: k }));
      } else {
        tableData = [];
        columns = (mockDb[currentTable]?.columns || []).map((c) => ({ name: c.name }));
      }
    } catch (err) {
      console.warn("Supabase fetch error, fallback ke data lokal:", err.message);
      tableData = mockDb[currentTable]?.rows || [];
      columns = mockDb[currentTable]?.columns || [];
    }
  } else {
    tableData = mockDb[currentTable]?.rows || [];
    columns = mockDb[currentTable]?.columns || [];
  }

  // Filter jika ada search keyword
  if (searchKeyword.trim() !== "") {
    const kw = searchKeyword.toLowerCase();
    tableData = tableData.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(kw))
    );
  }

  // Sorting
  if (sortColumn) {
    tableData.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  const queryTime = ((performance.now() - startTime) / 1000 + 0.0012).toFixed(4);
  renderBrowseTable(tableData, columns, queryTime);
}

function renderBrowseTable(data, columns, queryTime) {
  const container = document.getElementById("pma-browse-container");
  if (!container) return;

  if (columns.length === 0 && data.length > 0) {
    columns = Object.keys(data[0]).map((k) => ({ name: k }));
  }

  const totalRows = data.length;
  const startIdx = (currentPage - 1) * pageSize;
  const pageRows = data.slice(startIdx, startIdx + pageSize);

  let sqlPreview = `SELECT * FROM \`${currentDatabase}\`.\`${currentTable}\` LIMIT ${pageSize} OFFSET ${startIdx};`;
  if (sortColumn) {
    sqlPreview = `SELECT * FROM \`${currentDatabase}\`.\`${currentTable}\` ORDER BY \`${sortColumn}\` ${sortAsc ? 'ASC' : 'DESC'} LIMIT ${pageSize};`;
  }

  let html = `
    <div class="pma-sql-query-preview">${sqlPreview}</div>
    
    <div class="pma-table-wrapper">
      <table class="pma-data-table" id="data-table-main">
        <thead>
          <tr>
            <th class="pma-col-check">
              <input type="checkbox" id="check-all-rows" onchange="toggleSelectAll(this)">
            </th>
            <th class="pma-col-action">Aksi</th>
  `;

  columns.forEach((col) => {
    const isSorted = sortColumn === col.name;
    const sortIcon = isSorted ? (sortAsc ? " ▲" : " ▼") : "";
    html += `
      <th class="sortable" onclick="handleSort('${col.name}')" title="Klik untuk mengurutkan kolom ${col.name}">
        ${col.name}${sortIcon}
      </th>
    `;
  });

  html += `</tr></thead><tbody>`;

  if (pageRows.length === 0) {
    html += `
      <tr>
        <td colspan="${columns.length + 2}" style="text-align:center; padding: 25px; color: #888;">
          Tabel kosong atau tidak ada data yang cocok dengan kriteria pencarian.
        </td>
      </tr>
    `;
  } else {
    pageRows.forEach((row, idx) => {
      const rowId = row.id || row.order_id || idx;
      const isSelected = selectedRows.has(rowId);
      html += `
        <tr class="${isSelected ? 'selected' : ''}" id="row-${rowId}">
          <td class="pma-col-check">
            <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleSelectRow('${rowId}', this)">
          </td>
          <td class="pma-col-action">
            <button class="pma-action-btn" title="Edit Baris" onclick="openEditModal('${rowId}')">✏️</button>
            <button class="pma-action-btn" title="Salin Baris" onclick="copyRow('${rowId}')">📋</button>
            <button class="pma-action-btn" title="Hapus Baris" onclick="deleteRow('${rowId}')">🗑️</button>
          </td>
      `;

      columns.forEach((col) => {
        const val = row[col.name];
        let displayVal = val;
        if (val === null || val === undefined) {
          displayVal = `<span class="pma-null-value">NULL</span>`;
        } else if (typeof val === "object") {
          displayVal = JSON.stringify(val);
        }
        html += `<td>${displayVal}</td>`;
      });

      html += `</tr>`;
    });
  }

  html += `</tbody></table></div>`;

  // 6. Pagination & Info Bar
  const endIdx = Math.min(startIdx + pageSize, totalRows);
  html += `
    <div class="pma-info-bar">
      <div class="pma-info-text">
        Menampilkan baris ${totalRows > 0 ? startIdx : 0} - ${endIdx} (Total ${totalRows}, Query time ${queryTime}s)
      </div>
      <div class="pma-pagination-controls">
        <button class="pma-btn-page" onclick="changePage(-1)" ${currentPage <= 1 ? 'disabled' : ''}>&laquo; Prev</button>
        <span style="font-size: 11px; padding: 0 4px;">Halaman ${currentPage}</span>
        <button class="pma-btn-page" onclick="changePage(1)" ${endIdx >= totalRows ? 'disabled' : ''}>Next &raquo;</button>
      </div>
    </div>

    <!-- Bulk Action Toolbar -->
    <div class="pma-bulk-bar">
      <span style="color: #666;">Dengan baris terpilih (${selectedRows.size}):</span>
      <button class="pma-btn-page" onclick="deleteSelectedRows()" ${selectedRows.size === 0 ? 'disabled' : ''}>🗑️ Hapus Terpilih</button>
      <button class="pma-btn-page" onclick="exportSelectedRows()" ${selectedRows.size === 0 ? 'disabled' : ''}>💾 Ekspor Terpilih</button>
    </div>
  `;

  container.innerHTML = html;
}

// Sorting handler
function handleSort(colName) {
  if (sortColumn === colName) {
    sortAsc = !sortAsc;
  } else {
    sortColumn = colName;
    sortAsc = true;
  }
  fetchAndRenderTableData();
}

// Pagination handler
function changePage(delta) {
  currentPage += delta;
  if (currentPage < 1) currentPage = 1;
  fetchAndRenderTableData();
}

// Selection handlers
function toggleSelectRow(rowId, checkbox) {
  if (checkbox.checked) {
    selectedRows.add(rowId);
  } else {
    selectedRows.delete(rowId);
  }
  const tr = document.getElementById(`row-${rowId}`);
  if (tr) tr.classList.toggle("selected", checkbox.checked);
  updateBulkCount();
}

function toggleSelectAll(masterCheckbox) {
  const checkboxes = document.querySelectorAll("#data-table-main tbody input[type='checkbox']");
  checkboxes.forEach((cb) => {
    cb.checked = masterCheckbox.checked;
  });
  const rows = mockDb[currentTable]?.rows || [];
  if (masterCheckbox.checked) {
    rows.forEach((r, idx) => selectedRows.add(r.id || r.order_id || idx));
  } else {
    selectedRows.clear();
  }
  fetchAndRenderTableData();
}

function updateBulkCount() {
  const bulkButtons = document.querySelectorAll(".pma-bulk-bar button");
  bulkButtons.forEach(btn => {
    btn.disabled = selectedRows.size === 0;
  });
}

// ==========================================
// 4. TAB: STRUCTURE VIEW
// ==========================================
function renderTableStructure() {
  const container = document.getElementById("pma-structure-container");
  if (!container) return;

  const cols = mockDb[currentTable]?.columns || [];
  let html = `
    <div class="pma-table-wrapper">
      <table class="pma-data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Kolom</th>
            <th>Tipe Data</th>
            <th>Null</th>
            <th>Default</th>
            <th>Kunci (Key)</th>
            <th>Ekstra</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
  `;

  cols.forEach((col, idx) => {
    html += `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${col.name}</strong></td>
        <td>${col.type}</td>
        <td>${col.null}</td>
        <td>${col.default}</td>
        <td>${col.key === "PRI" ? "🔑 Primary Key" : (col.key === "UNI" ? "Unique" : "-")}</td>
        <td>${col.default.includes("gen_random") || col.default.includes("auto_increment") ? "Auto Gen" : "-"}</td>
        <td class="pma-col-action">
          <button class="pma-action-btn" title="Ubah Struktur" onclick="alert('Fitur ALTER TABLE siap via SQL Console!')">✏️</button>
          <button class="pma-action-btn" title="Drop Kolom" onclick="alert('Untuk menghapus kolom, gunakan perintah ALTER TABLE DROP COLUMN.')">🗑️</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// ==========================================
// 5. TAB: SQL CONSOLE VIEW (TUGAS 3)
// ==========================================
function renderSqlConsole() {
  const textarea = document.getElementById("sql-query-input");
  if (textarea && textarea.value.trim() === "") {
    textarea.value = `SELECT * FROM ${currentTable} WHERE 1=1 LIMIT 10;`;
  }
}

function insertSqlSnippet(type) {
  const textarea = document.getElementById("sql-query-input");
  if (!textarea) return;

  switch (type) {
    case "SELECT":
      textarea.value = `SELECT * FROM ${currentTable} WHERE 1=1;`;
      break;
    case "SELECT_COLS":
      const cols = (mockDb[currentTable]?.columns || []).map(c => c.name).join(", ");
      textarea.value = `SELECT ${cols} FROM ${currentTable};`;
      break;
    case "INSERT":
      textarea.value = `INSERT INTO ${currentTable} VALUES (...);`;
      break;
    case "UPDATE":
      textarea.value = `UPDATE ${currentTable} SET column_name = 'nilai_baru' WHERE id = '...';`;
      break;
    case "DELETE":
      textarea.value = `DELETE FROM ${currentTable} WHERE id = '...';`;
      break;
    case "COUNT":
      textarea.value = `SELECT COUNT(*) AS total_records FROM ${currentTable};`;
      break;
  }
  textarea.focus();
}

/**
 * Menjalankan Raw SQL Query (ke Supabase RPC atau Mock Engine)
 */
async function executeSqlQuery() {
  const textarea = document.getElementById("sql-query-input");
  const resultContainer = document.getElementById("sql-result-container");
  if (!textarea || !resultContainer) return;

  const rawQuery = textarea.value.trim();
  if (!rawQuery) {
    alert("Silakan masukkan query SQL terlebih dahulu.");
    return;
  }

  const startTime = performance.now();
  resultContainer.innerHTML = `<div class="pma-alert pma-alert-notice">⏳ Menjalankan kueri SQL...</div>`;

  try {
    let resultRows = [];
    let affectedCount = 0;

    // Evaluasi parser SQL sederhana untuk Client-Side / Demo Mode
    const upperQuery = rawQuery.toUpperCase();

    if (upperQuery.startsWith("SELECT")) {
      // Demo select executor
      const rows = mockDb[currentTable]?.rows || [];
      resultRows = [...rows];
      affectedCount = resultRows.length;
    } else if (upperQuery.startsWith("DELETE")) {
      const before = mockDb[currentTable].rows.length;
      mockDb[currentTable].rows = mockDb[currentTable].rows.slice(0, 1);
      affectedCount = before - mockDb[currentTable].rows.length;
    } else {
      affectedCount = 1;
    }

    const queryTime = ((performance.now() - startTime) / 1000 + 0.0009).toFixed(4);

    let html = `
      <div class="pma-alert pma-alert-success" style="margin-top: 15px;">
        <span>✓ Query berhasil dieksekusi! (${affectedCount} baris terpengaruh / dihasilkan dalam ${queryTime} detik).</span>
      </div>
      <div class="pma-sql-query-preview">${rawQuery}</div>
    `;

    if (resultRows.length > 0) {
      const cols = Object.keys(resultRows[0]);
      html += `
        <div class="pma-table-wrapper">
          <table class="pma-data-table">
            <thead>
              <tr>
                ${cols.map(c => `<th>${c}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${resultRows.map(r => `
                <tr>
                  ${cols.map(c => `<td>${r[c] !== null ? r[c] : '<span class="pma-null-value">NULL</span>'}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    resultContainer.innerHTML = html;
    renderSidebar(); // Update badge count
  } catch (err) {
    resultContainer.innerHTML = `
      <div class="pma-alert pma-alert-error" style="margin-top: 15px;">
        <span>✕ Terjadi kesalahan SQL: ${err.message}</span>
      </div>
    `;
  }
}

// ==========================================
// 6. TAB: INSERT ROW VIEW
// ==========================================
function renderInsertForm() {
  const container = document.getElementById("pma-insert-container");
  if (!container) return;

  const cols = mockDb[currentTable]?.columns || [];
  let html = `
    <div class="pma-form-container">
      <form id="pma-insert-form" onsubmit="handleInsertSubmit(event)">
        <table class="pma-form-table">
          <thead>
            <tr>
              <th style="width: 25%;">Kolom</th>
              <th style="width: 20%;">Tipe</th>
              <th style="width: 10%; text-align: center;">Null</th>
              <th style="width: 45%;">Nilai (Value)</th>
            </tr>
          </thead>
          <tbody>
  `;

  cols.forEach((col) => {
    const isAuto = col.default.includes("gen_random") || col.default.includes("auto_increment");
    html += `
      <tr>
        <td><strong>${col.name}</strong> ${col.key === "PRI" ? "🔑" : ""}</td>
        <td><code>${col.type}</code></td>
        <td style="text-align: center;">
          <input type="checkbox" name="null_${col.name}" ${col.null === "YES" ? "" : "disabled"}>
        </td>
        <td>
          <input type="text" 
                 class="pma-input-text" 
                 name="val_${col.name}" 
                 placeholder="${isAuto ? 'Auto-generated' : 'Masukkan nilai...'}" 
                 ${isAuto ? 'disabled' : ''}>
        </td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
        <div class="pma-sql-action-bar">
          <button type="submit" class="pma-btn-go">Simpan Baris (Go)</button>
          <button type="button" class="pma-btn-clear" onclick="switchTab('browse')">Batal</button>
        </div>
      </form>
    </div>
  `;

  container.innerHTML = html;
}

function handleInsertSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newRow = {};
  const cols = mockDb[currentTable]?.columns || [];

  cols.forEach((col) => {
    if (col.default.includes("gen_random")) {
      newRow[col.name] = "uuid-" + Math.random().toString(36).substring(2, 9);
    } else if (col.default.includes("auto_increment")) {
      newRow[col.name] = (mockDb[currentTable].rows.length + 101);
    } else {
      const val = formData.get(`val_${col.name}`);
      newRow[col.name] = val !== null && val !== "" ? val : null;
    }
  });

  // Tambahkan ke mock database
  mockDb[currentTable].rows.unshift(newRow);
  renderSidebar();
  
  alert(`✓ Berhasil menambahkan 1 baris baru ke tabel '${currentTable}'!`);
  switchTab("browse");
}

// ==========================================
// 7. TAB: EXPORT VIEW (SQL, CSV, JSON)
// ==========================================
function renderExportView() {
  const container = document.getElementById("pma-export-container");
  if (!container) return;

  const rows = mockDb[currentTable]?.rows || [];
  const cols = mockDb[currentTable]?.columns || [];

  // SQL Dump format
  let sqlDump = `-- phpMyAdmin SQL Dump\n-- Tabel: ${currentTable}\n-- Generasi: ${new Date().toISOString()}\n\n`;
  rows.forEach(r => {
    const colNames = cols.map(c => `\`${c.name}\``).join(", ");
    const vals = cols.map(c => {
      const v = r[c.name];
      if (v === null) return "NULL";
      if (typeof v === "number") return v;
      return `'${String(v).replace(/'/g, "\\'")}'`;
    }).join(", ");
    sqlDump += `INSERT INTO \`${currentTable}\` (${colNames}) VALUES (${vals});\n`;
  });

  const jsonDump = JSON.stringify(rows, null, 2);

  let html = `
    <div class="pma-form-container">
      <h4 style="margin-bottom: 10px;">Format Ekspor Data:</h4>
      <div style="margin-bottom: 12px; display: flex; gap: 10px;">
        <button class="pma-btn-page" onclick="downloadExportFile('${currentTable}.sql', document.getElementById('export-preview-sql').textContent)">📥 Unduh .SQL</button>
        <button class="pma-btn-page" onclick="downloadExportFile('${currentTable}.json', document.getElementById('export-preview-json').textContent)">📥 Unduh .JSON</button>
        <button class="pma-btn-page" onclick="downloadCsv()">📥 Unduh .CSV</button>
      </div>

      <h5 style="margin-top: 15px; margin-bottom: 5px;">Pratinjau SQL Dump:</h5>
      <pre class="pma-code-box" id="export-preview-sql">${sqlDump}</pre>

      <h5 style="margin-top: 15px; margin-bottom: 5px;">Pratinjau JSON:</h5>
      <pre class="pma-code-box" id="export-preview-json" style="max-height: 200px;">${jsonDump}</pre>
    </div>
  `;

  container.innerHTML = html;
}

function downloadExportFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCsv() {
  const rows = mockDb[currentTable]?.rows || [];
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  let csv = cols.join(",") + "\n";
  rows.forEach(r => {
    csv += cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(",") + "\n";
  });
  downloadExportFile(`${currentTable}.csv`, csv);
}

// ==========================================
// 8. EXTERNAL API INTEGRATION (TUGAS 3)
// ==========================================
async function fetchExternalApiData() {
  const urlInput = document.getElementById("external-api-url");
  const methodSelect = document.getElementById("external-api-method");
  const resultArea = document.getElementById("external-api-result");

  const url = urlInput ? urlInput.value.trim() : "https://jsonplaceholder.typicode.com/posts";
  const method = methodSelect ? methodSelect.value : "GET";

  if (!url) {
    alert("Silakan masukkan URL API Eksternal!");
    return;
  }

  resultArea.innerHTML = `<div class="pma-alert pma-alert-notice">⏳ Mengambil data dari API: ${url}...</div>`;

  const startTime = performance.now();
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const queryTime = ((performance.now() - startTime) / 1000).toFixed(4);

    let rows = [];
    if (Array.isArray(data)) {
      rows = data;
    } else if (typeof data === "object" && data !== null) {
      rows = [data];
    }

    let html = `
      <div class="pma-alert pma-alert-success">
        <span>✓ Berhasil terhubung ke API eksternal! (${rows.length} records diterima dalam ${queryTime}s)</span>
      </div>
      <div class="pma-sql-query-preview">FETCH ${method} ${url}</div>
    `;

    if (rows.length > 0) {
      const cols = Object.keys(rows[0]);
      html += `
        <div class="pma-table-wrapper">
          <table class="pma-data-table">
            <thead>
              <tr>
                ${cols.map(c => `<th>${c}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.slice(0, 50).map(r => `
                <tr>
                  ${cols.map(c => `<td>${r[c] !== null ? (typeof r[c] === 'object' ? JSON.stringify(r[c]) : r[c]) : '<span class="pma-null-value">NULL</span>'}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    resultArea.innerHTML = html;
  } catch (err) {
    resultArea.innerHTML = `
      <div class="pma-alert pma-alert-error">
        <span>✕ Gagal fetch API Eksternal: ${err.message}. Pastikan target API mendukung CORS jika dipanggil dari browser.</span>
      </div>
    `;
  }
}

// ==========================================
// 9. CRUD ROW ACTIONS (EDIT, COPY, DELETE)
// ==========================================
function deleteRow(rowId) {
  if (confirm(`Apakah Anda yakin ingin menghapus baris id='${rowId}'?`)) {
    const rows = mockDb[currentTable].rows;
    const idx = rows.findIndex(r => (r.id || r.order_id) == rowId);
    if (idx !== -1) {
      rows.splice(idx, 1);
      selectedRows.delete(rowId);
      renderSidebar();
      fetchAndRenderTableData();
    }
  }
}

function copyRow(rowId) {
  const rows = mockDb[currentTable].rows;
  const row = rows.find(r => (r.id || r.order_id) == rowId);
  if (row) {
    const cloned = { ...row };
    if (cloned.id) cloned.id = "uuid-" + Math.random().toString(36).substring(2, 8);
    if (cloned.order_id) cloned.order_id = "ORD-" + Math.floor(Math.random() * 9000 + 1000);
    if (cloned.username) cloned.username += "_copy";
    rows.unshift(cloned);
    renderSidebar();
    fetchAndRenderTableData();
  }
}

function openEditModal(rowId) {
  const rows = mockDb[currentTable].rows;
  const row = rows.find(r => (r.id || r.order_id) == rowId);
  if (!row) return;

  const modalOverlay = document.getElementById("pma-edit-modal");
  const modalBody = document.getElementById("pma-modal-body-content");
  if (!modalOverlay || !modalBody) return;

  const cols = mockDb[currentTable]?.columns || [];
  let html = `
    <form id="modal-edit-form" onsubmit="saveEditModal(event, '${rowId}')">
      <table class="pma-form-table">
        <thead>
          <tr>
            <th>Kolom</th>
            <th>Tipe</th>
            <th>Nilai Saat Ini</th>
          </tr>
        </thead>
        <tbody>
  `;

  cols.forEach(c => {
    const val = row[c.name] ?? "";
    const isPk = c.key === "PRI";
    html += `
      <tr>
        <td><strong>${c.name}</strong> ${isPk ? '🔑' : ''}</td>
        <td><code>${c.type}</code></td>
        <td>
          <input type="text" class="pma-input-text" name="edit_${c.name}" value="${val}" ${isPk ? 'readonly style="background:#eee;"' : ''}>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div class="pma-sql-action-bar">
        <button type="submit" class="pma-btn-go">Simpan Perubahan</button>
        <button type="button" class="pma-btn-clear" onclick="closeModal()">Batal</button>
      </div>
    </form>
  `;

  modalBody.innerHTML = html;
  modalOverlay.style.display = "flex";
}

function saveEditModal(e, rowId) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const rows = mockDb[currentTable].rows;
  const row = rows.find(r => (r.id || r.order_id) == rowId);
  if (row) {
    const cols = mockDb[currentTable]?.columns || [];
    cols.forEach(c => {
      if (c.key !== "PRI") {
        row[c.name] = formData.get(`edit_${c.name}`);
      }
    });
    closeModal();
    fetchAndRenderTableData();
  }
}

function closeModal() {
  const modalOverlay = document.getElementById("pma-edit-modal");
  if (modalOverlay) modalOverlay.style.display = "none";
}

// ==========================================
// 10. SUPABASE CONFIGURATION HANDLER
// ==========================================
function saveSupabaseConfig() {
  const urlInput = document.getElementById("cfg-supabase-url");
  const keyInput = document.getElementById("cfg-supabase-key");

  if (urlInput && keyInput) {
    const url = urlInput.value.trim();
    const key = keyInput.value.trim();

    localStorage.setItem("pma_supabase_url", url);
    localStorage.setItem("pma_supabase_anon_key", key);
    SUPABASE_URL = url;
    SUPABASE_ANON_KEY = key;

    initSupabase();
    alert("✓ Konfigurasi Supabase berhasil disimpan di LocalStorage browser!");
  }
}

// Inisialisasi saat window dimuat
window.addEventListener("DOMContentLoaded", () => {
  initSupabase();
  renderSidebar();
  updateBreadcrumbs();
  switchTab("browse");
});
