import { getClothingAdvice } from '@/lib/weather-utils';

interface Props {
  temp: number;
}

export default function ClothingAdvice({ temp }: Props) {
  const advice = getClothingAdvice(temp);

  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
        服装の目安
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{advice.emoji}</span>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm">{advice.label}</p>
          <p className="text-white/60 text-xs mt-0.5 leading-snug">{advice.detail}</p>
        </div>
      </div>
      <p className="text-white/35 text-[10px] mt-3">※ 気温による一般的な目安です</p>
    </div>
  );
}
