import React, { useState, useEffect, useRef } from 'react';
import { Sun, CloudFog, CloudSun, Cloud, Cloudy ,CloudDrizzle , CloudRain, CloudRainWind, CloudLightning, Wind, Droplets, Thermometer, Map, List, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
import WeatherIcon from './components/weather-cion';
import Clock from './components/clock';
import axios from 'axios';
import windDirectionToDegrees from './components/wind-dir';
import Sidebar from './components/side-bar';
import RunningText from './components/running-text';
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
const getWaveColor = (category) => {
    const colors = {
        'Tenang': 'bg-blue-300',
        'Rendah': 'bg-green-400',
        'Sedang': 'bg-yellow-400',
        'Tinggi': 'bg-orange-500',
        'Sangat Tinggi': 'bg-red-500',
        'Ekstrem': 'bg-purple-600',
    };
    return colors[category] || 'bg-gray-400';
};

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

const WeatherPage = ({ theme }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const weatherSeverity = {
        'Cerah': 0, 'Cerah Berawan': 1, 'Berawan': 2, 'Berawan Tebal': 3,
        'Kabut': 4, 'Hujan Ringan': 5, 'Hujan Sedang': 6, 'Hujan Lebat': 7,
        'Hujan Petir': 8, 'default': 99
    };

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

    // Cari prakiraan untuk satu jam ke depan dari waktu saat ini
    const now = new Date();
    let closestIndex = 0;
    let minDiff = Infinity;
    data.forecast_day1.forEach((forecast, index) => {
        const forecastTime = new Date(forecast.time);
        const diff = Math.abs(forecastTime - now);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = index;
        }
    });

    // Tentukan indeks untuk jam berikutnya, dengan fallback jika sudah di akhir
    const nextHourIndex = closestIndex + 1;
    const displayIndex = nextHourIndex < data.forecast_day1.length ? nextHourIndex : closestIndex;
    const displayForecast = data.forecast_day1[displayIndex];


    const hourlyData = data.forecast_day1.map(item => ({
        time: new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':'),
        icon: item.weather,
        temp: item.temp_avg,
        windSpeed: item.wind_speed,
        windGust: item.wind_gust,
        waveHeight: item.wave_height,
        waveCategory: item.wave_cat
    }));
    
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
            const minTemp = Math.min(...summary.temps);
            const maxTemp = Math.max(...summary.temps);
            const dominantCondition = Object.keys(summary.conditions).reduce((a, b) => 
                (weatherSeverity[a] || weatherSeverity.default) > (weatherSeverity[b] || weatherSeverity.default) ? a : b
            );
            return {
                day: new Date(date).toLocaleDateString('id-ID', { weekday: 'long' }),
                icon: dominantCondition,
                condition: dominantCondition,
                temp: `${maxTemp}° / ${minTemp}°`
            };
        });
    };

    const dailyData = processDailyForecast(data['forecast_day2-4']);

    return (
        <div className="flex flex-col gap-6 card-container">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className={`${theme.glassCardClass} p-6 flex flex-col sm:flex-row items-center justify-between card-item lg:w-2/3`}>
                    <div>
                        <h2 className={`text-3xl font-bold ${theme.text.primary}`}>{data.name}</h2>
                        <p className={theme.text.secondary}>{displayForecast.weather}</p>
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
                <div className={`${theme.glassCardClass} p-6 card-item lg:w-1/3 flex flex-col`}>
                    <h3 className={`font-semibold mb-4 uppercase text-sm ${theme.text.secondary}`}>Prakiraan Cuaca Seminggu Kedepan</h3>
                    <div className="space-y-2 flex-grow flex flex-col justify-around">
                        {dailyData.map((item, index) => (<DailyForecastItem key={index} {...item} theme={theme}/>))}
                    </div>
                </div>
            </div>
            <div className={`${theme.glassCardClass} pt-6 pb-4 card-item`}>
                <h3 className={`font-semibold mb-4 uppercase text-sm px-6 ${theme.text.secondary}`}>Prakiraan Cuaca Hari Ini</h3>
                <div className="slider-container">
                    <div className="slider-track">
                        {[...hourlyData, ...hourlyData].map((item, index) => (<HourlyForecastCard key={index} {...item} theme={theme}/>))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CityCard = ({ port, tempRange, conditionText, windSpeed, windGust, windDirection, waveRange, waveCategory, theme }) => (
    <div className={`${theme.glassCardClass} p-5 flex flex-col justify-between h-[290px] w-[280px]`}>
        <div>
            <p className={`${theme.text.secondary} text-sm`}>Pelabuhan</p>
            <h3 className={`text-xl font-bold ${theme.text.primary}`}>{port}</h3>
        </div>
        
        <div className='flex-grow flex flex-col justify-center'>
            <div className="flex flex-row items-center justify-center space-x-4">
                <div className="flex flex-col items-center justify-center w-1/2">
                    <WeatherIcon condition={conditionText} className="w-16 h-16"/>
                    <p className={`text-lg font-bold ${theme.text.primary} mt-1`}>{conditionText}</p>
                </div>
                <div className={`w-1/2 self-stretch border-l ${theme.border} flex flex-col justify-center space-y-3 pl-4`}>
                    <div className="flex flex-col items-center justify-center">
                        <Thermometer className="w-6 h-6 mb-1 text-red-500" />
                        <span className={`${theme.text.primary} text-sm`}>{tempRange}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Navigation className={`w-6 h-6 mb-1 ${theme.text.secondary}`} style={{ transform: `rotate(${windDirection}deg)` }} />
                        <span className={`${theme.text.primary} text-sm`}>{windSpeed} knot</span>
                        <span className={`${theme.text.secondary} text-xs`}>Gust {windGust} knot</span>
                    </div>
                </div>
            </div>
        </div>

        <div className={`mt-auto pt-3 border-t ${theme.border} flex items-center justify-center space-x-3`}>
            <Waves className="w-5 h-5 text-cyan-500" />
            <div className={`w-4 h-4 rounded-full ${getWaveColor(waveCategory)}`}></div>
            <span className={`font-semibold text-sm ${theme.text.primary}`}>{waveCategory}</span>
            <span className={`text-sm ${theme.text.secondary}`}>({waveRange})</span>
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
        let maxWindGust = dailyForecasts[0].wind_gust;
        let waveCategoryForMax = dailyForecasts[0].wave_cat;

        dailyForecasts.forEach(forecast => {
            if ((weatherSeverity[forecast.weather] || weatherSeverity.default) > (weatherSeverity[worstWeather] || weatherSeverity.default)) {
                worstWeather = forecast.weather;
            }
            minTemp = Math.min(minTemp, forecast.temp_avg);
            maxTemp = Math.max(maxTemp, forecast.temp_avg);
            if (forecast.wave_height > maxWave) {
                maxWave = forecast.wave_height;
                waveCategoryForMax = forecast.wave_cat;
            }
            minWave = Math.min(minWave, forecast.wave_height);
            maxWindGust = Math.max(maxWindGust, forecast.wind_gust);
        });

        return {
            name: port.name.replace('Pelabuhan ', ''),
            tempRange: `${minTemp}° - ${maxTemp}°`,
            conditionText: worstWeather,
            windSpeed: dailyForecasts[0].wind_speed,
            windGust: maxWindGust,
            windDirection: windDirectionToDegrees(dailyForecasts[0].wind_from),
            waveRange: `${minWave} - ${maxWave} m`,
            waveCategory: waveCategoryForMax,
        };
    };

    return (
        <div className="card-container">
            <div className="card-item mb-4">
                <div className={`${theme.glassCardClass} p-2 rounded-xl flex items-center justify-center space-x-2`}>
                    {dayLabels.map((label, index) => (
                        <button
                            key={label}
                            onClick={() => setActiveDayIndex(index)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
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
                <div key={activeDayIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
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
                                    windGust={summary.windGust}
                                    windDirection={summary.windDirection}
                                    waveRange={summary.waveRange}
                                    waveCategory={summary.waveCategory}
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
        <div className={`${theme.glassCardClass} p-4 card-conta iner`}>
            <div className="card-item h-[75vh] w-full rounded-2xl overflow-hidden">
                <div ref={mapContainerRef} style={{ height: "100%", width: "100%", backgroundColor: 'transparent' }}></div>
            </div>
        </div>
    );
};


// --- Definisi Tema ---
const lightTheme = {
  gradient: "bg-gradient-to-br from-sky-400 to-blue-600",
  background: {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D",
  },
  overlay: "bg-cyan-500/20",
  overlay2: "bg-sky-400/30",
  sidebar: "bg-sky-100/20 border-white/30",
  glassCardClass: "bg-white/70 border-white/40 shadow-lg rounded-3xl",
  text: { primary: "text-slate-800", secondary: "text-slate-600", placeholder: "placeholder-slate-500" },
  nav: { text: "text-sky-800", hoverBg: "bg-white/50", activeFill: "bg-sky-500/80" },
  border: "border-slate-800/10"
};

const darkTheme = {
  background: {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Atlantic_near_Faroe_Islands.jpg/1200px-Atlantic_near_Faroe_Islands.jpg",
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

const Display = () => {
  const pages = ['weather', 'cities', 'map', 'fish'];
  const animationDuration = 300;
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
  }, [activePage]); // Reset timer on manual click

  return (
    <>
      <div 
        className={`min-h-screen flex flex-col md:flex-row font-sans relative overflow-hidden dark bg-cover bg-center`}
        style={{ backgroundImage: `url(${theme.background.image})` }}
      >
        <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-blob ${theme.overlay}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000 ${theme.overlay2}`}></div>

        <Sidebar activePage={activePage} handleNavClick={handleNavClick} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} animationDuration={animationDuration} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 overflow-y-auto z-10">
          
          <div key={activePage}>
            {activePage === 'weather' && <WeatherPage theme={theme}/>}
            {activePage === 'cities' && <CitiesPage theme={theme}/>}
            {activePage === 'map' && <div className={`${theme.glassCardClass} p-6 card-container`}><div className="card-item"><h1 className={`text-3xl font-bold ${theme.text.primary}`}>Map Page (Placeholder)</h1></div></div>}
            {activePage === 'fish' && <FishMapPage theme={theme} isDarkMode={isDarkMode}/>}
          </div>

        </main>
        <Clock theme={theme} isDarkMode={isDarkMode}/>
        <RunningText theme={theme} />
      </div>
    </>
  );
}

export default Display