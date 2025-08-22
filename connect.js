// Script sederhana untuk menghubungkan semua modul gudang

// Fungsi untuk navigasi antar modul
function navigateTo(module) {
    const paths = {
        'home': 'index.html',
        'dashboard':'dashboard.html',
        'transaksi': 'transaksi.html',
        'manajemen': 'manajemen-gudang.html',
        'laporan': 'laporan.html'
    };
    
    if (paths[module]) {
        window.location.href = paths[module];
    }
}

// Fungsi untuk menyimpan data ke localStorage
function saveData(key, data) {
    localStorage.setItem('gudang_' + key, JSON.stringify(data));
}

// Fungsi untuk mengambil data dari localStorage
function getData(key) {
    const data = localStorage.getItem('gudang_' + key);
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menambahkan navigasi ke semua halaman
function addNavigation() {
    // Cek apakah sudah ada navigasi
    if (document.querySelector('.main-nav')) return;
    
    const navHTML = `
        <nav style="background: #2c3e50; padding: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
                <h2 style="color: white; margin: 0;">Gudang UPT Gandul 3</h2>
                <ul style="display: flex; list-style: none; gap: 20px; margin: 0;">
                    <li><a href="index.html" style="color: white; text-decoration: none; padding: 8px 15px; border-radius: 4px;">Beranda</a></li>
                    <li><a href="index.html" style="color: white; text-decoration: none; padding: 8px 15px; border-radius: 4px;">Dashboard</a></li>
                    <li><a href="index.html" style="color: white; text-decoration: none; padding: 8px 15px; border-radius: 4px;">Transaksi</a></li>
                    <li><a href="manajemen gudang/index.html" style="color: white; text-decoration: none; padding: 8px 15px; border-radius: 4px;">Manajemen Gudang</a></li>
                    <li><a href="laporan/index.html" style="color: white; text-decoration: none; padding: 8px 15px; border-radius: 4px;">Laporan</a></li>
                </ul>
            </div>
        </nav>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// Fungsi untuk menambahkan styling global
function addGlobalStyles() {
    if (document.querySelector('#global-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'global-styles';
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 0 20px;
        }
        
        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 2px;
        }
        
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    addNavigation();
    addGlobalStyles();
    
    // Highlight menu aktif
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.main-nav a');
    links.forEach(link => {
        if (link.href.includes(currentPath.split('/').pop())) {
            link.style.background = '#34495e';
        }
    });
});

// Fungsi untuk berbagi data antar modul
function shareData(type, data) {
    const allData = getData(type);
    allData.push(data);
    saveData(type, allData);
    
    // Emit event untuk update
    window.dispatchEvent(new CustomEvent('gudang-update', { 
        detail: { type, data: allData } 
    }));
}

// Fungsi untuk mendapatkan data dari modul lain
function getSharedData(type) {
    return getData(type);
}

// Fungsi untuk menghubungkan transaksi dengan dashboard
function updateDashboardFromTransaction(transaction) {
    shareData('transactions', transaction);
    
    // Update stok jika ada
    if (transaction.type === 'masuk') {
        const stock = getData('stock');
        const item = stock.find(s => s.name === transaction.item);
        if (item) {
            item.quantity += transaction.quantity;
        } else {
            stock.push({ name: transaction.item, quantity: transaction.quantity });
        }
        saveData('stock', stock);
    } else if (transaction.type === 'keluar') {
        const stock = getData('stock');
        const item = stock.find(s => s.name === transaction.item);
        if (item) {
            item.quantity -= transaction.quantity;
            saveData('stock', stock);
        }
    }
}

// Global functions
window.GudangSystem = {
    navigate: navigateTo,
    saveData: saveData,
    getData: getData,
    shareData: shareData,
    updateDashboard: updateDashboardFromTransaction
};

