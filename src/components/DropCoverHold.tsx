"use client";

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Phase = 'IDLE' | 'COUNTDOWN' | 'DROP' | 'COVER' | 'HOLD' | 'RESULT';

interface Result {
  success: boolean;
  score: number; // 0..100
  reactionMs: number[]; // per phase
}

export function DropCoverHold() {
  const [phase, setPhase] = useState<Phase>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [reactions, setReactions] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartRef = useRef<number>(0);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('IDLE');
    setTimeLeft(0);
    setReactions([]);
    setResult(null);
  }, []);

  const start = useCallback(() => {
    setResult(null);
    setReactions([]);
    setPhase('COUNTDOWN');
    let t = 3;
    setTimeLeft(t);
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Start DROP phase
        phaseStartRef.current = performance.now();
        setPhase('DROP');
        setTimeLeft(3);
        runPhase(3, () => advanceTo('COVER'));
      }
    }, 1000);
  }, []);

  const runPhase = (seconds: number, onComplete: () => void) => {
    let t = seconds;
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onComplete();
      }
    }, 1000);
  };

  const advanceTo = (next: Phase) => {
    // record miss (no reaction) for previous phase
    setReactions((prev) => [...prev, 3000]);
    phaseStartRef.current = performance.now();
    if (next === 'COVER') {
      setPhase('COVER');
      setTimeLeft(3);
      runPhase(3, () => advanceTo('HOLD'));
    } else if (next === 'HOLD') {
      setPhase('HOLD');
      setTimeLeft(3);
      runPhase(3, () => finish());
    }
  };

  const reactNow = (expected: Phase) => {
    if (phase !== expected) return;
    const delta = Math.max(0, Math.round(performance.now() - phaseStartRef.current));
    // cap at 3000ms
    setReactions((prev) => [...prev, Math.min(3000, delta)]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (expected === 'DROP') {
      phaseStartRef.current = performance.now();
      setPhase('COVER');
      setTimeLeft(3);
      runPhase(3, () => advanceTo('HOLD'));
    } else if (expected === 'COVER') {
      phaseStartRef.current = performance.now();
      setPhase('HOLD');
      setTimeLeft(3);
      runPhase(3, () => finish());
    } else if (expected === 'HOLD') {
      finish();
    }
  };

  const finish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('RESULT');
    // Ensure 3 entries
    setReactions((prev) => {
      const arr = prev.slice(0, 3);
      while (arr.length < 3) arr.push(3000);
      const score = computeScore(arr);
      setResult({ success: score >= 70, score, reactionMs: arr });
      return arr;
    });
  };

  const progress = useMemo(() => {
    // timeLeft is 0..3, show countdown bar
    return Math.round(((3 - timeLeft) / 3) * 100);
  }, [timeLeft]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drop, Cover, Hold On</CardTitle>
        <CardDescription>React quickly in each phase to maximize your score.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {phase === 'IDLE' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button onClick={start}>Start Drill</Button>
              </motion.div>
            )}

            {phase === 'COUNTDOWN' && (
              <motion.div key="count" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="text-6xl font-bold">{timeLeft}</div>
                <p className="text-gray-600">Earthquake incoming… prepare to Drop!</p>
              </motion.div>
            )}

            {(phase === 'DROP' || phase === 'COVER' || phase === 'HOLD') && (
              <motion.div key={phase} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Time</Badge>
                  <div className="w-full h-2 bg-gray-200 mx-3 rounded">
                    <motion.div className="h-2 bg-blue-600 rounded" initial={{ width: '0%' }} animate={{ width: `${progress}%` }} />
                  </div>
                  <Badge>{timeLeft}s</Badge>
                </div>
                <div className="text-center">
                  {phase === 'DROP' && <motion.h3 className="text-xl font-semibold" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>Tap DROP</motion.h3>}
                  {phase === 'COVER' && <motion.h3 className="text-xl font-semibold" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>Tap COVER</motion.h3>}
                  {phase === 'HOLD' && <motion.h3 className="text-xl font-semibold" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>Tap HOLD ON</motion.h3>}
                </div>
                <div className="flex justify-center gap-3">
                  <Button variant={phase === 'DROP' ? 'default' : 'outline'} onClick={() => reactNow('DROP')}>DROP</Button>
                  <Button variant={phase === 'COVER' ? 'default' : 'outline'} onClick={() => reactNow('COVER')}>COVER</Button>
                  <Button variant={phase === 'HOLD' ? 'default' : 'outline'} onClick={() => reactNow('HOLD')}>HOLD ON</Button>
                </div>
              </motion.div>
            )}

            {phase === 'RESULT' && result && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-3">
                <div className="text-4xl font-bold">Score: {result.score}</div>
                <div className="flex justify-center gap-2">
                  <Badge variant={result.success ? 'default' : 'destructive'}>{result.success ? 'PASSED' : 'TRY AGAIN'}</Badge>
                </div>
                <div className="text-sm text-gray-600">Reactions (ms): {result.reactionMs.join(', ')}</div>
                <div className="flex justify-center gap-2 mt-2">
                  <Button onClick={start}>Retry</Button>
                  <Button variant="outline" onClick={reset}>Reset</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function computeScore(ms: number[]): number {
  // Map each reaction time to 0..100 (0ms=100, 3000ms=0), then average
  const per = ms.map((v) => Math.max(0, Math.min(100, Math.round(100 - (v / 3000) * 100))));
  const avg = Math.round(per.reduce((a, b) => a + b, 0) / per.length);
  return avg;
}


