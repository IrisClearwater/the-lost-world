import { usePlayerStore } from './state/playerStore';
import { useWorldStore } from './state/worldStore';
import HexMap from './components/game/HexMap';
import InspectorPanel from './components/game/InspectorPanel';
import TopBar from './components/layout/TopBar';
import BottomDeck from './components/layout/BottomDeck';

export default function App() {
  const player = usePlayerStore();
  const selectedZoneId = useWorldStore(s => s.selectedZoneId);
  const selectedZone = useWorldStore(s =>
    s.zones.find(z => z.id === selectedZoneId)
  );

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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Game viewport */}
        <div className="flex-1 relative min-h-0">
          <HexMap />
        </div>

        {/* Desktop inspector */}
        <aside className="hidden md:block w-80 border-l border-parchment/10 overflow-y-auto">
          <InspectorPanel onClear={handleClear} />
        </aside>
      </div>
      <BottomDeck />
    </div>
  );
}
