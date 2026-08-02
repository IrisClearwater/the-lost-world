import { usePlayerStore } from '../../state/playerStore';

export default function TopBar() {
  const { level, title, xp, xpToNext, energy, maxEnergy, coins, gems, water } = usePlayerStore();
  const xpPct = Math.min(100, (xp / xpToNext) * 100);

  return (
    <header className="shrink-0 border-b border-parchment/8 bg-pine-dark/70 backdrop-blur-md">
      <div className="flex items-center gap-3 md:gap-5 px-4 py-2.5">
        {/* Logo */}
        <h1 className="font-serif text-lg md:text-2xl text-gold tracking-wider shrink-0">
          The Lost World
        </h1>

        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-pine-light/60 rounded-full pl-3 pr-1.5 py-1">
          <span className="text-gold text-xs font-semibold">Lv.{level}</span>
          <span className="text-parchment/40 text-[11px]">{title}</span>
          {/* Mini XP */}
          <div className="w-12 h-1.5 bg-pine-dark rounded-full overflow-hidden ml-1">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        <div className="flex-1" />

        {/* Resources */}
        <div className="flex items-center gap-2 text-xs">
          <ResourcePill icon="🪙" value={coins} />
          <ResourcePill icon="💎" value={gems} />
          <ResourcePill icon="💧" value={water} />
          <ResourcePill icon="🍃" value={energy} suffix={`/${maxEnergy}`} highlight={energy < 20} />
        </div>
      </div>
    </header>
  );
}

function ResourcePill({ icon, value, suffix, highlight }: {
  icon: string; value: number; suffix?: string; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors
      ${highlight ? 'bg-terracotta/15 ring-1 ring-terracotta/30' : 'bg-pine-light/50'}`}>
      <span className="text-sm">{icon}</span>
      <span className="font-mono tabular-nums text-parchment/80">{value.toLocaleString()}</span>
      {suffix && <span className="text-parchment/25 text-[10px]">{suffix}</span>}
    </div>
  );
}
