import React, { useEffect, useState } from 'react';
import {
  Siren,
  Clock,
  MapPin,
  CheckCircle2,
  PlusCircle,
  MessageSquare,
  Star,
  X,
  Play,
  ShieldCheck,
  Wallet,
  Radio,
  FileText,
  Download,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { QUALITY_TAGS } from '../data/mockData';
import { UI_COPY } from '../i18n/translations';
import { AppLanguage, Booking, ParentRequest, Sitter } from '../types';
import { AvatarWithFallback } from './AvatarWithFallback';

interface BookingsAndLiveViewProps {
  bookings: Booking[];
  requests: ParentRequest[];
  sitters: Sitter[];
  selectedBookingId: string | null;
  shareLocationDuringJob: boolean;
  lang: AppLanguage;
  onSelectBooking: (bookingId: string | null) => void;
  onCheckIn: (bookingId: string) => void;
  onRequestExtension: (bookingId: string) => void;
  onFinishJob: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onSubmitReview: (
    bookingId: string,
    rating: number,
    tags: string[],
    comment: string
  ) => void;
  onOpenChat: (sitterId: string) => void;
  onOpenSOS: (context: string) => void;
  onGoToSearch: () => void;
  onGoToSettings: () => void;
}

export const BookingsAndLiveView: React.FC<BookingsAndLiveViewProps> = ({
  bookings,
  requests,
  sitters,
  selectedBookingId,
  shareLocationDuringJob,
  lang,
  onSelectBooking,
  onCheckIn,
  onRequestExtension,
  onFinishJob,
  onCancelBooking,
  onSubmitReview,
  onOpenChat,
  onOpenSOS,
  onGoToSearch,
  onGoToSettings,
}) => {
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['דייקנות', 'בטיחות']);
  const [reviewComment, setReviewComment] = useState('');
  const [archiveSearch, setArchiveSearch] = useState('');
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  const t = UI_COPY[lang];

  const activeBooking =
    bookings.find((b) => b.id === selectedBookingId) ??
    bookings.find((b) => b.status === 'in_progress') ??
    bookings.find((b) => b.status === 'pending_checkin') ??
    bookings[0];

  useEffect(() => {
    if (!activeBooking || activeBooking.status !== 'in_progress') return;
    const timer = window.setInterval(() => {
      setLiveSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeBooking?.id, activeBooking?.status]);

  const formatElapsed = (baseMinutes: number, extraSeconds: number) => {
    const totalSec = baseMinutes * 60 + extraSeconds;
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  const toggleReviewTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((tItem) => tItem !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handleReviewFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;
    onSubmitReview(reviewBookingId, rating, selectedTags, reviewComment);
    setReviewBookingId(null);
    setReviewComment('');
    setRating(5);
  };

  const getSitter = (id: string) => sitters.find((s) => s.id === id);

  const buildReceiptDownloadHref = (booking: Booking, sitter: Sitter) => {
    const receiptNum = `BG-${booking.date.replace(/-/g, '')}-${booking.id.slice(-4).toUpperCase()}`;
    const baseTotal = Math.round(booking.baseRate * booking.hours);
    const html = `<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><title>קבלה ${receiptNum} - BabysitGo</title>
<style>body{font-family:Arial,sans-serif;background:#FFFDF9;color:#222;padding:32px;max-width:560px;margin:auto}h1{color:#1A73E8}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px 0;border-bottom:1px solid #eee}.total{font-weight:bold;font-size:18px;color:#1A73E8}</style>
</head>
<body>
<h1>BabysitGo — קבלה דיגיטלית</h1>
<p>מספר קבלה: <strong>${receiptNum}</strong></p>
<p>תאריך שירות: ${booking.dateLabel} (${booking.startTime}–${booking.endTime})</p>
<p>בייביסיטר: ${sitter.firstName} ${sitter.lastInitial} · כתובת: ${booking.generalAddress}</p>
<table>
  <tr><td>שמרטפות (${booking.hours} שעות × ₪${booking.baseRate})</td><td>₪${baseTotal}</td></tr>
  <tr><td>תוספת ערב / סופ״ש / קצרה</td><td>₪${booking.eveningExtra + booking.weekendExtra + booking.shortNoticeExtra}</td></tr>
  <tr><td>דמי שירות ואבטחה</td><td>₪${booking.serviceFee}</td></tr>
  <tr><td>טיפ לבייביסיטר</td><td>₪${booking.tip}</td></tr>
  <tr class="total"><td>סה״כ שולם (${booking.paymentMethod.toUpperCase()})</td><td>₪${booking.totalEstimated.toFixed(0)}</td></tr>
</table>
<p style="margin-top:24px;font-size:12px;color:#666">הופק אוטומטית ע״י BabysitGo Trust & Billing</p>
</body></html>`;
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  };

  const archivedBookings = bookings.filter((b) => {
    if (b.status !== 'completed' && b.status !== 'cancelled') return false;
    if (!archiveSearch.trim()) return true;
    const sitter = getSitter(b.sitterId);
    const hay = `${sitter?.firstName ?? ''} ${b.dateLabel} ${b.generalAddress}`.toLowerCase();
    return hay.includes(archiveSearch.trim().toLowerCase());
  });

  const upcomingOrActive = bookings.filter(
    (b) => b.status === 'in_progress' || b.status === 'pending_checkin'
  );

  return (
    <div className="space-y-6">
      {/* Published Open Parent Requests */}
      {requests.length > 0 && (
        <section
          aria-label="בקשות פתוחות שפורסמו"
          className="glass-card rounded-3xl border border-[#1A73E8]/30 p-5 space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#1A73E8]" />
              <h2 className="font-display font-bold text-base text-[#222222]">
                בקשות פתוחות ששידרת לבייביסיטריות
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#1A73E8] tabular-nums">
              {requests.length} בקשות פעילות
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#222222] tabular-nums">
                    {req.date} · {req.startTime}–{req.endTime}
                  </span>
                  <span className="font-semibold text-[#34A853]">
                    נשלחה התראה לאזורך
                  </span>
                </div>
                <p className="text-slate-600">
                  {req.childrenCount} ילדים ({req.childAges.join(', ')}) · עד ₪
                  {req.maxRate}/שעה
                  {req.hasPets ? ' · חיות מחמד בבית' : ''}
                </p>
                {req.skills.length > 0 && (
                  <p className="text-[#1A73E8] font-medium">
                    דרישות: {req.skills.join(' · ')}
                  </p>
                )}
                {req.notes && (
                  <p className="text-slate-500">הערות: {req.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live Job Tracking Panel (A7) */}
      {activeBooking &&
        activeBooking.status !== 'cancelled' &&
        (() => {
          const sitter = getSitter(activeBooking.sitterId);
          if (!sitter) return null;
          const isInProgress = activeBooking.status === 'in_progress';
          const isPending = activeBooking.status === 'pending_checkin';
          const isCompleted = activeBooking.status === 'completed';

          return (
            <section
              aria-label="מעקב עבודה חי"
              className="glass-card rounded-3xl border overflow-hidden shadow-sm"
            >
              {/* Top Safety Header with Prominent Red SOS Button */}
              <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AvatarWithFallback
                    src={sitter.photo}
                    alt={sitter.firstName}
                    name={sitter.firstName}
                    className="w-12 h-12 rounded-2xl"
                  />
                  <div>
                    <div className="text-xs text-slate-300">
                      מעקב עבודה חי · {activeBooking.dateLabel}
                    </div>
                    <h1 className="font-display font-bold text-lg">
                      {sitter.firstName} {sitter.lastInitial} (
                      {activeBooking.startTime}–{activeBooking.endTime})
                    </h1>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenSOS(
                      `מעקב עבודה חי — ${sitter.firstName} ${sitter.lastInitial}`
                    )
                  }
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-red-600 text-white font-display font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Siren className="w-5 h-5 shrink-0" />
                  <span>SOS חירום</span>
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Location Sharing Warning Edge-Case (Spec G) */}
                {!shareLocationDuringJob && (
                  <div
                    role="alert"
                    className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{t.locationMissingWarning}</span>
                    </div>
                    <button
                      type="button"
                      onClick={onGoToSettings}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 cursor-pointer"
                    >
                      {t.enableNow}
                    </button>
                  </div>
                )}

                {/* Status Stepper */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`p-2.5 rounded-xl font-semibold ${
                      isPending
                        ? 'bg-[#1A73E8]/10 text-[#1A73E8] border border-[#1A73E8]/30'
                        : 'bg-[#34A853]/10 text-[#34A853]'
                    }`}
                  >
                    1. ממתין ל-Check-in
                  </div>
                  <div
                    className={`p-2.5 rounded-xl font-semibold ${
                      isInProgress
                        ? 'bg-[#34A853] text-white'
                        : isCompleted
                        ? 'bg-[#34A853]/10 text-[#34A853]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    2. בעבודה
                  </div>
                  <div
                    className={`p-2.5 rounded-xl font-semibold ${
                      isCompleted
                        ? 'bg-[#1A73E8] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    3. הסתיים
                  </div>
                </div>

                {/* Live Timer, Updated Cost & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="bg-white/80 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">
                        טיימר שעות חי
                      </span>
                      <span className="font-display font-bold text-2xl text-[#222222] tabular-nums mt-0.5 block">
                        {isPending
                          ? '00:00:00'
                          : formatElapsed(activeBooking.elapsedMinutes, liveSeconds)}
                      </span>
                    </div>
                    <Clock className="w-6 h-6 text-[#1A73E8] shrink-0" />
                  </div>

                  <div className="bg-white/80 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">
                        עלות משוערת ({activeBooking.hours} ש׳)
                      </span>
                      <span className="font-display font-bold text-2xl text-[#1A73E8] tabular-nums mt-0.5 block">
                        ₪{activeBooking.totalEstimated.toFixed(0)}
                      </span>
                    </div>
                    <Wallet className="w-6 h-6 text-[#1A73E8] shrink-0" />
                  </div>

                  <div className="bg-white/80 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="text-xs text-slate-500 block">
                        {shareLocationDuringJob
                          ? 'מיקום (Opt-in פעיל)'
                          : 'מיקום (שיתוף כבוי)'}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#222222] mt-0.5 block truncate">
                        {activeBooking.fullAddress}
                      </span>
                    </div>
                    <MapPin
                      className={`w-6 h-6 shrink-0 ${
                        shareLocationDuringJob ? 'text-[#34A853]' : 'text-amber-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {isPending && (
                    <button
                      type="button"
                      onClick={() => onCheckIn(activeBooking.id)}
                      className="min-h-[46px] px-5 rounded-xl bg-[#34A853] text-white text-sm font-semibold hover:bg-[#2B8E44] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>סימולציית Check-in (התחלת עבודה)</span>
                    </button>
                  )}

                  {isInProgress && (
                    <>
                      <button
                        type="button"
                        onClick={() => onRequestExtension(activeBooking.id)}
                        disabled={activeBooking.extensionRequested}
                        className="min-h-[46px] px-4 rounded-xl border border-[#1A73E8] text-[#1A73E8] text-sm font-semibold hover:bg-[#1A73E8]/5 disabled:opacity-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>
                          {activeBooking.extensionRequested
                            ? 'הארכה ב-30 דק׳ עודכנה בעלות'
                            : 'בקש/י הארכה (30 דק׳)'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onFinishJob(activeBooking.id);
                          setReviewBookingId(activeBooking.id);
                        }}
                        className="min-h-[46px] px-5 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold hover:bg-[#1557B0] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>סיום עבודה</span>
                      </button>
                    </>
                  )}

                  {isCompleted && !activeBooking.reviewSubmitted && (
                    <button
                      type="button"
                      onClick={() => setReviewBookingId(activeBooking.id)}
                      className="min-h-[46px] px-5 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold hover:bg-[#1557B0] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Star className="w-4 h-4" />
                      <span>שליחת ביקורת ודירוג (Double-blind)</span>
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => setReceiptBooking(activeBooking)}
                      className="min-h-[46px] px-4 rounded-xl border border-[#34A853]/40 bg-[#F2FBF5] text-[#34A853] text-sm font-semibold hover:bg-[#34A853]/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{t.viewReceipt}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenChat(sitter.id)}
                    className="min-h-[46px] px-4 rounded-xl border border-slate-200 bg-white/80 text-[#222222] text-sm font-semibold hover:bg-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#1A73E8]" />
                    <span>צ׳אט</span>
                  </button>
                </div>
              </div>
            </section>
          );
        })()}

      {/* Upcoming & Active Bookings */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#222222]">
            {lang === 'he' ? 'הזמנות פעילות וקרובות' : 'Active & Upcoming Bookings'}
          </h2>
          <button
            type="button"
            onClick={onGoToSearch}
            className="text-xs font-semibold text-[#1A73E8] hover:underline min-h-[36px] px-2 cursor-pointer"
          >
            {lang === 'he' ? '+ הזמנה חדשה' : '+ New Booking'}
          </button>
        </div>

        {upcomingOrActive.length === 0 ? (
          <p className="text-sm text-slate-600 py-5 text-center">
            {lang === 'he'
              ? 'אין הזמנות פעילות כרגע. חפשי בייביסיטר קרובה כדי להתחיל.'
              : 'No active bookings right now.'}
          </p>
        ) : (
          <div className="divide-y divide-slate-200/60">
            {upcomingOrActive.map((booking) => {
              const sitter = getSitter(booking.sitterId);
              if (!sitter) return null;
              const statusText =
                booking.status === 'in_progress'
                  ? 'בעבודה כעת'
                  : 'ממתין ל-Check-in';

              return (
                <div
                  key={booking.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                            booking.status === 'in_progress'
                              ? 'text-[#34A853]'
                              : 'text-[#1A73E8]'
                          }`}
                        >
                          {statusText}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600">{booking.dateLabel}</span>
                      </div>
                      <p className="font-semibold text-sm text-[#222222] mt-0.5">
                        {sitter.firstName} {sitter.lastInitial} ·{' '}
                        <span className="tabular-nums font-normal text-slate-600">
                          {booking.startTime}–{booking.endTime} · ₪
                          {booking.totalEstimated.toFixed(0)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onSelectBooking(booking.id)}
                      className="min-h-[40px] px-3.5 rounded-xl bg-white border border-slate-200 text-[#222222] text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      מעקב / פרטים
                    </button>
                    {booking.status === 'pending_checkin' && (
                      <button
                        type="button"
                        onClick={() => onCancelBooking(booking.id)}
                        className="min-h-[40px] px-3 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        ביטול הזמנה
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bookings Archive & Digital Receipts Section */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1A73E8]" />
            <h2 className="font-display font-bold text-lg text-[#222222]">
              {t.archiveTitle}
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="search"
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              placeholder={
                lang === 'he' ? 'חיפוש לפי שם בייביסיטר או תאריך...' : 'Filter archive...'
              }
              className="w-full min-h-[40px] pr-9 pl-3 rounded-xl border border-slate-200 bg-white/90 text-xs"
            />
          </div>
        </div>

        {archivedBookings.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">{t.archiveEmpty}</p>
        ) : (
          <div className="divide-y divide-slate-200/60">
            {archivedBookings.map((booking) => {
              const sitter = getSitter(booking.sitterId);
              if (!sitter) return null;
              const receiptCode = `BG-${booking.date.replace(/-/g, '')}-${booking.id
                .slice(-4)
                .toUpperCase()}`;

              return (
                <div
                  key={booking.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <AvatarWithFallback
                      src={sitter.photo}
                      alt={sitter.firstName}
                      name={sitter.firstName}
                      className="w-11 h-11 rounded-2xl"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            booking.status === 'cancelled'
                              ? 'text-red-600'
                              : 'text-[#34A853]'
                          }`}
                        >
                          {booking.status === 'cancelled'
                            ? 'בוטלה'
                            : 'הושלמה ושולמה ✓'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600">{booking.dateLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500 tabular-nums">
                          #{receiptCode}
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-[#222222] mt-0.5">
                        {sitter.firstName} {sitter.lastInitial} ·{' '}
                        <span className="tabular-nums font-normal text-slate-600">
                          {booking.startTime}–{booking.endTime} ({booking.hours} ש׳) · ₪
                          {booking.totalEstimated.toFixed(0)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {booking.status === 'completed' && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setReceiptBooking(booking)}
                        className="min-h-[38px] px-3.5 rounded-xl bg-[#F0F6FF] border border-[#1A73E8]/25 text-[#1A73E8] text-xs font-semibold hover:bg-[#1A73E8]/10 flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t.viewReceipt}</span>
                      </button>
                      <a
                        href={buildReceiptDownloadHref(booking, sitter)}
                        download={`Receipt-${receiptCode}.html`}
                        className="min-h-[38px] px-3 rounded-xl border border-slate-200 bg-white text-[#222222] text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#34A853]" />
                        <span>הורדה</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Digital Receipt Modal */}
      {receiptBooking &&
        (() => {
          const sitter = getSitter(receiptBooking.sitterId);
          if (!sitter) return null;
          const receiptCode = `BG-${receiptBooking.date.replace(
            /-/g,
            ''
          )}-${receiptBooking.id.slice(-4).toUpperCase()}`;
          const baseTotal = Math.round(
            receiptBooking.baseRate * receiptBooking.hours
          );
          const extrasTotal =
            receiptBooking.eveningExtra +
            receiptBooking.weekendExtra +
            receiptBooking.shortNoticeExtra;

          return (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full sm:max-w-md bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1A73E8]" />
                    <h3 className="font-display font-bold text-base text-[#222222]">
                      {t.receiptTitle}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReceiptBooking(null)}
                    className="min-h-[36px] min-w-[36px] rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    aria-label={t.close}
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">מספר אסמכתא:</span>
                    <span className="font-bold text-[#222222] tabular-nums">
                      #{receiptCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">תאריך ושעות:</span>
                    <span className="font-semibold text-[#222222] tabular-nums">
                      {receiptBooking.dateLabel} · {receiptBooking.startTime}–
                      {receiptBooking.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">בייביסיטר:</span>
                    <span className="font-semibold text-[#222222]">
                      {sitter.firstName} {sitter.lastInitial}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">אמצעי תשלום:</span>
                    <span className="font-semibold text-[#222222] uppercase">
                      {receiptBooking.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#FFF4EC]/70 border border-orange-100 p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-700">
                    <span>
                      שמרטפות ({receiptBooking.hours} ש׳ × ₪
                      {receiptBooking.baseRate})
                    </span>
                    <span className="tabular-nums font-medium">₪{baseTotal}</span>
                  </div>
                  {extrasTotal > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>תוספות ערב / סופ״ש</span>
                      <span className="tabular-nums">₪{extrasTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-700">
                    <span>דמי שירות ואבטחה</span>
                    <span className="tabular-nums">
                      ₪{receiptBooking.serviceFee}
                    </span>
                  </div>
                  {receiptBooking.tip > 0 && (
                    <div className="flex justify-between text-[#34A853]">
                      <span>טיפ לבייביסיטר</span>
                      <span className="tabular-nums">₪{receiptBooking.tip}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-orange-200/70 flex justify-between font-display font-bold text-base text-[#1A73E8]">
                    <span>סה״כ שולם</span>
                    <span className="tabular-nums">
                      ₪{receiptBooking.totalEstimated.toFixed(0)}
                    </span>
                  </div>
                </div>

                <a
                  href={buildReceiptDownloadHref(receiptBooking, sitter)}
                  download={`Receipt-${receiptCode}.html`}
                  className="w-full min-h-[46px] rounded-2xl bg-[#1A73E8] text-white font-semibold text-sm hover:bg-[#1557B0] flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.downloadReceipt}</span>
                </a>
              </div>
            </div>
          );
        })()}

      {/* Double-blind Review Modal (A8) */}
      {reviewBookingId && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <form
            onSubmit={handleReviewFormSubmit}
            className="w-full sm:max-w-md bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3
                id="review-modal-title"
                className="font-display font-bold text-lg text-[#222222]"
              >
                דירוג וביקורת (Double-blind)
              </h3>
              <button
                type="button"
                onClick={() => setReviewBookingId(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="סגירת חלון ביקורת"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/70 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
              <span>
                הביקורת תפורסם רק לאחר שגם הבייביסיטרית תדרג (או תוך 72 שעות).
              </span>
            </div>

            {/* Stars 1-5 */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600 block">
                דירוג 1–5 כוכבים:
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-amber-50 cursor-pointer"
                    aria-label={`${star} כוכבים`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Up to 3 Quality Tags */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600 block">
                בחירה של עד 3 תגיות איכות ({selectedTags.length}/3):
              </span>
              <div className="flex flex-wrap gap-2">
                {QUALITY_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleReviewTag(tag)}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#34A853] border-[#34A853] text-white'
                          : 'bg-white border-slate-200 text-[#222222]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                הערה אישית (אופציונלי)
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="איך הייתה החוויה עם הבייביסיטר?"
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#1A73E8] text-white font-semibold text-sm hover:bg-[#1557B0] transition-colors cursor-pointer"
            >
              שליחת ביקורת
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
