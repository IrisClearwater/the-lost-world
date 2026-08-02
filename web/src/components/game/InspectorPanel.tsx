import { usePlayerStore } from '../../state/playerStore';
import { useWorldStore, type Zone } from '../../state/worldStore';

interface Props {
  zone: Zone;
  onClear: () => void;
}

const stateLabels: Record<string, { label: string; color: string }> = {
  dormant:   { label: 'Locked',    color: 'bg-parchment/10 text-parchment/30' },
  overgrown: { label: 'Overgrown', color: 'bg-terracotta/80 text-parchment' },
  restored:  { label: 'Restored',  color: 'bg-sage/80 text-parchment' },
  thriving:  { label: 'Thriving',  color: 'bg-gold/80 text-pine-dark' },
};

export default function InspectorPanel({ zone, onClear }: Props) {
  const energy = usePlayerStore(s => s.energy);
  const { coins, harmony, materials } = zone.rewards;
  const canClear = zone.state === 'overgrown' && energy >= zone.clearCost;
  const canRestore = zone.state === 'restored' && energy >= zone.restoreCost;
  const st = stateLabels[zone.state];

  return (
    <div className="p-5 space-y-5 animate-fade-in h-full overflow-y-auto">
      {/* State badge + biome */}
      <div className="flex items-center gap-2.5">
        <span className={`text-[11px] px-3 py-1 rounded-full font-semibold tracking-wider ${st.color}`}>
          {st.label}
        </span>
        <span className="text-xs text-parchment/30 tracking-wide">{zone.biome}</span>
      </div>

      {/* Zone name */}
      <h2 className="font-serif text-2xl text-parchment leading-tight">{zone.name}</h2>

      {/* Description */}
      <p className="text-sm text-parchment/55 leading-relaxed">{zone.description}</p>

      {/* Rewards card */}
      {zone.state !== 'dormant' && zone.state !== 'thriving' && (
        <div className="card p-4 space-y-3">
          <span className="label">Rewards</span>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🪙</span>
              <span className="font-mono tabular-nums text-pine-dark/80">+{coins}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">✨</span>
              <span className="font-mono tabular-nums text-pine-dark/80">+{harmony}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">🧱</span>
              <span className="font-mono tabular-nums text-pine-dark/80">+{materials}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-2.5">
        {zone.state === 'overgrown' && (
          <>
            <button onClick={onClear} disabled={!canClear} className="btn-primary w-full">
              <span className="flex items-center justify-center gap-2">
                <span>Clear Brambles</span>
                <span className="text-xs opacity-70">({zone.clearCost} 🍃)</span>
              </span>
            </button>
            {!canClear && (
              <p className="text-xs text-terracotta/70 text-center">
                Not enough energy. Wait for regen.
              </p>
            )}
          </>
        )}

        {zone.state === 'restored' && (
          <button
            onClick={() => useWorldStore.getState().restoreZone(zone.id)}
            disabled={!canRestore}
            className="btn-primary w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <span>Restore Zone</span>
              <span className="text-xs opacity-70">({zone.restoreCost} 🍃)</span>
            </span>
          </button>
        )}

        {zone.state === 'dormant' && (
          <div className="text-center py-6 space-y-2">
            <span className="text-3xl">🔒</span>
            <p className="text-xs text-parchment/25">Clear neighbouring zones to unlock.</p>
          </div>
        )}

        {zone.state === 'thriving' && (
          <div className="text-center py-6 space-y-2">
            <span className="font-serif text-sage text-lg">✦ Thriving ✦</span>
            <p className="text-xs text-parchment/30">This zone is fully restored.</p>
          </div>
        )}
      </div>

      {/* Energy warning */}
      {energy < zone.clearCost && zone.state !== 'dormant' && zone.state !== 'thriving' && (
        <div className="border border-terracotta/15 rounded-card p-3 text-center">
          <p className="text-xs text-terracotta/60">
            🍃 Low energy — wait for natural regen or consume food to restore.
          </p>
        </div>
      )}
    </div>
  );
}
