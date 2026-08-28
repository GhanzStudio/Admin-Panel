import React, { useState } from 'react';
import { TableData } from '../types';

interface BrowseTabProps {
  tableData: TableData;
  queryTime: string;
  onEditRow: (rowId: any, row: Record<string, any>) => void;
  onCopyRow: (row: Record<string, any>) => void;
  onDeleteRow: (rowId: any) => void;
  onDeleteMultiple: (ids: any[]) => void;
}

export const BrowseTab: React.FC<BrowseTabProps> = ({
  tableData,
  queryTime,
  onEditRow,
  onCopyRow,
  onDeleteRow,
  onDeleteMultiple
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  const columns = tableData.columns || [];
  let rows = [...(tableData.rows || [])];

  // Sorting
  if (sortColumn) {
    rows.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  const totalRows = rows.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = rows.slice(startIndex, startIndex + pageSize);
  const endIndex = Math.min(startIndex + pageSize, totalRows);

  const handleSort = (colName: string) => {
    if (sortColumn === colName) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(colName);
      setSortAsc(true);
    }
  };

  const toggleSelectRow = (id: any) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedRows.map((r, i) => r.id ?? r.order_id ?? r.log_id ?? i);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const sqlQueryPreview = sortColumn
    ? `SELECT * FROM \`public\`.\`${tableData.name}\` ORDER BY \`${sortColumn}\` ${sortAsc ? 'ASC' : 'DESC'} LIMIT ${pageSize} OFFSET ${startIndex};`
    : `SELECT * FROM \`public\`.\`${tableData.name}\` LIMIT ${pageSize} OFFSET ${startIndex};`;

  return (
    <div id="tab-content-browse" className="pma-tab-content">
      {/* SQL Query display */}
      <div className="pma-sql-query-preview" id="browse-sql-preview">
        {sqlQueryPreview}
      </div>

      {/* Main Table Wrapper */}
      <div className="pma-table-wrapper" id="browse-table-wrapper">
        <table className="pma-data-table" id="pma-main-data-table">
          <thead>
            <tr>
              <th className="pma-col-check">
                <input
                  type="checkbox"
                  id="check-all-header"
                  checked={paginatedRows.length > 0 && selectedIds.size >= paginatedRows.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="pma-col-action">Aksi</th>
              {columns.map((col) => {
                const isSorted = sortColumn === col.name;
                return (
                  <th
                    key={col.name}
                    className="sortable"
                    onClick={() => handleSort(col.name)}
                    title={`Urutkan berdasarkan ${col.name}`}
                  >
                    {col.name}
                    {isSorted ? (sortAsc ? ' ▲' : ' ▼') : ''}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  style={{ textAlign: 'center', padding: '30px', color: '#888' }}
                >
                  Tabel <code>{tableData.name}</code> kosong atau belum memiliki baris data.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const rowId = row.id ?? row.order_id ?? row.log_id ?? idx;
                const isSelected = selectedIds.has(rowId);

                return (
                  <tr
                    key={rowId}
                    id={`row-${rowId}`}
                    className={isSelected ? 'selected' : ''}
                  >
                    <td className="pma-col-check">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(rowId)}
                      />
                    </td>
                    <td className="pma-col-action">
                      <button
                        className="pma-action-btn"
                        id={`btn-edit-${rowId}`}
                        title="Edit Baris"
                        onClick={() => onEditRow(rowId, row)}
                      >
                        ✏️
                      </button>
                      <button
                        className="pma-action-btn"
                        id={`btn-copy-${rowId}`}
                        title="Duplikasi Baris"
                        onClick={() => onCopyRow(row)}
                      >
                        📋
                      </button>
                      <button
                        className="pma-action-btn"
                        id={`btn-del-${rowId}`}
                        title="Hapus Baris"
                        onClick={() => onDeleteRow(rowId)}
                      >
                        🗑️
                      </button>
                    </td>
                    {columns.map((col) => {
                      const val = row[col.name];
                      return (
                        <td key={col.name}>
                          {val === null || val === undefined ? (
                            <span className="pma-null-value">NULL</span>
                          ) : typeof val === 'object' ? (
                            JSON.stringify(val)
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 6. Pagination & Info Bar */}
      <div className="pma-info-bar" id="pma-pagination-bar">
        <div className="pma-info-text">
          Menampilkan baris {totalRows > 0 ? startIndex : 0} - {endIndex} (Total {totalRows}, Query time {queryTime}s)
        </div>
        <div className="pma-pagination-controls">
          <button
            className="pma-btn-page"
            id="btn-prev-page"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            « Prev
          </button>
          <span style={{ fontSize: '11px', padding: '0 6px' }}>Halaman {currentPage}</span>
          <button
            className="pma-btn-page"
            id="btn-next-page"
            disabled={endIndex >= totalRows}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next »
          </button>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <div className="pma-bulk-bar">
        <span style={{ color: '#555' }}>
          Dengan baris terpilih (<strong>{selectedIds.size}</strong>):
        </span>
        <button
          className="pma-btn-page"
          disabled={selectedIds.size === 0}
          onClick={() => {
            if (confirm(`Hapus ${selectedIds.size} baris yang dipilih?`)) {
              onDeleteMultiple(Array.from(selectedIds));
              setSelectedIds(new Set());
            }
          }}
        >
          🗑️ Hapus Terpilih
        </button>
        <button
          className="pma-btn-page"
          disabled={selectedIds.size === 0}
          onClick={() => {
            const selectedRowsData = rows.filter((r, i) =>
              selectedIds.has(r.id ?? r.order_id ?? r.log_id ?? i)
            );
            const json = JSON.stringify(selectedRowsData, null, 2);
            navigator.clipboard.writeText(json);
            alert(`✓ ${selectedRowsData.length} baris tersalin ke clipboard (format JSON)!`);
          }}
        >
          📋 Salin Data Terpilih
        </button>
      </div>
    </div>
  );
};
