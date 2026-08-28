import { ApiFetchResult } from '../types';

export async function fetchExternalApi(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  headers: Record<string, string> = {},
  body?: string
): Promise<ApiFetchResult> {
  const startTime = performance.now();
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };

    if (method === 'POST' && body) {
      fetchOptions.body = body;
      (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, fetchOptions);
    const durationMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        durationMs,
        url,
        method,
        data: null,
        columns: [],
        rows: [],
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const json = await response.json();
    let rows: Record<string, any>[] = [];
    let columns: string[] = [];

    if (Array.isArray(json)) {
      rows = json;
    } else if (typeof json === 'object' && json !== null) {
      // Periksa apakah terdapat array di dalam properti seperti `data`, `results`, `posts`, `products`
      const arrayKey = Object.keys(json).find(k => Array.isArray(json[k]));
      if (arrayKey) {
        rows = json[arrayKey];
      } else {
        rows = [json];
      }
    }

    if (rows.length > 0 && typeof rows[0] === 'object') {
      columns = Object.keys(rows[0]);
    }

    return {
      status: response.status,
      statusText: response.statusText,
      durationMs,
      url,
      method,
      data: json,
      columns,
      rows
    };
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - startTime);
    return {
      status: 0,
      statusText: 'Network Error',
      durationMs,
      url,
      method,
      data: null,
      columns: [],
      rows: [],
      error: err.message || 'Gagal memanggil API eksternal. Pastikan target API mengaktifkan CORS.'
    };
  }
}
