import { usePlayerStore } from '../../state/playerStore';

export default function TopBar() {
  const { level, title, xp, xpToNext, energy, maxEnergy, coins, gems, water } = usePlayerStore();

  return (
    <header className="flex items-center gap-2 md:gap-4 px-3 py-2 border-b border-parchment/10 bg-pine-dark/50 backdrop-blur shrink-0">
      {/* Logo */}
      <h1 className="font-serif text-lg md:text-xl text-gold tracking-wide mr-2">
        The Lost World
      </h1>

      {/* Level */}
      <div className="resource-badge hidden sm:flex">
        <span className="text-gold text-xs">Lv.{level}</span>
        <span className="text-parchment/50 text-xs">{title}</span>
      </div>

      {/* XP bar */}
      <div className="hidden md:flex items-center gap-1.5 bg-pine rounded-full h-6 px-2 flex-1 max-w-40">
        <div className="flex-1 h-1.5 bg-pine-light rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all"
               style={{ width: `${(xp / xpToNext) * 100}%` }} />
        </div>
        <span className="text-[10px] text-parchment/40 tabular-nums">{xp}/{xpToNext}</span>
      </div>

      <div className="flex-1" />

      {/* Resources */}
      <div className="flex items-center gap-1.5 text-xs">
        <Resource icon="🪙" value={coins} />
        <Resource icon="💎" value={gems} />
        <Resource icon="💧" value={water} />
        <Resource icon="🍃" value={energy} max={maxEnergy} isEnergy />
      </div>
    </header>
  );
}

function Resource({ icon, value, max, isEnergy }: {
  icon: string; value: number; max?: number; isEnergy?: boolean;
}) {
  return (
    <div className="resource-badge">
      <span>{icon}</span>
      {isEnergy && max ? (
        <>
          <span className="tabular-nums">{value}</span>
          <span className="text-parchment/30 text-[10px]">/{max}</span>
        </>
      ) : (
        <span className="tabular-nums">{value.toLocaleString()}</span>
      )}
    </div>
  );
}
