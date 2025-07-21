import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, Fish } from 'lucide-react';

// --- Komponen UI ---

const WaveFill = ({ animationDuration, theme, pageKey }) => (
    // Menambahkan `key` untuk memaksa re-mount dan restart animasi setiap kali halaman berubah
    <div key={pageKey} className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-lg z-0">
        <div 
            className="absolute w-full h-full" // Pastikan h-full ada di sini agar transform berfungsi
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

const NavItem = ({ icon: Icon, label, isActive, animationDuration, theme }) => (
  <button
    disabled 
    className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-20 h-20 overflow-hidden ${theme.nav.text}`}
  >
    {/* Animate only if it's the currently active page */}
    {isActive && <WaveFill animationDuration={animationDuration} theme={theme} pageKey={label} />}
    
    <div className={`relative z-10 flex flex-col items-center justify-center transition-colors ${isActive ? 'text-white' : theme.nav.text}`}>
        <Icon className="w-7 h-7 mb-1" />
        <span className="text-xs font-medium">{label}</span>
    </div>
  </button>
);

const Sidebar = ({ activePage, isDarkMode, setIsDarkMode, animationDuration }) => {
    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
      <div className={`${theme.sidebar} backdrop-blur-xl p-2 md:p-3 flex md:flex-col items-center fixed bottom-0 w-full md:relative md:w-24 md:h-screen z-20 shadow-xl`}>
        <div className="hidden md:flex items-center justify-center bg-sky-500 p-3 rounded-2xl mb-6 shadow-md">
          <CloudLightning className="w-8 h-8 text-white" />
        </div>
        <nav className="w-full md:w-auto flex-grow flex flex-row md:flex-col justify-around md:justify-start md:items-center">
          <NavItem icon={List} label="Weather" isActive={activePage === 'weather'} animationDuration={animationDuration} theme={theme}/>
          <NavItem icon={Cloud} label="Cities" isActive={activePage === 'cities'} animationDuration={animationDuration} theme={theme}/>
          <NavItem icon={Map} label="Map" isActive={activePage === 'map'} animationDuration={animationDuration} theme={theme}/>
          <NavItem icon={Fish} label="Fish Map" isActive={activePage === 'fish'} animationDuration={animationDuration} theme={theme}/>
        </nav>
        <div className="hidden md:flex mt-auto">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-full transition-colors ${theme.nav.text} hover:${theme.nav.hoverBg}`}>
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
             </button>
        </div>
      </div>
    );
};


// --- Komponen Halaman ---

const HourlyForecastCard = ({ time, icon: Icon, temp, theme }) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl p-4 mx-2 w-24 flex-shrink-0 ${theme.glassCardClass} ${theme.text.primary}`}>
    <span className={`${theme.text.secondary} text-sm`}>{time}</span>
    <Icon className="w-10 h-10 text-yellow-500 my-2" />
    <span className="text-xl font-semibold">{temp}°</span>
  </div>
);

const DailyForecastItem = ({ day, icon: Icon, condition, temp, theme }) => (
  <div className={`flex items-center justify-between p-3 border-b ${theme.border} last:border-b-0`}>
    <span className={`${theme.text.secondary} w-1/4`}>{day}</span>
    <div className={`flex items-center w-1/2 ${theme.text.primary}`}>
      <Icon className="w-6 h-6 text-yellow-500 mr-2" />
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
    const hourlyData = [
        { time: '6:00 AM', icon: Cloud, temp: 25 }, { time: '9:00 AM', icon: CloudSun, temp: 28 },
        { time: '12:00 PM', icon: Sun, temp: 33 }, { time: '3:00 PM', icon: Sun, temp: 34 },
        { time: '6:00 PM', icon: Sun, temp: 32 }, { time: '9:00 PM', icon: CloudSun, temp: 30 },
        { time: '12:00 AM', icon: Cloud, temp: 27 },
    ];
    const extendedHourlyData = [...hourlyData, ...hourlyData];
    const dailyData = [
        { day: 'Today', icon: Sun, condition: 'Sunny', temp: '36 / 22' }, { day: 'Tue', icon: Sun, condition: 'Sunny', temp: '37 / 21' },
        { day: 'Wed', icon: Sun, condition: 'Sunny', temp: '37 / 21' }, { day: 'Thu', icon: Cloud, condition: 'Cloudy', temp: '37 / 21' },
        { day: 'Fri', icon: Cloud, condition: 'Cloudy', temp: '37 / 21' }, { day: 'Sat', icon: CloudRain, condition: 'Rainy', temp: '37 / 21' },
        { day: 'Sun', icon: CloudLightning, condition: 'Storm', temp: '37 / 21' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 card-container">
            <div className="lg:col-span-2 card-item">
                <div className={`${theme.glassCardClass} p-6 flex flex-col sm:flex-row items-center justify-between mb-6`}>
                    <div>
                        <h2 className={`text-3xl font-bold ${theme.text.primary}`}>Madrid</h2>
                        <p className={theme.text.secondary}>Chance of rain: 0%</p>
                        <p className={`text-7xl sm:text-8xl font-bold my-4 ${theme.text.primary}`}>31°</p>
                    </div>
                    <div className="text-yellow-400"><Sun size={140} /></div>
                </div>
                <div className={`${theme.glassCardClass} pt-6 pb-4 mb-6`}>
                    <h3 className={`font-semibold mb-4 uppercase text-sm px-6 ${theme.text.secondary}`}>Today's Forecast</h3>
                    <div className="slider-container">
                        <div className="slider-track">
                            {extendedHourlyData.map((item, index) => (<HourlyForecastCard key={index} {...item} theme={theme}/>))}
                        </div>
                    </div>
                </div>
                <div className={`${theme.glassCardClass} p-6`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-semibold uppercase text-sm ${theme.text.secondary}`}>Air Conditions</h3>
                        <button className="bg-sky-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-sky-600">See more</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        <AirConditionItem icon={Thermometer} label="Real Feel" value="30°" theme={theme}/>
                        <AirConditionItem icon={Wind} label="Wind" value="0.2" unit="km/h" theme={theme}/>
                        <AirConditionItem icon={Droplets} label="Chance of rain" value="0" unit="%" theme={theme}/>
                        <AirConditionItem icon={Sun} label="UV Index" value="3" theme={theme}/>
                    </div>
                </div>
            </div>
            <div className={`${theme.glassCardClass} p-6 card-item`}>
                <h3 className={`font-semibold mb-4 uppercase text-sm ${theme.text.secondary}`}>7-Day Forecast</h3>
                <div className="space-y-2">
                    {dailyData.map((item, index) => (<DailyForecastItem key={index} {...item} theme={theme}/>))}
                </div>
            </div>
        </div>
    );
};

const CityCard = ({ city, country, temp, conditionIcon: Icon, conditionText, windSpeed, windDirection, theme }) => (
    <div className={`${theme.glassCardClass} p-5 flex flex-col justify-between`}>
        <div>
            <p className={`${theme.text.secondary} text-sm`}>{country}</p>
            <h3 className={`text-2xl font-bold ${theme.text.primary}`}>{city}</h3>
        </div>
        <div className="text-center my-4">
            <p className={`text-6xl font-bold ${theme.text.primary}`}>{temp}°</p>
        </div>
        <div className={`flex justify-between items-center text-sm ${theme.text.primary}`}>
            <div className="flex items-center">
                <Icon className="w-5 h-5 mr-1.5 text-yellow-500" />
                <span>{conditionText}</span>
            </div>
            <div className="flex items-center">
                <Navigation className={`w-4 h-4 mr-1.5 ${theme.text.secondary}`} style={{ transform: `rotate(${windDirection}deg)` }} />
                <span>{windSpeed} km/h</span>
            </div>
        </div>
    </div>
);

const CitiesPage = ({ theme }) => {
    const citiesData = [
        { city: 'Tokyo', country: 'Japan', temp: 29, conditionIcon: CloudSun, conditionText: 'Cloudy', windSpeed: 15, windDirection: 120 },
        { city: 'London', country: 'UK', temp: 18, conditionIcon: CloudRain, conditionText: 'Rainy', windSpeed: 22, windDirection: 240 },
        { city: 'New York', country: 'USA', temp: 31, conditionIcon: Sun, conditionText: 'Sunny', windSpeed: 8, windDirection: 80 },
        { city: 'Sydney', country: 'Australia', temp: 22, conditionIcon: Cloud, conditionText: 'Overcast', windSpeed: 18, windDirection: 310 },
    ];
    return (
        <div className="card-container">
            <h1 className={`text-3xl font-bold mb-6 ${theme.text.primary} card-item`}>Cities</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {citiesData.map((city, index) => (
                  <div key={city.city} className="card-item" style={{animationDelay: `${index * 100}ms`}}>
                    <CityCard {...city} theme={theme}/>
                  </div>
                ))}
            </div>
        </div>
    );
};

const FishMapPage = ({ theme, isDarkMode }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const position = [-2.5489, 118.0149]; // Center of Indonesia

    const fishData = [
        { pos: [-5.8, 105.5], name: 'Ikan Tuna' },
        { pos: [1.1, 128.3], name: 'Ikan Cakalang' },
        { pos: [-8.4, 116.0], name: 'Ikan Kerapu' },
        { pos: [-3.0, 135.9], name: 'Ikan Tongkol' },
        { pos: [4.0, 97.0], name: 'Ikan Tenggiri' },
    ];

    const createFishIcon = (color) => {
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));"><path d="M6.5 12c.9 0 1.5-1.5 1.5-3s-.6-3-1.5-3c-.9 0-1.5 1.5-1.5 3s.6 3 1.5 3z"></path><path d="m18.5 6-8.5 6 8.5 6"></path><path d="M10 12h11"></path></svg>`;
        return window.L.divIcon({
            html: svgString,
            className: 'custom-leaflet-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        });
    };

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current && window.L) {
            mapInstanceRef.current = window.L.map(mapContainerRef.current, {
                scrollWheelZoom: true,
            }).setView(position, 5);

            window.L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
            ).addTo(mapInstanceRef.current);
        }
        
        if (mapInstanceRef.current) {
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof window.L.Marker) {
                    mapInstanceRef.current.removeLayer(layer);
                }
            });

            const iconColor = isDarkMode ? '#3b82f6' : '#0ea5e9';
            fishData.forEach(fish => {
                window.L.marker(fish.pos, { icon: createFishIcon(iconColor) })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(fish.name);
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
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
  overlay: "bg-cyan-500/20",
  overlay2: "bg-sky-400/30",
  sidebar: "bg-sky-100/20 border-white/30",
  glassCardClass: "bg-white/60 border-white/40 shadow-lg rounded-3xl",
  text: { primary: "text-slate-800", secondary: "text-slate-600", placeholder: "placeholder-slate-500" },
  nav: { text: "text-sky-800", hoverBg: "bg-white/50", activeFill: "bg-sky-500/80" },
  border: "border-slate-800/10"
};

const darkTheme = {
  background: {
    image: "https://images.unsplash.com/photo-1537110999185-86361a1a457c?q=80&w=1974&auto=format&fit=crop",
  },
  overlay: "bg-blue-900/40",
  overlay2: "bg-gray-900/50",
  sidebar: "bg-gray-900/30 border-white/10",
  glassCardClass: "bg-gray-800/40 border-white/10 shadow-lg rounded-3xl",
  text: { primary: "text-white", secondary: "text-gray-300", placeholder: "placeholder-gray-400" },
  nav: { text: "text-gray-300", hoverBg: "bg-white/10", activeFill: "bg-blue-600/80" },
  border: "border-white/10"
};


// --- Komponen Utama Aplikasi ---

export default function App() {
  const pages = ['weather', 'cities', 'map', 'fish'];
  const animationDuration = 30;
  const [activePage, setActivePage] = useState(pages[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePage(currentPage => {
        const currentIndex = pages.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % pages.length;
        return pages[nextIndex];
      });
    }, animationDuration * 1000);
    return () => clearInterval(interval);
  }, []);

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
          .card-container .card-item {
            animation: fade-in-up 0.5s ease-out backwards;
          }
          .card-container .card-item:nth-child(1) { animation-delay: 0.1s; }
          .card-container .card-item:nth-child(2) { animation-delay: 0.2s; }
          .card-container .card-item:nth-child(3) { animation-delay: 0.3s; }
          .card-container .card-item:nth-child(4) { animation-delay: 0.4s; }

          .slider-container {
            overflow: hidden; position: relative; width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .slider-track { display: flex; animation: scroll 40s linear infinite; }
          @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(calc(-112px * 7)); } }
          .slider-container:hover .slider-track { animation-play-state: paused; }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-4000 { animation-delay: -4s; }
          @keyframes blob {
	          0% { transform: translate(0px, 0px) scale(1); }
	          33% { transform: translate(30px, -50px) scale(1.1); }
	          66% { transform: translate(-20px, 20px) scale(0.9); }
	          100% { transform: translate(0px, 0px) scale(1); }
          }
        `}
      </style>
      
      <div 
        className={`min-h-screen flex flex-col md:flex-row font-sans relative overflow-hidden ${isDarkMode ? 'dark bg-cover bg-center' : theme.gradient}`}
        style={{ backgroundImage: isDarkMode ? `url(${theme.background.image})` : 'none' }}
      >
        <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-blob ${theme.overlay}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000 ${theme.overlay2}`}></div>

        <Sidebar activePage={activePage} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} animationDuration={animationDuration} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 overflow-y-auto z-10">
          
          <div key={activePage}>
            {activePage === 'weather' && <WeatherPage theme={theme}/>}
            {activePage === 'cities' && <CitiesPage theme={theme}/>}
            {activePage === 'map' && <div className={`${theme.glassCardClass} p-6 card-container`}><div className="card-item"><h1 className={`text-3xl font-bold ${theme.text.primary}`}>Map Page (Placeholder)</h1></div></div>}
            {activePage === 'fish' && <FishMapPage theme={theme} isDarkMode={isDarkMode}/>}
          </div>

        </main>
      </div>
    </>
  );
}
