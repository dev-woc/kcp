"use client";

import { useState, useEffect } from "react";

interface JournalStats {
  totalEntries: number;
  totalWords: number;
}

export default function JournalStats() {
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/journal");
      const data = await response.json();

      if (response.ok) {
        setStats({
          totalEntries: data.totalEntries,
          totalWords: data.totalWords,
        });
      }
    } catch (error) {
      console.error("Error fetching journal stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!stats || stats.totalEntries === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            📝 Journal Entries
          </h3>
          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalEntries}
            </div>
            <div className="text-sm text-gray-600">
              {stats.totalWords.toLocaleString()} words written
            </div>
          </div>
        </div>
        <div className="text-4xl">✨</div>
      </div>
    </div>
  );
}
