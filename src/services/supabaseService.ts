import { createClient, SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;
let currentConfig = {
  url: localStorage.getItem('pma_supabase_url') || '',
  anonKey: localStorage.getItem('pma_supabase_anon_key') || ''
};

export function getSupabaseClient(): SupabaseClient | null {
  if (!clientInstance && currentConfig.url && currentConfig.anonKey) {
    try {
      clientInstance = createClient(currentConfig.url, currentConfig.anonKey);
    } catch (e) {
      console.warn('Could not create Supabase client:', e);
      clientInstance = null;
    }
  }
  return clientInstance;
}

export function setSupabaseCredentials(url: string, anonKey: string): boolean {
  try {
    currentConfig.url = url.trim();
    currentConfig.anonKey = anonKey.trim();
    localStorage.setItem('pma_supabase_url', currentConfig.url);
    localStorage.setItem('pma_supabase_anon_key', currentConfig.anonKey);
    
    if (currentConfig.url && currentConfig.anonKey) {
      clientInstance = createClient(currentConfig.url, currentConfig.anonKey);
      return true;
    } else {
      clientInstance = null;
      return false;
    }
  } catch (err) {
    console.error('Failed to set Supabase credentials:', err);
    return false;
  }
}

export function getStoredConfig() {
  return {
    url: localStorage.getItem('pma_supabase_url') || '',
    anonKey: localStorage.getItem('pma_supabase_anon_key') || '',
    isConfigured: Boolean(localStorage.getItem('pma_supabase_url') && localStorage.getItem('pma_supabase_anon_key'))
  };
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string; tables?: string[] }> {
  try {
    const testClient = createClient(url, anonKey);
    // Coba fetch info sederhana atau auth health
    const { error } = await testClient.from('_non_existent_check').select('*').limit(1);
    
    // Jika error kode 404/PGRST204/PGRST200 berarti koneksi URL & Key valid ke Postgres REST API
    if (error && (error.code === 'PGRST204' || error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist'))) {
      return { success: true, message: 'Koneksi ke Supabase REST endpoint berhasil diverifikasi!' };
    }
    
    if (error && error.message.includes('Invalid API key')) {
      return { success: false, message: 'Anon Key tidak valid atau salah format.' };
    }

    return { success: true, message: 'Berhasil terhubung ke Supabase Project.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal terhubung ke host Supabase.' };
  }
}
