"use client";

import { useState } from "react";
import { updatePaymentStatus } from "@/actions/payment";

interface PaymentSectionProps {
  userId: string | null;
  initialPaid: boolean;
}

export function PaymentSection({ userId, initialPaid }: PaymentSectionProps) {
  const [isPaid, setIsPaid] = useState(initialPaid);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasOpenedPayPay, setHasOpenedPayPay] = useState(false);

  const handlePaymentStatusChange = async (paid: boolean) => {
    if (!userId) return;

    setIsUpdating(true);
    const result = await updatePaymentStatus(userId, paid);
    
    if (result.success) {
      setIsPaid(paid);
    } else {
      alert("更新に失敗しました");
    }
    setIsUpdating(false);
  };

  const handlePayPaylinkClick = () => {
    // PayPayリンクを開いたことを記録
    setHasOpenedPayPay(true);
  };

  return (
    <div className="dark-card rounded-lg p-6 border-2 border-green-500/30">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-2 glow-text">
          💰 お支払い
        </h3>
        <p className="text-gray-400 text-sm">
          PayPayでお支払いいただけます
        </p>
      </div>

      {/* PayPayボタン */}
      <div className="flex justify-center mb-6">
        <a
          href="https://qr.paypay.ne.jp/p2p01_k8lNv1BabuB8s6My"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handlePayPaylinkClick}
          className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition shadow-lg transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
            <span className="text-xl">PayPayで支払う</span>
          </div>
        </a>
      </div>

      {!hasOpenedPayPay && (
        <div className="mt-4 text-center mb-6">
          <p className="text-xs text-gray-500">
            リンクをタップしてPayPayアプリで支払いを完了してください
          </p>
        </div>
      )}

      {/* 支払い状態選択（PayPayリンクを開いた後にのみ表示） */}
      {hasOpenedPayPay && (
        <div className="border-t border-white/10 pt-6">
        <div className="text-center mb-4">
          <p className="text-white font-semibold mb-2">支払い状態</p>
          <p className="text-xs text-gray-400">
            支払い完了後、以下のボタンで状態を更新してください
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          {/* 未払いボタン */}
          <button
            onClick={() => handlePaymentStatusChange(false)}
            disabled={isUpdating || !isPaid}
            className={`flex-1 max-w-[150px] py-3 px-4 rounded-lg font-bold transition border-2 ${
              !isPaid
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {!isPaid && "✓ "}未払い
          </button>

          {/* 支払い済みボタン */}
          <button
            onClick={() => handlePaymentStatusChange(true)}
            disabled={isUpdating || isPaid}
            className={`flex-1 max-w-[150px] py-3 px-4 rounded-lg font-bold transition border-2 ${
              isPaid
                ? "bg-green-500/20 border-green-500 text-green-400"
                : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPaid && "✓ "}支払い済み
          </button>
        </div>

        {/* 現在の状態表示 */}
        <div className="mt-4 text-center">
          {isPaid ? (
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-semibold">支払い完了</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-sm font-semibold">未払い</span>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

