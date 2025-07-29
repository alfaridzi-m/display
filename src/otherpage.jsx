import React, { useState, useEffect, useRef } from 'react';
import { Sun, CloudFog, CloudSun, Cloud, Cloudy, CloudDrizzle, CloudRain, CloudRainWind, CloudLightning, Wind, Droplets, Thermometer, Map, List, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
import axios from 'axios';

// --- Komponen Pembantu ---

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

const windDirectionToDegrees = (direction) => {
    const directions = {
        'Utara': 0, 'Timur Laut': 45, 'Timur': 90, 'Tenggara': 135,
        'Selatan': 180, 'Barat Daya': 225, 'Barat': 270, 'Barat Laut': 315
    };
    return directions[direction] || 0;
};


// --- Komponen UI ---

const WaveFill = ({ animationDuration, theme, pageKey }) => (
    <div key={pageKey} className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-lg z-0">
        <div 
            className="absolute w-full h-full"
            style={{ animation: `wave-fill ${animationDuration}s linear forwards`}}
        >
            <div className={`absolute w-[200%] h-[200%] -left-[50%] top-0 ${theme.nav.activeFill}`}
                style={{ 
                    animation: `wave-move 4s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite`,
                    borderRadius: '40%'
                }}
            ></div>
             <div className={`absolute w-[200%] h-[200%] -left-[50%] top-0 ${theme.nav.activeFill} opacity-70`}
                style={{ 
                    animation: `wave-move 6s cubic-bezier(0.36, 0.45, 0.63, 0.53) -.125s infinite`,
                    borderRadius: '40%'
                }}
            ></div>
        </div>
    </div>
);

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

const Sidebar = ({ activePage, handleNavClick, isDarkMode, setIsDarkMode, animationDuration }) => {
    const theme = isDarkMode ? darkTheme : lightTheme;
    return (
      <div className={`${theme.sidebar} backdrop-blur-xl p-2 md:p-3 flex md:flex-col items-center fixed bottom-0 w-full md:relative md:w-24 md:h-screen z-30 shadow-xl`}>
        <div className="hidden md:flex items-center justify-center bg-sky-500 p-3 rounded-2xl mb-6 shadow-md">
          <CloudLightning className="w-8 h-8 text-white" />
        </div>
        <nav className="w-full md:w-auto flex-grow flex flex-row md:flex-col justify-around md:justify-start md:items-center">
          <NavItem icon={List} label="Weather" isActive={activePage === 'weather'} onClick={() => handleNavClick('weather')} animationDuration={animationDuration} theme={theme}/>
          <NavItem icon={Anchor} label="Cities" isActive={activePage === 'cities'} onClick={() => handleNavClick('cities')} animationDuration={animationDuration} theme={theme}/>
          <NavItem icon={Map} label="Map" isActive={activePage === 'map'} onClick={() => handleNavClick('map')} animationDuration={animationDuration} theme={theme}/>
          <NavItem icon={FishSymbol} label="Fish Map" isActive={activePage === 'fish'} onClick={() => handleNavClick('fish')} animationDuration={animationDuration} theme={theme}/>
        </nav>
        <div className="hidden md:flex mt-auto">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-full transition-colors ${theme.nav.text} hover:${theme.nav.hoverBg}`}>
               {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
             </button>
        </div>
      </div>
    );
};

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
        <div className={`fixed bottom-10 md:bottom-0 right-0 z-50 px-4 py-2 md:py-3 rounded-tl-2xl text-center ${isDarkMode ? 'bg-black/50' : 'bg-white/50' } backdrop-blur-sm`}>
            <p className={`font-semibold text-sm md:text-base ${theme.text.primary}`}>{formattedDateTime}</p>
        </div>
    );
};

const RunningText = ({ theme }) => (
    <div className={`fixed bottom-20 md:bottom-0 left-0 w-full h-10 flex items-center z-20 ${theme.sidebar} backdrop-blur-xl`}>
        <div className="relative w-full overflow-hidden h-full">
            <p className={`absolute whitespace-nowrap text-lg font-medium ${theme.text.primary}`} style={{ animation: 'marquee 30s linear infinite' }}>
                Peringatan Dini: Potensi gelombang tinggi di perairan selatan Jawa. Waspada hujan lebat disertai petir di wilayah Jabodetabek sore ini. Suhu di sebagian besar wilayah Indonesia diperkirakan normal.
            </p>
        </div>
    </div>
);


// --- Komponen Halaman ---

const HourlyForecastCard = ({ time, icon, temp, theme }) => (
    <div className={`flex flex-col items-center justify-center rounded-2xl p-4 mx-2 w-28 flex-shrink-0 ${theme.glassCardClass} ${theme.text.primary}`}>
        <span className={`${theme.text.secondary} text-sm`}>{time}</span>
        <WeatherIcon condition={icon} className="w-10 h-10 my-2" />
        <span className="text-xl font-semibold">{temp}°</span>
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

const AirConditionItem = ({ icon: Icon, label, value, unit, theme }) => (
  <div className={`flex items-center ${theme.text.primary}`}>
    <Icon className={`w-6 h-6 mr-3 ${theme.text.secondary}`} />
    <div>
      <span className={`text-sm ${theme.text.secondary}`}>{label}</span>
      <p className="text-xl font-semibold">{value} <span className="text-base font-normal">{unit}</span></p>
    </div>
  </div>
);

const WeatherPage = ({ theme }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = 'https://maritim.bmkg.go.id/marine-data/pelabuhan/AA005.json';

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.error('Gagal mengambil data cuaca:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !data) {
        return <div className={`text-center p-10 ${theme.text.primary}`}>Loading Weather Data...</div>;
    }

    const today = data.forecast_day1[0];
    const hourlyData = data.forecast_day1.map(item => ({
        time: new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        icon: item.weather,
        temp: item.temp_avg
    }));
    
    const dailyData = [
        { day: 'Today', icon: data.forecast_day1[0].weather, condition: data.forecast_day1[0].weather, temp: `${Math.max(...data.forecast_day1.map(f => f.temp_avg))} / ${Math.min(...data.forecast_day1.map(f => f.temp_avg))}` },
        { day: 'Tue', icon: 'Cerah Berawan', condition: 'Cerah Berawan', temp: '37 / 21' },
        { day: 'Wed', icon: 'Cerah', condition: 'Cerah', temp: '37 / 21' },
        { day: 'Thu', icon: 'Berawan', condition: 'Berawan', temp: '37 / 21' },
        { day: 'Fri', icon: 'Berawan Tebal', condition: 'Berawan Tebal', temp: '37 / 21' },
        { day: 'Sat', icon: 'Hujan Ringan', condition: 'Hujan Ringan', temp: '37 / 21' },
        { day: 'Sun', icon: 'Hujan Petir', condition: 'Hujan Petir', temp: '37 / 21' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 card-container">
            <div className="lg:col-span-2 card-item">
                <div className={`${theme.glassCardClass} p-6 flex flex-col sm:flex-row items-center justify-between mb-6`}>
                    <div>
                        <h2 className={`text-3xl font-bold ${theme.text.primary}`}>{data.name}</h2>
                        <p className={theme.text.secondary}>Prakiraan: {today.weather}</p>
                        <p className={`text-7xl sm:text-8xl font-bold my-4 ${theme.text.primary}`}>{today.temp_avg}°</p>
                    </div>
                    <WeatherIcon condition={today.weather} className="w-36 h-36" />
                </div>
                <div className={`${theme.glassCardClass} pt-6 pb-4 mb-6`}>
                    <h3 className={`font-semibold mb-4 uppercase text-sm px-6 ${theme.text.secondary}`}>Prakiraan Hari Ini</h3>
                    <div className="slider-container">
                        <div className="slider-track">
                            {[...hourlyData, ...hourlyData].map((item, index) => (<HourlyForecastCard key={index} {...item} theme={theme}/>))}
                        </div>
                    </div>
                </div>
                <div className={`${theme.glassCardClass} p-6`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-semibold uppercase text-sm ${theme.text.secondary}`}>Kondisi Udara</h3>
                        <button className="bg-sky-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-sky-600">Lihat Detail</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        <AirConditionItem icon={Thermometer} label="Suhu Rata-rata" value={`${today.temp_avg}°`} theme={theme}/>
                        <AirConditionItem icon={Wind} label="Angin" value={today.wind_speed} unit="knot" theme={theme}/>
                        <AirConditionItem icon={Droplets} label="Kelembapan" value={today.rh_avg} unit="%" theme={theme}/>
                        <AirConditionItem icon={Waves} label="Tinggi Gelombang" value={today.wave_height} unit="m" theme={theme}/>
                    </div>
                </div>
            </div>
            <div className={`${theme.glassCardClass} p-6 card-item`}>
                <h3 className={`font-semibold mb-4 uppercase text-sm ${theme.text.secondary}`}>Prakiraan 7-Hari</h3>
                <div className="space-y-2">
                    {dailyData.map((item, index) => (<DailyForecastItem key={index} {...item} theme={theme}/>))}
                </div>
            </div>
        </div>
    );
};

const CityCard = ({ port, tempRange, conditionText, windSpeed, windDirection, waveRange, theme }) => (
    <div className={`${theme.glassCardClass} p-5 flex flex-col justify-between min-h-[250px]`}>
        <div>
            <p className={`${theme.text.secondary} text-sm`}>Pelabuhan</p>
            <h3 className={`text-2xl font-bold ${theme.text.primary}`}>{port}</h3>
        </div>
        <div className="text-center my-4 flex flex-col justify-center items-center">
             <WeatherIcon condition={conditionText} className="w-16 h-16"/>
             <p className={`text-xl font-bold ${theme.text.primary}`}>{conditionText}</p>
        </div>
        <div className={`mt-auto pt-4 border-t ${theme.border} grid grid-cols-3 gap-2 text-center text-sm`}>
            <div className="flex flex-col items-center justify-center">
                <Thermometer className="w-6 h-6 mb-1 text-red-500" />
                <span className={theme.text.primary}>{tempRange}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Navigation className={`w-6 h-6 mb-1 ${theme.text.secondary}`} style={{ transform: `rotate(${windDirection}deg)` }} />
                <span className={theme.text.primary}>{windSpeed} knot</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Waves className="w-6 h-6 mb-1 text-cyan-500" />
                <span className={theme.text.primary}>{waveRange}</span>
            </div>
        </div>
    </div>
);

const CitiesPage = ({ theme }) => {
    const [portData, setPortData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeDayIndex, setActiveDayIndex] = useState(0);

    const dayLabels = ['Hari Ini', 'Besok', 'Lusa'];

    const weatherSeverity = {
        'Cerah': 0, 'Cerah Berawan': 1, 'Berawan': 2, 'Berawan Tebal': 3,
        'Kabut': 4, 'Hujan Ringan': 5, 'Hujan Sedang': 6, 'Hujan Lebat': 7,
        'Hujan Petir': 8, 'default': 99
    };

    useEffect(() => {
        const portEndPoints = ['AA001','AA004', 'AA005', 'AA006', 'AA007','AA008','AA009','AA011','AA012','AA013','AA015','XX010','XX011','XT010','XO010'];
        const urls = portEndPoints.map(id => `https://maritim.bmkg.go.id/marine-data/pelabuhan/${id}.json`);

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

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveDayIndex(prevIndex => (prevIndex + 1) % 3);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    const getDailySummary = (port, targetDateString) => {
        const allForecasts = [...(port.forecast_day1 || []), ...(port['forecast_day2-4'] || [])];
        const dailyForecasts = allForecasts.filter(f => f.time.startsWith(targetDateString));

        if (dailyForecasts.length === 0) return null;

        let worstWeather = dailyForecasts[0].weather;
        let minTemp = dailyForecasts[0].temp_avg;
        let maxTemp = dailyForecasts[0].temp_avg;
        let minWave = dailyForecasts[0].wave_height;
        let maxWave = dailyForecasts[0].wave_height;

        dailyForecasts.forEach(forecast => {
            if ((weatherSeverity[forecast.weather] || weatherSeverity.default) > (weatherSeverity[worstWeather] || weatherSeverity.default)) {
                worstWeather = forecast.weather;
            }
            minTemp = Math.min(minTemp, forecast.temp_avg);
            maxTemp = Math.max(maxTemp, forecast.temp_avg);
            minWave = Math.min(minWave, forecast.wave_height);
            maxWave = Math.max(maxWave, forecast.wave_height);
        });

        return {
            name: port.name.replace('Pelabuhan ', ''),
            tempRange: `${minTemp}° - ${maxTemp}°`,
            conditionText: worstWeather,
            windSpeed: dailyForecasts[0].wind_speed,
            windDirection: windDirectionToDegrees(dailyForecasts[0].wind_from),
            waveRange: `${minWave} - ${maxWave} m`,
        };
    };

    return (
        <div className="card-container">
            <div className="card-item mb-6">
                <div className={`${theme.glassCardClass} p-2 rounded-full flex items-center justify-center space-x-2`}>
                    {dayLabels.map((label, index) => (
                        <button
                            key={label}
                            onClick={() => setActiveDayIndex(index)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                activeDayIndex === index
                                    ? 'bg-sky-500 text-white shadow-md'
                                    : `bg-transparent ${theme.text.primary}`
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            
            {isLoading ? (
                <div className={`text-center p-10 ${theme.text.primary}`}>Memuat Data Pelabuhan...</div>
            ) : (
                <div key={activeDayIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {portData.map((port, index) => {
                        if (!port || !port.valid_from) return null;

                        const startDate = new Date(port.valid_from);
                        const targetDate = new Date(startDate);
                        targetDate.setUTCDate(startDate.getUTCDate() + activeDayIndex);
                        const targetDateString = targetDate.toISOString().split('T')[0];
                        const summary = getDailySummary(port, targetDateString);

                        if (!summary) return null; 

                        return (
                            <div key={`${port.code}-${activeDayIndex}`} className="card-item" style={{animationDelay: `${index * 50}ms`}}>
                                <CityCard 
                                    port={summary.name}
                                    tempRange={summary.tempRange}
                                    conditionText={summary.conditionText}
                                    windSpeed={summary.windSpeed}
                                    windDirection={summary.windDirection}
                                    waveRange={summary.waveRange}
                                    theme={theme}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const FishMapPage = ({ theme, isDarkMode }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const position = [-2.5489, 118.0149];

    useEffect(() => {
        if (typeof window === 'undefined' || !window.L || mapInstanceRef.current) return;

        if (mapContainerRef.current) {
            mapInstanceRef.current = window.L.map(mapContainerRef.current, {
                scrollWheelZoom: true,
            }).setView(position, 5);

            window.L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
                { attribution: '&copy; OpenStreetMap contributors' }
            ).addTo(mapInstanceRef.current);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        
        const fishData = [
            { pos: [-5.8, 105.5], name: 'Ikan Tuna' }, { pos: [1.1, 128.3], name: 'Ikan Cakalang' },
            { pos: [-8.4, 116.0], name: 'Ikan Kerapu' }, { pos: [-3.0, 135.9], name: 'Ikan Tongkol' },
            { pos: [4.0, 97.0], name: 'Ikan Tenggiri' },
        ];
        
        const createFishIcon = (color) => {
            const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));"><path d="M6.5 12c.9 0 1.5-1.5 1.5-3s-.6-3-1.5-3c-.9 0-1.5 1.5-1.5 3s.6 3 1.5 3z"></path><path d="m18.5 6-8.5 6 8.5 6"></path><path d="M10 12h11"></path></svg>`;
            return window.L.divIcon({ html: svgString, className: 'custom-leaflet-icon', iconSize: [30, 30], iconAnchor: [15, 15] });
        };

        mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof window.L.Marker) mapInstanceRef.current.removeLayer(layer);
        });

        const iconColor = isDarkMode ? '#3b82f6' : '#0ea5e9';
        fishData.forEach(fish => {
            window.L.marker(fish.pos, { icon: createFishIcon(iconColor) }).addTo(mapInstanceRef.current).bindPopup(fish.name);
        });

    }, [isDarkMode]);

    return (
        <div className={`${theme.glassCardClass} p-4 card-container`}>
            <div className="card-item h-[75vh] w-full rounded-2xl overflow-hidden">
                <div ref={mapContainerRef} style={{ height: "100%", width: "100%", backgroundColor: 'transparent' }}></div>
            </div>
        </div>
    );
};


// --- Definisi Tema ---
const lightTheme = {
  gradient: "bg-gradient-to-br from-sky-400 to-blue-600",
  background: { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D" },
  overlay: "bg-cyan-500/20",
  overlay2: "bg-sky-400/30",
  sidebar: "bg-sky-100/20 border-white/30",
  glassCardClass: "bg-white/60 border-white/40 shadow-lg rounded-3xl",
  text: { primary: "text-slate-800", secondary: "text-slate-600", placeholder: "placeholder-slate-500" },
  nav: { text: "text-sky-800", hoverBg: "bg-white/50", activeFill: "bg-sky-500/80" },
  border: "border-slate-800/10"
};

const darkTheme = {
  background: { image: "https://images.unsplash.com/photo-1537110999185-86361a1a457c?q=80&w=1974&auto=format&fit=crop" },
  overlay: "bg-blue-900/40",
  overlay2: "bg-gray-900/50",
  sidebar: "bg-gray-900/30 border-white/10",
  glassCardClass: "bg-gray-800/40 border-white/10 shadow-lg rounded-3xl",
  text: { primary: "text-white", secondary: "text-gray-300", placeholder: "placeholder-gray-400" },
  nav: { text: "text-gray-300", hoverBg: "bg-white/10", activeFill: "bg-blue-600/80" },
  border: "border-white/10"
};


// --- Komponen Utama Aplikasi ---

export default function DisplayOther() {
  const pages = ['weather', 'cities', 'map', 'fish'];
  const animationDuration = 30;
  const [activePage, setActivePage] = useState(pages[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePage(currentPage => {
        const currentIndex = pages.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % pages.length;
        return pages[nextIndex];
      });
    }, animationDuration * 1000);
    return () => clearInterval(interval);
  }, [activePage]);

  return (
    <>
      <style>
        {`
          /* Leaflet CSS */
          @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
          .leaflet-container { font-family: 'Inter', sans-serif; }
          .leaflet-popup-content-wrapper, .leaflet-popup-tip { background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .dark .leaflet-popup-content-wrapper, .dark .leaflet-popup-tip { background-color: rgba(31, 41, 55, 0.8); color: white; }
          .dark .leaflet-tile-pane { filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7); }

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
          .card-item {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
          
          .slider-container {
            overflow: hidden; position: relative; width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .slider-track { display: flex; animation: scroll 40s linear infinite; }
          @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(calc(-128px * 8)); } }
          .slider-container:hover .slider-track { animation-play-state: paused; }
          
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-4000 { animation-delay: -4s; }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes marquee {
            from { transform: translateX(100%); }
            to { transform: translateX(-150%); }
          }
        `}
      </style>
      
      <div 
        className={`min-h-screen flex flex-col md:flex-row font-sans relative overflow-hidden ${isDarkMode ? 'dark bg-cover bg-center' : theme.gradient}`}
        style={{ backgroundImage: isDarkMode ? `url(${theme.background.image})` : 'none' }}
      >
        <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-blob ${theme.overlay}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000 ${theme.overlay2}`}></div>

        <Sidebar activePage={activePage} handleNavClick={handleNavClick} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} animationDuration={animationDuration} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-40 md:pb-20 overflow-y-auto z-10">
          
          <div key={activePage}>
            {activePage === 'weather' && <WeatherPage theme={theme}/>}
            {activePage === 'cities' && <CitiesPage theme={theme}/>}
            {activePage === 'map' && <div className={`${theme.glassCardClass} p-6 card-container`}><div className="card-item"><h1 className={`text-3xl font-bold ${theme.text.primary}`}>Map Page (Placeholder)</h1></div></div>}
            {activePage === 'fish' && <FishMapPage theme={theme} isDarkMode={isDarkMode}/>}
          </div>

        </main>

        <Clock theme={theme} isDarkMode={isDarkMode} />
        <RunningText theme={theme} isDarkMode={isDarkMode} />
      </div>
    </>
  );
}
