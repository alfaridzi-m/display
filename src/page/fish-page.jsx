import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
// Import Leaflet dari CDN
import L from 'https://esm.sh/leaflet';

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

export default FishMapPage