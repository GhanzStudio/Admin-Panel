import React from 'react';
import { TableData } from '../types';

interface ExportTabProps {
  tableData: TableData;
}

export const ExportTab: React.FC<ExportTabProps> = ({ tableData }) => {
  const rows = tableData.rows || [];
  const columns = tableData.columns || [];

  // Generate SQL Dump
  let sqlDump = `-- phpMyAdmin SQL Dump\n-- Tabel: ${tableData.name}\n-- Database: public\n-- Waktu Ekspor: ${new Date().toLocaleString('id-ID')}\n\n`;
  sqlDump += `DROP TABLE IF EXISTS \`${tableData.name}\`;\n`;
  sqlDump += `CREATE TABLE \`${tableData.name}\` (\n`;
  sqlDump += columns
    .map(
      (c) =>
        `  \`${c.name}\` ${c.type} ${c.null === 'NO' ? 'NOT NULL' : 'DEFAULT NULL'}${
          c.default && c.default !== 'NULL' ? ` DEFAULT ${c.default}` : ''
        }`
    )
    .join(',\n');
  const pk = columns.find((c) => c.key === 'PRI');
  if (pk) {
    sqlDump += `,\n  PRIMARY KEY (\`${pk.name}\`)`;
  }
  sqlDump += `\n);\n\n-- Dumping data untuk tabel \`${tableData.name}\`\n`;

  rows.forEach((r) => {
    const colList = columns.map((c) => `\`${c.name}\``).join(', ');
    const valList = columns
      .map((c) => {
        const val = r[c.name];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        return `'${String(val).replace(/'/g, "\\'")}'`;
      })
      .join(', ');
    sqlDump += `INSERT INTO \`${tableData.name}\` (${colList}) VALUES (${valList});\n`;
  });

  const jsonDump = JSON.stringify(rows, null, 2);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (rows.length === 0) return;
    const colNames = columns.map((c) => c.name);
    let csv = colNames.join(',') + '\n';
    rows.forEach((r) => {
      csv +=
        colNames
          .map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`)
          .join(',') + '\n';
    });
    downloadFile(`${tableData.name}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  return (
    <div id="tab-content-export" className="pma-tab-content">
      <div className="pma-form-container">
        <h4 style={{ marginBottom: '10px', color: '#182848' }}>
          💾 Ekspor Tabel <code>{tableData.name}</code>:
        </h4>
        <p style={{ fontSize: '11px', color: '#555', marginBottom: '15px' }}>
          Pilih format file ekspor yang diinginkan untuk backup atau migrasi:
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
          <button
            className="pma-btn-page"
            id="btn-dl-sql"
            onClick={() =>
              downloadFile(
                `${tableData.name}.sql`,
                sqlDump,
                'application/sql;charset=utf-8;'
              )
            }
          >
            📥 Unduh .SQL (Dump)
          </button>
          <button
            className="pma-btn-page"
            id="btn-dl-json"
            onClick={() =>
              downloadFile(
                `${tableData.name}.json`,
                jsonDump,
                'application/json;charset=utf-8;'
              )
            }
          >
            📥 Unduh .JSON
          </button>
          <button
            className="pma-btn-page"
            id="btn-dl-csv"
            onClick={handleDownloadCsv}
          >
            📥 Unduh .CSV
          </button>
        </div>

        <h5 style={{ marginTop: '15px', marginBottom: '5px' }}>Pratinjau SQL Dump:</h5>
        <pre className="pma-code-box" style={{ maxHeight: '200px' }}>
          {sqlDump}
        </pre>

        <h5 style={{ marginTop: '15px', marginBottom: '5px' }}>Pratinjau JSON Array:</h5>
        <pre className="pma-code-box" style={{ maxHeight: '180px' }}>
          {jsonDump}
        </pre>
      </div>
    </div>
  );
};
