import React, { useEffect, useState } from 'react';
import {
  Clock,
  MapPin,
  Users,
  PawPrint,
  CheckCircle2,
  XCircle,
  MessageSquare,
  X,
  Lock,
  Timer,
} from 'lucide-react';
import { JobOffer } from '../../types';

interface SitterJobsViewProps {
  offers: JobOffer[];
  selectedOfferId: string | null;
  onSelectOfferId: (id: string | null) => void;
  onAcceptOffer: (offer: JobOffer) => void;
  onDeclineOffer: (offerId: string) => void;
  onOpenChatWithParent: (offer: JobOffer) => void;
}

export const SitterJobsView: React.FC<SitterJobsViewProps> = ({
  offers,
  selectedOfferId,
  onSelectOfferId,
  onAcceptOffer,
  onDeclineOffer,
  onOpenChatWithParent,
}) => {
  const [tickSec, setTickSec] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTickSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const formatSLA = (baseSec: number) => {
    const remaining = Math.max(0, baseSec - tickSec);
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const acceptedOffers = offers.filter((o) => o.status === 'accepted');
  const selectedOffer = offers.find((o) => o.id === selectedOfferId) ?? null;

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#222222]">
              הצעות עבודה בסביבה
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              אשרי בזמן כדי לשמור על מדד האמינות ודירוג המענה המהיר שלך
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1A73E8] tabular-nums">
            {pendingOffers.length} הצעות ממתינות למענה
          </span>
        </div>

        {pendingOffers.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-[#222222]">
              כל ההצעות הפתוחות טופלו
            </p>
            <p>נעדכן אותך ברגע שיעלו בקשות חדשות מהורים בגוש דן.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOffers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-2xl border border-slate-200 bg-[#FAFAFA] p-4 flex flex-col justify-between gap-4 hover:border-[#1A73E8]/50 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display font-bold text-base text-[#222222]">
                        {offer.parentName} · {offer.city} ({offer.neighborhood})
                      </h2>
                      <div className="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-0.5 tabular-nums">
                        <Timer className="w-3.5 h-3.5" />
                        <span>
                          הצעה תפוג בעוד {formatSLA(offer.slaRemainingSec)} דק׳
                        </span>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="font-display font-bold text-lg text-[#1A73E8] tabular-nums block">
                        ₪{offer.estimatedTotal}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        משוער ({offer.hours} ש׳)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#1A73E8]" />
                      <span className="tabular-nums font-medium text-[#222222]">
                        {offer.dateLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        מרחק {offer.distanceKm} ק״מ
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#34A853]" />
                      <span>
                        {offer.childrenCount} ילדים ({offer.childAges.join(', ')})
                      </span>
                      {offer.hasPets && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-[#222222]">
                            <PawPrint className="w-3 h-3" />
                            חיות מחמד
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-500 pt-0.5">
                      תעריף בסיס ₪{offer.basePay} + תוספות ₪{offer.extrasPay}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => onSelectOfferId(offer.id)}
                    className="min-h-[42px] px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#222222] hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    פרטי בקשה ומפה
                  </button>
                  <button
                    type="button"
                    onClick={() => onAcceptOffer(offer)}
                    className="min-h-[42px] px-3 rounded-xl bg-[#34A853] text-white text-xs font-semibold hover:bg-[#2B8E44] transition-colors cursor-pointer"
                  >
                    אישור עבודה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Accepted Jobs Summary */}
      {acceptedOffers.length > 0 && (
        <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-3 shadow-sm">
          <h2 className="font-display font-bold text-base text-[#222222]">
            משמרות שאושרו לאחרונה
          </h2>
          <div className="divide-y divide-slate-100">
            {acceptedOffers.map((offer) => (
              <div
                key={offer.id}
                className="py-3 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-[#34A853]">
                    אושרה · הכתובת המלאה זמינה בצ׳אט ובמשמרת
                  </div>
                  <div className="text-sm font-semibold text-[#222222] mt-0.5">
                    {offer.parentName} · {offer.dateLabel} · ₪
                    {offer.estimatedTotal}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChatWithParent(offer)}
                  className="min-h-[40px] px-4 rounded-xl bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1557B0] flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>לצ׳אט ו-Check-in</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Request Details Modal (B4) */}
      {selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-details-title"
        >
          <div className="w-full sm:max-w-lg max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2
                  id="offer-details-title"
                  className="font-display font-bold text-lg text-[#222222]"
                >
                  פרטי בקשה · {selectedOffer.parentName}
                </h2>
                <p className="text-xs text-amber-700 font-semibold tabular-nums mt-0.5">
                  הצעה תפוג בעוד {formatSLA(selectedOffer.slaRemainingSec)} דק׳
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectOfferId(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="סגור פרטי בקשה"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Approximate Arrival Map (No exact address before acceptance) */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-[#EEF3F8] relative h-44">
                <svg
                  viewBox="0 0 100 60"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <path d="M40,0 L38,60" stroke="#fff" strokeWidth="2.5" />
                  <path d="M5,32 L95,28" stroke="#fff" strokeWidth="1.8" />
                  <circle
                    cx={selectedOffer.mapCoords.x}
                    cy={selectedOffer.mapCoords.y * 0.65}
                    r="11"
                    fill="#1A73E8"
                    fillOpacity="0.16"
                    stroke="#1A73E8"
                    strokeDasharray="1.5 1.5"
                    strokeWidth="0.6"
                  />
                  <circle
                    cx={selectedOffer.mapCoords.x}
                    cy={selectedOffer.mapCoords.y * 0.65}
                    r="2"
                    fill="#1A73E8"
                  />
                </svg>
                <div className="absolute bottom-2.5 right-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-xl px-3 py-2 text-xs text-slate-700 flex items-center gap-2 border border-slate-200">
                  <Lock className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                  <span>
                    אזור משוער: {selectedOffer.city} · {selectedOffer.neighborhood} ({selectedOffer.distanceKm} ק״מ). כתובת מדויקת תיחשף רק לאחר אישור.
                  </span>
                </div>
              </div>

              {/* Family Details & Notes */}
              <div className="bg-[#FAFAFA] rounded-2xl border border-slate-200/80 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">מועד:</span>
                  <span className="font-semibold text-[#222222] tabular-nums">
                    {selectedOffer.dateLabel} ({selectedOffer.hours} שעות)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ילדים:</span>
                  <span className="font-semibold text-[#222222]">
                    {selectedOffer.childrenCount} ({selectedOffer.childAges.join(', ')})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">כישורים נדרשים:</span>
                  <span className="font-medium text-[#1A73E8]">
                    {selectedOffer.skillsRequired.join(' · ') || 'ללא דרישה מיוחדת'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    הערות המשפחה:
                  </span>
                  <p className="text-xs sm:text-sm text-[#222222] leading-relaxed">
                    {selectedOffer.familyNotes}
                  </p>
                </div>
              </div>

              {/* Pay Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">
                    שכר בסיס ₪{selectedOffer.basePay} + תוספות ₪
                    {selectedOffer.extrasPay}
                  </span>
                  <span className="font-bold text-[#222222]">
                    סה״כ משוער למשמרת
                  </span>
                </div>
                <span className="font-display font-bold text-xl text-[#1A73E8] tabular-nums">
                  ₪{selectedOffer.estimatedTotal}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-[#FAFAFA] flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onDeclineOffer(selectedOffer.id);
                  onSelectOfferId(null);
                }}
                className="min-h-[46px] px-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>דחייה</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenChatWithParent(selectedOffer);
                  onSelectOfferId(null);
                }}
                className="min-h-[46px] px-4 rounded-xl border border-[#1A73E8] bg-white text-xs sm:text-sm font-semibold text-[#1A73E8] hover:bg-[#1A73E8]/5 flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>צ׳אט עם ההורה</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAcceptOffer(selectedOffer);
                  onSelectOfferId(null);
                }}
                className="flex-1 min-h-[46px] px-5 rounded-xl bg-[#34A853] text-white text-sm font-bold hover:bg-[#2B8E44] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>אישור עבודה</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
