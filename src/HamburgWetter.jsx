import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HamburgWetter() {
    const [temperature, setTemperature] = useState(null);
    const [icon, setIcon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const apiKey = '9ef7b620d2134edd93590208242606'; // Your WeatherAPI.com key
                const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Hamburg`);
                setTemperature(response.data.current.temp_c);
                setIcon(response.data.current.condition.icon);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching weather data:", err);
                setError(err.response ? err.response.data.error.message : err.message);
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return <div className="weather-container"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="weather-container"><p>Error: {error}</p></div>;
    }

    return (
        <div className="weather-container">
            <div className="weather-header">Aktuelle Umgebungstemperatur in Hamburg</div>
            <div className="weather-temp">{temperature}°C</div>
            {icon && <img className="weather-icon" src={`https:${icon}`} alt="weather icon" />}
        </div>
    );
}

export default HamburgWetter;
