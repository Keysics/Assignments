function WeatherCard({ data }) {

    // Simple WMO weather code interpretation
    const getWeatherDescription = (code) => {
        const codes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
        }
        return codes[code] || 'Unknown'
    }

    return (
        <div className="weather-card">
            <div className="location">
                <h2>{data.city}</h2>
                <span>{data.country}</span>
            </div>

            <div className="current-weather">
                <div className="temperature">
                    {Math.round(data.current.temperature)}°
                </div>
                <div>
                    <div className="condition">{getWeatherDescription(data.current.weathercode)}</div>
                </div>
            </div>

            <div className="details-grid">
                <div className="detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <div className="detail-value">{data.current.windspeed} km/h</div>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Wind Direction</span>
                    <div className="detail-value">{data.current.winddirection}°</div>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Max Temp</span>
                    <div className="detail-value">{data.daily.temperature_2m_max[0]}°</div>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Min Temp</span>
                    <div className="detail-value">{data.daily.temperature_2m_min[0]}°</div>
                </div>
            </div>
        </div>
    )
}

export default WeatherCard
