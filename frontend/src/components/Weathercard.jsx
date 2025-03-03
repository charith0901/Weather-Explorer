import React, { useState, useEffect } from 'react';
import { 
  WiThermometer, 
  WiCloud, 
  WiRain, 
  WiSnow, 
  WiStrongWind, 
  WiDaySunny, 
  WiFog,
  WiHumidity,
  WiStrongWind as WindIcon,
  WiSunrise,
  WiSunset,
  WiBarometer
} from 'react-icons/wi';

const WeatherCard = ({ weather }) => {
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 1000);
        return () => clearTimeout(timer);
    }, [weather]);
    
    // Extract and format the date
    const date = weather.dt_txt 
        ? new Date(weather.dt_txt).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        }) 
        : "Today";
        
    const condition = weather.weather[0].main;
    
    // Format sunrise and sunset times if available
    const formatTime = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    
    const sunrise = weather.sys?.sunrise ? formatTime(weather.sys.sunrise) : null;
    const sunset = weather.sys?.sunset ? formatTime(weather.sys.sunset) : null;
    
    // Get temperature-based background gradient and text color
    const getTemperatureStyle = (temp) => {
        if (temp > 30) return "bg-gradient-to-br from-red-500 to-yellow-500";
        if (temp > 20) return "bg-gradient-to-br from-yellow-400 to-orange-500";
        if (temp > 10) return "bg-gradient-to-br from-blue-400 to-green-500";
        return "bg-gradient-to-br from-blue-500 to-purple-600";
    };
    
    // Weather icons with their background colors
    const getIconConfig = (condition) => {
        switch (condition) {
            case 'Clear':
                return { 
                    icon: <WiDaySunny size={64} className="text-yellow-300" />,
                    bgColor: "bg-blue-500",
                    label: "Clear Sky"
                };
            case 'Clouds':
                return { 
                    icon: <WiCloud size={64} className="text-gray-200" />,
                    bgColor: "bg-gray-600",
                    label: "Cloudy"
                };
            case 'Rain':
                return { 
                    icon: <WiRain size={64} className="text-blue-200" />,
                    bgColor: "bg-blue-600",
                    label: "Rainy"
                };
            case 'Snow':
                return { 
                    icon: <WiSnow size={64} className="text-white" />,
                    bgColor: "bg-sky-700",
                    label: "Snowy"
                };
            case 'Fog':
                return { 
                    icon: <WiFog size={64} className="text-gray-300" />,
                    bgColor: "bg-gray-500",
                    label: "Foggy"
                };
            case 'Wind':
                return { 
                    icon: <WiStrongWind size={64} className="text-gray-200" />,
                    bgColor: "bg-teal-600",
                    label: "Windy"
                };
            default:
                return { 
                    icon: <WiCloud size={64} className="text-gray-200" />,
                    bgColor: "bg-gray-600",
                    label: "Clouds"
                };
        }
    };
    
    const { icon, bgColor, label } = getIconConfig(condition);
    
    return (
        <div className={`relative overflow-hidden rounded-3xl shadow-2xl max-w-md mx-auto 
                         transition-all duration-500 transform 
                         ${animate ? 'scale-105' : 'scale-100'}`}>
            {/* Top section with gradient background */}
            <div className={`${getTemperatureStyle(weather.main.temp)} p-6 pb-16`}>
                {/* Date and Location */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-white text-sm font-medium mb-1">{date}</p>
                        <h2 className="text-3xl font-bold text-white">
                            {weather.name}, {weather.sys.country}
                        </h2>
                    </div>
                    
                    {/* Temperature */}
                    <div className="flex items-center">
                        <WiThermometer size={36} className="text-white" />
                        <span className="text-4xl font-bold text-white">
                            {Math.round(weather.main.temp)}°
                        </span>
                    </div>
                </div>
                
                {/* Main weather icon and description */}
                <div className="mt-6 flex items-center">
                    <div className={`${bgColor} p-4 rounded-full mr-4`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{label}</p>
                        <p className="text-white capitalize opacity-80">
                            {weather.weather[0].description}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Bottom section with details */}
            <div className="bg-white dark:bg-gray-800 p-6 -mt-10 rounded-t-3xl">
                {/* Weather details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <WiHumidity size={28} className="text-blue-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                            <p className="text-lg font-semibold dark:text-white">{weather.main.humidity}%</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <WindIcon size={28} className="text-teal-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Wind Speed</p>
                            <p className="text-lg font-semibold dark:text-white">{weather.wind.speed} m/s</p>
                        </div>
                    </div>
                    
                    {weather.main.pressure && (
                        <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <WiBarometer size={28} className="text-purple-500 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Pressure</p>
                                <p className="text-lg font-semibold dark:text-white">{weather.main.pressure} hPa</p>
                            </div>
                        </div>
                    )}
                    
                    {weather.main.feels_like && (
                        <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <WiThermometer size={28} className="text-red-500 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Feels Like</p>
                                <p className="text-lg font-semibold dark:text-white">{Math.round(weather.main.feels_like)}°C</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Sunrise and Sunset if available */}
                {(sunrise && sunset) && (
                    <div className="flex justify-between items-center mt-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center">
                            <WiSunrise size={32} className="text-yellow-500 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
                                <p className="text-md font-semibold dark:text-white">{sunrise}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <WiSunset size={32} className="text-orange-500 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
                                <p className="text-md font-semibold dark:text-white">{sunset}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Subtle animated cloud background element */}
            <div className="absolute top-0 right-0 opacity-20">
                <WiCloud size={120} className="text-white animate-pulse" />
            </div>
        </div>
    );
};

export default WeatherCard;