import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Map, List, CloudSun, Navigation, Moon, FishSymbol, Waves, Anchor } from 'lucide-react';
// Import Leaflet dari CDN
import L from 'https://esm.sh/leaflet';

const WeatherPage = ({ theme }) => {
    const hourlyData = [
        { time: '6:00 AM', icon: Cloud, temp: 25 }, { time: '9:00 AM', icon: CloudSun, temp: 28 },
        { time: '12:00 PM', icon: Sun, temp: 33 }, { time: '3:00 PM', icon: Sun, temp: 34 },
        { time: '6:00 PM', icon: Sun, temp: 32 }, { time: '9:00 PM', icon: CloudSun, temp: 30 },
        { time: '12:00 AM', icon: Cloud, temp: 27 },
    ];
    const extendedHourlyData = [...hourlyData, ...hourlyData,...hourlyData];
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

export default WeatherPage