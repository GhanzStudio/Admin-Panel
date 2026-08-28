import React, { useState, useEffect } from 'react';
import { TableData } from '../types';

interface EditRowModalProps {
  isOpen: boolean;
  rowId: any;
  row: Record<string, any> | null;
  tableData: TableData;
  onClose: () => void;
  onSave: (rowId: any, updatedRow: Record<string, any>) => void;
}

export const EditRowModal: React.FC<EditRowModalProps> = ({
  isOpen,
  rowId,
  row,
  tableData,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (row) {
      setFormData({ ...row });
    }
  }, [row]);

  if (!isOpen || !row) return null;

  const handleChange = (colName: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [colName]: val
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rowId, formData);
    onClose();
  };

  return (
    <div className="pma-modal-overlay">
      <div className="pma-modal-box">
        <div className="pma-modal-header">
          <span>✏️ Ubah Baris Data (Tabel: {tableData.name})</span>
          <button className="pma-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pma-modal-body">
            <table className="pma-form-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Kolom</th>
                  <th style={{ width: '20%' }}>Tipe Data</th>
                  <th style={{ width: '55%' }}>Nilai (Value)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.columns.map((c) => {
                  const val = formData[c.name] ?? '';
                  const isPk = c.key === 'PRI';
                  return (
                    <tr key={c.name}>
                      <td>
                        <strong>{c.name}</strong> {isPk && <span style={{ color: '#d35400' }}>🔑</span>}
                      </td>
                      <td>
                        <code>{c.type}</code>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="pma-input-text"
                          value={typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          disabled={isPk}
                          style={isPk ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                          onChange={(e) => handleChange(c.name, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pma-modal-footer">
            <button type="button" className="pma-btn-clear" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="pma-btn-go">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
