'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastStrip from '@/components/ForecastStrip';
import WeatherCalendar from '@/components/WeatherCalendar';
import DayDetailCard from '@/components/DayDetailCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { processWeatherData, getWeatherBgClass } from '@/lib/weather-utils';
import type {
  WeatherData,
  OWMCurrentResponse,
  OWMForecastResponse,
} from '@/types/weather';

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setSelectedDate(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '天気データの取得に失敗しました');
        return;
      }

      const processed = processWeatherData(
        data.current as OWMCurrentResponse,
        data.forecast as OWMForecastResponse
      );
      setWeatherData(processed);

      if (processed.forecast.length > 0) {
        setSelectedDate(processed.forecast[0].dateStr);
      }
    } catch {
      setError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  const bgClass = weatherData
    ? getWeatherBgClass(weatherData.current.weatherId)
    : 'weather-bg-default';

  const selectedDayData = weatherData?.forecast.find(
    (d) => d.dateStr === selectedDate
  );

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${bgClass}`}>
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            🌤️ Weather Calendar
          </h1>
          <p className="text-white/50 text-sm mt-1">天気予報カレンダー</p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-2xl p-4 text-center">
            <p className="text-white text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Welcome screen */}
        {!weatherData && !loading && !error && (
          <div className="text-center py-16 space-y-3">
            <p className="text-7xl">🌍</p>
            <p className="text-white/70 text-lg font-medium">
              都市名を入力して検索してください
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Tokyo', 'Osaka', 'New York', 'London', 'Paris'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleSearch(city)}
                  className="text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/20"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Weather data */}
        {weatherData && !loading && (
          <div className="space-y-4">
            <CurrentWeatherCard data={weatherData.current} />
            <ForecastStrip
              forecast={weatherData.forecast}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <WeatherCalendar
              forecast={weatherData.forecast}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            {selectedDayData && <DayDetailCard day={selectedDayData} />}
          </div>
        )}
      </div>
    </div>
  );
}
