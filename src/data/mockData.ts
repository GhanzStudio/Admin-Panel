import { DatabaseSchema } from '../types';

export const initialMockDatabase: DatabaseSchema = {
  users: {
    name: 'users',
    columns: [
      { name: 'id', type: 'uuid', key: 'PRI', null: 'NO', default: 'gen_random_uuid()' },
      { name: 'username', type: 'varchar(50)', key: 'UNI', null: 'NO', default: 'NULL' },
      { name: 'email', type: 'varchar(100)', key: '', null: 'NO', default: 'NULL' },
      { name: 'role', type: 'varchar(20)', key: '', null: 'NO', default: "'editor'" },
      { name: 'status', type: 'varchar(20)', key: '', null: 'YES', default: "'active'" },
      { name: 'created_at', type: 'timestamp', key: '', null: 'NO', default: 'now()' }
    ],
    rows: [
      { id: 'usr-901a-8812', username: 'admin_utama', email: 'admin@perusahaan.co.id', role: 'admin', status: 'active', created_at: '2026-02-15 08:30:00' },
      { id: 'usr-902b-8813', username: 'budi_santoso', email: 'budi.santoso@gmail.com', role: 'editor', status: 'active', created_at: '2026-02-18 10:15:22' },
      { id: 'usr-903c-8814', username: 'siti_aminah', email: 'siti.aminah@yahoo.com', role: 'viewer', status: 'inactive', created_at: '2026-02-20 14:45:10' },
      { id: 'usr-904d-8815', username: 'doni_wijaya', email: 'doni.w@techindo.com', role: 'developer', status: 'active', created_at: '2026-02-22 09:12:05' },
      { id: 'usr-905e-8816', username: 'linda_putri', email: 'linda.putri@digital.org', role: 'editor', status: 'active', created_at: '2026-02-25 16:20:40' },
      { id: 'usr-906f-8817', username: 'ahmad_fauzi', email: 'fauzi@webmedia.id', role: 'viewer', status: 'banned', created_at: '2026-02-27 11:05:19' },
      { id: 'usr-907g-8818', username: 'ratna_dewi', email: 'ratna.dewi@cloud.id', role: 'editor', status: 'active', created_at: '2026-02-28 07:18:44' }
    ]
  },
  products: {
    name: 'products',
    columns: [
      { name: 'id', type: 'serial', key: 'PRI', null: 'NO', default: 'auto_increment' },
      { name: 'sku', type: 'varchar(30)', key: 'UNI', null: 'NO', default: 'NULL' },
      { name: 'name', type: 'varchar(150)', key: '', null: 'NO', default: 'NULL' },
      { name: 'category', type: 'varchar(50)', key: '', null: 'YES', default: "'General'" },
      { name: 'price', type: 'numeric(12,2)', key: '', null: 'NO', default: '0.00' },
      { name: 'stock', type: 'integer', key: '', null: 'NO', default: '0' },
      { name: 'updated_at', type: 'timestamp', key: '', null: 'YES', default: 'now()' }
    ],
    rows: [
      { id: 101, sku: 'PRD-SRV-01', name: 'Cloud VPS 4 vCPU 16GB NVMe', category: 'Infrastructure', price: 450000.00, stock: 45, updated_at: '2026-02-24 10:00:00' },
      { id: 102, sku: 'PRD-DOM-ID', name: 'Domain .ID Enterprise 1 Tahun', category: 'Networking', price: 225000.00, stock: 999, updated_at: '2026-02-25 11:30:10' },
      { id: 103, sku: 'PRD-SSL-WV', name: 'Wildcard SSL Certificate GeoTrust', category: 'Security', price: 1200000.00, stock: 120, updated_at: '2026-02-26 14:20:45' },
      { id: 104, sku: 'PRD-API-GW', name: 'API Gateway Microservices Enterprise', category: 'Software', price: 850000.00, stock: 60, updated_at: '2026-02-27 16:15:30' },
      { id: 105, sku: 'PRD-DB-PG', name: 'Managed PostgreSQL High Availability', category: 'Database', price: 1750000.00, stock: 30, updated_at: '2026-02-28 09:10:00' }
    ]
  },
  orders: {
    name: 'orders',
    columns: [
      { name: 'order_id', type: 'varchar(36)', key: 'PRI', null: 'NO', default: 'NULL' },
      { name: 'customer_name', type: 'varchar(100)', key: '', null: 'NO', default: 'NULL' },
      { name: 'total_amount', type: 'numeric(14,2)', key: '', null: 'NO', default: '0' },
      { name: 'payment_method', type: 'varchar(30)', key: '', null: 'YES', default: "'QRIS'" },
      { name: 'status', type: 'varchar(20)', key: '', null: 'NO', default: "'pending'" },
      { name: 'order_date', type: 'timestamp', key: '', null: 'NO', default: 'now()' }
    ],
    rows: [
      { order_id: 'ORD-2026-001', customer_name: 'PT Solusi Media Global', total_amount: 5400000.00, payment_method: 'Bank Transfer', status: 'completed', order_date: '2026-02-26 09:00:00' },
      { order_id: 'ORD-2026-002', customer_name: 'CV Berkah Abadi', total_amount: 1450000.00, payment_method: 'QRIS', status: 'completed', order_date: '2026-02-26 13:20:10' },
      { order_id: 'ORD-2026-003', customer_name: 'Startup Nusantara Lab', total_amount: 8900000.00, payment_method: 'Virtual Account', status: 'pending', order_date: '2026-02-27 15:45:00' },
      { order_id: 'ORD-2026-004', customer_name: 'PT Digital Kreasi Mandiri', total_amount: 2350000.00, payment_method: 'Credit Card', status: 'processing', order_date: '2026-02-28 08:30:15' }
    ]
  },
  system_logs: {
    name: 'system_logs',
    columns: [
      { name: 'log_id', type: 'bigint', key: 'PRI', null: 'NO', default: 'auto_increment' },
      { name: 'level', type: 'varchar(10)', key: '', null: 'NO', default: "'INFO'" },
      { name: 'service', type: 'varchar(50)', key: '', null: 'NO', default: "'auth_service'" },
      { name: 'message', type: 'text', key: '', null: 'NO', default: 'NULL' },
      { name: 'ip_address', type: 'inet', key: '', null: 'YES', default: 'NULL' },
      { name: 'timestamp', type: 'timestamp', key: '', null: 'NO', default: 'now()' }
    ],
    rows: [
      { log_id: 5001, level: 'INFO', service: 'auth_service', message: 'User root@supabase logged in successfully via API token', ip_address: '180.252.164.21', timestamp: '2026-02-28 04:10:22' },
      { log_id: 5002, level: 'INFO', service: 'db_pool', message: 'Connection pool warm-up completed: 20 active connections', ip_address: '10.0.4.12', timestamp: '2026-02-28 04:11:05' },
      { log_id: 5003, level: 'WARN', service: 'rate_limiter', message: 'High request frequency detected from external crawler', ip_address: '45.112.87.19', timestamp: '2026-02-28 04:15:30' }
    ]
  }
};
