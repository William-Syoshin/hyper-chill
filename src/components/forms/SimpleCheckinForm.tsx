"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { simpleCheckin } from "@/actions/checkin";

interface SimpleCheckinFormProps {
  venueId: string;
  venueName: string;
  userId: string;
  userNickname: string;
}

export function SimpleCheckinForm({
  venueId,
  venueName,
  userId,
  userNickname,
}: SimpleCheckinFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckin = async () => {
    setLoading(true);
    setError(null);

    const result = await simpleCheckin(venueId, userId);

    if (result.success) {
      router.push(`/success?venue=${venueId}`);
    } else {
      setError(result.error || "チェックインに失敗しました");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 glow-text">
          {venueName}へようこそ！
        </h2>
        <p className="text-gray-400">おかえりなさい、{userNickname}さん</p>
      </div>

      {/* ユーザー情報表示 */}
      <div className="glass-effect rounded-lg p-4 border-white/20">
        <p className="text-sm text-gray-300 text-center">
          事前登録済みのアカウントでチェックインします
        </p>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="glass-effect rounded-lg p-4 border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* チェックインボタン */}
      <button
        onClick={handleCheckin}
        disabled={loading}
        className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-medium rounded-lg border border-white/20 transition relative"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            チェックイン中...
          </span>
        ) : (
          "チェックイン"
        )}
      </button>
    </div>
  );
}

