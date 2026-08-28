import React from 'react';

export const GuideTab: React.FC = () => {
  return (
    <div id="tab-content-guide" className="pma-tab-content">
      <div className="pma-form-container">
        <h3 style={{ marginBottom: '12px', color: '#182848' }}>
          📘 Panduan Setup Supabase & Hosting ke GitHub Pages
        </h3>

        <div className="pma-alert pma-alert-notice" style={{ marginBottom: '15px' }}>
          <span>
            💡 Dashboard ini dirancang 100% Client-Side murni (HTML, CSS, JS) tanpa backend server
            sehingga dapat di-hosting secara <strong>GRATIS</strong> selamanya di GitHub Pages!
          </span>
        </div>

        {/* Bagian 1: Supabase Setup */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#40719c', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
            1. Persiapan Database di Supabase (PostgreSQL Cloud)
          </h4>
          <ol style={{ marginLeft: '20px', lineHeight: '1.7', fontSize: '11px' }}>
            <li>
              Buka website <a href="https://supabase.com" target="_blank" rel="noreferrer">https://supabase.com</a> dan buat akun baru.
            </li>
            <li>Klik tombol <strong>"New Project"</strong>, beri nama project dan pilih region terdekat (misal: <em>Singapore</em>).</li>
            <li>
              Buka menu <strong>Project Settings &gt; API</strong>:
              <ul style={{ marginLeft: '15px', marginTop: '4px' }}>
                <li>Salin <strong>Project URL</strong> (contoh: <code>https://abcdefgh.supabase.co</code>).</li>
                <li>Salin <strong>Project API keys &gt; anon / public</strong>.</li>
              </ul>
            </li>
            <li>
              Buka menu <strong>SQL Editor</strong> di Supabase, lalu jalankan query contoh untuk membuat tabel:
              <pre className="pma-code-box">
{`-- Contoh Tabel Users
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(50) UNIQUE NOT NULL,
  email varchar(100) NOT NULL,
  role varchar(20) DEFAULT 'editor',
  status varchar(20) DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now()
);

-- Buka izin akses Read/Write untuk Anonymous Client
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.users FOR DELETE USING (true);`}
              </pre>
            </li>
          </ol>
        </div>

        {/* Bagian 2: GitHub Pages Deployment */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#40719c', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
            2. Deployment ke GitHub Pages (Statis)
          </h4>
          <ol style={{ marginLeft: '20px', lineHeight: '1.7', fontSize: '11px' }}>
            <li>
              Klik tombol <strong>"📦 Ekspor Kode GitHub Pages"</strong> di bilah navigasi atas untuk mengunduh atau menyalin file:
              <ul style={{ marginLeft: '15px', fontFamily: 'monospace' }}>
                <li>index.html</li>
                <li>style.css</li>
                <li>app.js</li>
              </ul>
            </li>
            <li>Buat repositori baru di GitHub (contoh nama: <code>admin-dashboard</code>).</li>
            <li>Unggah ketiga file tersebut ke root repositori Anda.</li>
            <li>
              Buka <strong>Settings &gt; Pages</strong> pada repositori GitHub:
              <ul style={{ marginLeft: '15px' }}>
                <li>Pada opsi <em>Source</em>, pilih <strong>Deploy from a branch</strong>.</li>
                <li>Pilih branch <strong>main</strong> (atau <code>master</code>) dan folder <strong>/ (root)</strong>.</li>
                <li>Klik tombol <strong>Save</strong>.</li>
              </ul>
            </li>
            <li>
              Tunggu sekitar 1–2 menit, dashboard phpMyAdmin Anda akan aktif secara langsung di URL:
              <div style={{ fontWeight: 'bold', color: '#0066cc', marginTop: '4px' }}>
                <code>https://&lt;username-github&gt;.github.io/admin-dashboard/</code>
              </div>
            </li>
          </ol>
        </div>

        {/* Bagian 3: Integrasi API Eksternal */}
        <div>
          <h4 style={{ color: '#40719c', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
            3. Integrasi dengan API Eksternal Milik Anda
          </h4>
          <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444' }}>
            Untuk mengambil data dari backend atau website lain milik Anda:
          </p>
          <ul style={{ marginLeft: '20px', lineHeight: '1.7', fontSize: '11px' }}>
            <li>
              Pastikan server API target Anda telah mengaktifkan header <strong>CORS</strong>:
              <code>Access-Control-Allow-Origin: *</code>
            </li>
            <li>
              Gunakan tab <strong>"🌐 External API"</strong> di dashboard ini untuk memanggil endpoint GET atau POST dan data JSON akan otomatis diformat menjadi tabel interaktif.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
