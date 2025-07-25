import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
// Import Leaflet dari CDN
import L from 'https://esm.sh/leaflet';
const HourlyForecastCard = ({ time, icon: Icon, temp, theme }) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl p-4 mx-2 w-24 flex-shrink-0 ${theme.glassCardClass} ${theme.text.primary}`}>
    <span className={`${theme.text.secondary} text-sm`}>{time}</span>
    <Icon className="w-10 h-10 text-yellow-500 my-2" />
    <span className="text-xl font-semibold">{temp}°</span>
    <div className='flex flex-row items-center gap-2'>
      <Icon className="w-4 h-4 text-yellow-500 my-2" />
      <span className={`${theme.text.secondary} text-sm`}>{temp}</span>
    </div>
  </div>
);
export default HourlyForecastCard