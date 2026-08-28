import React, { useState } from 'react';
import { TableData } from '../types';

interface SearchTabProps {
  tableData: TableData;
  onSearch: (column: string, operator: string, value: string) => void;
  onReset: () => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ tableData, onSearch, onReset }) => {
  const [selectedColumn, setSelectedColumn] = useState(tableData.columns[0]?.name || '');
  const [operator, setOperator] = useState('LIKE');
  const [value, setValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedColumn, operator, value);
  };

  return (
    <div id="tab-content-search" className="pma-tab-content">
      <div className="pma-form-container">
        <h4 style={{ marginBottom: '12px' }}>
          🔍 Cari Data pada Tabel <code>{tableData.name}</code>:
        </h4>

        <form onSubmit={handleSearch}>
          <table className="pma-form-table">
            <thead>
              <tr>
                <th>Kolom</th>
                <th>Tipe</th>
                <th>Operator</th>
                <th>Nilai Pencarian</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select
                    className="pma-input-select"
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                  >
                    {tableData.columns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <code>
                    {tableData.columns.find((c) => c.name === selectedColumn)?.type || 'text'}
                  </code>
                </td>
                <td>
                  <select
                    className="pma-input-select"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                  >
                    <option value="LIKE">LIKE %...%</option>
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="IS NULL">IS NULL</option>
                    <option value="IS NOT NULL">IS NOT NULL</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="pma-input-text"
                    placeholder="Masukkan kata kunci..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pma-sql-action-bar">
            <button
              type="button"
              className="pma-btn-clear"
              onClick={() => {
                setValue('');
                onReset();
              }}
            >
              Reset Filter
            </button>
            <button type="submit" className="pma-btn-go" id="btn-submit-search">
              Cari (Go)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
