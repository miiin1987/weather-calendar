'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getWeatherEmoji, isToday } from '@/lib/weather-utils';
import type { DailyForecast } from '@/types/weather';

interface Props {
  forecast: DailyForecast[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function WeatherCalendar({ forecast, selectedDate, onSelectDate }: Props) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const forecastMap = new Map(forecast.map((d) => [d.dateStr, d]));

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const toDateStr = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-xl">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
          aria-label="前の月"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-white font-bold text-lg">
          {viewYear}年{viewMonth + 1}月
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
          aria-label="次の月"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-1 ${
              i === 0 ? 'text-red-300' : i === 6 ? 'text-blue-300' : 'text-white/60'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="min-h-[60px]" />;

          const dateStr = toDateStr(day);
          const dayData = forecastMap.get(dateStr);
          const currentDay = isToday(dateStr);
          const selected = selectedDate === dateStr;
          const hasForecast = !!dayData;
          const dayOfWeek = (firstDayOfWeek + day - 1) % 7;

          return (
            <button
              key={dateStr}
              onClick={() => hasForecast && onSelectDate(dateStr)}
              disabled={!hasForecast}
              className={[
                'relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-xl min-h-[60px] transition-all',
                hasForecast ? 'cursor-pointer hover:bg-white/20' : 'cursor-default opacity-35',
                selected ? 'bg-white shadow-lg' : '',
                currentDay && !selected ? 'ring-2 ring-white/60 bg-white/10' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'font-semibold text-sm',
                  selected
                    ? 'text-blue-600'
                    : dayOfWeek === 0
                    ? 'text-red-300'
                    : dayOfWeek === 6
                    ? 'text-blue-300'
                    : 'text-white',
                ].join(' ')}
              >
                {day}
              </span>
              {dayData && (
                <>
                  <span className="text-base leading-none mt-0.5">
                    {getWeatherEmoji(dayData.weatherId)}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      selected ? 'text-blue-600' : 'text-white/80'
                    }`}
                  >
                    {dayData.tempMax}°/{dayData.tempMin}°
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-white/40 text-xs text-center mt-3">
        天気アイコンのある日をタップして詳細を表示
      </p>
    </div>
  );
}
