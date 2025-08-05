import React, { useState, useEffect } from 'react';

// Hook khusus untuk mendapatkan ukuran jendela browser
// Hook ini akan memantau perubahan ukuran jendela dan memperbarui nilainya
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Fungsi untuk menangani perubahan ukuran jendela
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Menambahkan event listener saat komponen pertama kali dirender
    window.addEventListener("resize", handleResize);

    // Memanggil handleResize sekali saat inisialisasi untuk mendapatkan ukuran awal
    handleResize();

    // Membersihkan event listener saat komponen di-unmount
    // Ini penting untuk mencegah kebocoran memori (memory leak)
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali (saat mount dan unmount)

  return windowSize;
};

// Komponen untuk menampilkan dashboard cuaca pada layar besar
const WeatherDashboard = () => {
  // Data cuaca tiruan (mock data) untuk Jakarta
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mensimulasikan pengambilan data dari API saat komponen dimuat
  useEffect(() => {
    const fetchWeatherData = () => {
      // Simulasikan jeda waktu API call
      setTimeout(() => {
        setWeatherData({
          city: "Jakarta",
          temperature: 29,
          condition: "Cerah Berawan",
          humidity: 78,
          windSpeed: 10,
        });
        setLoading(false);
      }, 1500); // Jeda 1.5 detik untuk efek loading
    };

    fetchWeatherData();
  }, []);

  // Tampilan loading saat data sedang "diambil"
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-700 text-white rounded-lg p-8 text-center transition-all duration-300">
        <h2 className="text-2xl font-semibold animate-pulse">Memuat Data Cuaca...</h2>
      </div>
    );
  }

  // Tampilan dashboard setelah data didapatkan
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg p-8 text-center shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Cuaca</h1>
        <h2 className="text-2xl font-light mb-4">{weatherData.city}</h2>
        <div className="flex items-center justify-center mb-6">
            {/* Ikon Cuaca Cerah Berawan */}
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-sun mr-4 drop-shadow-lg"><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12a4.5 4.5 0 0 1 4.5 4.5z"/><path d="M12 7V2.5"/><path d="m16.2 8.8 3.2-3.2"/><path d="M18 13h4.5"/><path d="m16.2 17.2 3.2 3.2"/><path d="M12 21.5V17"/><path d="m7.8 17.2-3.2 3.2"/><path d="M6 13H1.5"/><path d="m7.8 8.8-3.2-3.2"/><path d="M16 16.5A4.5 4.5 0 0 0 16 7.5h-1.5a6 6 0 1 0 0 12H16z"/></svg>
            <span className="text-7xl font-bold drop-shadow-lg">{weatherData.temperature}°C</span>
        </div>
        <p className="text-2xl capitalize mb-6">{weatherData.condition}</p>
        <div className="flex justify-around w-full max-w-xs text-lg mt-4 bg-black bg-opacity-20 p-3 rounded-lg">
            <div>
                <p className="font-semibold">Kelembapan</p>
                <p>{weatherData.humidity}%</p>
            </div>
            <div>
                <p className="font-semibold">Angin</p>
                <p>{weatherData.windSpeed} km/j</p>
            </div>
        </div>
    </div>
  );
};


// Komponen untuk ditampilkan pada layar kecil atau standar
const SmallScreenComponent = ({ width, height }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-green-100 text-green-800 rounded-lg p-8 text-center">
       <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone mb-4"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Tampilan Layar Standar/Kecil</h1>
      <p className="text-lg">Website ini dioptimalkan untuk layar dengan lebar 1920px atau kurang.</p>
       <p className="mt-4 text-sm font-mono bg-green-200 px-3 py-1 rounded">Ukuran saat ini: {width}px x {height}px</p>
    </div>
  );
};


// Komponen utama aplikasi
export default function App() {
  // Menggunakan hook useWindowSize untuk mendapatkan lebar dan tinggi jendela
  const { width } = useWindowSize();
  
  // Batas lebar layar
  const breakpoint = 1920;

  return (
    <div className="bg-gray-100 w-full min-h-screen p-4 md:p-8 flex items-center justify-center font-sans">
        <div className="w-full max-w-4xl h-[450px] shadow-2xl rounded-lg transition-all duration-300">
            {/* Secara kondisional merender komponen berdasarkan lebar layar.
              Jika lebar lebih besar dari breakpoint, tampilkan WeatherDashboard.
              Jika tidak, tampilkan SmallScreenComponent.
            */}
            {width > breakpoint ? <WeatherDashboard /> : <SmallScreenComponent width={width} />}
        </div>
    </div>
  );
}
