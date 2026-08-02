import { useWorldStore } from '../../state/worldStore';
import { usePlayerStore } from '../../state/playerStore';

interface Props {
  onClear: () => void;
}

export default function InspectorPanel({ onClear }: Props) {
  const selectedZoneId = useWorldStore(s => s.selectedZoneId);
  const zone = useWorldStore(s => s.zones.find(z => z.id === selectedZoneId));
  const energy = usePlayerStore(s => s.energy);
  const selectedHex = useWorldStore(s => s.selectedHex);

  if (!zone) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-center text-parchment/30">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="text-sm">Select a zone to inspect</p>
          {selectedHex && (
            <p className="text-xs mt-2 text-parchment/20">
              No zone at ({selectedHex.q}, {selectedHex.r})
            </p>
          )}
        </div>
      </div>
    );
  }

  const canClear = zone.state === 'overgrown' && energy >= zone.clearCost;
  const canRestore = zone.state === 'restored' && energy >= zone.restoreCost;

  const stateColours: Record<string, string> = {
    dormant: 'bg-parchment/20 text-parchment/30',
    overgrown: 'bg-terracotta/80 text-parchment',
    restored: 'bg-sage/80 text-parchment',
    thriving: 'bg-gold/80 text-pine-dark',
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Zone state badge */}
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${stateColours[zone.state]}`}>
          {zone.state.toUpperCase()}
        </span>
        <span className="text-xs text-parchment/40">{zone.biome}</span>
      </div>

      {/* Zone name */}
      <h2 className="font-serif text-xl text-parchment">{zone.name}</h2>

      {/* Description */}
      <p className="text-sm text-parchment/60 leading-relaxed">{zone.description}</p>

      {/* Rewards */}
      {zone.state !== 'dormant' && zone.state !== 'thriving' && (
        <div className="card p-3 space-y-2">
          <h3 className="label">Rewards</h3>
          <div className="flex gap-3 text-sm">
            <span>🪙 +{zone.rewards.coins}</span>
            <span>✨ +{zone.rewards.harmony}</span>
            <span>🧱 +{zone.rewards.materials}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {zone.state === 'overgrown' && (
          <button onClick={onClear} disabled={!canClear}
            className={`btn-primary w-full ${!canClear && 'opacity-40 cursor-not-allowed'}`}>
            Clear Brambles ({zone.clearCost} 🍃)
          </button>
        )}
        {zone.state === 'restored' && (
          <button onClick={() => useWorldStore.getState().restoreZone(zone.id)}
            disabled={!canRestore}
            className={`btn-primary w-full ${!canRestore && 'opacity-40 cursor-not-allowed'}`}>
            Restore Zone ({zone.restoreCost} 🍃)
          </button>
        )}
        {zone.state === 'dormant' && (
          <p className="text-xs text-parchment/30 text-center">
            Clear a neighbouring zone to unlock this area.
          </p>
        )}
        {zone.state === 'thriving' && (
          <div className="text-center">
            <p className="text-sage text-sm">✦ Thriving ✦</p>
            <p className="text-xs text-parchment/40 mt-1">This zone is fully restored.</p>
          </div>
        )}
      </div>

      {/* Energy check */}
      {(zone.state === 'overgrown' || zone.state === 'restored') && energy < zone.clearCost && (
        <p className="text-xs text-terracotta text-center">
          Not enough energy. Wait for regen or consume food.
        </p>
      )}
    </div>
  );
}
