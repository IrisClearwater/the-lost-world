import { useEffect, useRef, useCallback } from 'react';
import { useWorldStore, type ZoneState } from '../../state/worldStore';

const HEX_SIZE = 48;
const HEX_WIDTH = HEX_SIZE * Math.sqrt(3);
const HEX_VERT_SPACING = HEX_SIZE * 1.5;

const stateColours: Record<ZoneState, { fill: string; stroke: string }> = {
  dormant: { fill: '#1A2E24', stroke: '#223B2E' },
  overgrown: { fill: '#3B2E24', stroke: '#C47452' },
  restored: { fill: '#2E3B2E', stroke: '#7BA07E' },
  thriving: { fill: '#2E3A2E', stroke: '#D4AF37' },
};

const fogColour = '#16261D';
const gridLineColour = '#223B2E';

function hexToPixel(q: number, r: number): [number, number] {
  const x = HEX_WIDTH * (q + r / 2);
  const y = HEX_VERT_SPACING * r;
  return [x, y];
}

function pixelToHex(px: number, py: number): [number, number] {
  const q = ((px * Math.sqrt(3) / 3) - (py / 3)) / HEX_SIZE;
  const r = (py * 2 / 3) / HEX_SIZE;
  return hexRound(q, r);
}

function hexRound(q: number, r: number): [number, number] {
  const s = -q - r;
  let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
  const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return [rq, rr];
}

function drawHex(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  size: number,
  fill: string,
  stroke: string,
  strokeWidth: number = 1.5,
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

export default function HexMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zones = useWorldStore(s => s.zones);
  const discoveredHexes = useWorldStore(s => s.discoveredHexes);
  const selectedZoneId = useWorldStore(s => s.selectedZoneId);
  const selectHex = useWorldStore(s => s.selectHex);

  // Determine visible grid bounds from discovered hexes
  const getGridBounds = useCallback(() => {
    let minQ = 0, maxQ = 0, minR = 0, maxR = 0;
    discoveredHexes.forEach(key => {
      const [q, r] = key.split(',').map(Number);
      minQ = Math.min(minQ, q);
      maxQ = Math.max(maxQ, q);
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
    });
    return { minQ: minQ - 1, maxQ: maxQ + 1, minR: minR - 1, maxR: maxR + 1 };
  }, [discoveredHexes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      render();
    };

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = parent.clientWidth;
      const h = parent.clientHeight;

      // Background
      ctx.fillStyle = '#16261D';
      ctx.fillRect(0, 0, w, h);

      const { minQ, maxQ, minR, maxR } = getGridBounds();
      const centerX = w / 2;
      const centerY = h / 2;

      // Draw all hexes in bounds
      for (let q = minQ; q <= maxQ; q++) {
        for (let r = minR; r <= maxR; r++) {
          const key = `${q},${r}`;
          const [px, py] = hexToPixel(q, r);
          const cx = centerX + px;
          const cy = centerY + py;

          // Skip if well outside viewport
          if (cx < -HEX_SIZE || cx > w + HEX_SIZE || cy < -HEX_SIZE || cy > h + HEX_SIZE) continue;

          const discovered = discoveredHexes.has(key);
          const zone = zones.find(z => z.gridPosition.q === q && z.gridPosition.r === r);

          if (discovered && zone) {
            const colours = stateColours[zone.state];
            const isSelected = zone.id === selectedZoneId;
            drawHex(ctx, cx, cy, HEX_SIZE - 2, colours.fill, isSelected ? '#D4AF37' : colours.stroke, isSelected ? 2.5 : 1.5);

            // Zone name label
            if (zone.state !== 'dormant') {
              ctx.fillStyle = zone.state === 'thriving' ? '#D4AF37' : '#F5EFE6';
              ctx.font = '9px Inter, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(zone.name, cx, cy + HEX_SIZE - 10);
            }
          } else if (discovered) {
            // Discovered but no zone — empty hex
            drawHex(ctx, cx, cy, HEX_SIZE - 2, '#1A2E24', gridLineColour, 0.5);
          } else {
            // Undiscovered — fog
            drawHex(ctx, cx, cy, HEX_SIZE - 2, fogColour, '#1A2E24', 0.3);
          }
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - parent.clientWidth / 2;
      const y = e.clientY - rect.top - parent.clientHeight / 2;
      const [q, r] = pixelToHex(x, y);
      selectHex(q, r);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left - parent.clientWidth / 2;
      const y = touch.clientY - rect.top - parent.clientHeight / 2;
      const [q, r] = pixelToHex(x, y);
      selectHex(q, r);
      e.preventDefault();
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, [zones, discoveredHexes, selectedZoneId, selectHex, getGridBounds]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair touch-none"
    />
  );
}
