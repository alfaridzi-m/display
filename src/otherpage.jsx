import React, { useState, useEffect } from 'react';

// --- Helper Functions (diletakkan di luar komponen) ---

// Fungsi untuk mendapatkan data pengguna dari localStorage
const getUsers = () => {
    try {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    } catch (e) {
        console.error("Gagal mem-parsing data pengguna dari localStorage", e);
        return [];
    }
};

// Fungsi untuk menyimpan data pengguna ke localStorage
const saveUsers = (users) => {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (e) {
        console.error("Gagal menyimpan data pengguna ke localStorage", e);
    }
};

// Fungsi untuk generate UserID unik
const generateUniqueId = () => {
    return `f${Math.floor(Math.random() * 100)}${String.fromCharCode(65 + Math.floor(Math.random() * 26)).toLowerCase()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

};


// --- Komponen-komponen UI ---

// Komponen untuk Tampilan Login
const LoginView = ({ onLogin, onShowRegister }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = getUsers();
        const user = users.find(u => u.password === password);

        if (user) {
            onLogin(user);
        } else {
            setError('Kata sandi salah.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Selamat Datang Kembali!</h2>
            <p className="text-center text-gray-500 mb-6">Silakan masukkan kata sandi Anda.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                    <input
                        type="password"
                        id="login-password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(''); // Hapus error saat mengetik
                        }}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all">Masuk</button>
            </form>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            <p className="text-center text-sm text-gray-600 mt-6">
                Belum punya akun? <a href="#" onClick={onShowRegister} className="font-medium text-blue-600 hover:underline">Daftar di sini</a>
            </p>
        </div>
    );
};

// Komponen untuk Tampilan Registrasi
const RegisterView = ({ onShowLogin }) => {
    const [userId, setUserId] = useState('');
    const [namaKantor, setNamaKantor] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Generate UserID saat komponen pertama kali dimuat
    useEffect(() => {
        setUserId(generateUniqueId());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const users = getUsers();

        if (users.some(user => user.namaKantor === namaKantor)) {
            setError("Nama kantor sudah digunakan.");
            return;
        }
        if (users.some(user => user.password === password)) {
            setError("Kata sandi sudah digunakan. Harap pilih yang lain.");
            return;
        }

        const newUser = { userId, namaKantor, password };
        saveUsers([...users, newUser]);

        setSuccess('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
        setNamaKantor('');
        setPassword('');
        setUserId(generateUniqueId()); // Generate ID baru untuk pendaftaran selanjutnya

        setTimeout(() => {
            onShowLogin();
        }, 2000);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Buat Akun Baru</h2>
            <p className="text-center text-gray-500 mb-6">Hanya butuh beberapa detik.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="register-userid" className="block text-sm font-medium text-gray-700 mb-1">UserID (Otomatis)</label>
                    <input type="text" id="register-userid" value={userId} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" readOnly />
                </div>
                <div className="mb-4">
                    <label htmlFor="register-nama-kantor" className="block text-sm font-medium text-gray-700 mb-1">Nama Kantor</label>
                    <input
                        type="text"
                        id="register-nama-kantor"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={namaKantor}
                        onChange={(e) => setNamaKantor(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                    <input
                        type="password"
                        id="register-password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition-all">Daftar</button>
            </form>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mt-4">{success}</p>}
            <p className="text-center text-sm text-gray-600 mt-6">
                Sudah punya akun? <a href="#" onClick={onShowLogin} className="font-medium text-blue-600 hover:underline">Masuk di sini</a>
            </p>
        </div>
    );
};

// Komponen untuk Tampilan Dashboard
const DashboardView = ({ user, onLogout }) => {
    return (
        <div className="w-full max-w-7xl">
            <header className="bg-white shadow-md rounded-xl p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="font-semibold text-gray-700">{user.namaKantor}</p>
                        <p className="text-xs text-gray-500">ID: {user.userId}</p>
                    </div>
                </div>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card Data Contoh */}
                <div className="bg-white p-6 rounded-xl shadow-lg"><h3 className="text-lg font-semibold text-gray-600 mb-2">Pengguna Aktif</h3><p className="text-3xl font-bold text-blue-600">dasd</p></div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><h3 className="text-lg font-semibold text-gray-600 mb-2">Pendapatan</h3><p className="text-3xl font-bold text-green-600">sdasda</p></div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><h3 className="text-lg font-semibold text-gray-600 mb-2">Pesanan Baru</h3><p className="text-3xl font-bold text-yellow-500">13123</p></div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><h3 className="text-lg font-semibold text-gray-600 mb-2">Tingkat Konversi</h3><p className="text-3xl font-bold text-purple-600">12.5%</p></div>
                {/* Chart Contoh */}
                <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-4"><h3 className="text-lg font-semibold text-gray-600 mb-4">Grafik Penjualan Bulanan (Contoh)</h3><div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-400">Data grafik akan ditampilkan di sini</p></div></div>
            </main>
        </div>
    );
};


// --- Komponen Utama Aplikasi ---
export default function App() {
    const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Cek status login dari sessionStorage saat aplikasi dimuat
    useEffect(() => {
        try {
            const userJson = sessionStorage.getItem('loggedInUser');
            if (userJson) {
                const user = JSON.parse(userJson);
                setLoggedInUser(user);
                setView('dashboard');
            }
        } catch (e) {
            console.error("Gagal mem-parsing data sesi", e);
            sessionStorage.removeItem('loggedInUser');
        }
    }, []);

    const handleLogin = (user) => {
        setLoggedInUser(user);
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        setView('dashboard');
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        sessionStorage.removeItem('loggedInUser');
        setView('login');
    };

    const handleShowRegister = (e) => {
        e.preventDefault();
        setView('register');
    };

    const handleShowLogin = (e) => {
        if(e) e.preventDefault();
        setView('login');
    };

    // Render komponen berdasarkan state 'view'
    const renderView = () => {
        switch (view) {
            case 'register':
                return <RegisterView onShowLogin={handleShowLogin} />;
            case 'dashboard':
                return <DashboardView user={loggedInUser} onLogout={handleLogout} />;
            case 'login':
            default:
                return <LoginView onLogin={handleLogin} onShowRegister={handleShowRegister} />;
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-sans">
            {renderView()}
        </div>
    );
}
