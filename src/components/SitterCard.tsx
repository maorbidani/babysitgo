import React from 'react';
import { ShieldCheck, Star, Play, Award, Users } from 'lucide-react';
import { Sitter } from '../types';
import { AvatarWithFallback } from './AvatarWithFallback';

interface SitterCardProps {
  sitter: Sitter;
  onSelect: (sitter: Sitter) => void;
  variant?: 'compact' | 'detailed';
}

export const SitterCard: React.FC<SitterCardProps> = ({
  sitter,
  onSelect,
  variant = 'compact',
}) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (sitter.reliability / 100) * circumference;

  return (
    <button
      type="button"
      onClick={() => onSelect(sitter)}
      className="group w-full text-right glass-card rounded-3xl border p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1A73E8]/50 transition-all duration-200 flex flex-col justify-between gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] active:scale-[0.99] cursor-pointer"
    >
      <div className="flex items-start gap-3.5 w-full">
        <div className="relative shrink-0">
          <AvatarWithFallback
            src={sitter.photo}
            alt={`${sitter.firstName} ${sitter.lastInitial}`}
            name={sitter.firstName}
            className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl shadow-xs"
          />
          {variant === 'detailed' && (
            <span
              className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#1A73E8]"
              title="כולל וידאו היכרות"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#222222] truncate">
                  {sitter.firstName} {sitter.lastInitial}
                </h3>
                <span className="font-display font-bold text-base text-[#1A73E8] tabular-nums whitespace-nowrap shrink-0">
                  · ₪{sitter.hourlyRate}
                  <span className="text-xs font-normal text-slate-500">/ש׳</span>
                </span>
              </div>

              {/* Verified Social & Identity Cue */}
              <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#34A853]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>זהות ורשת חברתית אומתו ✓</span>
              </div>
            </div>

            {/* Circular Reliability Progress Ring */}
            <div
              className="relative w-12 h-12 flex items-center justify-center shrink-0"
              title={`מדד אמינות ${sitter.reliability}%`}
            >
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  fill="none"
                  stroke={sitter.reliability >= 96 ? '#34A853' : '#1A73E8'}
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-display font-bold text-[#222222] tabular-nums">
                {sitter.reliability}%
              </span>
            </div>
          </div>

          {/* Live Proximity Pulse & Social Proof */}
          <div className="mt-2 space-y-1 text-xs">
            {sitter.availableTonight ? (
              <div className="flex items-center gap-2 text-[#222222] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse shrink-0" />
                <span className="tabular-nums">
                  זמינה עכשיו במרחק {sitter.distanceKm} ק״מ
                </span>
              </div>
            ) : (
              <div className="text-slate-600 tabular-nums">
                {sitter.availabilityLabel} · מרחק {sitter.distanceKm} ק״מ
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-600">
              <span className="inline-flex items-center gap-1 text-[#1A73E8] font-medium">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="tabular-nums">
                  הוזמנה {sitter.neighborhoodBookingsCount} פעמים בשכונה שלך
                </span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-[#222222] tabular-nums">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                {sitter.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Award className="w-3.5 h-3.5 text-[#1A73E8]" />
                {sitter.rank}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 w-full text-xs">
        <span className="text-slate-600 truncate">
          {sitter.skills.slice(0, 2).join(' · ')}
        </span>
        <span className="text-[#1A73E8] font-semibold whitespace-nowrap shrink-0 group-hover:underline">
          לפרופיל והזמנה
        </span>
      </div>
    </button>
  );
};
