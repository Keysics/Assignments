import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'

function App() {
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchWeather = async (searchCity) => {
        if (!searchCity) return;

        setLoading(true)
        setError(null)
        setWeather(null)

        try {
            // 1. Geocoding
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=en&format=json`
            const geoRes = await fetch(geoUrl)
            const geoData = await geoRes.json()

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('City not found')
            }

            const { latitude, longitude, name, country } = geoData.results[0]

            // 2. Weather Data
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
            const weatherRes = await fetch(weatherUrl)
            const weatherData = await weatherRes.json()

            setWeather({
                city: name,
                country: country,
                current: weatherData.current_weather,
                daily: weatherData.daily
            })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Weather Dashboard</h1>
                <p>Real-time weather from across the globe</p>
            </header>

            <main>
                <SearchBar onSearch={fetchWeather} />

                {loading && <div className="loader">Loading...</div>}

                {error && <div className="error-message">{error}</div>}

                {weather && <WeatherCard data={weather} />}

                {!weather && !loading && !error && (
                    <div className="placeholder-text">
                        Enter a city name to see the forecast.
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
