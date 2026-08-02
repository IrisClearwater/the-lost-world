import { usePlayerStore } from '../../state/playerStore';

export default function BottomDeck() {
  const energy = usePlayerStore(s => s.energy);
  const maxEnergy = usePlayerStore(s => s.maxEnergy);
  const level = usePlayerStore(s => s.level);
  const xp = usePlayerStore(s => s.xp);
  const xpToNext = usePlayerStore(s => s.xpToNext);

  return (
    <footer className="md:hidden shrink-0 border-t border-parchment/10 bg-pine-dark/70 px-3 py-2 space-y-2">
      {/* Energy bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-parchment/50">🍃 Energy</span>
        <div className="flex-1 h-2 bg-pine-light rounded-full overflow-hidden">
          <div className="h-full bg-sage rounded-full transition-all duration-500"
               style={{ width: `${(energy / maxEnergy) * 100}%` }} />
        </div>
        <span className="text-xs tabular-nums text-parchment/70">{energy}/{maxEnergy}</span>
      </div>

      {/* Level + quick info */}
      <div className="flex items-center justify-between text-xs text-parchment/40">
        <span>Lv.{level} Custodian</span>
        <span>XP {xp}/{xpToNext}</span>
      </div>
    </footer>
  );
}
