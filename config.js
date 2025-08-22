// Konfigurasi Global Gudang UPT Gandul 3
const AppConfig = {
    // Base URL untuk semua modul
    baseUrl: window.location.origin,
    
    // Module paths
    modules: {
        home: 'home.html',
        dashboard: 'dashboard.html',
        transaksi: 'transaksi.html',
        manajemenGudang: 'manajemen-gudang.html',
        laporan: 'laporan.html'
    },
    
    // API endpoints
    api: {
        transaksi: {
            pemasukan: 'data-integration.js',
            pengeluaran: 'data-integration.js',
            list: 'data-integration.js'
        },
        laporan: {
            generate: 'data-integration.js',
            export: 'data-integration.js'
        },
        dashboard: {
            summary: 'dashboard.js',
            alerts: 'dashboard.js'
        }
    },
    
    // Shared data storage
    storage: {
        key: 'gudang_gandul3_data',
        set: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        },
        clear: function(key) {
            localStorage.removeItem(key);
        }
    },
    
    // Navigation helper
    navigation: {
        goTo: function(module) {
            if (AppConfig.modules[module]) {
                window.location.href = AppConfig.modules[module];
            }
        },
        
        getCurrentModule: function() {
            const path = window.location.pathname;
            if (path.includes('home')) return 'home';
            if (path.includes('dashboard')) return 'dashboard';
            if (path.includes('transaksi')) return 'transaksi';
            if (path.includes('manajemen gudang')) return 'manajemenGudang';
            if (path.includes('laporan')) return 'laporan';
            return 'unknown';
        }
    },
    
    // Data sharing between modules
    dataBridge: {
        // Share transaction data
        shareTransaction: function(transaction) {
            const transactions = AppConfig.storage.get('transactions') || [];
            transactions.push(transaction);
            AppConfig.storage.set('transactions', transactions);
            
            // Update dashboard if open
            if (window.parent && window.parent.updateDashboard) {
                window.parent.updateDashboard();
            }
        },
        
        // Get dashboard data
        getDashboardData: function() {
            return {
                transactions: AppConfig.storage.get('transactions') || [],
                stock: AppConfig.storage.get('stock') || [],
                alerts: AppConfig.storage.get('alerts') || []
            };
        }
    }
};

// Initialize active navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentModule = AppConfig.navigation.getCurrentModule();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.href.includes(currentModule)) {
            link.classList.add('active');
        }
    });
});

