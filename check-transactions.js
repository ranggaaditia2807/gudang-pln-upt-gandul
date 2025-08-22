// Script untuk memeriksa data transaksi yang tersimpan di localStorage
console.log("=== MEMERIKSA DATA TRANSAKSI DI LOCALSTORAGE ===");

// Cek transaksi pemasukan
const transaksiPemasukan = JSON.parse(localStorage.getItem('transaksiPemasukan')) || [];
console.log("Jumlah transaksi pemasukan:", transaksiPemasukan.length);
transaksiPemasukan.forEach((transaksi, index) => {
    console.log(`Pemasukan ${index + 1}:`, {
        noTransaksi: transaksi.noTransaksi,
        noTransaksiMasuk: transaksi.noTransaksiMasuk,
        tanggalMasuk: transaksi.tanggalMasuk,
        supplier: transaksi.supplier
    });
});

// Cek transaksi pengeluaran
const transaksiPengeluaran = JSON.parse(localStorage.getItem('transaksiPengeluaran')) || [];
console.log("Jumlah transaksi pengeluaran:", transaksiPengeluaran.length);
transaksiPengeluaran.forEach((transaksi, index) => {
    console.log(`Pengeluaran ${index + 1}:`, {
        noTransaksiKeluar: transaksi.noTransaksiKeluar,
        tanggalKeluar: transaksi.tanggalKeluar,
        tujuan: transaksi.tujuan
    });
});

console.log("=== SELESAI MEMERIKSA ===");
