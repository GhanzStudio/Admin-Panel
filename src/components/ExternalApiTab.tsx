import React, { useState } from 'react';
import { fetchExternalApi } from '../services/apiService';
import { ApiFetchResult } from '../types';

export const ExternalApiTab: React.FC = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [requestBody, setRequestBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiFetchResult | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetchExternalApi(url.trim(), method, {}, requestBody ? requestBody : undefined);
      setResult(res);
    } catch (err: any) {
      setResult({
        status: 0,
        statusText: 'Error',
        durationMs: 0,
        url,
        method,
        data: null,
        columns: [],
        rows: [],
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tab-content-api" className="pma-tab-content">
      <div className="pma-form-container">
        <h4 style={{ marginBottom: '8px', color: '#182848' }}>
          🌐 Integrasi & Fetch Data API Eksternal (Website Lain)
        </h4>
        <p style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>
          Panggil REST API dari website milik Anda atau layanan pihak ketiga, dan tampilkan data responnya langsung dalam tabel phpMyAdmin.
        </p>

        <div className="pma-api-control-bar">
          <select
            className="pma-api-method-select"
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <input
            type="text"
            className="pma-api-url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.website-saya.com/v1/data"
          />
          <button
            className="pma-btn-go"
            id="btn-fetch-api"
            onClick={handleFetch}
            disabled={loading}
          >
            {loading ? 'Mengambil...' : 'Fetch API (Go)'}
          </button>
        </div>

        {method === 'POST' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Request Body (JSON):</label>
            <textarea
              className="pma-sql-textarea"
              style={{ height: '80px', marginTop: '4px' }}
              placeholder='{"key": "value"}'
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
            />
          </div>
        )}

        <div style={{ fontSize: '11px', color: '#666', marginBottom: '15px' }}>
          Quick Preset Endpoint:
          <button
            type="button"
            className="pma-shortcut-btn"
            style={{ marginLeft: '6px' }}
            onClick={() => {
              setUrl('https://jsonplaceholder.typicode.com/users');
              setMethod('GET');
            }}
          >
            Users API
          </button>
          <button
            type="button"
            className="pma-shortcut-btn"
            style={{ marginLeft: '6px' }}
            onClick={() => {
              setUrl('https://jsonplaceholder.typicode.com/posts');
              setMethod('GET');
            }}
          >
            Posts API
          </button>
          <button
            type="button"
            className="pma-shortcut-btn"
            style={{ marginLeft: '6px' }}
            onClick={() => {
              setUrl('https://dummyjson.com/products?limit=10');
              setMethod('GET');
            }}
          >
            DummyJSON Products
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '15px' }}>
            {result.error ? (
              <div className="pma-alert pma-alert-error">
                <span>✕ Gagal memanggil API: {result.error}</span>
              </div>
            ) : (
              <div className="pma-alert pma-alert-success">
                <span>
                  ✓ Status: <strong>{result.status} {result.statusText}</strong> | Latensi:{' '}
                  {result.durationMs}ms | Diterima: {result.rows.length} baris data.
                </span>
              </div>
            )}

            <div className="pma-sql-query-preview">
              FETCH {result.method} {result.url}
            </div>

            {result.rows.length > 0 && (
              <div className="pma-table-wrapper" style={{ marginTop: '10px' }}>
                <table className="pma-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>#</th>
                      {result.columns.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        {result.columns.map((col) => {
                          const val = row[col];
                          return (
                            <td key={col}>
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
