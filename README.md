# Sistem Gudang PLN

Sistem manajemen gudang untuk PT PLN yang memungkinkan pengelolaan barang dan transaksi secara efisien.

## Fitur Utama

### 1. Dashboard
- **Manajemen Barang**: Tambah, edit, hapus, dan cari barang
- **Transaksi Barang**: Catat barang masuk dan keluar
- **Stok Real-time**: Update otomatis berdasarkan transaksi

### 2. Data Integration
- **Local Storage**: Semua data tersimpan di browser
- **Sinkronisasi Otomatis**: Stok diperbarui berdasarkan transaksi
- **Validasi Stok**: Cek ketersediaan sebelum pengeluaran

## Cara Penggunaan

### Memulai
1. Buka file `dashboard.html` di browser
2. Sistem akan otomatis menginisialisasi data awal
3. Mulai tambahkan barang dan transaksi

### Menambah Barang Baru
1. Klik tombol "Tambah Barang" di panel Manajemen Barang
2. Isi form dengan data yang diperlukan:
   - Kode Barang (unik)
   - Nama Barang
   - Stok Awal
   - Satuan (pcs/unit/kg/meter/liter)
   - Lokasi Penyimpanan (opsional)
3. Klik "Simpan"

### Transaksi Barang Masuk
1. Klik tab "Barang Masuk"
2. Klik tombol "Tambah Transaksi"
3. Pilih barang dari dropdown
4. Masukkan jumlah dan supplier
5. Tambahkan keterangan jika perlu
6. Klik "Simpan"

### Transaksi Barang Keluar
1. Klik tab "Barang Keluar"
2. Klik tombol "Tambah Transaksi"
3. Pilih barang dari dropdown
4. Masukkan jumlah dan tujuan pengeluaran
5. Sistem akan validasi stok tersedia
6. Klik "Simpan"

### Mencari Barang
- Gunakan fitur search di panel Manajemen Barang
- Cari berdasarkan nama atau kode barang

### Edit dan Hapus Barang
- **Edit**: Klik tombol "Edit" di baris barang yang ingin diubah
- **Hapus**: Klik tombol "Hapus" dan konfirmasi penghapusan

## Struktur Data

### Barang
```javascript
{
  kode: "BRG001",
  nama: "Laptop Dell",
  stok: 10,
  satuan: "unit",
  lokasi: "Rak A1"
}
```

### Transaksi Masuk
```javascript
{
  id: 1234567890,
  tanggal: "2024-01-15",
  supplier: "PT Teknologi Maju",
  keterangan: "Pembelian rutin bulanan",
  barang: [{
    kodeBarang: "BRG001",
    namaBarang: "Laptop Dell",
    jumlah: 5,
    satuan: "unit"
  }]
}
```

### Transaksi Keluar
```javascript
{
  id: 1234567891,
  tanggal: "2024-01-16",
  tujuan: "Proyek PLN Jakarta",
  keterangan: "Untuk kebutuhan operasional",
  barang: [{
    kodeBarang: "BRG001",
    namaBarang: "Laptop Dell",
    jumlahKeluar: 2,
    satuan: "unit"
  }]
}

## Troubleshooting

### Data Tidak Muncul
- Refresh browser untuk memuat ulang data
- Cek apakah JavaScript diaktifkan di browser
- Buka Developer Tools (F12) untuk melihat error di console

### Stok Tidak Update
- Pastikan transaksi berhasil disimpan
- Cek di tab transaksi untuk melihat riwayat
- Gunakan fitur sinkronisasi di data-integration.js

### Kode Barang Sudah Ada
- Sistem tidak memperbolehkan duplikasi kode barang
- Gunakan kode yang unik untuk setiap barang

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Catatan
- Semua data disimpan di localStorage browser
- Data akan hilang jika browser cache dihapus
- Untuk backup, ekspor data dari localStorage

