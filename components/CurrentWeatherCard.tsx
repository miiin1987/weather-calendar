import { getWeatherEmoji } from '@/lib/weather-utils';
import type { CurrentWeather } from '@/types/weather';
import { Wind, Droplets, Thermometer } from 'lucide-react';

interface Props {
  data: CurrentWeather;
}

export default function CurrentWeatherCard({ data }: Props) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {data.cityName}
            <span className="text-white/60 text-lg font-normal ml-2">
              {data.country}
            </span>
          </h2>
          <p className="text-white/70 mt-1 text-sm">{data.description}</p>
        </div>
        <span className="text-6xl leading-none">
          {getWeatherEmoji(data.weatherId)}
        </span>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-7xl font-bold text-white leading-none">
          {data.temp}
        </span>
        <span className="text-3xl text-white/70 mb-2">°C</span>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-1.5 text-white/80">
          <Thermometer className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">体感 {data.feelsLike}°C</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/80">
          <Droplets className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">湿度 {data.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/80">
          <Wind className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">風速 {data.windSpeed.toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  );
}
