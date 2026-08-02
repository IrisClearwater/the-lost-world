import { useWorldStore, type Zone } from '../../state/worldStore';

interface Props {
  onSelectZone: (zone: Zone) => void;
}

const zoneArt: Record<string, string> = {
  clearing: '/zones/clearing.png',
  thicket:  '/zones/thicket.png',
  grove:    '/zones/grove.png',
  meadow:   '/zones/meadow.png',
};

const zoneGrid: { id: string; row: number; col: number }[] = [
  { id: 'thicket',  row: 1, col: 1 },
  { id: 'clearing', row: 1, col: 2 },
  { id: 'grove',    row: 2, col: 1 },
  { id: 'meadow',   row: 2, col: 2 },
];

export default function SceneView({ onSelectZone }: Props) {
  const zones = useWorldStore(s => s.zones);
  const selectedZoneId = useWorldStore(s => s.selectedZoneId);

  return (
    <div className="w-full h-full bg-pine-dark overflow-hidden">
      {/* 2x2 zone mosaic */}
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
        {zoneGrid.map(({ id }) => {
          const zone = zones.find(z => z.id === id);
          if (!zone) return null;
          const art = zoneArt[id];
          const isSelected = zone.id === selectedZoneId;
          const isDormant = zone.state === 'dormant';
          const isOvergrown = zone.state === 'overgrown';
          const isRestored = zone.state === 'restored';
          const isThriving = zone.state === 'thriving';

          return (
            <button
              key={id}
              onClick={() => onSelectZone(zone)}
              disabled={isDormant}
              className="relative overflow-hidden group"
            >
              {/* Zone art background — always visible underneath */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${art})` }}
              />

              {/* State overlays */}
              {isDormant && <DormantOverlay />}
              {isOvergrown && <OvergrownOverlay name={zone.name} />}
              {isRestored && <RestoredOverlay name={zone.name} />}
              {isThriving && <ThrivingOverlay name={zone.name} />}

              {/* Selection border */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-gold shadow-[inset_0_0_30px_rgba(212,175,55,0.2)] z-10 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DormantOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-pine-dark/90 backdrop-blur-sm">
      <span className="text-3xl mb-1">🔒</span>
      <span className="text-parchment/20 text-xs font-medium tracking-wider">LOCKED</span>
      <span className="text-parchment/10 text-[10px] mt-1">Clear a neighbouring zone</span>
    </div>
  );
}

function OvergrownOverlay({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-4 pointer-events-none">
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/80 via-pine-dark/30 to-transparent" />
      {/* Bramble edge vignette */}
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-terracotta/40 shadow-[inset_0_0_40px_rgba(196,116,82,0.15)]" />
      {/* Label */}
      <span className="relative z-20 text-parchment/90 font-serif text-sm md:text-base font-semibold drop-shadow-lg">
        {name}
      </span>
      <span className="relative z-20 text-terracotta/80 text-[10px] tracking-wider mt-0.5">
        NEEDS CLEARING
      </span>
      {/* Pulsing dot */}
      <div className="absolute top-3 right-3 z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse shadow-[0_0_8px_rgba(196,116,82,0.6)]" />
      </div>
    </div>
  );
}

function RestoredOverlay({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-4 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/40 via-transparent to-transparent" />
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-sage/40" />
      <span className="relative z-20 text-parchment/90 font-serif text-sm md:text-base font-semibold drop-shadow-lg">
        {name}
      </span>
      <span className="relative z-20 text-sage text-[10px] tracking-wider mt-0.5">
        RESTORED
      </span>
    </div>
  );
}

function ThrivingOverlay({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-4 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/20 via-transparent to-transparent" />
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gold/60 shadow-[inset_0_0_30px_rgba(212,175,55,0.1)]" />
      <span className="relative z-20 text-gold font-serif text-sm md:text-base font-semibold drop-shadow-lg">
        ✦ {name} ✦
      </span>
      <span className="relative z-20 text-gold/60 text-[10px] tracking-wider mt-0.5">
        THRIVING
      </span>
    </div>
  );
}
