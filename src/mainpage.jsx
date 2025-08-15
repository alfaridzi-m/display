import React, { useEffect, useRef, useState } from 'react';

// Komponen utama aplikasi
function App() {
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
    Tenang: { color: "#D0E3F4" },
    Rendah: { color: "#61AEF2" },
    Sedang: { color: "#A7E9BE" },
    Tinggi: { color: "#67E18E" },
    'Sangat Tinggi': { color: "#F7F387" },
    Ekstrem: { color: "#F7F38B" },
    'Sangat Ekstrem': { color: "#F9AB7A" },
    unknown: { color: "#E0E0E0" }
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
      console.log("Mulai mengambil data prakiraan cuaca...");
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const data = await resp.json();
      console.log("Data prakiraan cuaca berhasil diambil.");
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
      console.log("Data prakiraan cuaca berhasil diolah.");
    } catch (err) {
      console.error('Error saat mengambil atau mengolah data prakiraan:', err);
      throw err;
    }
  }

  // Inisialisasi peta dan gambar poligon awal
  useEffect(() => {
    const initializeMap = async () => {
      if (mapRef.current || !mapContainerRef.current || !window.L || !window.dayjs) return;

      console.log("Mulai inisialisasi peta...");
      mapRef.current = window.L.map(mapContainerRef.current).setView([-2.548926, 118.0148634], 5);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
      console.log("Peta dasar dan tile layer berhasil dibuat.");
      
      try {
        const [geojsonData] = await Promise.all([
            // --- PERBAIKAN: Menggunakan URL GeoJSON yang lebih stabil dan ringan ---
            fetch('https://maritim.bmkg.go.id/marine-data/meta/wilmetos.json').then(res => {
              if (!res.ok) throw new Error(`Gagal mengambil GeoJSON: Status ${res.status}`);
              console.log("Data poligon berhasil diambil.");
              return res.json();
            }),
            fetchAndProcessForecasts()
        ]);

        console.log("Mulai menggambar poligon ke peta...");
        window.L.geoJSON(geojsonData, {
            style: feature => {
                return { color: "#333", weight: 1, opacity: 0.8, fillColor: kategoriGelombang.unknown.color, fillOpacity: 0.75 };
            },
            onEachFeature: (feature, layer) => {
                featureLayersRef.current[feature.properties.ID_MAR] = layer;
            }
        }).addTo(mapRef.current);
        console.log(`Poligon berhasil digambar. Jumlah: ${Object.keys(featureLayersRef.current).length} wilayah.`);

        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
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
        console.log("Legenda ditambahkan.");

      } catch (error) {
        console.error("GAGAL saat inisialisasi peta dengan data:", error);
        setMapTitle("Gagal memuat data peta. Cek konsol.");
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
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }};
  }, []);

  // Perbarui gaya & popup saat indeks waktu berubah
  useEffect(() => {
    if (Object.keys(featureLayersRef.current).length === 0 || !forecastData || timeSteps.length === 0) return;

    const currentTime = timeSteps[currentTimeIndex];
    console.log(`--- Memperbarui warna untuk waktu: ${currentTime} ---`);

    for (const regionId in featureLayersRef.current) {
        const layer = featureLayersRef.current[regionId];
        const regionForecasts = forecastData[regionId];
        let waveCategoryColor = kategoriGelombang.unknown.color;
        let popupContent = `Prakiraan cuaca untuk wilayah ini (${regionId}) tidak tersedia.`;

        if (regionForecasts) {
            const forecast = regionForecasts.find(f => f.time.toISOString() === currentTime);
            if (forecast) {
                waveCategoryColor = getColorForWaveCategory(forecast.wave_cat);
                // --- PERBAIKAN: Menggunakan properti 'nama' sesuai data dari wilmetos.min.geojson ---
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
      }, 1500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, timeSteps]);

  const handleTogglePlay = () => {
    if (currentTimeIndex === timeSteps.length - 1) {
      setCurrentTimeIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md p-4 z-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center">{mapTitle}</h1>
        <p className="text-center text-gray-600 mb-3">Sumber data: BMKG</p>
        
        {timeSteps.length > 0 && (
          <div className="max-w-md mx-auto bg-gray-50 p-3 rounded-lg shadow-inner flex items-center justify-between">
            <button 
              onClick={handleTogglePlay} 
              className="px-6 py-2 bg-green-500 text-white rounded-md font-bold w-24 text-center transition-colors duration-300 hover:bg-green-600"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <div className="text-center flex-grow">
              <div className="text-sm text-gray-500">Waktu Prakiraan</div>
              <div className="font-bold text-lg text-gray-800">
                {window.dayjs(timeSteps[currentTimeIndex]).format('ddd, DD MMM YYYY HH:mm')}
              </div>
            </div>
            <div className="w-24"></div> 
          </div>
        )}

      </header>
      <main className="flex-grow relative">
        <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '100%' }}></div>
      </main>
    </div>
  );
}

const LeafletStyles = () => (
  <style>{`
    @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    .leaflet-container { background: #aadaff; }
    .leaflet-popup-content-wrapper { border-radius: 8px; }
    .legend {
        line-height: 18px;
        color: #555;
        background-color: rgba(255, 255, 255, 0.85);
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
    }
    .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.9;
        border: 1px solid #777;
    }
    .leaflet-interactive {
        transition: fill 0.75s ease-in-out;
    }
  `}</style>
);

const AppContainer = () => (
  <>
    <LeafletStyles />
    <App />
  </>
);

export default AppContainer;
