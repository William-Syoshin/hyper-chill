"use client";

import { useEffect, useState } from "react";
import { getVenueCounts } from "@/actions/admin";
import { VenueWithCount } from "@/types/database";
import { REALTIME_UPDATE_INTERVAL } from "@/lib/constants";
import { VenueMap } from "./VenueMap";

interface RealtimeCounterProps {
  initialVenues: VenueWithCount[];
  darkMode?: boolean;
}

export function RealtimeCounter({
  initialVenues,
  darkMode = false,
}: RealtimeCounterProps) {
  const [venues, setVenues] = useState<VenueWithCount[]>(initialVenues);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchVenues = async () => {
      const data = await getVenueCounts();
      setVenues(data as VenueWithCount[]);
      setLastUpdated(new Date());
    };

    const interval = setInterval(fetchVenues, REALTIME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const totalCount = venues.reduce((sum, v) => sum + v.current_count, 0);

  if (darkMode) {
    return (
      <div className="space-y-6">
        {/* 総人数 (ダークモード) */}
        <div className="glass-effect rounded-lg p-6 border-purple-500/30">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-400 mb-2">
              現在の総来場者数
            </div>
            <div className="text-5xl font-bold text-white glow-text">
              {String(totalCount)}
            </div>
            <div className="text-xs mt-2 text-gray-500">
              最終更新: {lastUpdated.toLocaleTimeString("ja-JP")}
            </div>
          </div>
        </div>

        {/* 会場マップ (ダークモード) */}
        <VenueMap venues={venues} darkMode={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 総人数 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <div className="text-sm font-medium mb-2">現在の総来場者数</div>
          <div className="text-5xl font-bold">{String(totalCount)}</div>
          <div className="text-xs mt-2 opacity-80">
            最終更新: {lastUpdated.toLocaleTimeString("ja-JP")}
          </div>
        </div>
      </div>

      {/* 会場マップ */}
      <VenueMap venues={venues} />
    </div>
  );
}
