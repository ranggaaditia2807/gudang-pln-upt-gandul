// Data Integration System - Menghubungkan Manajemen Gudang dengan Transaksi

// Key untuk localStorage
const STORAGE_KEYS = {
    BARANG: 'barang',
    TRANSAKSI_PEMASUKAN: 'transaksiPemasukan',
    TRANSAKSI_PENGELUARAN: 'transaksiPengeluaran'
};

function getDataBarang() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BARANG)) || [];
}

console.log("Memeriksa data barang di localStorage...");
if (!localStorage.getItem(STORAGE_KEYS.BARANG)) {
    const barangAwal = [
        { kode: 'BRG001', nama: 'Laptop Dell', stok: 10, satuan: 'unit', lokasi: 'Rak A1' },
        { kode: 'BRG002', nama: 'Mouse Wireless', stok: 5, satuan: 'pcs', lokasi: 'Rak B2' },
        { kode: 'BRG003', nama: 'Keyboard Mechanical', stok: 2, satuan: 'pcs', lokasi: 'Rak B3' }
    ];
    console.log("Inisialisasi data awal:", barangAwal);
    saveDataBarang(barangAwal);
} else {
    console.log("Data barang sudah ada di localStorage:", getDataBarang());
}

// Fungsi untuk menyimpan data barang ke manajemen gudang
function saveDataBarang(barang) {
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(barang));
}

// Fungsi untuk update stok barang berdasarkan transaksi
function updateStokBarang(kodeBarang, jumlah, jenisTransaksi) {
    const barang = getDataBarang();
    const index = barang.findIndex(item => item.kode === kodeBarang);
    
    if (index !== -1) {
        if (jenisTransaksi === 'pemasukan') {
            barang[index].stok += jumlah;
        } else if (jenisTransaksi === 'pengeluaran') {
            if (barang[index].stok < jumlah) {
                console.error('Stok tidak mencukupi untuk pengeluaran');
                return false; // Stok tidak cukup untuk pengeluaran
            }
            barang[index].stok -= jumlah;
        }
        saveDataBarang(barang);
        return true;
    }
    return false; // Barang tidak ditemukan
}

// Fungsi untuk mendapatkan stok tersedia
function getStokTersedia(kodeBarang) {
    const barang = getDataBarang();
    const item = barang.find(b => b.kode === kodeBarang);
    return item ? item.stok : 0;
}

// Fungsi untuk validasi stok sebelum pengeluaran
function validasiStok(kodeBarang, jumlahKeluar) {
    const stokTersedia = getStokTersedia(kodeBarang);
    return stokTersedia >= jumlahKeluar;
}

// Fungsi untuk sinkronisasi stok dari semua transaksi
function sinkronisasiStok() {
    const barang = getDataBarang();
    const transaksiPemasukan = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSAKSI_PEMASUKAN)) || [];
    const transaksiPengeluaran = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSAKSI_PENGELUARAN)) || [];
    
    // Reset stok ke 0
    barang.forEach(item => item.stok = 0);
    
    // Hitung total pemasukan
    transaksiPemasukan.forEach(transaksi => {
        transaksi.barang.forEach(barangTransaksi => {
            const index = barang.findIndex(b => b.kode === barangTransaksi.kodeBarang);
            if (index !== -1) {
                barang[index].stok += barangTransaksi.jumlah;
            }
        });
    });
    
    // Hitung total pengeluaran
    transaksiPengeluaran.forEach(transaksi => {
        transaksi.barang.forEach(barangTransaksi => {
            const index = barang.findIndex(b => b.kode === barangTransaksi.kodeBarang);
            if (index !== -1) {
                barang[index].stok -= barangTransaksi.jumlahKeluar;
            }
        });
    });                             
                             
    saveDataBarang(barang);
    return barang;
}

// Fungsi untuk mendapatkan data transaksi lengkap dengan nama barang
function getTransaksiWithBarang() {
    const barang = getDataBarang();
    const transaksiPemasukan = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSAKSI_PEMASUKAN)) || [];
    const transaksiPengeluaran = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSAKSI_PENGELUARAN)) || [];
    
    // Tambahkan nama barang ke transaksi pemasukan
    const pemasukanWithBarang = transaksiPemasukan.map(transaksi => ({
        ...transaksi,
        barang: transaksi.barang.map(b => ({
            ...b,
            namaBarang: barang.find(item => item.kode === b.kodeBarang)?.nama || 'Barang tidak ditemukan'
        }))
    }));
    
    // Tambahkan nama barang ke transaksi pengeluaran
    const pengeluaranWithBarang = transaksiPengeluaran.map(transaksi => ({
        ...transaksi,
        barang: transaksi.barang.map(b => ({
            ...b,
            namaBarang: barang.find(item => item.kode === b.kodeBarang)?.nama || 'Barang tidak ditemukan'
        }))
    }));
    
    return { pemasukan: pemasukanWithBarang, pengeluaran: pengeluaranWithBarang };
}

function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.BARANG)) {
        const barangAwal = [
            { kode: 'BRG001', nama: 'Laptop Dell', stok: 10, satuan: 'unit', lokasi: 'Rak A1' },
            { kode: 'BRG002', nama: 'Mouse Wireless', stok: 5, satuan: 'pcs', lokasi: 'Rak B2' },
            { kode: 'BRG003', nama: 'Keyboard Mechanical', stok: 2, satuan: 'pcs', lokasi: 'Rak B3' }
        ];
        saveDataBarang(barangAwal);
    }
}

// Event listener untuk sinkronisasi otomatis
document.addEventListener('DOMContentLoaded', function() {
    initData();
    
    // Sinkronisasi stok saat halaman dimuat
    if (window.location.pathname.includes('transaksi')) {
        sinkronisasiStok();
    }
});

// Export fungsi untuk digunakan di file lain
window.DataIntegration = {
    getDataBarang,
    updateStokBarang,
    getStokTersedia,
    validasiStok,
    sinkronisasiStok,
    getTransaksiWithBarang
};
 