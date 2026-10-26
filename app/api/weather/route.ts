import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json(
      { error: '都市名を入力してください' },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'APIキーが設定されていません。.env.local を確認してください。' },
      { status: 500 }
    );
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`,
        { cache: 'no-store' }
      ),
      fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`,
        { cache: 'no-store' }
      ),
    ]);

    if (currentRes.status === 404) {
      return NextResponse.json(
        {
          error:
            '都市が見つかりませんでした。英語の都市名（例: Tokyo, Osaka, New York）で試してください。',
        },
        { status: 404 }
      );
    }

    if (currentRes.status === 401 || forecastRes.status === 401) {
      return NextResponse.json(
        { error: 'APIキーが無効です。OpenWeatherMapのAPIキーを確認してください。' },
        { status: 401 }
      );
    }

    if (!currentRes.ok || !forecastRes.ok) {
      return NextResponse.json(
        { error: '天気データの取得に失敗しました。しばらくしてからもう一度お試しください。' },
        { status: 500 }
      );
    }

    const [current, forecast] = await Promise.all([
      currentRes.json(),
      forecastRes.json(),
    ]);

    return NextResponse.json({ current, forecast });
  } catch {
    return NextResponse.json(
      { error: 'ネットワークエラーが発生しました。インターネット接続を確認してください。' },
      { status: 500 }
    );
  }
}
