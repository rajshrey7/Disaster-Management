"use client";

import { useEffect, useState } from 'react';
import { Leaderboard, LeaderboardRow } from '@/components/Leaderboard';

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const json = await res.json();
        if (json.success && isMounted) setRows(json.data);
      } catch (e) {
        setError('Failed to load leaderboard');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <Leaderboard rows={rows} />
      {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
    </div>
  );
}


