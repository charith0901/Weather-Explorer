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
import ShareButton from './ShareButton';

const WeatherCard = ({ weather }) => {
    const [animate, setAnimate] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
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
        <div 
            className={`
                relative 
                overflow-hidden 
                rounded-3xl 
                shadow-2xl 
                max-w-md 
                mx-auto 
                transition-all 
                duration-500 
                transform 
                hover:scale-[1.02] 
                hover:shadow-3xl 
                ${animate ? 'animate-pulse-soft' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top section with gradient background and staggered entrance animation */}
            <div 
                className={`
                    ${getTemperatureStyle(weather.main.temp)} 
                    p-6 
                    pb-16 
                    relative 
                    overflow-hidden
                `}
            >
                {/* Animated background elements */}
                <div 
                    className={`
                        absolute 
                        -top-10 
                        -right-10 
                        opacity-10 
                        transition-transform 
                        duration-700 
                        ${isHovered ? 'rotate-12 scale-110' : 'rotate-0'}
                    `}
                >
                    <WiCloud size={200} className="text-white animate-drift" />
                </div>

                {/* Date and Location with staggered animation */}
                <div className="relative z-10 transform transition-transform duration-500 animate-slide-in-top">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <p className="text-white text-sm font-medium opacity-80 animate-fade-in delay-100">
                                {date}
                            </p>
                            <h2 className="text-3xl font-bold text-white animate-fade-in delay-200">
                                {weather.name}, {weather.sys.country}
                            </h2>
                        </div>
                        
                        {/* Temperature with wobble effect */}
                        <div 
                            className={`
                                flex 
                                items-center 
                                transition-transform 
                                duration-300 
                                hover:animate-wobble
                            `}
                        >
                            <WiThermometer size={36} className="text-white" />
                            <span className="text-4xl font-bold text-white">
                                {Math.round(weather.main.temp)}°
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Main weather icon and description */}
                <div 
                    className="
                        mt-6 
                        flex 
                        items-center 
                        transform 
                        transition-transform 
                        duration-500 
                        animate-slide-in-bottom
                    "
                >
                    <div 
                        className={`
                            ${bgColor} 
                            p-4 
                            rounded-full 
                            mr-4 
                            transition-all 
                            duration-300 
                            hover:rotate-12 
                            hover:scale-110
                        `}
                    >
                        {icon}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white animate-fade-in delay-300">
                            {label}
                        </p>
                        <p 
                            className="
                                text-white 
                                capitalize 
                                opacity-80 
                                animate-fade-in 
                                delay-500
                            "
                        >
                            {weather.weather[0].description}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Bottom section with subtle hover and interactive effects */}
            <div 
                className="
                    bg-white 
                    dark:bg-gray-800 
                    p-6 
                    -mt-10 
                    rounded-t-3xl 
                    transition-all 
                    duration-300 
                    hover:shadow-lg
                "
            >
                {/* Weather details grid with hover and interaction effects */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { 
                            icon: <WiHumidity size={28} className="text-blue-500 mr-3" />, 
                            label: "Humidity", 
                            value: `${weather.main.humidity}%` 
                        },
                        { 
                            icon: <WindIcon size={28} className="text-teal-500 mr-3" />, 
                            label: "Wind Speed", 
                            value: `${weather.wind.speed} m/s` 
                        },
                        weather.main.pressure && { 
                            icon: <WiBarometer size={28} className="text-purple-500 mr-3" />, 
                            label: "Pressure", 
                            value: `${weather.main.pressure} hPa` 
                        },
                        weather.main.feels_like && { 
                            icon: <WiThermometer size={28} className="text-red-500 mr-3" />, 
                            label: "Feels Like", 
                            value: `${Math.round(weather.main.feels_like)}°C` 
                        }
                    ].filter(Boolean).map((detail, index) => (
                        <div 
                            key={detail.label}
                            className={`
                                flex 
                                items-center 
                                p-3 
                                bg-gray-100 
                                dark:bg-gray-700 
                                rounded-xl 
                                transition-all 
                                duration-300 
                                hover:scale-105 
                                hover:shadow-md
                                animate-slide-in-right
                            `}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {detail.icon}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {detail.label}
                                </p>
                                <p className="text-lg font-semibold dark:text-white">
                                    {detail.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Sunrise and Sunset section */}
                {(sunrise && sunset) && (
                    <div 
                        className="
                            flex 
                            justify-between 
                            items-center 
                            mt-6 
                            p-3 
                            bg-gray-100 
                            dark:bg-gray-700 
                            rounded-xl
                            transition-all 
                            duration-300 
                            hover:scale-[1.02]
                            animate-slide-in-bottom
                        "
                    >
                        {/* Sunrise block */}
                        <div className="flex items-center">
                            <WiSunrise size={32} className="text-yellow-500 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
                                <p className="text-md font-semibold dark:text-white">{sunrise}</p>
                            </div>
                        </div>
                        
                        {/* Sunset block */}
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
            
            {/* ShareButton with gentle animation */}
            {weather && (
                <div 
                    className="
                        mt-4 
                        p-4 
                        transition-all 
                        duration-500 
                        animate-fade-in
                    "
                >
                    <ShareButton 
                        location={weather.name}
                        temperature={weather.main.temp}
                        description={weather.weather[0].description}
                    />
                </div>
            )}
        </div>
    );
};

export default WeatherCard;

// Add these custom Tailwind animations in your global CSS or Tailwind config
const customAnimations = {
    '@keyframes drift': {
        '0%, 100%': { transform: 'translateX(0) translateY(0)' },
        '50%': { transform: 'translateX(10px) translateY(-10px)' },
    },
    '@keyframes pulse-soft': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.02)' },
    },
    '@keyframes slide-in-top': {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    '@keyframes slide-in-bottom': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    '@keyframes slide-in-right': {
        '0%': { opacity: 0, transform: 'translateX(20px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
    },
    '@keyframes fade-in': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
    '@keyframes wobble': {
        '0%, 100%': { transform: 'rotate(0deg)' },
        '25%': { transform: 'rotate(-5deg)' },
        '75%': { transform: 'rotate(5deg)' },
    }
};