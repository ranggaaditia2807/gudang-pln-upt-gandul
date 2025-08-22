// Konfigurasi Data Terpusat untuk Sistem Gudang PLN

const DATA_CONFIG = {
    STORAGE_KEYS: {
        BARANG: 'barang',
        TRANSAKSI_PEMASUKAN: 'transaksiPemasukan',
        TRANSAKSI_PENGELUARAN: 'transaksiPengeluaran',
        LAPORAN: 'laporan'
    },
    
    // Data barang default
    DEFAULT_BARANG: [
        { kode: 'BRG001', nama: 'Laptop Dell', stok: 10, satuan: 'unit', lokasi: 'Rak A1' },
        { kode: 'BRG002', nama: 'Mouse Wireless', stok: 5, satuan: 'pcs', lokasi: 'Rak B2' },
        { kode: 'BRG003', nama: 'Keyboard Mechanical', stok: 2, satuan: 'pcs', lokasi: 'Rak B3' }
    ],
    
    // Fungsi untuk mendapatkan data barang
    getDataBarang: function() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BARANG)) || [];
    },
    
    // Fungsi untuk menyimpan data barang
    saveDataBarang: function(barang) {
        localStorage.setItem(this.STORAGE_KEYS.BARANG, JSON.stringify(barang));
    },
    
    // Fungsi untuk inisialisasi data
    initData: function() {
        if (!localStorage.getItem(this.STORAGE_KEYS.BARANG)) {
            this.saveDataBarang(this.DEFAULT_BARANG);
            console.log("Data barang diinisialisasi dengan data default");
        }
    },
    
    // Fungsi untuk sinkronisasi stok
    sinkronisasiStok: function() {
        const barang = this.getDataBarang();
        const transaksiPemasukan = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSAKSI_PEMASUKAN)) || [];
        const transaksiPengeluaran = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSAKSI_PENGELUARAN)) || [];
        
        console.log("Memulai sinkronisasi stok terpusat...");
        
        // Hitung ulang stok berdasarkan semua transaksi
        const stokBaru = barang.map(item => {
            let stokAkhir = item.stok;
            
            // Hitung pemasukan
            transaksiPemasukan.forEach(transaksi => {
                transaksi.barang.forEach(barangTransaksi => {
                    if (barangTransaksi.kodeBarang === item.kode) {
                        stokAkhir += barangTransaksi.jumlahMasuk || 0;
                    }
                });
            });
            
            // Hitung pengeluaran
            transaksiPengeluaran.forEach(transaksi => {
                transaksi.barang.forEach(barangTransaksi => {
                    if (barangTransaksi.kodeBarang === item.kode) {
                        stokAkhir -= barangTransaksi.jumlahKeluar || 0;
                    }
                });
            });
            
            return {
                ...item,
                stok: Math.max(0, stokAkhir) // Pastikan stok tidak negatif
            };
        });
        
        this.saveDataBarang(stokBaru);
        console.log("Sinkronisasi stok selesai:", stokBaru);
        return stokBaru;
    },
    
    // Fungsi untuk update stok barang secara langsung
    updateStokBarang: function(kodeBarang, jumlah, jenis) {
        const barang = this.getDataBarang();
        const itemIndex = barang.findIndex(b => b.kode === kodeBarang);
        
        if (itemIndex === -1) {
            console.error("Barang tidak ditemukan:", kodeBarang);
            return false;
        }
        
        if (jenis === 'pengeluaran') {
            barang[itemIndex].stok -= jumlah;
        } else if (jenis === 'pemasukan') {
            barang[itemIndex].stok += jumlah;
        } else {
            console.error("Jenis transaksi tidak valid:", jenis);
            return false;
        }
        
        // Pastikan stok tidak negatif
        barang[itemIndex].stok = Math.max(0, barang[itemIndex].stok);
        
        this.saveDataBarang(barang);
        console.log(`Stok barang ${kodeBarang} diupdate: ${jenis} ${jumlah} unit`);
        return true;
    }
};

// Inisialisasi data saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    DATA_CONFIG.initData();
});

// Export untuk digunakan di modul lain
window.DataConfig = DATA_CONFIG;
