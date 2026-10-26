import { getWeatherEmoji, formatDate, isToday } from '@/lib/weather-utils';
import type { DailyForecast } from '@/types/weather';
import { Droplets, Umbrella, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  day: DailyForecast;
}

export default function DayDetailCard({ day }: Props) {
  const today = isToday(day.dateStr);

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-xl">
              {formatDate(day.dateStr)}
            </h3>
            {today && (
              <span className="bg-white/30 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                今日
              </span>
            )}
          </div>
          <p className="text-white/70 text-sm mt-0.5">{day.description}</p>
        </div>
        <span className="text-5xl leading-none">
          {getWeatherEmoji(day.weatherId)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-300 flex-shrink-0" />
          <div>
            <p className="text-white/60 text-xs">最高気温</p>
            <p className="text-white font-bold text-xl">{day.tempMax}°C</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-300 flex-shrink-0" />
          <div>
            <p className="text-white/60 text-xs">最低気温</p>
            <p className="text-white font-bold text-xl">{day.tempMin}°C</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-300 flex-shrink-0" />
          <div>
            <p className="text-white/60 text-xs">湿度</p>
            <p className="text-white font-bold text-xl">{day.humidity}%</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
          <Umbrella className="w-5 h-5 text-blue-300 flex-shrink-0" />
          <div>
            <p className="text-white/60 text-xs">降水確率</p>
            <p className="text-white font-bold text-xl">{day.pop}%</p>
          </div>
        </div>
      </div>

      {/* Hourly forecast */}
      {day.hourly.length > 0 && (
        <div>
          <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
            時間別予報
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
            {day.hourly.map((h) => (
              <div
                key={h.time}
                className="flex-shrink-0 snap-start flex flex-col items-center gap-1 bg-white/10 rounded-xl px-3 py-2.5 min-w-[60px]"
              >
                <span className="text-white/60 text-xs">{h.time}</span>
                <span className="text-xl leading-none">
                  {getWeatherEmoji(h.weatherId)}
                </span>
                <span className="text-white text-sm font-semibold">
                  {h.temp}°
                </span>
                {h.pop > 0 && (
                  <span className="text-blue-300 text-[10px]">{h.pop}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
