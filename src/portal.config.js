/**
 * Portal Hub Configuration File
 * 
 * Sederhanakan penambahan link, kategori, nama pembuat, dan warna di sini.
 * Aplikasi akan otomatis menyesuaikan visual berdasarkan data di config ini.
 */

export const siteConfig = {
  // Informasi Owner / Profil di Header
  ownerName: 'Anugerah Surya Atmaja',
  avatarInitials: 'ASA',
  siteTitle: 'Portal Hub BPS Sumbar',
  subTitle: 'Portal Hub Kumpulan Link BPS & Developer',
  footerText: 'Badan Pusat Statistik Provinsi Sumatera Barat',

  // Konfigurasi Default Aplikasi
  defaultTheme: 'dark', // Pilihan: 'dark' | 'light'
  enableThemeToggle: true,
  enableClickTracking: true, // Menyimpan statistik jumlah klik ke LocalStorage

  // Panduan Icon yang tersedia:
  // - 'activity' (Lapor / Kegiatan)
  // - 'chart' (Statistik / CKP)
  // - 'shield' (Keamanan / Sibeken)
  // - 'github' (Git/Kode)
  // - 'vercel' (Hosting/Web)
  // - 'star' (Penilaian/Kipapp)
  // - 'users' (Kepegawaian/Simpeg)
  // - 'education' (E-learning/Gojags)
  // - 'check-square' (Survei/Fasih)
  // - 'mail' (Email/Surat)
  // - 'briefcase' (Administrasi/Backoffice)
  // - 'map-pin' (Pemetaan/Wilkerstat)
  // - 'globe' (Spasial/Situs Umum)
  defaultIcon: 'globe'
};

export const categories = [
  {
    id: 'aktivitas',
    name: 'Aktivitas & Kinerja (Lokal)',
    icon: 'activity',
    description: 'Aplikasi pelaporan dan penilaian kinerja internal BPS Sumatera Barat'
  },
  {
    id: 'dev',
    name: 'Peralatan Developer',
    icon: 'terminal',
    description: 'Tools, version control, hosting, dan ekosistem pengembang'
  },
  {
    id: 'pusat',
    name: 'Layanan & Aplikasi Pusat',
    icon: 'database',
    description: 'Portal nasional, administrasi umum, survei, dan database BPS RI'
  }
];

export const links = [
  // === KATEGORI: Aktivitas & Kinerja (Lokal BPS Sumbar) ===
  {
    name: 'Lapor Aktivitas',
    url: 'http://laporaktivitasti1300.vercel.app/',
    category: 'aktivitas',
    description: 'Sistem pelaporan aktivitas harian pegawai TI 1300 BPS Provinsi Sumatera Barat.',
    tag: 'TI1300',
    color: '#0ea5e9', // Accent Color
    colorRgb: '14, 165, 233', // Digunakan untuk hover glow shadow rgba
    icon: 'activity'
  },
  {
    name: 'Ckp BPS Sumbar',
    url: 'https://bps1300.web.bps.go.id/ckp/main',
    category: 'aktivitas',
    description: 'Dashboard pemantauan dan pengisian Capaian Kinerja Pegawai (CKP) BPS Sumatera Barat.',
    tag: 'CKP BPS',
    color: '#3b82f6',
    colorRgb: '59, 130, 246',
    icon: 'chart'
  },
  {
    name: 'Sibeken',
    url: 'http://sibeken.web.bps.go.id/',
    category: 'aktivitas',
    description: 'Sistem Informasi Terpadu dan Layanan Kepegawaian internal BPS Provinsi Sumatera Barat.',
    tag: 'Sibeken',
    color: '#10b981',
    colorRgb: '16, 185, 129',
    icon: 'shield'
  },

  // === KATEGORI: Peralatan Developer (dev) ===
  {
    name: 'Github',
    url: 'https://github.com/',
    category: 'dev',
    description: 'Platform hosting repositori Git untuk kolaborasi kode, manajemen versi, dan open source.',
    tag: 'Repository',
    color: '#818cf8',
    colorRgb: '129, 140, 248',
    icon: 'github'
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com/',
    category: 'dev',
    description: 'Platform deployment instan dan serverless hosting teroptimasi untuk aplikasi frontend.',
    tag: 'Deployment',
    color: '#f43f5e',
    colorRgb: '244, 63, 94',
    icon: 'vercel'
  },

  // === KATEGORI: Layanan & Aplikasi Pusat (pusat) ===
  {
    name: 'Kipapp',
    url: 'https://kipapp.bps.go.id/',
    category: 'pusat',
    description: 'Aplikasi penilaian kinerja, dokumentasi kegiatan, dan evaluasi instansi BPS RI.',
    tag: 'Kipapp',
    color: '#f59e0b',
    colorRgb: '245, 158, 11',
    icon: 'star'
  },
  {
    name: 'Simpeg',
    url: 'https://simpeg.bps.go.id/',
    category: 'pusat',
    description: 'Sistem Informasi Manajemen Kepegawaian terpusat bagi seluruh pegawai BPS RI.',
    tag: 'Simpeg',
    color: '#ef4444',
    colorRgb: '239, 68, 68',
    icon: 'users'
  },
  {
    name: 'Seruti',
    url: 'https://seruti.bps.go.id',
    category: 'pusat',
    description: 'Sistem Informasi Manajemen Kepegawaian terpusat bagi seluruh pegawai BPS RI.',
    tag: 'Seruti',
    color: '#2ba335ff',
    colorRgb: '34, 197, 94',
    icon: 'users'
  },
  {
    name: 'Gojags',
    url: 'https://gojags-training.bps.go.id',
    category: 'pusat',
    description: 'Portal diklat online, training, dan e-learning peningkatan kapasitas SDM BPS RI.',
    tag: 'E-Learning',
    color: '#a855f7',
    colorRgb: '168, 85, 247',
    icon: 'education'
  },
  {
    name: 'Fasih',
    url: 'https://fasih-sm.bps.go.id/',
    category: 'pusat',
    description: 'Sistem Survei Mandiri BPS RI untuk pengelolaan pencacahan dan input data.',
    tag: 'Survei',
    color: '#06b6d4',
    colorRgb: '6, 182, 212',
    icon: 'check-square'
  },
  {
    name: 'Email BPS',
    url: 'https://mail.bps.go.id/',
    category: 'pusat',
    description: 'Layanan surat elektronik resmi berbasis webmail untuk kedinasan pegawai BPS RI.',
    tag: 'Webmail',
    color: '#14b8a6',
    colorRgb: '20, 184, 166',
    icon: 'mail'
  },
  {
    name: 'Backoffice',
    url: 'https://backoffice.bps.go.id/',
    category: 'pusat',
    description: 'Layanan administrasi, persuratan, keuangan, dan dukungan backoffice internal BPS RI.',
    tag: 'Administrasi',
    color: '#64748b',
    colorRgb: '100, 116, 139',
    icon: 'briefcase'
  },
  {
    name: 'Wilkerstat',
    url: 'https://wilkerstat.bps.go.id/sso/bps',
    category: 'pusat',
    description: 'Sistem single sign-on pemetaan dan manajemen wilayah kerja statistik BPS RI.',
    tag: 'Wilkerstat',
    color: '#d946ef',
    colorRgb: '217, 70, 239',
    icon: 'map-pin'
  },
  {
    name: 'Geospatial',
    url: 'https://dataspasial.bps.go.id/',
    category: 'pusat',
    description: 'Portal data spasial resmi BPS RI untuk peta statistik dan data spasial spasio-temporal.',
    tag: 'Spasial',
    color: '#22c55e',
    colorRgb: '34, 197, 94',
    icon: 'globe'
  }
];

export const mockVisitors = [
  { name: 'Drs. Sugeng Arianto, M.Si (BPS Prov. Sumbar)', time: 'Baru saja', isMock: true },
  { name: 'Rina Rahmawati, S.ST (IPDS BPS Sumbar)', time: '2 jam yang lalu', isMock: true },
  { name: 'Muhammad Ilham (TI1300)', time: '5 jam yang lalu', isMock: true },
  { name: 'Putri Handayani (BPS Kota Padang)', time: '1 hari yang lalu', isMock: true }
];
