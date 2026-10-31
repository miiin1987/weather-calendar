'use client';

import type { FavoriteCity } from '@/types/weather';

interface Props {
  favorites: FavoriteCity[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onAdd: () => void;
  canAdd: boolean;
}

export default function FavoritesPanel({ favorites, onSelect, onRemove, onAdd, canAdd }: Props) {
  if (favorites.length === 0 && !canAdd) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/80 text-sm font-semibold">⭐ お気に入り</h3>
        {canAdd && (
          <button
            onClick={onAdd}
            className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all border border-white/20"
          >
            + 現在地を追加
          </button>
        )}
      </div>
      {favorites.length === 0 ? (
        <p className="text-white/40 text-xs text-center py-1">
          検索後に「現在地を追加」でお気に入り登録できます
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <div
              key={fav.query}
              className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1.5 border border-white/20"
            >
              <button
                onClick={() => onSelect(fav.query)}
                className="text-white/85 hover:text-white text-sm transition-colors"
              >
                {fav.name}
              </button>
              <button
                onClick={() => onRemove(fav.query)}
                className="text-white/40 hover:text-red-300 text-xs ml-1 transition-colors leading-none"
                aria-label={`${fav.name}をお気に入りから削除`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
