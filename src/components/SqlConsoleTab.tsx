import React, { useState } from 'react';
import { TableData } from '../types';

interface SqlConsoleTabProps {
  currentTable: string;
  tableData: TableData;
  onExecuteSql: (query: string) => Promise<{ success: boolean; rows?: Record<string, any>[]; affected?: number; message?: string; durationMs?: number }>;
}

export const SqlConsoleTab: React.FC<SqlConsoleTabProps> = ({
  currentTable,
  tableData,
  onExecuteSql
}) => {
  const [query, setQuery] = useState(`SELECT * FROM ${currentTable} WHERE 1=1 LIMIT 25;`);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    rows?: Record<string, any>[];
    affected?: number;
    message?: string;
    durationMs?: number;
  } | null>(null);

  const insertSnippet = (type: string) => {
    const cols = (tableData.columns || []).map((c) => c.name).join(', ');
    switch (type) {
      case 'SELECT':
        setQuery(`SELECT * FROM ${currentTable} WHERE 1=1;`);
        break;
      case 'SELECT_COLS':
        setQuery(`SELECT ${cols} FROM ${currentTable};`);
        break;
      case 'INSERT':
        setQuery(`INSERT INTO ${currentTable} (${cols}) VALUES (...);`);
        break;
      case 'UPDATE':
        setQuery(`UPDATE ${currentTable} SET status = 'active' WHERE id = '...';`);
        break;
      case 'DELETE':
        setQuery(`DELETE FROM ${currentTable} WHERE id = '...';`);
        break;
      case 'COUNT':
        setQuery(`SELECT COUNT(*) AS total_records FROM ${currentTable};`);
        break;
    }
  };

  const handleRun = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await onExecuteSql(query.trim());
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Terjadi kesalahan eksekusi SQL'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="tab-content-sql" className="pma-tab-content">
      <div className="pma-sql-container">
        <h4 style={{ marginBottom: '8px', color: '#182848' }}>
          Jalankan kueri SQL pada database <code>public</code>:
        </h4>

        <div className="pma-sql-shortcuts">
          <button className="pma-shortcut-btn" onClick={() => insertSnippet('SELECT')}>
            SELECT *
          </button>
          <button className="pma-shortcut-btn" onClick={() => insertSnippet('SELECT_COLS')}>
            SELECT Kolom
          </button>
          <button className="pma-shortcut-btn" onClick={() => insertSnippet('INSERT')}>
            INSERT
          </button>
          <button className="pma-shortcut-btn" onClick={() => insertSnippet('UPDATE')}>
            UPDATE
          </button>
          <button className="pma-shortcut-btn" onClick={() => insertSnippet('DELETE')}>
            DELETE
          </button>
          <button className="pma-shortcut-btn" onClick={() => insertSnippet('COUNT')}>
            COUNT(*)
          </button>
        </div>

        <textarea
          id="sql-query-input-main"
          className="pma-sql-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tuliskan query SQL di sini..."
        />

        <div className="pma-sql-action-bar">
          <button
            className="pma-btn-clear"
            onClick={() => setQuery('')}
          >
            Bersihkan
          </button>
          <button
            className="pma-btn-go"
            id="btn-execute-sql"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? 'Menjalankan...' : 'Jalankan (Go)'}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '15px' }}>
          {result.success ? (
            <div className="pma-alert pma-alert-success">
              <span>
                ✓ Kueri berhasil dieksekusi! ({result.affected ?? result.rows?.length ?? 0} baris
                terpengaruh dalam {((result.durationMs || 1) / 1000).toFixed(4)} detik).
              </span>
            </div>
          ) : (
            <div className="pma-alert pma-alert-error">
              <span>✕ Terjadi kesalahan SQL: {result.message}</span>
            </div>
          )}

          <div className="pma-sql-query-preview">{query}</div>

          {result.rows && result.rows.length > 0 && (
            <div className="pma-table-wrapper" style={{ marginTop: '10px' }}>
              <table className="pma-data-table">
                <thead>
                  <tr>
                    {Object.keys(result.rows[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, idx) => (
                    <tr key={idx}>
                      {Object.keys(result.rows![0]).map((col) => (
                        <td key={col}>
                          {row[col] === null || row[col] === undefined ? (
                            <span className="pma-null-value">NULL</span>
                          ) : typeof row[col] === 'object' ? (
                            JSON.stringify(row[col])
                          ) : (
                            String(row[col])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
