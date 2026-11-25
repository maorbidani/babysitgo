import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Star,
  Play,
  Pause,
  MessageSquare,
  Video,
  Info,
  CheckCircle2,
  MapPin,
  Globe,
  Clock,
  PhoneOff,
} from 'lucide-react';
import { Sitter } from '../types';
import { AvatarWithFallback } from './AvatarWithFallback';

interface SitterProfileModalProps {
  sitter: Sitter | null;
  onClose: () => void;
  onOpenChat: (sitter: Sitter) => void;
  onBookNow: (sitter: Sitter) => void;
}

export const SitterProfileModal: React.FC<SitterProfileModalProps> = ({
  sitter,
  onClose,
  onOpenChat,
  onBookNow,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoSec, setVideoSec] = useState(0);
  const [showReliabilityTip, setShowReliabilityTip] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [poorSignal, setPoorSignal] = useState(false);

  useEffect(() => {
    setIsPlayingVideo(false);
    setVideoSec(0);
    setShowReliabilityTip(false);
    setVideoCallActive(false);
    setPoorSignal(false);
  }, [sitter?.id]);

  useEffect(() => {
    if (!isPlayingVideo || !sitter) return;
    const interval = window.setInterval(() => {
      setVideoSec((prev) => {
        if (prev >= sitter.videoDurationSec) {
          setIsPlayingVideo(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlayingVideo, sitter]);

  if (!sitter) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sitter-profile-heading"
    >
      <div className="w-full sm:max-w-2xl max-h-[92vh] bg-[#FAFAFA] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Sticky Modal Top Header */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#34A853]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>זהות ורשת חברתית אומתו ✓</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="סגירת פרופיל"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {/* Profile Hero */}
          <div className="bg-gradient-to-l from-[#F3F8FF] via-white to-[#F2FBF5] rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <AvatarWithFallback
                src={sitter.photo}
                alt={`${sitter.firstName} ${sitter.lastInitial}`}
                name={sitter.firstName}
                className="w-20 h-20 rounded-2xl"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="sitter-profile-heading"
                    className="font-display text-2xl font-bold text-[#222222]"
                  >
                    {sitter.firstName} {sitter.lastInitial}
                  </h2>
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                    בת {sitter.age} · גיל מאומת
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1A73E8]">
                    <Award className="w-4 h-4" />
                    דרגת {sitter.rank}
                  </span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => setShowReliabilityTip((v) => !v)}
                    className="inline-flex items-center gap-1 font-semibold text-[#34A853] hover:underline cursor-pointer"
                  >
                    <span className="tabular-nums">אמינות {sitter.reliability}%</span>
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span aria-hidden="true">·</span>
                  {sitter.availableTonight ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#222222] tabular-nums">
                      <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                      זמינה עכשיו במרחק {sitter.distanceKm} ק״מ
                    </span>
                  ) : (
                    <span className="tabular-nums">{sitter.distanceKm} ק״מ ממך</span>
                  )}
                </div>

                <p className="mt-1 text-xs font-medium text-[#1A73E8] tabular-nums">
                  הוזמנה {sitter.neighborhoodBookingsCount} פעמים בשכונה שלך
                </p>

                {showReliabilityTip && (
                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                    מבוסס על דייקנות, ביטולים, זמן תגובה ({sitter.responseMinutes} דק׳ בממוצע) ואימותים.
                  </p>
                )}
              </div>
            </div>

            <div className="sm:text-left border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto flex sm:block items-center justify-between">
              <span className="text-xs text-slate-500 block">תעריף בסיס</span>
              <span className="font-display text-2xl font-bold text-[#1A73E8] tabular-nums">
                ₪{sitter.hourlyRate}
                <span className="text-xs font-normal text-slate-500">/שעה</span>
              </span>
            </div>
          </div>

          {/* Intro Video Area (30-45 sec) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#222222]">
                וידאו היכרות קצר ({sitter.videoDurationSec} שנ׳)
              </h3>
              <span className="text-xs text-slate-500 tabular-nums">
                {formatTimer(videoSec)} / {formatTimer(sitter.videoDurationSec)}
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/9] sm:aspect-[21/9]">
              <img
                src={sitter.photo}
                alt={`סרטון היכרות של ${sitter.firstName}`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isPlayingVideo ? 'scale-105 brightness-75' : 'brightness-65'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <span className="text-xs text-white/90 bg-black/45 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    אימות וידאו אושר
                  </span>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo((v) => !v)}
                    className="w-12 h-12 rounded-full bg-[#1A73E8] text-white flex items-center justify-center hover:bg-[#1557B0] transition-colors shadow-lg shrink-0 cursor-pointer"
                    aria-label={isPlayingVideo ? 'השהה וידאו' : 'נגן וידאו היכרות'}
                  >
                    {isPlayingVideo ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-xs sm:text-sm text-white leading-snug line-clamp-2">
                      {sitter.videoTranscript}
                    </p>
                    <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A73E8] transition-all duration-300"
                        style={{
                          width: `${(videoSec / sitter.videoDurationSec) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-display font-bold text-base text-[#222222]">אודות</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{sitter.bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-[#1A73E8] shrink-0" />
                <span>
                  אזור פעילות: <strong className="text-[#222222]">{sitter.city}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-[#1A73E8] shrink-0" />
                <span>
                  ניסיון: <strong className="text-[#222222]">{sitter.experienceYears} שנים</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-4 h-4 text-[#1A73E8] shrink-0" />
                <span>
                  שפות: <strong className="text-[#222222]">{sitter.languages.join(', ')}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Skills & Medals */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-3">
            <h3 className="font-display font-bold text-base text-[#222222]">
              כישורים, הסמכות ומדליות
            </h3>
            <div className="space-y-2 text-sm">
              <div className="text-slate-700">
                <span className="font-semibold text-[#222222]">כישורים מאומתים: </span>
                {sitter.skills.join(' · ')}
              </div>
              <div className="text-[#1A73E8] font-medium">
                <span className="font-semibold text-[#222222]">מדליות קהילה: </span>
                {sitter.medals.join(' · ')}
              </div>
            </div>
          </div>

          {/* Reviews (Double-blind) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#222222]">
                  ביקורות הורים
                </h3>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#222222] tabular-nums">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  {sitter.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  ({sitter.completedJobs} עבודות)
                </span>
              </div>
              <span className="text-xs text-slate-500">
                מנגנון Double-blind למניעת הטיה
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {sitter.reviews.map((review) => (
                <div key={review.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#222222]">
                      {review.parentName}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {review.rating}.0
                      </span>
                      <span>·</span>
                      <span>{review.dateLabel}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-xs text-[#34A853] font-medium">
                    תגיות איכות: {review.tags.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Short Video Call Simulation Banner if active */}
          {videoCallActive && (
            <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display font-bold text-base">
                    שיחת היכרות קצרה עם {sitter.firstName} (עד 2 דק׳)
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    מחובר דרך המערכת · מספרי הטלפון מוסתרים לשמירה על פרטיות
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPoorSignal((v) => !v)}
                    className="min-h-[40px] px-3 rounded-xl bg-white/10 text-amber-300 text-xs font-semibold hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {poorSignal ? 'חזור לחיבור תקין' : 'הדמיית בעיית קליטה'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoCallActive(false)}
                    className="min-h-[40px] px-4 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>סיום שיחה</span>
                  </button>
                </div>
              </div>

              {poorSignal ? (
                <div
                  role="alert"
                  className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-100"
                >
                  <span>
                    אין קליטה בוידאו: בדקו רשת או נסו מעבר לשיחה טקסטואלית.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoCallActive(false);
                      onOpenChat(sitter);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 cursor-pointer"
                  >
                    עבור לצ׳אט טקסטואלי
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  אין קליטה בוידאו? בדקו רשת או עברו לשיחה טקסטואלית בצ׳אט.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sticky Bottom Action Bar with Protection Guarantee */}
        <div className="bg-white border-t border-slate-200 px-5 pt-2.5 pb-3.5 space-y-2 shrink-0">
          <p className="text-[11px] text-center text-slate-600">
            התשלום מוקפא ומוגן עד סיום העבודה · כתובת מלאה נחשפת רק לאחר אישור
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChat(sitter)}
              className="min-h-[48px] px-4 rounded-2xl border border-slate-200 text-[#222222] text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#1A73E8]" />
              <span>צ׳אט</span>
            </button>

            <button
              type="button"
              onClick={() => setVideoCallActive(true)}
              className="min-h-[48px] px-4 rounded-2xl border border-slate-200 text-[#222222] text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Video className="w-4 h-4 text-[#1A73E8]" />
              <span>וידאו קצר</span>
            </button>

            <button
              type="button"
              onClick={() => onBookNow(sitter)}
              className="flex-1 min-h-[48px] px-5 rounded-2xl bg-[#1A73E8] text-white text-sm sm:text-base font-semibold hover:bg-[#1557B0] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-sm shadow-[#1A73E8]/20"
            >
              הזמן עכשיו
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
