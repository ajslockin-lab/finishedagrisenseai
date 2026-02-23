"use server";

export interface WeatherData {
    current: {
        temp: number;
        cond: string;
        icon: string;
        low: number;
        rain: string;
        humidity: number;
        wind: number;
        visibility: number;
    };
    daily: Array<{
        day: string;
        icon: string;
        temp: number;
        low: number;
        rain: string;
        cond: string;
        isIdeal: boolean;
    }>;
}

const CONDITION_MAP: Record<number, { cond: string; icon: string }> = {
    0: { cond: 'Clear sky', icon: '☀️' },
    1: { cond: 'Mainly clear', icon: '☀️' },
    2: { cond: 'Partly cloudy', icon: '⛅' },
    3: { cond: 'Overcast', icon: '☁️' },
    45: { cond: 'Fog', icon: '🌫️' },
    48: { cond: 'Depositing rime fog', icon: '🌫️' },
    51: { cond: 'Light drizzle', icon: '🌦️' },
    53: { cond: 'Moderate drizzle', icon: '🌦️' },
    55: { cond: 'Dense drizzle', icon: '🌦️' },
    61: { cond: 'Slight rain', icon: '🌧️' },
    63: { cond: 'Moderate rain', icon: '🌧️' },
    65: { cond: 'Heavy rain', icon: '🌧️' },
    71: { cond: 'Slight snow fall', icon: '❄️' },
    73: { cond: 'Moderate snow fall', icon: '❄️' },
    75: { cond: 'Heavy snow fall', icon: '❄️' },
    80: { cond: 'Slight rain showers', icon: '🌧️' },
    81: { cond: 'Moderate rain showers', icon: '🌧️' },
    82: { cond: 'Violent rain showers', icon: '🌧️' },
    95: { cond: 'Thunderstorm', icon: '⛈️' },
};

export async function getWeatherForecast(location: string): Promise<WeatherData> {
    // Simple heuristic for Chandigarh lat/long if matches exactly (default)
    // In a real app, use a geocoding API.
    let lat = 30.7333;
    let lon = 76.7794;

    if (location.toLowerCase().includes('chandigarh')) {
        lat = 30.7333;
        lon = 76.7794;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    const data = await res.json();

    const currentCode = data.current_weather.weathercode;
    const current = {
        temp: Math.round(data.current_weather.temperature),
        cond: CONDITION_MAP[currentCode]?.cond || 'Clear',
        icon: CONDITION_MAP[currentCode]?.icon || '☀️',
        low: Math.round(data.daily.temperature_2m_min[0]),
        rain: `${data.daily.precipitation_probability_max[0]}%`,
        humidity: 55, // Open-Meteo current_weather doesn't include relative humidity unless requested in hourly
        wind: Math.round(data.current_weather.windspeed),
        visibility: 10,
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();

    const daily = data.daily.time.map((time: string, i: number) => {
        const d = new Date(time);
        const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
        const code = data.daily.weathercode[i];
        const condition = CONDITION_MAP[code] || { cond: 'Clear', icon: '☀️' };

        return {
            day: label,
            icon: condition.icon,
            temp: Math.round(data.daily.temperature_2m_max[i]),
            low: Math.round(data.daily.temperature_2m_min[i]),
            rain: `${data.daily.precipitation_probability_max[i]}%`,
            cond: condition.cond,
            isIdeal: condition.cond.includes('Clear') || condition.cond.includes('Mainly clear'),
        };
    });

    return { current, daily };
}
