import { usePlayerStore } from './state/playerStore';
import { useWorldStore, type Zone } from './state/worldStore';
import SceneView from './components/game/SceneView';
import InspectorPanel from './components/game/InspectorPanel';
import TopBar from './components/layout/TopBar';
import BottomDeck from './components/layout/BottomDeck';

export default function App() {
  const player = usePlayerStore();
  const zones = useWorldStore(s => s.zones);
  const selectedZoneId = useWorldStore(s => s.selectedZoneId);
  const selectedZone = zones.find(z => z.id === selectedZoneId) ?? zones[0];

  const handleSelectZone = (zone: Zone) => {
    useWorldStore.getState().selectZone(zone.id);
  };

  const handleClear = () => {
    if (!selectedZone || selectedZone.state !== 'overgrown') return;
    if (!player.spendEnergy(selectedZone.clearCost)) return;
    useWorldStore.getState().clearZone(selectedZone.id);
    player.addCoins(selectedZone.rewards.coins);
    player.addHarmony(selectedZone.rewards.harmony);
    player.addMaterials(selectedZone.rewards.materials);
    player.addXp(40);
  };

  return (
    <div className="h-dvh w-dvw flex flex-col overflow-hidden bg-pine">
      <TopBar />

      {/* Main content: left nav (desktop) + center view + right inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation (desktop) */}
        <nav className="hidden lg:flex flex-col w-52 shrink-0 border-r border-parchment/8 bg-pine-dark/30 p-3 gap-1">
          <NavItem icon="🌿" label="Garden" active />
          <NavItem icon="📋" label="Tasks" />
          <NavItem icon="🎒" label="Inventory" />
          <NavItem icon="🦊" label="Wildlife" />
          <NavItem icon="🏪" label="Market" />
          <NavItem icon="📖" label="Journal" />

          <div className="flex-1" />

          {/* Player level card */}
          <div className="card p-3 space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧑‍🌾</span>
              <div>
                <p className="text-xs font-semibold text-pine-dark/80">Custodian</p>
                <p className="text-[10px] text-pine-dark/40">Level {player.level}</p>
              </div>
            </div>
            <div className="h-1.5 bg-pine-dark/10 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all"
                   style={{ width: `${Math.min(100, (player.xp / player.xpToNext) * 100)}%` }} />
            </div>
            <p className="text-[10px] text-pine-dark/30 tabular-nums text-right">
              {player.xp} / {player.xpToNext} XP
            </p>
          </div>
        </nav>

        {/* Center — Game Scene */}
        <main className="flex-1 min-w-0 relative">
          <SceneView onSelectZone={handleSelectZone} />

          {/* Mobile zone selector overlay */}
          <div className="lg:hidden absolute bottom-16 left-3 right-3 flex gap-2 overflow-x-auto pb-1">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => handleSelectZone(zone)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${zone.id === selectedZoneId
                    ? 'bg-gold text-pine-dark'
                    : 'bg-pine-dark/80 text-parchment/60 backdrop-blur'
                  }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </main>

        {/* Right Inspector (desktop) */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 border-l border-parchment/8 bg-pine-dark/20 overflow-y-auto">
          <InspectorPanel zone={selectedZone} onClear={handleClear} />
        </aside>
      </div>

      {/* Mobile bottom deck */}
      <div className="lg:hidden">
        <BottomDeck zone={selectedZone} onClear={handleClear} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <div className={`nav-item ${active ? 'nav-item-active' : ''}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
