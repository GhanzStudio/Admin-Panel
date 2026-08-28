import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, setSupabaseCredentials, getStoredConfig } from '../services/supabaseService';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onConfigSaved }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const cfg = getStoredConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setStatusMsg({ success: false, text: 'Silakan isi Project URL dan Anon Key terlebih dahulu.' });
      return;
    }
    setTesting(true);
    setStatusMsg(null);
    const res = await testSupabaseConnection(url.trim(), anonKey.trim());
    setStatusMsg({ success: res.success, text: res.message });
    setTesting(false);
  };

  const handleSave = () => {
    setSupabaseCredentials(url, anonKey);
    onConfigSaved();
    alert('✓ Konfigurasi Supabase berhasil disimpan!');
    onClose();
  };

  const handleUseDemo = () => {
    setSupabaseCredentials('', '');
    setUrl('');
    setAnonKey('');
    onConfigSaved();
    alert('Beralih ke Demo Mode lokal.');
    onClose();
  };

  return (
    <div className="pma-modal-overlay">
      <div className="pma-modal-box" style={{ maxWidth: '600px' }}>
        <div className="pma-modal-header">
          <span>⚙️ Konfigurasi Supabase Cloud Database</span>
          <button className="pma-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pma-modal-body">
          <p style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>
            Hubungkan dashboard statis ini ke proyek PostgreSQL Supabase Anda secara real-time.
          </p>

          <table className="pma-form-table">
            <tbody>
              <tr>
                <td style={{ width: '30%' }}>
                  <strong>Supabase Project URL:</strong>
                </td>
                <td>
                  <input
                    type="text"
                    className="pma-input-text"
                    placeholder="https://xyzabcdefg.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Anon / Public API Key:</strong>
                </td>
                <td>
                  <input
                    type="password"
                    className="pma-input-text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {statusMsg && (
            <div
              className={`pma-alert ${statusMsg.success ? 'pma-alert-success' : 'pma-alert-error'}`}
              style={{ marginTop: '10px' }}
            >
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div style={{ marginTop: '10px', fontSize: '10px', color: '#777' }}>
            * Kredensial hanya disimpan di <code>localStorage</code> browser klien Anda.
          </div>
        </div>

        <div className="pma-modal-footer">
          <button className="pma-btn-clear" onClick={handleUseDemo}>
            Gunakan Demo Mode
          </button>
          <button className="pma-btn-clear" onClick={handleTest} disabled={testing}>
            {testing ? 'Menguji...' : 'Uji Koneksi'}
          </button>
          <button className="pma-btn-go" onClick={handleSave}>
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
};
