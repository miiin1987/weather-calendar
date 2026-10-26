import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Weather Calendar - 天気予報カレンダー',
  description: '都市名で天気を検索して、週間予報をカレンダーで確認できます',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
