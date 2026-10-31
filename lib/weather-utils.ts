import type {
  OWMCurrentResponse,
  OWMForecastResponse,
  WeatherData,
  HourlyEntry,
  DailyForecast,
} from '@/types/weather';

export function processWeatherData(
  current: OWMCurrentResponse,
  forecast: OWMForecastResponse
): WeatherData {
  const tz = forecast.city.timezone;

  // Group 3-hour forecast entries by city-local date
  const byDate: Record<string, typeof forecast.list> = {};
  for (const entry of forecast.list) {
    // Shift UTC timestamp by city timezone, then read UTC components → local date
    const localDate = new Date((entry.dt + tz) * 1000);
    const dateStr = toUtcDateStr(localDate);
    if (!byDate[dateStr]) byDate[dateStr] = [];
    byDate[dateStr].push(entry);
  }

  const forecastDays: DailyForecast[] = Object.entries(byDate).map(
    ([dateStr, entries]) => {
      const tempMax = Math.round(Math.max(...entries.map((e) => e.main.temp_max)));
      const tempMin = Math.round(Math.min(...entries.map((e) => e.main.temp_min)));
      const avgHumidity = Math.round(
        entries.reduce((s, e) => s + e.main.humidity, 0) / entries.length
      );
      const maxPop = Math.round(Math.max(...entries.map((e) => e.pop)) * 100);

      // Use the entry closest to midday as representative
      const midday = entries.reduce((best, entry) => {
        const h = new Date((entry.dt + tz) * 1000).getUTCHours();
        const bh = new Date((best.dt + tz) * 1000).getUTCHours();
        return Math.abs(h - 12) < Math.abs(bh - 12) ? entry : best;
      }, entries[0]);

      const hourly: HourlyEntry[] = entries.map((entry) => {
        const localDt = new Date((entry.dt + tz) * 1000);
        const h = String(localDt.getUTCHours()).padStart(2, '0');
        const m = String(localDt.getUTCMinutes()).padStart(2, '0');
        return {
          time: `${h}:${m}`,
          temp: Math.round(entry.main.temp),
          weatherId: entry.weather[0].id,
          description: entry.weather[0].description,
          pop: Math.round(entry.pop * 100),
        };
      });

      return {
        dateStr,
        tempMax,
        tempMin,
        humidity: avgHumidity,
        pop: maxPop,
        weatherId: midday.weather[0].id,
        description: midday.weather[0].description,
        hourly,
      };
    }
  );

  return {
    current: {
      cityName: current.name,
      country: current.sys.country,
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      weatherId: current.weather[0].id,
      description: current.weather[0].description,
      windSpeed: current.wind.speed,
    },
    forecast: forecastDays,
  };
}

function toUtcDateStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeatherEmoji(id: number): string {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 600) return id >= 511 ? '🌨️' : '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800) return '☀️';
  if (id === 801 || id === 802) return '⛅';
  return '☁️';
}

export function getWeatherBgClass(id: number): string {
  if (id >= 200 && id < 300) return 'weather-bg-thunderstorm';
  if (id >= 300 && id < 600) return 'weather-bg-rain';
  if (id >= 600 && id < 700) return 'weather-bg-snow';
  if (id >= 700 && id < 800) return 'weather-bg-fog';
  if (id === 800) return 'weather-bg-clear';
  return 'weather-bg-clouds';
}

export function formatDate(
  dateStr: string,
  style: 'full' | 'short' = 'full'
): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const wd = weekdays[d.getDay()];
  if (style === 'short') return `${month}/${day}(${wd})`;
  return `${year}年${month}月${day}日(${wd})`;
}

export function isToday(dateStr: string): boolean {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return dateStr === `${y}-${m}-${d}`;
}

export interface ClothingAdvice {
  emoji: string;
  label: string;
  detail: string;
}

export function getClothingAdvice(temp: number): ClothingAdvice {
  if (temp >= 28) return { emoji: '👕', label: '半袖', detail: '暑い日です。薄手の服装で過ごしましょう。' };
  if (temp >= 23) return { emoji: '👕', label: '半袖〜薄手の長袖', detail: '快適な気温です。お好みで。' };
  if (temp >= 18) return { emoji: '👔', label: '長袖シャツ', detail: 'やや涼しいです。長袖がおすすめ。' };
  if (temp >= 12) return { emoji: '🧥', label: '上着・ジャケット', detail: '肌寒いです。上着を持参しましょう。' };
  if (temp >= 6)  return { emoji: '🧥', label: '厚手のコート', detail: '寒いです。暖かい服装で。' };
  return { emoji: '🧣', label: 'コート・防寒具', detail: '非常に寒いです。完全防寒が必要です。' };
}

export type UmbrellaLevel = 'none' | 'low' | 'medium' | 'high' | 'unknown';

export interface UmbrellaAdvice {
  emoji: string;
  label: string;
  detail: string;
  level: UmbrellaLevel;
}

export function getUmbrellaAdvice(pop: number | null, weatherId: number): UmbrellaAdvice {
  if (pop === null) {
    const isRainy = weatherId >= 200 && weatherId < 600;
    if (isRainy) {
      return { emoji: '☂️', label: '要注意', detail: '現在の天気から雨の可能性があります', level: 'medium' };
    }
    return { emoji: '❓', label: '情報なし', detail: '降水確率データが取得できませんでした', level: 'unknown' };
  }
  if (pop >= 70) return { emoji: '☂️', label: '傘が必要', detail: `降水確率 ${pop}%`, level: 'high' };
  if (pop >= 40) return { emoji: '☔', label: '傘があると安心', detail: `降水確率 ${pop}%`, level: 'medium' };
  if (pop >= 20) return { emoji: '🌂', label: '折り畳み傘推奨', detail: `降水確率 ${pop}%`, level: 'low' };
  return { emoji: '☀️', label: '傘は不要', detail: `降水確率 ${pop}%`, level: 'none' };
}
