"use client";

import { useCallback, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Hotspot = {
  id: string;
  xPct: number; // 0..100 relative x
  yPct: number; // 0..100 relative y
  radiusPct: number; // clickable radius in % of container min-dimension
  label: string;
};

const HOTSPOTS: Hotspot[] = [
  { id: 'wires', xPct: 20, yPct: 35, radiusPct: 5, label: 'Exposed wires' },
  { id: 'blocked-exit', xPct: 80, yPct: 50, radiusPct: 6, label: 'Blocked exit' },
  { id: 'heavy-shelf', xPct: 55, yPct: 25, radiusPct: 5, label: 'Unsecured heavy shelf' },
];

export function HazardIdentify() {
  const [found, setFound] = useState<string[]>([]);
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);

  const score = useMemo(() => Math.round((found.length / HOTSPOTS.length) * 100), [found.length]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFound([]);
    setTime(60);
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFound([]);
    setTime(60);
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const onClickArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!running || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    // Check proximity to hotspots
    for (const h of HOTSPOTS) {
      if (found.includes(h.id)) continue;
      const dx = xPct - h.xPct;
      const dy = yPct - h.yPct;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= h.radiusPct) {
        setFound((prev) => [...prev, h.id]);
        break;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hazard Identification</CardTitle>
        <CardDescription>Tap hazards in the scene before time runs out.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Time: {time}s</Badge>
            <Badge>Score: {score}</Badge>
          </div>
          <div className="flex gap-2">
            {!running ? (
              <Button onClick={start}>Start</Button>
            ) : (
              <Button variant="outline" onClick={reset}>Stop</Button>
            )}
            <Button variant="ghost" onClick={reset}>Reset</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div
              ref={areaRef}
              onClick={onClickArea}
              className="relative w-full aspect-[16/9] rounded border overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-crosshair"
            >
              {/* Hotspot markers (revealed when found) */}
              {HOTSPOTS.map((h) => (
                <div
                  key={h.id}
                  className={`absolute rounded-full border-2 ${found.includes(h.id) ? 'border-green-500 bg-green-200/40' : 'border-transparent'}`}
                  style={{
                    left: `calc(${h.xPct}% - ${h.radiusPct / 2}%)`,
                    top: `calc(${h.yPct}% - ${h.radiusPct / 2}%)`,
                    width: `${h.radiusPct}%`,
                    height: `${h.radiusPct}%`,
                  }}
                  title={found.includes(h.id) ? h.label : undefined}
                />
              ))}

              {/* Simple illustrative objects (fake scene) */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-300" />
              <div className="absolute left-[18%] top-[30%] w-8 h-16 bg-yellow-500 rotate-6" />
              <div className="absolute right-[15%] bottom-[25%] w-24 h-6 bg-red-400" />
              <div className="absolute left-[52%] top-[20%] w-14 h-24 bg-gray-500" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Targets</h3>
            <ul className="space-y-2 text-sm">
              {HOTSPOTS.map((h) => (
                <li key={h.id} className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${found.includes(h.id) ? 'bg-green-600' : 'bg-gray-400'}`} />
                  <span className={found.includes(h.id) ? 'line-through text-gray-500' : ''}>{h.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


