import React, { useState, useEffect, useRef } from 'react';
import { Sun, CloudFog, CloudSun, Cloud, Cloudy ,CloudDrizzle , CloudRain, CloudRainWind, CloudLightning, Wind, Droplets, Thermometer, Map, List, Navigation, Moon, FishSymbol, Waves, Anchor, HelpCircle } from 'lucide-react';
const WeatherIcon = ({ condition, size = 24 }) => {
  const weatherIconMap = {
    'Cerah': <Sun className="w-20 h-20 text-yellow-400" />,
    'Cerah Berawan': <CloudSun className="w-20 h-20 text-yellow-400" />,
    'Berawan': <Cloud className="w-20 h-20 text-gray-400" />,
    'Berawan Tebal': <Cloudy className="w-20 h-20 text-gray-500" />,
    'Hujan Ringan': <CloudDrizzle className="w-20 h-20 text-blue-400" />,
    'Hujan Sedang': <CloudRain className="w-20 h-20 text-blue-500" />,
    'Hujan Lebat': <CloudRainWind className="w-20 h-20 text-blue-600" />,
    'Hujan Petir': <CloudLightning className="w-20 h-20 text-yellow-500" />,
    'Angin Kencang': <Wind className="w-20 h-20 text-yellow-500" />,
    'default': <HelpCircle className="w-20 h-20 text-yellow-500"/>
  };

  const IconComponent = weatherIconMap[condition] || weatherIconMap['default'];
  return React.cloneElement(IconComponent, { size });
};

export default WeatherIcon;