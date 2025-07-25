import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
// Import Leaflet dari CDN
import L from 'https://esm.sh/leaflet';
const CityCard = ({ city, country, temp, conditionIcon: Icon, conditionText, windSpeed, windDirection, waveHeight, theme }) => (
    <div className={`${theme.glassCardClass} p-5 flex flex-col justify-between`}>
        <div>
            <p className={`${theme.text.secondary} text-sm`}>{country}</p>
            <h3 className={`text-2xl font-bold ${theme.text.primary}`}>{city}</h3>
        </div>
        <div className="text-center my-4 flex flex-col justify-center items-center">
             <Icon className="w-20 h-20 text-yellow-500" />
             <p className={`text-xl font-bold ${theme.text.primary}`}>{conditionText}</p>
        </div>
        <div className={`mt-auto pt-4 border-t ${theme.border} grid grid-cols-3 gap-2 text-center text-sm`}>
            <div className="flex flex-col items-center justify-center">
                <Thermometer className="w-6 h-6 mb-1 text-red-500" />
                <span className={theme.text.primary}>{temp}°</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Navigation className={`w-6 h-6 mb-1 ${theme.text.secondary}`} style={{ transform: `rotate(${windDirection}deg)` }} />
                <span className={theme.text.primary}>{windSpeed} km/h</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Waves className="w-6 h-6 mb-1 text-cyan-500" />
                <span className={theme.text.primary}>{waveHeight} m</span>
            </div>
        </div>
    </div>
);

export default CityCard