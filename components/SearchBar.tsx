'use client';

import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="都市名を入力（例: Tokyo, Osaka）"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white/70 focus:bg-white/30 transition-all"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg whitespace-nowrap"
      >
        検索
      </button>
    </form>
  );
}
