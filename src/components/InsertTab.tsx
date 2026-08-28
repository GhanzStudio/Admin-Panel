import React, { useState } from 'react';
import { TableData } from '../types';

interface InsertTabProps {
  tableData: TableData;
  onInsertRow: (newRow: Record<string, any>) => void;
  onCancel: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({ tableData, onInsertRow, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [nullCheckboxes, setNullCheckboxes] = useState<Record<string, boolean>>({});

  const handleInputChange = (columnName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [columnName]: value
    }));
  };

  const handleNullToggle = (columnName: string, isNull: boolean) => {
    setNullCheckboxes((prev) => ({
      ...prev,
      [columnName]: isNull
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRow: Record<string, any> = {};

    tableData.columns.forEach((col) => {
      const isNull = nullCheckboxes[col.name];
      const isAuto =
        col.default?.includes('gen_random') ||
        col.default?.includes('auto_increment') ||
        col.type.includes('serial');

      if (isAuto && !formData[col.name]) {
        if (col.type.includes('uuid')) {
          finalRow[col.name] = 'usr-' + Math.random().toString(36).substring(2, 8);
        } else {
          finalRow[col.name] = Math.floor(Math.random() * 9000 + 1000);
        }
      } else if (isNull) {
        finalRow[col.name] = null;
      } else if (formData[col.name] !== undefined && formData[col.name] !== '') {
        const val = formData[col.name];
        if (col.type.includes('int') || col.type.includes('numeric')) {
          finalRow[col.name] = isNaN(Number(val)) ? val : Number(val);
        } else {
          finalRow[col.name] = val;
        }
      } else if (col.default && col.default !== 'NULL') {
        finalRow[col.name] = col.default.replace(/'/g, '');
      } else {
        finalRow[col.name] = null;
      }
    });

    onInsertRow(finalRow);
    setFormData({});
  };

  return (
    <div id="tab-content-insert" className="pma-tab-content">
      <div className="pma-form-container">
        <h4 style={{ marginBottom: '12px', color: '#182848' }}>
          ➕ Tambahkan Baris Baru ke Tabel <code>{tableData.name}</code>:
        </h4>

        <form onSubmit={handleSubmit}>
          <table className="pma-form-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Kolom</th>
                <th style={{ width: '20%' }}>Tipe Data</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Null</th>
                <th style={{ width: '45%' }}>Nilai (Value)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.columns.map((col) => {
                const isAuto =
                  col.default?.includes('gen_random') ||
                  col.default?.includes('auto_increment') ||
                  col.type.includes('serial');
                const isNull = nullCheckboxes[col.name] || false;

                return (
                  <tr key={col.name}>
                    <td>
                      <strong>{col.name}</strong>{' '}
                      {col.key === 'PRI' && <span style={{ color: '#d35400' }}>🔑</span>}
                    </td>
                    <td>
                      <code>{col.type}</code>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isNull}
                        disabled={col.null === 'NO' && !isAuto}
                        onChange={(e) => handleNullToggle(col.name, e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="pma-input-text"
                        placeholder={isAuto ? 'Otomatis digenerate sistem' : `Masukkan ${col.name}...`}
                        value={formData[col.name] || ''}
                        disabled={isNull || isAuto}
                        onChange={(e) => handleInputChange(col.name, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pma-sql-action-bar">
            <button type="button" className="pma-btn-clear" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="pma-btn-go" id="btn-submit-insert">
              Simpan Baris (Go)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
