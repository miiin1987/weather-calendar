// Raw OpenWeatherMap API response types
export interface OWMWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface OWMCurrentResponse {
  weather: OWMWeather[];
  main: OWMMain;
  wind: { speed: number };
  name: string;
  sys: { country: string };
  dt: number;
  timezone: number;
}

export interface OWMForecastEntry {
  dt: number;
  main: OWMMain;
  weather: OWMWeather[];
  pop: number;
  dt_txt: string;
}

export interface OWMForecastResponse {
  list: OWMForecastEntry[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
}

// Processed data types for the app
export interface CurrentWeather {
  cityName: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  weatherId: number;
  description: string;
  windSpeed: number;
}

export interface HourlyEntry {
  time: string;
  temp: number;
  weatherId: number;
  description: string;
  pop: number;
}

export interface DailyForecast {
  dateStr: string; // YYYY-MM-DD
  tempMax: number;
  tempMin: number;
  humidity: number;
  pop: number; // percentage 0-100
  weatherId: number;
  description: string;
  hourly: HourlyEntry[];
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}

export interface FavoriteCity {
  name: string;
  query: string;
}
