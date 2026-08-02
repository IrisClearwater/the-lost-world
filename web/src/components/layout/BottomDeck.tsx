import { usePlayerStore } from '../../state/playerStore';
import type { Zone } from '../../state/worldStore';

interface Props {
  zone: Zone;
  onClear: () => void;
}

export default function BottomDeck({ zone, onClear }: Props) {
  const energy = usePlayerStore(s => s.energy);
  const maxEnergy = usePlayerStore(s => s.maxEnergy);
  const level = usePlayerStore(s => s.level);
  const xp = usePlayerStore(s => s.xp);
  const xpToNext = usePlayerStore(s => s.xpToNext);
  const canClear = zone.state === 'overgrown' && energy >= zone.clearCost;
  const canRestore = zone.state === 'restored' && energy >= zone.restoreCost;

  return (
    <footer className="shrink-0 border-t border-parchment/8 bg-pine-dark/80 backdrop-blur-md px-4 py-3 space-y-3">
      {/* Energy bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-parchment/40">🍃</span>
        <div className="flex-1 h-2 bg-pine-light rounded-full overflow-hidden">
          <div className="h-full bg-sage rounded-full transition-all duration-500"
               style={{ width: `${(energy / maxEnergy) * 100}%` }} />
        </div>
        <span className="text-xs tabular-nums text-parchment/60">{energy}/{maxEnergy}</span>
      </div>

      {/* Action button */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          {zone.state === 'overgrown' && (
            <button onClick={onClear} disabled={!canClear}
              className={`btn-primary w-full text-sm ${!canClear && 'opacity-40'}`}>
              Clear {zone.name} ({zone.clearCost} 🍃)
            </button>
          )}
          {zone.state === 'restored' && (
            <button disabled={!canRestore}
              className={`btn-primary w-full text-sm ${!canRestore && 'opacity-40'}`}>
              Restore ({zone.restoreCost} 🍃)
            </button>
          )}
          {zone.state === 'thriving' && (
            <span className="text-sage text-xs">✦ Thriving</span>
          )}
          {zone.state === 'dormant' && (
            <span className="text-parchment/20 text-xs">🔒 Locked</span>
          )}
        </div>
        <span className="text-[10px] text-parchment/25 tabular-nums">
          Lv.{level} · {xp}/{xpToNext} XP
        </span>
      </div>
    </footer>
  );
}
