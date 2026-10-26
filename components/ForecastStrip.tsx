import { getWeatherEmoji, formatDate, isToday } from '@/lib/weather-utils';
import type { DailyForecast } from '@/types/weather';

interface Props {
  forecast: DailyForecast[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
}

export default function ForecastStrip({ forecast, selectedDate, onSelectDate }: Props) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-xl">
      <h3 className="text-white/70 font-semibold text-xs mb-3 uppercase tracking-wider">
        週間天気予報
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
        {forecast.map((day) => {
          const today = isToday(day.dateStr);
          const selected = selectedDate === day.dateStr;

          return (
            <button
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={[
                'flex-shrink-0 snap-start flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl',
                'transition-all border min-w-[72px]',
                selected
                  ? 'bg-white text-blue-600 border-transparent shadow-lg scale-105'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/25',
              ].join(' ')}
            >
              <span
                className={`text-xs font-semibold ${
                  selected ? 'text-blue-500' : 'text-white/70'
                }`}
              >
                {today ? '今日' : formatDate(day.dateStr, 'short')}
              </span>
              <span className="text-2xl leading-none">
                {getWeatherEmoji(day.weatherId)}
              </span>
              <span
                className={`text-sm font-bold ${
                  selected ? 'text-red-500' : 'text-orange-300'
                }`}
              >
                {day.tempMax}°
              </span>
              <span
                className={`text-xs ${selected ? 'text-blue-500' : 'text-blue-200'}`}
              >
                {day.tempMin}°
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
