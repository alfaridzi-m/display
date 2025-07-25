import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
// Import Leaflet dari CDN
import L from 'https://esm.sh/leaflet';
const AirConditionItem = ({ icon: Icon, label, value, unit, theme }) => (
  <div className={`flex items-center ${theme.text.primary}`}>
    <Icon className={`w-6 h-6 mr-3 ${theme.text.secondary}`} />
    <div>
      <span className={`text-sm ${theme.text.secondary}`}>{label}</span>
      <p className="text-xl font-semibold">{value} <span className="text-base font-normal">{unit}</span></p>
    </div>
  </div>
);

export default AirConditionItem