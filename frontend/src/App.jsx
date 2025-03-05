import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { WiDaySunny, WiTime3, WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';

import './index.css';
import 'leaflet/dist/leaflet.css';

import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';

const App = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [myWeather, setMyWeather] = useState(null);
    const [myForecast, setMyForecast] = useState(null);
    const [error, setError] = useState('');
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [activeTab, setActiveTab] = useState('current');
    const [temperatureUnit, setTemperatureUnit] = useState('celsius');

    // Get user's location
    useEffect(() => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (err) => {
                    setError("Location access denied. Using default location.");
                    setLocation({ lat: 40.7128, lon: -74.0060 });
                }
            );
        } else {
            setError("Geolocation is not supported by your browser. Using default location.");
            setLocation({ lat: 40.7128, lon: -74.0060 });
        }
    }, []);

    // Fetch weather for user's current location
    useEffect(() => {
        const fetchMyWeather = async () => {
            if (location.lat && location.lon) {
                setLoading(true);
                try {
                    const [weatherRes, forecastRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/weather', {
                            params: { city: `${location.lat},${location.lon}` },
                        }),
                        axios.get('http://localhost:5000/api/forecast', {
                            params: { city: `${location.lat},${location.lon}` },
                        }),
                    ]);
                    setMyWeather(weatherRes.data);
                    setMyForecast(forecastRes.data);
                } catch (err) {
                    setError(`Error fetching data: ${err.message}`);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchMyWeather();
    }, [location]);

    // Fetch weather by coordinates
    const fetchWeatherAndForecast = async (lat, lon) => {
        try {
            setLoading(true);
            setError('');
            const [weatherRes, forecastRes] = await Promise.all([
                axios.get('http://localhost:5000/api/weather', {
                    params: { city: `${lat},${lon}` },
                }),
                axios.get('http://localhost:5000/api/forecast', {
                    params: { city: `${lat},${lon}` },
                }),
            ]);
            setWeather(weatherRes.data);
            setForecast(forecastRes.data);
            setSelectedLocation({ lat, lon });
            setActiveTab('selected');
        } catch (err) {
            setWeather(null);
            setForecast(null);
            setError('Could not fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Temperature conversion utilities
    const convertTemperature = (temp) => {
        if (temperatureUnit === 'fahrenheit') {
            return ((temp * 9/5) + 32).toFixed(1);
        }
        return temp.toFixed(1);
    };

    const getTemperatureUnitSymbol = () => {
        return temperatureUnit === 'celsius' ? '°C' : '°F';
    };

    const convertWindSpeed = (speed) => {
        return temperatureUnit === 'fahrenheit' 
            ? (speed * 2.237).toFixed(1) 
            : speed.toFixed(1);
    };

    // Render weather details
    const renderWeatherDetails = (currentWeather) => {
        if (!currentWeather) return null;

        return (
            <div className="grid grid-cols-2 gap-4 mt-4 text-white">
                <div className="flex items-center">
                    <WiHumidity className="mr-2" size={24} />
                    <span>Humidity: {currentWeather.main.humidity}%</span>
                </div>
                <div className="flex items-center">
                    <WiStrongWind className="mr-2" size={24} />
                    <span>Wind: {convertWindSpeed(currentWeather.wind.speed)} {temperatureUnit === 'celsius' ? 'm/s' : 'mph'}</span>
                </div>
                {currentWeather.sys && (
                    <>
                        <div className="flex items-center">
                            <WiSunrise className="mr-2" size={24} />
                            <span>Sunrise: {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center">
                            <WiSunset className="mr-2" size={24} />
                            <span>Sunset: {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    // Map click handler
    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng;
                fetchWeatherAndForecast(lat, lng);
            },
        });
        return null;
    };

    // Date formatting
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Temperature unit toggle
    const TemperatureUnitToggle = () => (
        <div className="absolute top-4 right-4">
            <button 
                onClick={() => setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition"
            >
                Switch to {temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 relative">
            {/* Header */}
            <header className="py-6 px-4 bg-black/30 backdrop-blur-sm">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-white text-3xl md:text-4xl font-bold flex items-center">
                        <WiDaySunny className="mr-2 text-yellow-400" size={42} />
                        Weather Explorer
                    </h1>
                    
                    {/* Navigation Tabs */}
                    <div className="mt-4 md:mt-0 flex space-x-2">
                        <button 
                            className={`px-4 py-2 rounded-t-lg font-medium transition ${
                                activeTab === 'current' 
                                ? 'bg-white text-blue-600' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                            onClick={() => setActiveTab('current')}
                        >
                            My Location
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-t-lg font-medium transition ${
                                activeTab === 'selected' 
                                ? 'bg-white text-blue-600' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                            onClick={() => setActiveTab('selected')}
                            disabled={!weather}
                        >
                            Selected Location
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-t-lg font-medium transition ${
                                activeTab === 'map' 
                                ? 'bg-white text-blue-600' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                            onClick={() => setActiveTab('map')}
                        >
                            Map
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 relative">
                {/* Temperature Unit Toggle */}
                <TemperatureUnitToggle />

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader size="150" />
                    </div>
                )}

                {/* Error Messages */}
                {error && (
                    <div className="bg-red-500/80 text-white p-4 rounded-lg my-4 shadow-lg backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {/* Content based on active tab */}
                {!loading && (
                    <div className="mt-4">
                        {/* Current Location Tab */}
                        {activeTab === 'current' && myWeather && (
                            <div className="space-y-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-full max-w-md">
                                        <h2 className="text-white text-2xl font-bold mb-4 flex items-center">
                                            <WiThermometer className="mr-2" size={32} />
                                            Current Location Weather
                                        </h2>
                                        <WeatherCard 
                                            weather={{
                                                ...myWeather,
                                                main: {
                                                    ...myWeather.main,
                                                    temp: convertTemperature(myWeather.main.temp)
                                                }
                                            }} 
                                            temperatureUnit={getTemperatureUnitSymbol()}
                                        />
                                        {renderWeatherDetails(myWeather)}
                                    </div>
                                </div>
                                
                                {/* Forecast */}
                                {myForecast && (
                                    <div className="mt-8">
                                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                                            <WiTime3 className="mr-2" size={32} />
                                            5-Day Forecast
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                            {myForecast.list
                                                .filter(item => item.dt_txt.includes('12:00:00'))
                                                .map((item, index) => (
                                                    <div key={index} className="transform transition-transform hover:scale-105">
                                                        <p className="text-white text-center font-medium mb-2">
                                                            {formatDate(item.dt_txt)}
                                                        </p>
                                                        <WeatherCard 
                                                            weather={{
                                                                ...item,
                                                                main: {
                                                                    ...item.main,
                                                                    temp: convertTemperature(item.main.temp)
                                                                }
                                                            }} 
                                                            temperatureUnit={getTemperatureUnitSymbol()}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Selected Location Tab */}
                        {activeTab === 'selected' && weather && (
                            <div className="space-y-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-full max-w-md">
                                        <h2 className="text-white text-2xl font-bold mb-4 flex items-center">
                                            <WiThermometer className="mr-2" size={32} />
                                            Selected Location Weather
                                        </h2>
                                        <WeatherCard 
                                            weather={{
                                                ...weather,
                                                main: {
                                                    ...weather.main,
                                                    temp: convertTemperature(weather.main.temp)
                                                }
                                            }} 
                                            temperatureUnit={getTemperatureUnitSymbol()}
                                        />
                                        {renderWeatherDetails(weather)}
                                    </div>
                                </div>
                                
                                {/* Forecast */}
                                {forecast && (
                                    <div className="mt-8">
                                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                                            <WiTime3 className="mr-2" size={32} />
                                            5-Day Forecast
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                            {forecast.list
                                                .filter(item => item.dt_txt.includes('12:00:00'))
                                                .map((item, index) => (
                                                    <div key={index} className="transform transition-transform hover:scale-105">
                                                        <p className="text-white text-center font-medium mb-2">
                                                            {formatDate(item.dt_txt)}
                                                        </p>
                                                        <WeatherCard 
                                                            weather={{
                                                                ...item,
                                                                main: {
                                                                    ...item.main,
                                                                    temp: convertTemperature(item.main.temp)
                                                                }
                                                            }} 
                                                            temperatureUnit={getTemperatureUnitSymbol()}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Map Tab */}
                        {activeTab === 'map' && (
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                                <h2 className="text-white text-2xl font-bold mb-4">
                                    Interactive Weather Map
                                </h2>
                                <p className="text-white mb-4">
                                    Click anywhere on the map to get weather information for that location.
                                </p>
                                <div className="w-full h-[70vh] rounded-lg overflow-hidden shadow-xl border-2 border-white/30">
                                    {location.lat && location.lon && (
                                        <MapContainer
                                            center={[location.lat, location.lon]}
                                            zoom={10}
                                            scrollWheelZoom={true}
                                            className="w-full h-full"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {/* User's location marker */}
                                            <Marker position={[location.lat, location.lon]}>
                                                <Popup>Your current location</Popup>
                                            </Marker>
                                            
                                            {/* Selected location marker */}
                                            {selectedLocation && (
                                                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                                    <Popup>
                                                        Selected location
                                                        {weather && (
                                                            <div className="mt-2">
                                                                <p>{weather.name}, {weather.sys.country}</p>
                                                                <p>{weather.main.temp}°C, {weather.weather[0].description}</p>
                                                            </div>
                                                        )}
                                                    </Popup>
                                                </Marker>
                                            )}
                                            
                                            <MapClickHandler />
                                        </MapContainer>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-4 px-4 bg-black/40 mt-8">
                <div className="container mx-auto text-center text-white/70">
                    <p>© {new Date().getFullYear()} Weather Explorer. Data provided by OpenWeatherMap</p>
                </div>
            </footer>
        </div>
    );
};

export default App;