import React, { useMemo, useState } from 'react';
import {
  Search,
  ShieldCheck,
  CalendarClock,
  ArrowLeft,
  Radio,
  MapPin,
  Plus,
  RefreshCw,
  Star,
} from 'lucide-react';
import { Booking, ParentProfile, ParentRequest, Sitter } from '../types';
import { SitterCard } from './SitterCard';
import { AvatarWithFallback } from './AvatarWithFallback';

interface HomeViewProps {
  parent: ParentProfile;
  sitters: Sitter[];
  bookings: Booking[];
  requests: ParentRequest[];
  onGoToSearch: () => void;
  onSelectSitter: (sitter: Sitter) => void;
  onOpenBookingLive: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onOpenPostRequest: () => void;
}

const SMART_MATCH_REASONS: Record<string, string> = {
  'sitter-noa':
    'מומלצת עבורך כי יש לה ניסיון מוכח עם פעוטות ו-98% אמינות במרחק 1.2 ק״מ ממך.',
  'sitter-tamar':
    'מומלצת עבורך כי היא מדורגת 5.0 עם 99% אמינות, ניסיון של 6 שנים וקורס החייאה.',
  'sitter-maya':
    'מומלצת עבורך כי היא מתמחה בגילאי חצי שנה עד חמש וזמינה הערב בגבעתיים הסמוכה.',
  'sitter-yael':
    'מומלצת עבורך כי היא נמצאת במרחק הליכה של 0.9 ק״מ עם זמינות מיידית ותעריף נוח.',
  'sitter-shir':
    'מומלצת עבורך כי יש לה ניסיון בשיעורים והשכבה רגועה עם 96% אמינות.',
};

export const HomeView: React.FC<HomeViewProps> = ({
  parent,
  sitters,
  bookings,
  requests,
  onGoToSearch,
  onSelectSitter,
  onOpenBookingLive,
  onCancelBooking,
  onOpenPostRequest,
}) => {
  const [smartIndex, setSmartIndex] = useState(0);

  const rankedSitters = useMemo(() => {
    return [...sitters].sort((a, b) => b.smartScore - a.smartScore);
  }, [sitters]);

  const smartMatchSitter = rankedSitters[smartIndex % rankedSitters.length];
  const smartMatchReason =
    SMART_MATCH_REASONS[smartMatchSitter.id] ??
    `מומלצת עבורך בזכות ${smartMatchSitter.reliability}% אמינות וניסיון מוכח באזורך.`;

  const nearbySitters = sitters.slice(0, 4);
  const activeOrUpcomingBookings = bookings.filter(
    (b) => b.status === 'in_progress' || b.status === 'pending_checkin'
  );
  const liveBooking = bookings.find((b) => b.status === 'in_progress');

  const getSitterById = (id: string) => sitters.find((s) => s.id === id);

  return (
    <div className="space-y-7">
      {/* Hero / Greeting Banner with Warm Soft Gradient */}
      <section className="glass-card bg-gradient-to-l from-[#F0F6FF]/90 via-[#FFFDF9]/90 to-[#FFF4EC]/90 rounded-3xl border p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>
                {parent.city} · {parent.neighborhood}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#34A853] font-semibold">
                פיילוט גוש דן פעיל
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#222222] leading-snug">
              ערב טוב, {parent.firstName}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              בייביסיטריות מאומתות זהות ורשת חברתית זמינות בקרבתך.{' '}
              <span className="text-[#222222] font-medium">
                התשלום מוקפא ומוגן עד סיום העבודה
              </span>{' '}
              וכתובת מלאה נחשפת רק לאחר אישור.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onGoToSearch}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#1A73E8] text-white font-semibold text-sm sm:text-base hover:bg-[#1557B0] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-sm shadow-[#1A73E8]/20 cursor-pointer"
            >
              <Search className="w-5 h-5 shrink-0" />
              <span>חפש עכשיו</span>
            </button>
            <button
              type="button"
              onClick={onOpenPostRequest}
              className="hidden md:flex min-h-[48px] px-5 py-3 rounded-2xl bg-slate-100 text-[#222222] font-semibold text-sm hover:bg-slate-200 transition-colors items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1A73E8]" />
              <span>פרסום בקשה</span>
            </button>
          </div>
        </div>

        {/* Live Job Quick Banner if one is currently active */}
        {liveBooking &&
          (() => {
            const sitter = getSitterById(liveBooking.sitterId);
            if (!sitter) return null;
            return (
              <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AvatarWithFallback
                    src={sitter.photo}
                    alt={sitter.firstName}
                    name={sitter.firstName}
                    className="w-11 h-11 rounded-xl"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#34A853]">
                      <Radio className="w-3.5 h-3.5" />
                      <span>
                        עבודה פעילה כעת · Check-in בוצע ב-{liveBooking.checkInAt}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#222222] mt-0.5">
                      {sitter.firstName} {sitter.lastInitial} שומרת על אורי ומאיה (
                      {liveBooking.startTime}–{liveBooking.endTime})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBookingLive(liveBooking)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#34A853] text-white text-sm font-semibold hover:bg-[#2B8E44] transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>מעקב חי ו-SOS</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })()}
      </section>

      {/* AI Smart Match Banner */}
      <section
        aria-labelledby="smart-match-heading"
        className="bg-gradient-to-l from-[#1A73E8]/8 via-white to-[#34A853]/8 rounded-3xl border border-[#1A73E8]/25 p-5 sm:p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <AvatarWithFallback
              src={smartMatchSitter.photo}
              alt={smartMatchSitter.firstName}
              name={smartMatchSitter.firstName}
              className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl border border-white shadow-xs"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  id="smart-match-heading"
                  className="font-display font-bold text-[#1A73E8]"
                >
                  התאמה חכמה עבורך
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-[#34A853] font-semibold">
                  התאמה {smartMatchSitter.smartScore}% לפרופיל המשפחה
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#222222]">
                  {smartMatchSitter.firstName} {smartMatchSitter.lastInitial}
                </h2>
                <ShieldCheck className="w-4 h-4 text-[#34A853]" />
                <span className="text-xs font-semibold text-[#34A853]">
                  זהות ורשת חברתית אומתו ✓
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-xs text-slate-600 tabular-nums">
                  <Star className="w-3.5 h-3.5 inline text-amber-500 fill-amber-400 ml-0.5" />
                  {smartMatchSitter.rating.toFixed(1)} · ₪
                  {smartMatchSitter.hourlyRate}/שעה
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                {smartMatchSitter.availableTonight && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#222222]">
                    <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                    זמינה עכשיו במרחק {smartMatchSitter.distanceKm} ק״מ
                  </span>
                )}
                <span aria-hidden="true">·</span>
                <span className="text-[#1A73E8] font-medium tabular-nums">
                  הוזמנה {smartMatchSitter.neighborhoodBookingsCount} פעמים בשכונה שלך
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
                {smartMatchReason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
            <button
              type="button"
              onClick={() => setSmartIndex((i) => i + 1)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#222222] hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 text-[#1A73E8]" />
              <span>רענון חכם</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectSitter(smartMatchSitter)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1A73E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#1557B0] transition-colors cursor-pointer whitespace-nowrap"
            >
              צפייה והזמנה
            </button>
          </div>
        </div>
      </section>

      {/* Nearby Matches (4 Mock Sitter Cards) */}
      <section aria-labelledby="nearby-sitters-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              id="nearby-sitters-heading"
              className="font-display text-lg sm:text-xl font-bold text-[#222222]"
            >
              התאמות קרובות באזורך
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              מועמדות מאומתות עם מדד אמינות גבוה וזמינות קרובה
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToSearch}
            className="min-h-[44px] px-3 text-sm font-semibold text-[#1A73E8] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>לכל התוצאות</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbySitters.map((sitter) => (
            <SitterCard
              key={sitter.id}
              sitter={sitter}
              onSelect={onSelectSitter}
              variant="compact"
            />
          ))}
        </div>
      </section>

      {/* Upcoming Bookings & Parent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section
          aria-labelledby="upcoming-bookings-heading"
          className="lg:col-span-2 glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2
              id="upcoming-bookings-heading"
              className="font-display text-lg font-bold text-[#222222]"
            >
              הזמנות קרובות
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {activeOrUpcomingBookings.length} הזמנות פעילות
            </span>
          </div>

          {activeOrUpcomingBookings.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <CalendarClock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-600">
                עוד לא פרסמת בקשה? נתחיל בחיפוש סביבך.
              </p>
              <button
                type="button"
                onClick={onGoToSearch}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold hover:bg-[#1557B0] transition-colors cursor-pointer"
              >
                מצאו בייביסיטר קרובה
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeOrUpcomingBookings.map((booking) => {
                const sitter = getSitterById(booking.sitterId);
                if (!sitter) return null;
                const isLive = booking.status === 'in_progress';
                return (
                  <div
                    key={booking.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <AvatarWithFallback
                        src={sitter.photo}
                        alt={sitter.firstName}
                        name={sitter.firstName}
                        className="w-12 h-12 rounded-2xl"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`font-semibold ${
                              isLive ? 'text-[#34A853]' : 'text-[#1A73E8]'
                            }`}
                          >
                            {isLive ? 'בעבודה כעת' : 'ממתין ל-Check-in'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-600">
                            {booking.dateLabel}
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-[#222222] mt-0.5">
                          {sitter.firstName} {sitter.lastInitial} ·{' '}
                          <span className="tabular-nums font-normal text-slate-600">
                            {booking.startTime}–{booking.endTime} (₪
                            {booking.totalEstimated.toFixed(0)} מוקפא)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onOpenBookingLive(booking)}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] text-xs font-semibold hover:bg-[#1A73E8]/15 transition-colors cursor-pointer"
                      >
                        ניהול ומעקב
                      </button>
                      {!isLive && (
                        <button
                          type="button"
                          onClick={() => onCancelBooking(booking.id)}
                          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          ביטול
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Active Requests & Safety Trust Box */}
        <aside className="glass-card rounded-3xl border p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#222222]">
                הבקשות שלך
              </h2>
              <button
                type="button"
                onClick={onOpenPostRequest}
                className="text-xs font-semibold text-[#1A73E8] hover:underline min-h-[36px] px-2 cursor-pointer"
              >
                + בקשה חדשה
              </button>
            </div>

            {requests.length === 0 ? (
              <p className="text-sm text-slate-600 leading-relaxed">
                עוד לא פרסמת בקשה פתוחה. פרסמי מועד ותקבלי הצעות ממועמדות פנויות באזורך.
              </p>
            ) : (
              <div className="space-y-2.5">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-[#FAFAFA] border border-slate-200/70 text-xs space-y-1"
                  >
                    <div className="font-semibold text-[#222222] tabular-nums">
                      {req.date} · {req.startTime}–{req.endTime}
                    </div>
                    <div className="text-slate-600">
                      עד ₪{req.maxRate}/שעה · {req.childrenCount} ילדים (
                      {req.childAges.join(', ')})
                    </div>
                    {req.skills.length > 0 && (
                      <div className="text-[#1A73E8]">{req.skills.join(' · ')}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#34A853] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              כל הבייביסיטריות עוברות אימות זהות, קישור לרשת חברתית ואימות גיל 18+. כתובת מלאה נחשפת רק לאחר אישור והקפאת סכום.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
