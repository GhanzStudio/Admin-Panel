import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isConnected: boolean;
  onOpenConfig: () => void;
  onOpenCodeExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isConnected,
  onOpenConfig,
  onOpenCodeExport
}) => {
  return (
    <header id="pma-header">
      <div className="pma-header-left">
        <div className="pma-logo" id="pma-logo-title">
          <span>🐘</span>
          <span>Admin Panel</span>
        </div>
        <span
          className="pma-header-badge"
          id="pma-conn-badge"
          style={{
            backgroundColor: isConnected ? '#28a745' : '#e67e22',
            fontWeight: 'bold'
          }}
        >
          {isConnected ? 'CONNECTED (Supabase Live)' : 'DEMO MODE (Siap Pakai)'}
        </span>
        <span style={{ color: '#cfd9e8', fontSize: '11px' }}>
          (PostgreSQL Cloud - GitHub Pages)
        </span>
      </div>

      <div className="pma-header-right">
        <div className="pma-user-info" id="pma-user-label">
          <span>👤</span>
          <span>postgres@supabase-cloud</span>
        </div>

        <button
          className="pma-header-btn"
          id="btn-code-export"
          onClick={onOpenCodeExport}
          title="Lihat & Salin Kode HTML, CSS, JS untuk GitHub Pages"
        >
          📦 Ekspor Kode GitHub Pages
        </button>

        <button
          className="pma-header-btn"
          id="btn-open-config"
          onClick={onOpenConfig}
          title="Konfigurasi Kredensial Supabase"
        >
          ⚙️ Koneksi Supabase
        </button>

        <button
          className="pma-header-btn"
          id="btn-open-guide"
          onClick={() => setActiveTab('guide')}
          title="Buka Panduan Setup"
        >
          📖 Panduan Deploy
        </button>

        <button
          className="pma-header-btn"
          id="btn-logout"
          onClick={() => {
            alert('Mode static GitHub Pages aktif. Database tetap tersimpan di Supabase.');
          }}
          title="Logout"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
};
