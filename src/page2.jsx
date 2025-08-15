import React, { useState, useEffect, useRef } from 'react';
import { 
    Sun, CloudFog, CloudSun, Cloud, Cloudy, CloudDrizzle, CloudRain, 
    CloudRainWind, CloudLightning, Wind, Waves, Thermometer, Map, 
    List, Navigation, Moon, Anchor 
} from 'lucide-react';
import axios from 'axios';

// ============================================================================
// # DEFINISI TEMA & KONSTANTA
// ============================================================================

const lightTheme = {
  gradient: "bg-gradient-to-br from-sky-400 to-blue-600",
  background: { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D" },
  overlay: "bg-cyan-500/20",
  overlay2: "bg-sky-400/30",
  sidebar: "bg-sky-100/20 border-white/30",
  glassCardClass: "bg-white/60 border-white/40 shadow-lg rounded-3xl backdrop-blur-sm",
  text: { primary: "text-slate-800", secondary: "text-slate-600", placeholder: "placeholder-slate-500" },
  nav: { text: "text-sky-800", hoverBg: "bg-white/50", activeFill: "bg-sky-500/80" },
  border: "border-slate-800/10"
};

const darkTheme = {
  background: { image: "https://images.unsplash.com/photo-1537110999185-86361a1a457c?q=80&w=1974&auto=format&fit=crop" },
  overlay: "bg-blue-900/40",
  overlay2: "bg-gray-900/50",
  sidebar: "bg-gray-900/30 border-white/10",
  glassCardClass: "bg-gray-800/40 border-white/10 shadow-lg rounded-3xl backdrop-blur-md",
  text: { primary: "text-white", secondary: "text-gray-300", placeholder: "placeholder-gray-400" },
  nav: { text: "text-gray-300", hoverBg: "bg-white/10", activeFill: "bg-blue-600/80" },
  border: "border-white/10"
};

// Peringkat kondisi cuaca untuk menentukan kondisi dominan/terburuk
const WEATHER_SEVERITY = {
  'Cerah': 0, 'Cerah Berawan': 1, 'Berawan': 2, 'Berawan Tebal': 3,
  'Kabut': 4, 'Hujan Ringan': 5, 'Hujan Sedang': 6, 'Hujan Lebat': 7,
  'Hujan Petir': 8, 'default': 99
};

// ============================================================================
// # FUNGSI BANTUAN (HELPERS)
// ============================================================================

/**
 * Menampilkan ikon cuaca berdasarkan kondisi.
 * @param {{condition: string, className?: string}} props
 */
const WeatherIcon = ({ condition, className = "w-16 h-16" }) => {
  const iconMap = {
    'Cerah': <Sun className={`${className} text-yellow-400`} />,
    'Cerah Berawan': <CloudSun className={`${className} text-yellow-400`} />,
    'Berawan': <Cloud className={`${className} text-gray-400`} />,
    'Berawan Tebal': <Cloudy className={`${className} text-gray-500`} />,
    'Hujan Ringan': <CloudDrizzle className={`${className} text-blue-400`} />,
    'Hujan Sedang': <CloudRain className={`${className} text-blue-500`} />,
    'Hujan Lebat': <CloudRainWind className={`${className} text-blue-600`} />,
    'Hujan Petir': <CloudLightning className={`${className} text-purple-500`} />,
    'Kabut': <CloudFog className={`${className} text-gray-400`} />,
    'default': <Cloud className={`${className} text-gray-400`} />
  };
  return iconMap[condition] || iconMap['default'];
};

/**
 * Mengonversi arah mata angin ke derajat untuk rotasi ikon.
 * @param {string} direction - Arah mata angin (e.g., 'Utara', 'Timur Laut').
 * @returns {number} Derajat rotasi.
 */
const windDirectionToDegrees = (direction) => {
  const directions = {
    'Utara': 0, 'Timur Laut': 45, 'Timur': 90, 'Tenggara': 135,
    'Selatan': 180, 'Barat Daya': 225, 'Barat': 270, 'Barat Laut': 315
  };
  return directions[direction] || 0;
};

/**
 * Memberikan warna latar belakang berdasarkan kategori gelombang.
 * @param {string} category - Kategori gelombang (e.g., 'Tenang', 'Tinggi').
 * @returns {string} Kelas warna Tailwind CSS.
 */
const getWaveColor = (category) => {
  const colors = {
    'Tenang': 'bg-blue-300', 'Rendah': 'bg-green-400', 'Sedang': 'bg-yellow-400',
    'Tinggi': 'bg-orange-500', 'Sangat Tinggi': 'bg-red-500', 'Ekstrem': 'bg-purple-600',
  };
  return colors[category] || 'bg-gray-400';
};

// ============================================================================
// # KOMPONEN UI UMUM
// ============================================================================

/**
 * Animasi gelombang untuk item navigasi yang aktif.
 */
const WaveFill = ({ animationDuration, theme, pageKey }) => (
  <div key={pageKey} className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-lg z-0">
    <div
      className="absolute w-full h-full"
      style={{ animation: `wave-fill ${animationDuration}s linear forwards` }}
    >
      <div
        className={`absolute w-[200%] h-[200%] -left-[50%] top-0 ${theme.nav.activeFill}`}
        style={{ animation: `wave-move 4s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite`, borderRadius: '40%' }}
      />
      <div
        className={`absolute w-[200%] h-[200%] -left-[50%] top-0 ${theme.nav.activeFill} opacity-70`}
        style={{ animation: `wave-move 6s cubic-bezier(0.36, 0.45, 0.63, 0.53) -.125s infinite`, borderRadius: '40%' }}
      />
    </div>
  </div>
);

/**
 * Item navigasi di sidebar.
 */
const NavItem = ({ icon: Icon, label, isActive, animationDuration, theme, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-20 h-20 overflow-hidden ${theme.nav.text}`}
  >
    {isActive && <WaveFill animationDuration={animationDuration} theme={theme} pageKey={label} />}
    <div className={`relative z-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${isActive ? 'text-white' : theme.nav.text}`}>
      <Icon className="w-7 h-7 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  </button>
);

/**
 * Sidebar utama aplikasi.
 */
const Sidebar = ({ activePage, handleNavClick, isDarkMode, setIsDarkMode, pageDurations }) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <div className={`${theme.sidebar} backdrop-blur-xl p-2 md:p-3 flex md:flex-col items-center fixed bottom-0 w-full md:relative md:w-24 md:h-screen z-30 shadow-xl`}>
      <div className="hidden md:flex items-center justify-center bg-sky-500 p-3 rounded-2xl mb-6 shadow-md">
        <CloudLightning className="w-8 h-8 text-white" />
      </div>
      <nav className="w-full md:w-auto flex-grow flex flex-row md:flex-col justify-around md:justify-start md:items-center">
        <NavItem icon={List} label="Weather" isActive={activePage === 'weather'} onClick={() => handleNavClick('weather')} animationDuration={pageDurations.weather / 1000} theme={theme} />
        <NavItem icon={Anchor} label="Cities" isActive={activePage === 'cities'} onClick={() => handleNavClick('cities')} animationDuration={pageDurations.cities / 1000} theme={theme} />
        <NavItem icon={Map} label="Map" isActive={activePage === 'map'} onClick={() => handleNavClick('map')} animationDuration={pageDurations.map / 1000} theme={theme} />
        <NavItem icon={Waves} label="Perairan" isActive={activePage === 'perairan'} onClick={() => handleNavClick('perairan')} animationDuration={pageDurations.perairan / 1000} theme={theme} />
      </nav>
      <div className="hidden md:flex mt-auto">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-full transition-colors ${theme.nav.text} hover:${theme.nav.hoverBg}`}>
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </div>
  );
};

/**
 * Komponen jam dan tanggal.
 */
const Clock = ({ theme, isDarkMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const options = {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', hour12: false
  };
  const formattedDateTime = new Intl.DateTimeFormat('id-ID', options).format(time).replace('.', ':');

  return (
    <div className={`fixed bottom-20 md:bottom-0 right-0 z-50 px-4 py-2 md:py-3 rounded-tl-2xl text-center ${isDarkMode ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-sm`}>
      <p className={`font-semibold text-sm md:text-base ${theme.text.primary}`}>{formattedDateTime}</p>
    </div>
  );
};

/**
 * Teks berjalan untuk informasi gempa.
 */
const RunningText = ({ theme }) => {
  const [runningText, setRunningText] = useState('Memuat informasi gempa terkini...');

  useEffect(() => {
    const fetchEarthquakeData = async () => {
      try {
        const response = await axios.get('https://bmkg-content-inatews.storage.googleapis.com/datagempa.json');
        const infoGempa = response.data.info;
        const combinedText = `${infoGempa.instruction} --- ${infoGempa.description}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`;
        setRunningText(combinedText);
      } catch (error) {
        console.error("Gagal mengambil data gempa:", error);
        setRunningText("Gagal memuat informasi gempa. Silakan coba lagi nanti.\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");
      }
    };

    fetchEarthquakeData();
    const intervalId = setInterval(fetchEarthquakeData, 300000); // Fetch every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 w-full h-10 flex items-center z-20 ${theme.sidebar} backdrop-blur-xl md:hidden`}>
      <div className="w-full overflow-hidden whitespace-nowrap">
        <div className="inline-block" style={{ animation: 'marquee 60s linear infinite' }}>
          <span className={`text-lg font-medium ${theme.text.primary}`}>{runningText}</span>
          <span className={`text-lg font-medium ${theme.text.primary}`}>{runningText}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// # KOMPONEN HALAMAN & FITUR
// ============================================================================

// ----------------------------------------------------------------------------
// ## Komponen untuk Halaman "Weather"
// ----------------------------------------------------------------------------

const HourlyForecastCard = ({ time, icon, temp, windSpeed, windGust, waveHeight, waveCategory, theme }) => (
  <div className={`flex flex-col items-center justify-between rounded-2xl p-4 mx-2 w-36 h-52 flex-shrink-0 ${theme.glassCardClass} ${theme.text.primary}`}>
    <span className={`${theme.text.secondary} text-base font-semibold`}>{time}</span>
    <WeatherIcon condition={icon} className="w-12 h-12 my-1" />
    <span className="text-3xl font-bold">{temp}°</span>
    <div className={`w-full mt-2 pt-2 border-t ${theme.border} text-sm`}>
      <div className="flex justify-center items-center space-x-1">
        <Wind className={`w-4 h-4 ${theme.text.secondary}`} />
        <span className={`${theme.text.primary} font-semibold`}>{windSpeed}</span>
        <span className={theme.text.secondary}>({windGust}) knot</span>
      </div>
      <div className="flex justify-center items-center space-x-1 mt-1">
        <Waves className={`w-4 h-4 ${theme.text.secondary}`} />
        <span className={`${theme.text.primary} font-semibold`}>{waveHeight}m</span>
        <span className={theme.text.secondary}>({waveCategory})</span>
      </div>
    </div>
  </div>
);

const DailyForecastItem = ({ day, icon, condition, temp, theme }) => (
  <div className={`flex items-center justify-between p-3 border-b ${theme.border} last:border-b-0`}>
    <span className={`${theme.text.secondary} w-1/4`}>{day}</span>
    <div className={`flex items-center w-1/2 ${theme.text.primary}`}>
      <WeatherIcon condition={condition} className="w-6 h-6 mr-2" />
      <span>{condition}</span>
    </div>
    <span className={`${theme.text.secondary}`}>{temp}</span>
  </div>
);

const Calendar = ({ theme }) => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const date = today.getDate();

  const monthName = today.toLocaleDateString('id-ID', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={`${theme.glassCardClass} p-4 rounded-3xl h-full`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-bold text-lg ${theme.text.primary}`}>{monthName} {year}</h3>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {daysOfWeek.map(day => <div key={day} className={`font-semibold ${theme.text.secondary}`}>{day}</div>)}
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map(d => (
          <div key={d} className={`p-1 rounded-full ${d === date ? 'bg-sky-500 text-white' : ''} ${theme.text.primary}`}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

const MapComponent = ({ portId, theme }) => {
  const [location, setLocation] = useState(null);
  const [allPortsData, setAllPortsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Fetch all port metadata once
  useEffect(() => {
    const fetchPortMetadata = async () => {
      try {
        const response = await fetch('https://maritim.bmkg.go.id/marine-data/meta/port_province.json');
        if (!response.ok) throw new Error('Gagal mengambil data dari jaringan');
        const data = await response.json();
        setAllPortsData(data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPortMetadata();
  }, []);

  // Find the specific port location when portId or metadata changes
  useEffect(() => {
    if (allPortsData && portId) {
      setIsLoading(true);
      setError('');
      let foundPort = null;
      for (const provinceData of allPortsData) {
        const port = provinceData.ports.find(p => p.id === portId);
        if (port) {
          foundPort = port;
          break;
        }
      }
      if (foundPort) {
        setLocation(foundPort);
      } else {
        setError(`Pelabuhan dengan ID "${portId}" tidak ditemukan.`);
        setLocation(null);
      }
      setIsLoading(false);
    }
  }, [portId, allPortsData]);

  // Initialize and update the map
  useEffect(() => {
    const L = window.L;
    if (!L || !mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {}).addTo(mapRef.current);
    }

    // Update map view and marker when location changes
    if (location && mapRef.current) {
      const { lat, lon } = location;
      mapRef.current.setView([lat, lon], 11);
      if (markerRef.current) {
        markerRef.current.remove();
      }
      markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);
    }
  }, [location]);

  return (
    <div className={`${theme.glassCardClass} p-4 rounded-3xl h-full flex flex-col`}>
      <div className="h-16 text-center flex flex-col items-center justify-center mb-2">
        {isLoading && <p className={theme.text.secondary}>Memuat Peta...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {location && <h3 className={`font-bold text-lg ${theme.text.primary}`}>{location.name}</h3>}
      </div>
      <div ref={mapContainerRef} className="w-full h-full rounded-xl bg-gray-200 flex-grow" />
    </div>
  );
};

// ----------------------------------------------------------------------------
// ## Komponen untuk Halaman "Cities"
// ----------------------------------------------------------------------------

const CityCard = ({ port, tempRange, conditionText, windSpeed, windGust, windDirection, waveRange, waveCategory, theme }) => (
  <div className={`${theme.glassCardClass} p-5 flex flex-col justify-between h-[290px] w-full`}>
    <div>
      <p className={`${theme.text.secondary} text-sm`}>Pelabuhan</p>
      <h3 className={`text-xl font-bold ${theme.text.primary}`}>{port}</h3>
    </div>
    <div className='flex-grow flex flex-col justify-center'>
      <div className="flex flex-row items-center justify-center space-x-4">
        <div className="flex flex-col items-center justify-center w-1/2">
          <WeatherIcon condition={conditionText} className="w-16 h-16" />
          <p className={`text-lg font-bold ${theme.text.primary} mt-1 text-center`}>{conditionText}</p>
        </div>
        <div className={`w-1/2 self-stretch border-l ${theme.border} flex flex-col justify-center space-y-3 pl-4`}>
          <div className="flex flex-col items-center justify-center">
            <Thermometer className="w-6 h-6 mb-1 text-red-500" />
            <span className={`${theme.text.primary} text-sm font-bold`}>{tempRange}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Navigation className={`w-6 h-6 mb-1 ${theme.text.secondary}`} style={{ transform: `rotate(${windDirection}deg)` }} />
            <span className={`${theme.text.primary} text-sm font-bold`}>{windSpeed} knot</span>
            <span className={`${theme.text.secondary} text-xs`}>Gust {windGust} knot</span>
          </div>
        </div>
      </div>
    </div>
    <div className={`mt-auto pt-3 border-t ${theme.border} flex items-center justify-center space-x-3`}>
      <Waves className="w-5 h-5 text-cyan-500" />
      <div className={`w-4 h-4 rounded-full ${getWaveColor(waveCategory)}`} />
      <span className={`font-semibold text-sm ${theme.text.primary}`}>{waveCategory}</span>
      <span className={`text-sm ${theme.text.secondary}`}>({waveRange})</span>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// ## Komponen Halaman Utama (Pages)
// ----------------------------------------------------------------------------

const WeatherPage = ({ theme, list }) => {
  const [portData, setPortData] = useState([]);
  const [activePortIndex, setActivePortIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urls = list.map(id => `https://maritim.bmkg.go.id/marine-data/pelabuhan/${id}.json`);
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const allData = responses.map(res => res.data);
        setPortData(allData);
      } catch (error) {
        console.error('Gagal mengambil data cuaca:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [list]);

  // Carousel timer
  useEffect(() => {
    if (portData.length > 1) {
      const timer = setInterval(() => {
        setActivePortIndex(prevIndex => (prevIndex + 1) % portData.length);
      }, 15000); // Ganti setiap 15 detik
      return () => clearInterval(timer);
    }
  }, [portData]);

  if (loading || portData.length === 0) {
    return <div className={`text-center p-10 ${theme.text.primary}`}>Memuat Data Cuaca...</div>;
  }

  const data = portData[activePortIndex];
  const now = new Date();

  // Find the forecast for the upcoming hour
  let closestIndex = 0;
  let minDiff = Infinity;
  data.forecast_day1.forEach((forecast, index) => {
    const diff = Math.abs(new Date(forecast.time) - now);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });
  const nextHourIndex = closestIndex + 1;
  const displayIndex = nextHourIndex < data.forecast_day1.length ? nextHourIndex : closestIndex;
  const displayForecast = data.forecast_day1[displayIndex];

  // Prepare hourly data for the slider
  const hourlyData = data.forecast_day1
    .filter(item => new Date(item.time) >= new Date(now.getTime() - 60 * 60 * 1000))
    .map(item => ({
      time: new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':'),
      icon: item.weather, temp: item.temp_avg, windSpeed: item.wind_speed,
      windGust: item.wind_gust, waveHeight: item.wave_height, waveCategory: item.wave_cat
    }));

  // Process data for the weekly forecast
  const processDailyForecast = (forecasts) => {
    if (!forecasts || forecasts.length === 0) return [];
    const dailySummaries = {};
    forecasts.forEach(forecast => {
      const date = forecast.time.split(' ')[0];
      if (!dailySummaries[date]) {
        dailySummaries[date] = { temps: [], conditions: {} };
      }
      dailySummaries[date].temps.push(forecast.temp_avg);
      dailySummaries[date].conditions[forecast.weather] = (dailySummaries[date].conditions[forecast.weather] || 0) + 1;
    });
    return Object.keys(dailySummaries).map(date => {
      const summary = dailySummaries[date];
      const dominantCondition = Object.keys(summary.conditions).reduce((a, b) =>
        (WEATHER_SEVERITY[a] || WEATHER_SEVERITY.default) > (WEATHER_SEVERITY[b] || WEATHER_SEVERITY.default) ? a : b
      );
      return {
        day: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
        icon: dominantCondition, condition: dominantCondition,
        temp: `${Math.max(...summary.temps)}° / ${Math.min(...summary.temps)}°`
      };
    });
  };
  const dailyData = processDailyForecast(data['forecast_day2-4']);

  return (
    <div key={activePortIndex} className="flex flex-col gap-6 card-container animate-page-fade-in">
      {/* Top Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`${theme.glassCardClass} p-6 flex flex-col sm:flex-row items-center justify-between card-item lg:w-1/2`}>
          <div>
            <h2 className={`text-3xl font-bold ${theme.text.primary}`}>{data.name}</h2>
            <p className={theme.text.secondary}>Prakiraan Pukul {new Date(displayForecast.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')}</p>
            <p className={`text-7xl sm:text-8xl font-bold my-4 ${theme.text.primary}`}>{displayForecast.temp_avg}°</p>
            <div className={`mt-4 pt-4 border-t ${theme.border} flex items-center space-x-8`}>
              <div className="flex items-center space-x-2">
                <Wind className={`w-7 h-7 ${theme.text.secondary}`} />
                <div>
                  <p className={`text-lg font-semibold ${theme.text.primary}`}>{displayForecast.wind_speed} knot</p>
                  <p className={`text-sm ${theme.text.secondary}`}>{displayForecast.wind_from}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Waves className={`w-7 h-7 ${theme.text.secondary}`} />
                <div>
                  <p className={`text-lg font-semibold ${theme.text.primary}`}>{displayForecast.wave_height} m</p>
                  <p className={`text-sm ${theme.text.secondary}`}>{displayForecast.wave_cat}</p>
                </div>
              </div>
            </div>
          </div>
          <WeatherIcon condition={displayForecast.weather} className="w-36 h-36" />
        </div>
        <div className="card-item lg:w-1/4">
          <Calendar theme={theme} />
        </div>
        <div className={`${theme.glassCardClass} p-6 card-item lg:w-1/4 flex flex-col`}>
          <h3 className={`font-semibold mb-2 uppercase text-sm ${theme.text.secondary}`}>Prakiraan Mingguan</h3>
          <div className="space-y-1 flex-grow flex flex-col justify-around">
            {dailyData.slice(0, 5).map((item, index) => (<DailyForecastItem key={index} {...item} theme={theme} />))}
          </div>
        </div>
      </div>
      {/* Bottom Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`${theme.glassCardClass} pt-6 pb-4 card-item lg:w-2/3`}>
          <h3 className={`font-semibold uppercase text-sm px-6 mb-4 ${theme.text.secondary}`}>Prakiraan Hari Ini</h3>
          <div className="slider-container">
            <div className="slider-track">
              {hourlyData.length > 0
                ? [...hourlyData, ...hourlyData].map((item, index) => (<HourlyForecastCard key={index} {...item} theme={theme} />))
                : <p className={`px-6 ${theme.text.secondary}`}>Tidak ada prakiraan lebih lanjut untuk hari ini.</p>}
            </div>
          </div>
        </div>
        <div className="card-item lg:w-1/3">
          <MapComponent portId={data.code} theme={theme} />
        </div>
      </div>
    </div>
  );
};

const CitiesPage = ({ theme }) => {
    const [portData, setPortData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('today');
    const todayRef = useRef(null);
    const tomorrowRef = useRef(null);
    const dayAfterRef = useRef(null);

    // Daftar ID pelabuhan yang akan ditampilkan
    const PORT_IDS_CITIES = ['AA001', 'AA004', 'AA005', 'AA006', 'AA007'];

    useEffect(() => {
        const urls = PORT_IDS_CITIES.map(id => `https://maritim.bmkg.go.id/marine-data/pelabuhan/${id}.json`);
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const responses = await Promise.allSettled(urls.map(url => axios.get(url)));
                const allData = responses
                    .filter(res => res.status === 'fulfilled' && res.value.data)
                    .map(res => res.value.data);
                setPortData(allData);
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllData();
    }, []);

    const getDailySummary = (port, dayOffset) => {
        const targetDate = new Date(port.valid_from);
        targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
        const targetDateString = targetDate.toISOString().split('T')[0];
        
        const allForecasts = [...(port.forecast_day1 || []), ...(port['forecast_day2-4'] || [])];
        const dailyForecasts = allForecasts.filter(f => f.time.startsWith(targetDateString));

        if (dailyForecasts.length === 0) return null;

        const summary = dailyForecasts.reduce((acc, f) => ({
            worstWeather: (WEATHER_SEVERITY[f.weather] || WEATHER_SEVERITY.default) > (WEATHER_SEVERITY[acc.worstWeather] || WEATHER_SEVERITY.default) ? f.weather : acc.worstWeather,
            minTemp: Math.min(acc.minTemp, f.temp_avg),
            maxTemp: Math.max(acc.maxTemp, f.temp_avg),
            minWave: Math.min(acc.minWave, f.wave_height),
            maxWave: Math.max(acc.maxWave, f.wave_height),
            maxWindGust: Math.max(acc.maxWindGust, f.wind_gust),
            waveCategoryForMax: f.wave_height > acc.maxWave ? f.wave_cat : acc.waveCategoryForMax,
        }), {
            worstWeather: dailyForecasts[0].weather, minTemp: dailyForecasts[0].temp_avg,
            maxTemp: dailyForecasts[0].temp_avg, minWave: dailyForecasts[0].wave_height,
            maxWave: dailyForecasts[0].wave_height, maxWindGust: dailyForecasts[0].wind_gust,
            waveCategoryForMax: dailyForecasts[0].wave_cat
        });

        return {
            name: port.name.replace('Pelabuhan ', ''),
            tempRange: `${summary.minTemp}° - ${summary.maxTemp}°`,
            conditionText: summary.worstWeather,
            windSpeed: dailyForecasts[0].wind_speed,
            windGust: summary.maxWindGust,
            windDirection: windDirectionToDegrees(dailyForecasts[0].wind_from),
            waveRange: `${summary.minWave} - ${summary.maxWave} m`,
            waveCategory: summary.waveCategoryForMax,
        };
    };

    const handleScrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

    const renderForecastSection = (title, dayOffset, ref) => (
        <div ref={ref} className="card-item mb-8 animate-page-fade-in">
            <h2 className={`text-2xl font-bold mb-4 ${theme.text.primary}`}>{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {portData.map((port, index) => {
                    if (!port?.valid_from) return null;
                    const summary = getDailySummary(port, dayOffset);
                    if (!summary) return null; 

                    return (
                        <div key={`${port.code}-${dayOffset}`} style={{animationDelay: `${index * 50}ms`}} className="animate-fade-in-up">
                            <CityCard {...summary} theme={theme} />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex flex-row gap-6">
            <div className="flex-grow">
                {isLoading ? (
                    <div className={`text-center p-10 ${theme.text.primary}`}>Memuat Data Pelabuhan...</div>
                ) : (
                    <div>
                        {renderForecastSection('Prakiraan Hari Ini', 0, todayRef)}
                        {renderForecastSection('Prakiraan Besok', 1, tomorrowRef)}
                        {renderForecastSection('Prakiraan Lusa', 2, dayAfterRef)}
                    </div>
                )}
            </div>
            <div className="hidden lg:flex flex-col space-y-4 sticky top-6 h-min">
                <button onClick={() => handleScrollTo(todayRef)} className={`p-3 rounded-lg font-semibold transition-colors ${activeSection === 'today' ? 'bg-sky-500 text-white' : theme.glassCardClass}`}>Hari Ini</button>
                <button onClick={() => handleScrollTo(tomorrowRef)} className={`p-3 rounded-lg font-semibold transition-colors ${activeSection === 'tomorrow' ? 'bg-sky-500 text-white' : theme.glassCardClass}`}>Besok</button>
                <button onClick={() => handleScrollTo(dayAfterRef)} className={`p-3 rounded-lg font-semibold transition-colors ${activeSection === 'dayAfter' ? 'bg-sky-500 text-white' : theme.glassCardClass}`}>Lusa</button>
            </div>
        </div>
    );
};

const PerairanPage = ({ theme }) => {
    const [mapTitle, setMapTitle] = useState('Peta Prakiraan Kategori Gelombang');
    const [forecastData, setForecastData] = useState(null);
    const [timeSteps, setTimeSteps] = useState([]);
    const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const mapRef = useRef(null);
    const featureLayersRef = useRef({}); // Ref untuk menyimpan layer poligon
    const mapContainerRef = useRef(null);
    const intervalRef = useRef(null);

    const kategoriGelombang = {
      Tenang: { color: "#2793f2" },
      Rendah: { color: "#00d342" },
      Sedang: { color: "#fff200" },
      Tinggi: { color: "#fd8436" },
      'Sangat Tinggi': { color: "#fb0510" },
      Ekstrem: { color: "#ef38ce" },
      'Sangat Ekstrem': { color: "#000000" },
      unknown: { color: "#808080" }
    };

    const getColorForWaveCategory = (category) => {
        return kategoriGelombang[category]?.color || kategoriGelombang.unknown.color;
    };

    async function fetchAndProcessForecasts(url = 'https://maritim.bmkg.go.id/marine-data/combine/forecast.json') {
        const dayjs = window.dayjs;
        const utc = window.dayjs_plugin_utc;
        dayjs.extend(utc);

        const weather_dict = { 1: 'Cerah', 2: 'Cerah Berawan', 3: 'Berawan', 4: 'Berawan Tebal', 5: 'Hujan Ringan', 6: 'Hujan Sedang', 7: 'Hujan Lebat', 8: 'Hujan Sangat Lebat', 9: 'Hujan Ekstrem', 10: 'Hujan Petir', 11: 'Kabut/Asap', 12: 'Udara Kabur', 13: 'Kabut', 14: 'Petir', '': 'unknown' };
        const wave_cat_dict = { 1: "Tenang", 2: "Rendah", 3: "Sedang", 4: "Tinggi", 5: "Sangat Tinggi", 6: "Ekstrem", 7: "Sangat Ekstrem", '': 'unknown' };
        const dir_dict = { 1: "Utara", 2: "Utara Timur Laut", 3: "Timur Laut", 4: "Timur Timur Laut", 5: "Timur", 6: "Timur Tenggara", 7: "Tenggara", 8: "Selatan Tenggara", 9: "Selatan", 10: "Selatan Barat Daya", 11: "Barat Daya", 12: "Barat Barat Daya", 13: "Barat", 14: "Barat Barat Laut", 15: "Barat Laut", 16: "Utara Barat Laut", '': 'unknown' };

        function parseFctCode(id, fct_code) {
            const parts = fct_code.split('|');
            const timeStr = parts[0];
            const year = new Date().getFullYear();
            const base = dayjs.utc(`${year}${timeStr}`, 'YYYYMMDDHH').toDate();
            const forecasts = parts.slice(1).map((part, idx) => {
                const row = part.split(',');
                const dt = new Date(base);
                const i = idx + 1;
                dt.setHours(dt.getHours() + (i <= 25 ? i - 1 : 24 + ((i - 25) * 3)));
                return { id, time: dt, weather: row[0] ? weather_dict[row[0]] : 'unknown', wave_cat: row[1] ? wave_cat_dict[row[1]] : 'unknown', wave_height: row[2] ? parseFloat(row[2]) : 0, wind_speed: row[3] ? parseInt(row[3]) : 0, wind_gust: row[4] ? parseInt(row[4]) : 0, wind_from: row[5] ? dir_dict[row[5]] : 'unknown' };
            });
            return forecasts;
        }

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            const data = await resp.json();
            const lookup = {};
            const allTimes = new Set();
            const now = new Date();

            for (const area of data.area) {
                const allForecasts = parseFctCode(area.id, area.fct_code);
                const futureForecasts = allForecasts.filter(f => f.time > now);

                if (futureForecasts.length > 0) {
                    lookup[area.id] = futureForecasts;
                    futureForecasts.forEach(f => allTimes.add(f.time.toISOString()));
                } else if (allForecasts.length > 0) {
                    const lastForecast = allForecasts[allForecasts.length - 1];
                    lookup[area.id] = [lastForecast];
                    allTimes.add(lastForecast.time.toISOString());
                }
            }

            const sortedTimes = Array.from(allTimes).sort();
            setTimeSteps(sortedTimes);
            setForecastData(lookup);
        } catch (err) {
            console.error('Error fetching or parsing forecasts:', err);
            throw err;
        }
    }

    // Inisialisasi peta dan gambar poligon awal
    useEffect(() => {
        const initializeMap = async () => {
            if (mapRef.current || !mapContainerRef.current || !window.L || !window.dayjs) return;

            mapRef.current = window.L.map(mapContainerRef.current, { attributionControl: false }).setView([-2.548926, 118.0148634], 5);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            try {
                const [geojsonData] = await Promise.all([
                    fetch('https://maritim.bmkg.go.id/marine-data/meta/wilmetos.min.geojson').then(res => res.json()),
                    fetchAndProcessForecasts()
                ]);

                // Gambar poligon sekali saja dan simpan referensinya
                window.L.geoJSON(geojsonData, {
                    style: feature => ({
                        color: "#333", weight: 1, opacity: 0.8,
                        fillColor: kategoriGelombang.unknown.color, fillOpacity: 0.75
                    }),
                    onEachFeature: (feature, layer) => {
                        featureLayersRef.current[feature.properties.ID_MAR] = layer;
                    }
                }).addTo(mapRef.current);

                const legend = window.L.control({ position: 'bottomright' });
                legend.onAdd = function (map) {
                    const div = window.L.DomUtil.create('div', 'info legend');
                    let labels = ['<strong>Kategori Gelombang</strong>'];
                    for (const category in kategoriGelombang) {
                        const { color } = kategoriGelombang[category];
                        const label = category === 'unknown' ? 'Tidak Ada Data' : category;
                        labels.push(`<i style="background:${color}"></i> ${label}`);
                    }
                    div.innerHTML = labels.join('<br>');
                    return div;
                };
                legend.addTo(mapRef.current);
            } catch (error) {
                console.error("Gagal menginisialisasi peta:", error);
            }
        };

        if (!window.L || !window.dayjs) {
            const loadScript = (src, id) => new Promise((resolve, reject) => {
                if (document.getElementById(id)) { resolve(); return; }
                const script = document.createElement('script');
                script.src = src; script.id = id; script.async = true;
                script.onload = resolve; script.onerror = reject;
                document.head.appendChild(script);
            });
            Promise.all([
                loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "leaflet-script"),
                loadScript("https://unpkg.com/dayjs@1.11.10/dayjs.min.js", "dayjs-script")
            ]).then(() => {
                loadScript("https://unpkg.com/dayjs@1.11.10/plugin/utc.js", "dayjs-utc-plugin").then(() => {
                    window.dayjs.extend(window.dayjs_plugin_utc);
                    initializeMap();
                });
            }).catch(err => console.error("Gagal memuat skrip eksternal:", err));
        } else {
            initializeMap();
        }
        return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, []);

    // Perbarui gaya & popup saat indeks waktu berubah
    useEffect(() => {
        if (Object.keys(featureLayersRef.current).length === 0 || !forecastData || timeSteps.length === 0 || !window.dayjs) return;

        const currentTime = timeSteps[currentTimeIndex];

        for (const regionId in featureLayersRef.current) {
            const layer = featureLayersRef.current[regionId];
            const regionForecasts = forecastData[regionId];
            let waveCategoryColor = kategoriGelombang.unknown.color;
            let popupContent = `Prakiraan cuaca untuk wilayah ini (${regionId}) tidak tersedia.`;

            if (regionForecasts) {
                const forecast = regionForecasts.find(f => f.time.toISOString() === currentTime);
                if (forecast) {
                    waveCategoryColor = getColorForWaveCategory(forecast.wave_cat);
                    popupContent = `<div style="font-family: sans-serif; line-height: 1.5;"><h3 style="margin: 0 0 5px 0; font-size: 16px;">${layer.feature.properties.nama}</h3><strong>Waktu:</strong> ${window.dayjs(forecast.time).format('DD MMM YYYY, HH:mm')}<hr style="margin: 5px 0;"><strong>Cuaca:</strong> ${forecast.weather}<br><strong>Tinggi Gelombang:</strong> ${forecast.wave_height} m (${forecast.wave_cat})<br><strong>Angin:</strong> ${forecast.wind_speed} knots dari ${forecast.wind_from}</div>`;
                }
            }
            layer.setStyle({ fillColor: waveCategoryColor });
            layer.bindPopup(popupContent);
        }
    }, [forecastData, timeSteps, currentTimeIndex]);

    // Logika Autoplay
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTimeIndex(prev => {
                    const nextIndex = prev + 1;
                    if (nextIndex >= timeSteps.length) {
                        clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return prev;
                    }
                    return nextIndex;
                });
            }, 1500); // Ganti waktu setiap 1.5 detik
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, timeSteps]);

    const handleTogglePlay = () => {
        if (currentTimeIndex >= timeSteps.length - 1) {
            setCurrentTimeIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={`flex flex-col h-[calc(100vh-4rem)] ${theme.glassCardClass} rounded-3xl overflow-hidden`}>
            <header className="p-4 z-10 border-b ${theme.border}">
                <h1 className={`text-xl font-bold text-center ${theme.text.primary}`}>{mapTitle}</h1>
                <p className={`text-center text-sm ${theme.text.secondary} mb-3`}>Sumber data: BMKG</p>

                {timeSteps.length > 0 && (
                    <div className="max-w-md mx-auto bg-white/20 p-2 rounded-lg shadow-inner flex items-center justify-between space-x-2">
                        <button
                            onClick={handleTogglePlay}
                            className="px-4 py-2 bg-sky-500 text-white rounded-md font-bold w-24 text-center transition-colors duration-300 hover:bg-sky-600"
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <div className="text-center flex-grow">
                            <div className={`text-xs ${theme.text.secondary}`}>Waktu Prakiraan</div>
                            <div className={`font-bold text-base ${theme.text.primary}`}>
                                {window.dayjs ? window.dayjs(timeSteps[currentTimeIndex]).format('ddd, DD MMM YYYY HH:mm') : 'Memuat...'}
                            </div>
                        </div>
                        <div className="w-24" />
                    </div>
                )}
            </header>
            <main className="flex-grow relative">
                <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '100%' }} />
            </main>
        </div>
    );
};


// ============================================================================
// # KOMPONEN UTAMA APLIKASI
// ============================================================================

export default function App() {
  const pages = ['weather', 'cities', 'map', 'perairan'];
  const portIdsForWeatherPage = ['AA005', 'AA003', 'AA006']; // ID untuk halaman cuaca utama

  const pageDurations = {
    weather: 15000 * portIdsForWeatherPage.length, // 15 detik per port
    cities: 20000,
    map: 10000,
    perairan: 999999, // Durasi panjang agar tidak otomatis berganti
  };

  const [activePage, setActivePage] = useState(pages[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  // Automatic page carousel
  useEffect(() => {
    const duration = pageDurations[activePage];
    const timer = setTimeout(() => {
      const currentIndex = pages.indexOf(activePage);
      const nextIndex = (currentIndex + 1) % pages.length;
      setActivePage(pages[nextIndex]);
    }, duration);
    return () => clearTimeout(timer);
  }, [activePage, pages, pageDurations]);

  return (
    <>
      <style>
        {`
          /* Leaflet CSS Import */
          @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
          
          .leaflet-container { font-family: 'Inter', sans-serif; background: transparent; }
          .leaflet-popup-content-wrapper, .leaflet-popup-tip { 
            background-color: rgba(255, 255, 255, 0.8); 
            backdrop-filter: blur(10px); 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
          }
          .dark .leaflet-popup-content-wrapper, .dark .leaflet-popup-tip { 
            background-color: rgba(31, 41, 55, 0.8); 
            color: white; 
          }
          .dark .leaflet-tile-pane { 
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7); 
          }

          /* Leaflet Legend */
          .info.legend {
              padding: 6px 8px;
              font: 14px/16px Arial, Helvetica, sans-serif;
              background: white;
              background: rgba(255,255,255,0.8);
              box-shadow: 0 0 15px rgba(0,0,0,0.2);
              border-radius: 5px;
              line-height: 18px;
              color: #555;
          }
          .dark .info.legend {
              background: rgba(31, 41, 55, 0.8);
              color: #eee;
          }
          .info.legend i {
              width: 18px;
              height: 18px;
              float: left;
              margin-right: 8px;
              opacity: 0.9;
              border: 1px solid #555;
          }

          /* General Animations */
          @keyframes wave-fill {
            from { transform: translateY(105%); }
            to { transform: translateY(0%); }
          }
          @keyframes wave-move {
            100% { transform: rotate(360deg); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-page-fade-in {
            animation: fade-in-up 0.7s ease-in-out;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          /* Hourly Forecast Slider */
          .slider-container {
            overflow: hidden; 
            position: relative; 
            width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .slider-track { 
            display: flex; 
            animation: scroll 60s linear infinite; 
          }
          @keyframes scroll { 
            from { transform: translateX(0); } 
            to { transform: translateX(calc(-160px * 8)); } 
          }
          .slider-container:hover .slider-track { 
            animation-play-state: paused; 
          }
        `}
      </style>
      
      <div 
        className={`min-h-screen flex flex-col md:flex-row font-sans relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'dark bg-cover bg-center' : theme.gradient}`}
        style={{ backgroundImage: isDarkMode ? `url(${theme.background.image})` : 'none' }}
      >
        {/* Decorative Blobs */}
        <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-50 animate-blob ${theme.overlay}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000 ${theme.overlay2}`} />

        <Sidebar 
          activePage={activePage} 
          handleNavClick={handleNavClick} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          pageDurations={pageDurations} 
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-40 md:pb-8 overflow-y-auto z-10">
          <div key={activePage}>
            {activePage === 'weather' && <WeatherPage theme={theme} list={portIdsForWeatherPage} />}
            {activePage === 'cities' && <CitiesPage theme={theme} />}
            {activePage === 'map' && <div className={`${theme.glassCardClass} p-6`}><h1 className={`text-3xl font-bold ${theme.text.primary}`}>Halaman Peta (Dalam Pengembangan)</h1></div>}
            {activePage === 'perairan' && <PerairanPage theme={theme} />}
          </div>
        </main>

        <Clock theme={theme} isDarkMode={isDarkMode} />
        <RunningText theme={theme} />
      </div>
    </>
  );
}
