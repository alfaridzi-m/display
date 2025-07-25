import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
// Import Leaflet dari CDN
import L from 'https://esm.sh/leaflet';
const CitiesPage = ({ theme }) => {
    const citiesData = [
        { city: 'Tokyo', country: 'Japan', temp: 29, conditionIcon: CloudSun, conditionText: 'Cloudy', windSpeed: 15, windDirection: 120, waveHeight: 1.2 },
        { city: 'London', country: 'UK', temp: 18, conditionIcon: CloudRain, conditionText: 'Rainy', windSpeed: 22, windDirection: 240, waveHeight: 0.5 },
        { city: 'New York', country: 'USA', temp: 31, conditionIcon: Sun, conditionText: 'Sunny', windSpeed: 8, windDirection: 80, waveHeight: 1.8 },
        { city: 'New York', country: 'USA', temp: 31, conditionIcon: Sun, conditionText: 'Sunny', windSpeed: 8, windDirection: 80, waveHeight: 1.8 },
        { city: 'New York', country: 'USA', temp: 31, conditionIcon: Sun, conditionText: 'Sunny', windSpeed: 8, windDirection: 80, waveHeight: 1.8 },
        { city: 'Sydney', country: 'Australia', temp: 22, conditionIcon: Cloud, conditionText: 'Overcast', windSpeed: 18, windDirection: 310, waveHeight: 2.1 },
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

export default CitiesPage;