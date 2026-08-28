export type TabType = 
  | 'browse' 
  | 'structure' 
  | 'sql' 
  | 'search' 
  | 'insert' 
  | 'export' 
  | 'api' 
  | 'config' 
  | 'guide';

export interface ColumnDefinition {
  name: string;
  type: string;
  key?: 'PRI' | 'UNI' | 'MUL' | '';
  null?: 'YES' | 'NO';
  default?: string;
  extra?: string;
}

export interface TableData {
  name: string;
  columns: ColumnDefinition[];
  rows: Record<string, any>[];
}

export interface DatabaseSchema {
  [tableName: string]: TableData;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export interface ApiFetchResult {
  status: number;
  statusText: string;
  durationMs: number;
  url: string;
  method: string;
  data: any;
  columns: string[];
  rows: Record<string, any>[];
  error?: string;
}
