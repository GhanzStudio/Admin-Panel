import React from 'react';
import { TableData } from '../types';

interface StructureTabProps {
  tableData: TableData;
  onAddColumnClick: () => void;
}

export const StructureTab: React.FC<StructureTabProps> = ({ tableData, onAddColumnClick }) => {
  const columns = tableData.columns || [];

  return (
    <div id="tab-content-structure" className="pma-tab-content">
      <div className="pma-table-wrapper">
        <table className="pma-data-table" id="structure-data-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>#</th>
              <th>Nama Kolom</th>
              <th>Tipe Data (PostgreSQL)</th>
              <th>Null</th>
              <th>Nilai Bawaan (Default)</th>
              <th>Indeks / Key</th>
              <th>Atribut Ekstra</th>
              <th className="pma-col-action">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, idx) => (
              <tr key={col.name}>
                <td>{idx + 1}</td>
                <td>
                  <strong>{col.name}</strong>
                </td>
                <td>
                  <code>{col.type}</code>
                </td>
                <td>{col.null || 'NO'}</td>
                <td>
                  <code>{col.default || 'NULL'}</code>
                </td>
                <td>
                  {col.key === 'PRI' ? (
                    <span style={{ color: '#d35400', fontWeight: 'bold' }}>🔑 Primary</span>
                  ) : col.key === 'UNI' ? (
                    <span style={{ color: '#2980b9' }}>⚡ Unique</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {col.default?.includes('gen_random') || col.default?.includes('auto_increment')
                    ? 'Auto Generated'
                    : '-'}
                </td>
                <td className="pma-col-action">
                  <button
                    className="pma-action-btn"
                    title="Ubah Struktur Kolom"
                    onClick={() =>
                      alert(`Struktur kolom '${col.name}' dapat dimodifikasi melalui SQL Console dengan perintah ALTER TABLE.`)
                    }
                  >
                    ✏️
                  </button>
                  <button
                    className="pma-action-btn"
                    title="Hapus Kolom (Drop)"
                    onClick={() =>
                      alert(`Untuk menghapus kolom '${col.name}', gunakan: ALTER TABLE ${tableData.name} DROP COLUMN ${col.name};`)
                    }
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '15px' }}>
        <button
          className="pma-btn-go"
          id="btn-add-column"
          onClick={onAddColumnClick}
        >
          ➕ Tambah Kolom Baru (ALTER TABLE)
        </button>
      </div>
    </div>
  );
};
