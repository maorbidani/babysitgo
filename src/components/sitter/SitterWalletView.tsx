import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  CheckCircle2,
  ArrowDownLeft,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { SITTER_PERSONA } from '../../data/sitterMockData';
import { WalletTransaction } from '../../types';

interface SitterWalletViewProps {
  transactions: WalletTransaction[];
  onWithdrawAll: () => void;
}

const MINIMUM_WITHDRAWAL = 100;

export const SitterWalletView: React.FC<SitterWalletViewProps> = ({
  transactions,
  onWithdrawAll,
}) => {
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false);

  const availableBalance = transactions
    .filter((t) => t.status === 'paid_to_wallet')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const totalWithdrawn = transactions
    .filter((t) => t.status === 'withdrawn')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const canWithdraw = availableBalance >= MINIMUM_WITHDRAWAL;

  const handleConfirmWithdraw = () => {
    onWithdrawAll();
    setWithdrawConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Available Balance & Bank Withdrawal Hero (B6) */}
      <section className="glass-card rounded-3xl border p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#34A853]">
              <ShieldCheck className="w-4 h-4" />
              <span>
                משיכות מהירות זמינות למשתמשות בדרגת {SITTER_PERSONA.currentRank}{' '}
                ומעלה
              </span>
            </div>
            <span className="text-xs text-slate-500 block">
              יתרה זמינה למשיכה
            </span>
            <div className="font-display text-4xl font-bold text-[#222222] tabular-nums">
              ₪{availableBalance.toFixed(0)}
            </div>
            <p className="text-xs text-slate-500 tabular-nums">
              מינימום למשיכה: ₪{MINIMUM_WITHDRAWAL} · הועבר לחשבון החודש: ₪
              {totalWithdrawn.toFixed(0)}
            </p>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
            <button
              type="button"
              disabled={!canWithdraw}
              onClick={() => setWithdrawConfirmOpen(true)}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#1A73E8] text-white font-display font-bold text-sm hover:bg-[#1557B0] disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>משיכה לבנק (T+0/1)</span>
            </button>
            <span className="text-[11px] text-slate-500">
              חשבון מקושר: בנק לאומי •••• 7821
            </span>
          </div>
        </div>

        {withdrawConfirmOpen && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAFA] p-4 rounded-2xl">
            <div className="text-xs sm:text-sm text-[#222222]">
              לאשר העברה של{' '}
              <strong className="tabular-nums text-[#1A73E8]">
                ₪{availableBalance.toFixed(0)}
              </strong>{' '}
              לחשבון הבנק שלך (זיכוי T+0/1)?
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWithdrawConfirmOpen(false)}
                className="min-h-[40px] px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="min-h-[40px] px-4 rounded-xl bg-[#34A853] text-white text-xs font-bold hover:bg-[#2B8E44] cursor-pointer"
              >
                אישור משיכה
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Transparent Transactions List */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#1A73E8]" />
            <h2 className="font-display font-bold text-lg text-[#222222]">
              פירוט עסקאות ושכר בשקיפות מלאה
            </h2>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>100% מהטיפים עוברים אלייך ללא עמלה</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-semibold inline-flex items-center gap-1 ${
                      tx.status === 'paid_to_wallet'
                        ? 'text-[#34A853]'
                        : 'text-slate-500'
                    }`}
                  >
                    {tx.status === 'paid_to_wallet' ? (
                      <>
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        זמין בארנק
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        נמשך לבנק
                      </>
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">{tx.dateLabel}</span>
                </div>

                <div className="font-semibold text-sm text-[#222222]">
                  משמרת אצל {tx.parentName} ({tx.hours} שעות)
                </div>

                <div className="text-xs text-slate-600 tabular-nums">
                  בסיס ₪{tx.baseAmount} + תוספות ₪{tx.extrasAmount}
                  {tx.tipAmount > 0 && ` + טיפ ₪${tx.tipAmount}`} − עמלה ₪
                  {tx.platformFee}
                </div>
              </div>

              <div className="sm:text-left">
                <span className="text-xs text-slate-500 block">נטו לארנק</span>
                <span className="font-display font-bold text-lg text-[#1A73E8] tabular-nums">
                  +₪{tx.netAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
