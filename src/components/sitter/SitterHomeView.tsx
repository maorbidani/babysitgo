import React from 'react';
import {
  Award,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Radio,
  TrendingUp,
} from 'lucide-react';
import { SITTER_PERSONA } from '../../data/sitterMockData';
import { JobOffer } from '../../types';
import { AvatarWithFallback } from '../AvatarWithFallback';

interface SitterHomeViewProps {
  availableNow: boolean;
  onToggleAvailableNow: () => void;
  weeklyAvailability: Record<string, string[]>;
  onToggleSlot: (day: string, slot: string) => void;
  offers: JobOffer[];
  onGoToJobs: () => void;
  onSelectOffer: (offer: JobOffer) => void;
  onGoToRanks: () => void;
}

const DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const SLOTS = ['בוקר', 'צהריים', 'ערב'];

export const SitterHomeView: React.FC<SitterHomeViewProps> = ({
  availableNow,
  onToggleAvailableNow,
  weeklyAvailability,
  onToggleSlot,
  offers,
  onGoToJobs,
  onSelectOffer,
  onGoToRanks,
}) => {
  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const progressPct = Math.min(
    100,
    Math.round(
      (SITTER_PERSONA.jobsCompleted / SITTER_PERSONA.jobsRequiredForNext) * 100
    )
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Instant Availability Toggle */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <AvatarWithFallback
              src={SITTER_PERSONA.photo}
              alt={SITTER_PERSONA.firstName}
              name={SITTER_PERSONA.firstName}
              className="w-16 h-16 rounded-2xl"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-[#34A853] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>זהות, גיל 18+ ורשת חברתית מאומתים</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[#222222] mt-0.5">
                שלום, {SITTER_PERSONA.firstName} {SITTER_PERSONA.lastInitial}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                דרגת {SITTER_PERSONA.currentRank} · עמלת פלטפורמה{' '}
                {SITTER_PERSONA.commissionRate}%
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleAvailableNow}
            aria-pressed={availableNow}
            className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0 ${
              availableNow
                ? 'bg-[#34A853] text-white shadow-sm shadow-[#34A853]/25 hover:bg-[#2B8E44]'
                : 'bg-slate-100 text-[#222222] border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{availableNow ? 'זמינה עכשיו (פעיל)' : 'הפעל זמינות מיידית'}</span>
          </button>
        </div>
      </section>

      {/* Reliability Score & Next Rank Progress Card (B2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="glass-card rounded-3xl border p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-500">
                מדד אמינות אישי
              </span>
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#34A853] tabular-nums mt-1">
                {SITTER_PERSONA.reliability}%
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToRanks}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] text-xs font-semibold hover:bg-[#1A73E8]/15 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>מרכז דרגות</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#222222]">
                נותרו לך 2 עבודות בציון 4.7+ לדרגת {SITTER_PERSONA.nextRank}
              </span>
              <span className="font-bold text-[#1A73E8] tabular-nums">
                {SITTER_PERSONA.jobsCompleted}/{SITTER_PERSONA.jobsRequiredForNext}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A73E8] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            <TrendingUp className="w-4 h-4 text-[#34A853] shrink-0" />
            <span>העלאת האמינות מגדילה חשיפה בתוצאות ומפחיתה את העמלה ל-9%.</span>
          </p>
        </section>

        {/* Quick Weekly Availability Calendar */}
        <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1A73E8]" />
              <h2 className="font-display font-bold text-base text-[#222222]">
                יומן זמינות שבועי מהיר
              </h2>
            </div>
            <span className="text-xs text-slate-500">לחצי לסימון חלונות זמן</span>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-1.5 min-w-[300px]">
              {DAYS.map((day) => (
                <div key={day} className="space-y-1.5 text-center">
                  <div className="text-xs font-bold text-[#222222] pb-1">
                    {day}׳
                  </div>
                  {SLOTS.map((slot) => {
                    const active = (weeklyAvailability[day] ?? []).includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => onToggleSlot(day, slot)}
                        aria-pressed={active}
                        className={`w-full min-h-[34px] rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#34A853] text-white'
                            : 'bg-[#FAFAFA] border border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Preview of Nearby Job Offers */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#222222]">
              בקשות חדשות בסביבה
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              הצעות פתוחות שממתינות למענה מהיר באזור גוש דן
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToJobs}
            className="min-h-[40px] px-3 text-xs sm:text-sm font-semibold text-[#1A73E8] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>לכל ההצעות ({pendingOffers.length})</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {pendingOffers.length === 0 ? (
          <p className="text-sm text-slate-600 py-6 text-center">
            אין הצעות ממתינות כרגע. הפעילי זמינות מיידית כדי לקבל התראות מהורים בסביבה.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOffers.slice(0, 3).map((offer) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => onSelectOffer(offer)}
                className="text-right p-4 rounded-2xl border border-slate-200 bg-[#FAFAFA] hover:border-[#1A73E8]/50 hover:bg-white transition-all flex flex-col justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-sm text-[#222222]">
                      {offer.parentName}
                    </span>
                    <span className="font-display font-bold text-sm text-[#1A73E8] tabular-nums">
                      ₪{offer.estimatedTotal} משוער
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span className="tabular-nums">{offer.dateLabel}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {offer.city} · {offer.neighborhood} ({offer.distanceKm} ק״מ)
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    {offer.childrenCount} ילדים · {offer.childAges.join(', ')}
                  </span>
                  <span className="font-semibold text-[#1A73E8]">פרטים</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
