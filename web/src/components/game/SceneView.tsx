import { useWorldStore, type Zone } from '../../state/worldStore';

interface Props {
  onSelectZone: (zone: Zone) => void;
}

const zonePositions: Record<string, { top: string; left: string; width: string; height: string }> = {
  clearing:  { top: '38%', left: '28%', width: '44%', height: '42%' },
  thicket:   { top: '12%', left: '8%',  width: '38%', height: '35%' },
  grove:     { top: '58%', left: '12%', width: '40%', height: '38%' },
  meadow:    { top: '20%', left: '52%', width: '40%', height: '55%' },
};

const zoneArt: Record<string, string> = {
  clearing: '/zones/clearing.png',
  thicket:  '/zones/thicket.png',
  grove:    '/zones/grove.png',
  meadow:   '/zones/meadow.png',
};

export default function SceneView({ onSelectZone }: Props) {
  const zones = useWorldStore(s => s.zones);
  const selectedZoneId = useWorldStore(s => s.selectedZoneId);

  // Find the zone whose art to show as background (selected or first restored/overgrown)
  const activeZone = zones.find(z => z.id === selectedZoneId)
    || zones.find(z => z.state !== 'dormant')
    || zones[0];

  const bgArt = zoneArt[activeZone?.id] || zoneArt.clearing;

  return (
    <div className="relative w-full h-full overflow-hidden bg-pine-dark">
      {/* Background scene art */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${bgArt})` }}
      />

      {/* Dark vignette overlay for atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/60 via-transparent to-pine-dark/30 pointer-events-none" />

      {/* Interactive zone hotspots */}
      {zones.map(zone => {
        const pos = zonePositions[zone.id];
        if (!pos || zone.state === 'dormant') return null;
        const isSelected = zone.id === selectedZoneId;
        const isActive = zone.state === 'overgrown' || zone.state === 'restored';

        return (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone)}
            className="absolute transition-all duration-300 group"
            style={{ top: pos.top, left: pos.left, width: pos.width, height: pos.height }}
          >
            {/* Hotspot outline */}
            <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300
              ${isSelected
                ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                : isActive
                  ? 'border-sage/40 bg-sage/5 hover:border-sage/70 hover:bg-sage/10'
                  : 'border-parchment/10 hover:border-parchment/30'
              }`}
            />

            {/* Zone label */}
            <div className={`absolute bottom-2 left-2 right-2 text-center transition-all duration-300
              ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
                ${isSelected ? 'bg-gold/80 text-pine-dark' : 'bg-pine-dark/70 text-parchment'}`}>
                {zone.name}
              </span>
            </div>

            {/* State indicator dot */}
            {zone.state === 'overgrown' && (
              <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-terracotta shadow-[0_0_6px_rgba(196,116,82,0.6)]" />
            )}
            {zone.state === 'thriving' && (
              <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
            )}
          </button>
        );
      })}

      {/* Zone indicator dots at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {zones.map(zone => (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone)}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${zone.id === selectedZoneId
                ? 'bg-gold w-4'
                : zone.state === 'dormant'
                  ? 'bg-parchment/15'
                  : 'bg-parchment/40 hover:bg-parchment/60'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
