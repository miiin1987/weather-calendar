import { getUmbrellaAdvice, type UmbrellaLevel } from '@/lib/weather-utils';
import type { DailyForecast } from '@/types/weather';

interface Props {
  todayForecast: DailyForecast | null;
  currentWeatherId: number;
}

const labelColors: Record<UmbrellaLevel, string> = {
  none:    'text-yellow-200',
  low:     'text-blue-200',
  medium:  'text-blue-300',
  high:    'text-blue-400',
  unknown: 'text-white/50',
};

export default function UmbrellaAdvice({ todayForecast, currentWeatherId }: Props) {
  const pop = todayForecast !== null ? todayForecast.pop : null;
  const weatherId = todayForecast !== null ? todayForecast.weatherId : currentWeatherId;
  const advice = getUmbrellaAdvice(pop, weatherId);

  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
        傘の必要性
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{advice.emoji}</span>
        <div className="min-w-0">
          <p className={`font-bold text-sm ${labelColors[advice.level]}`}>{advice.label}</p>
          <p className="text-white/60 text-xs mt-0.5 leading-snug">{advice.detail}</p>
        </div>
      </div>
    </div>
  );
}
