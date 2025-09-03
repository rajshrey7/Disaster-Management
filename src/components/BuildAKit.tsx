"use client";

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type KitItem = {
  id: string;
  name: string;
  category: 'ESSENTIAL' | 'OPTIONAL' | 'WRONG';
};

const CATALOG: KitItem[] = [
  { id: 'water', name: 'Water (3-day supply)', category: 'ESSENTIAL' },
  { id: 'food', name: 'Non-perishable food', category: 'ESSENTIAL' },
  { id: 'firstaid', name: 'First aid kit', category: 'ESSENTIAL' },
  { id: 'flashlight', name: 'Flashlight', category: 'ESSENTIAL' },
  { id: 'radio', name: 'Battery radio', category: 'ESSENTIAL' },
  { id: 'batteries', name: 'Extra batteries', category: 'ESSENTIAL' },
  { id: 'meds', name: 'Prescription meds', category: 'OPTIONAL' },
  { id: 'cash', name: 'Emergency cash', category: 'OPTIONAL' },
  { id: 'whistle', name: 'Whistle', category: 'OPTIONAL' },
  { id: 'toys', name: 'Toys', category: 'OPTIONAL' },
  { id: 'candles', name: 'Candles', category: 'WRONG' },
  { id: 'alcohol', name: 'Alcohol', category: 'WRONG' },
  { id: 'knife', name: 'Large knife', category: 'WRONG' },
];

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 border rounded bg-white hover:bg-gray-50 cursor-grab">
      {label}
    </div>
  );
}

export function BuildAKit() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [available, setAvailable] = useState<string[]>(CATALOG.map((i) => i.id));
  const [kit, setKit] = useState<string[]>([]);

  const lookup = useMemo(() => Object.fromEntries(CATALOG.map((i) => [i.id, i])), []);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    // Move within same list
    if (kit.includes(active.id as string) && kit.includes(over.id as string)) {
      const oldIndex = kit.indexOf(active.id as string);
      const newIndex = kit.indexOf(over.id as string);
      setKit((k) => arrayMove(k, oldIndex, newIndex));
      return;
    }

    if (available.includes(active.id as string) && available.includes(over.id as string)) {
      const oldIndex = available.indexOf(active.id as string);
      const newIndex = available.indexOf(over.id as string);
      setAvailable((a) => arrayMove(a, oldIndex, newIndex));
      return;
    }
  }

  function moveToKit(id: string) {
    if (!available.includes(id)) return;
    setAvailable((a) => a.filter((x) => x !== id));
    setKit((k) => [...k, id]);
  }

  function removeFromKit(id: string) {
    if (!kit.includes(id)) return;
    setKit((k) => k.filter((x) => x !== id));
    setAvailable((a) => [...a, id]);
  }

  const score = useMemo(() => {
    let points = 0;
    let max = 0;
    CATALOG.forEach((i) => {
      if (i.category === 'ESSENTIAL') max += 2;
      if (i.category === 'OPTIONAL') max += 1;
    });
    kit.forEach((id) => {
      const item = lookup[id];
      if (item.category === 'ESSENTIAL') points += 2;
      if (item.category === 'OPTIONAL') points += 1;
      if (item.category === 'WRONG') points -= 1;
    });
    return { points: Math.max(0, points), max };
  }, [kit, lookup]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build an Emergency Kit</CardTitle>
        <CardDescription>Drag essential items into your kit. Avoid unsafe choices.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Available Items</h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={available} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 gap-2">
                  {available.map((id) => (
                    <div key={id} className="flex items-center gap-2">
                      <SortableItem id={id} label={lookup[id].name} />
                      <Button size="sm" variant="outline" onClick={() => moveToKit(id)}>Add</Button>
                      <Badge variant={lookup[id].category === 'ESSENTIAL' ? 'default' : lookup[id].category === 'OPTIONAL' ? 'secondary' : 'destructive'}>
                        {lookup[id].category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Your Kit</h3>
              <Badge>Score: {score.points} / {score.max}</Badge>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={kit} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 gap-2 min-h-24 p-2 border rounded bg-gray-50">
                  {kit.length === 0 && (
                    <div className="text-sm text-gray-500">Drag items here or use Add</div>
                  )}
                  {kit.map((id) => (
                    <div key={id} className="flex items-center gap-2">
                      <SortableItem id={id} label={lookup[id].name} />
                      <Button size="sm" variant="outline" onClick={() => removeFromKit(id)}>Remove</Button>
                      <Badge variant={lookup[id].category === 'ESSENTIAL' ? 'default' : lookup[id].category === 'OPTIONAL' ? 'secondary' : 'destructive'}>
                        {lookup[id].category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => { setAvailable(CATALOG.map((i) => i.id)); setKit([]); }}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}
