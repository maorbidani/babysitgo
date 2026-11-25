import React, { useEffect, useState } from 'react';
import {
  Send,
  Siren,
  ShieldAlert,
  MapPin,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { SitterShift } from '../../types';

interface SitterChatAndShiftViewProps {
  shifts: SitterShift[];
  activeShiftId: string;
  onSelectShift: (offerId: string) => void;
  onSendMessage: (offerId: string, text: string) => void;
  onCheckIn: (offerId: string) => void;
  onCheckOut: (offerId: string) => void;
  onOpenSOS: (context: string) => void;
}

export const SitterChatAndShiftView: React.FC<SitterChatAndShiftViewProps> = ({
  shifts,
  activeShiftId,
  onSelectShift,
  onSendMessage,
  onCheckIn,
  onCheckOut,
  onOpenSOS,
}) => {
  const [inputText, setInputText] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(true);
  const [showTaskDrawer, setShowTaskDrawer] = useState(true);
  const [liveSec, setLiveSec] = useState(0);

  // Smart Shift Summary Generator State
  const [showSummaryGen, setShowSummaryGen] = useState(false);
  const [foodStatus, setFoodStatus] = useState('אכלו ארוחת ערב מלאה');
  const [sleepStatus, setSleepStatus] = useState('נרדמו בזמן ללא קושי');
  const [activityStatus, setActivityStatus] = useState('שיחקנו בפאזלים וקראנו סיפור לפני השינה');

  const activeShift =
    shifts.find((s) => s.offerId === activeShiftId) ?? shifts[0];

  useEffect(() => {
    if (!activeShift || activeShift.shiftStatus !== 'checked_in') return;
    const timer = window.setInterval(() => {
      setLiveSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeShift?.offerId, activeShift?.shiftStatus]);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(
      2,
      '0'
    )}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeShift) return;
    onSendMessage(activeShift.offerId, inputText.trim());
    setInputText('');
  };

  const handleGenerateAndSendSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    const summaryText = `היי ${activeShift.parentName.split(' ')[0]}! סיכום משמרת חם: הילדים ${foodStatus}, ${activityStatus}, ו${sleepStatus}. הבית מסודר והכל עבר בשקט ובבטחה 😊`;
    onSendMessage(activeShift.offerId, summaryText);
    setShowSummaryGen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Safety Bar with Prominent Red SOS Button */}
      <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-red-900">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">
            אל תמסרו מספר טלפון. השיחה והדיווח מתועדים דרך המערכת לבטיחותך.
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            onOpenSOS(
              activeShift
                ? `מצב בייביסיטר · משמרת אצל ${activeShift.parentName}`
                : 'מצב בייביסיטר'
            )
          }
          className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 text-white font-display font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Siren className="w-4 h-4 shrink-0" />
          <span>SOS חירום</span>
        </button>
      </div>

      {/* Main Split Container */}
      <div className="glass-card rounded-3xl border overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px] shadow-sm">
        {/* Shifts / Parent Chat List */}
        <aside
          className={`lg:col-span-4 border-b lg:border-b-0 lg:border-l border-slate-200 flex flex-col ${
            mobileShowThread ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="px-4 py-3.5 border-b border-slate-100">
            <h1 className="font-display font-bold text-base text-[#222222]">
              צ׳אט וניהול משמרות
            </h1>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {shifts.map((shift) => {
              const isSelected = shift.offerId === activeShift?.offerId;
              const lastMsg = shift.messages[shift.messages.length - 1];
              const statusText =
                shift.shiftStatus === 'checked_in'
                  ? 'בעבודה (Check-in פעיל)'
                  : shift.shiftStatus === 'checked_out'
                  ? 'המשמרת הסתיימה'
                  : 'משמרת מאושרת';

              return (
                <button
                  key={shift.offerId}
                  type="button"
                  onClick={() => {
                    onSelectShift(shift.offerId);
                    setMobileShowThread(true);
                  }}
                  className={`w-full text-right p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#1A73E8]/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#1A73E8]/10 text-[#1A73E8] font-display font-bold text-base flex items-center justify-center shrink-0">
                    {shift.parentName.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-sm text-[#222222] truncate">
                        {shift.parentName}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {lastMsg?.timestamp}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#34A853] mt-0.5">
                      {statusText}
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      {lastMsg?.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Shift & Chat Window */}
        {activeShift && (
          <section
            className={`lg:col-span-8 flex flex-col h-[600px] ${
              mobileShowThread ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileShowThread(false)}
                  className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
                  aria-label="חזרה לרשימת משמרות"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] font-display font-bold flex items-center justify-center shrink-0">
                  {activeShift.parentName.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-sm sm:text-base text-[#222222] truncate">
                    {activeShift.parentName}
                  </h2>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {activeShift.dateLabel} · {activeShift.startTime}–
                    {activeShift.endTime}
                  </p>
                </div>
              </div>

              {/* Check-in / Check-out Live Status Pill-free Indicator */}
              <div className="flex items-center gap-2 text-xs font-semibold tabular-nums shrink-0">
                {activeShift.shiftStatus === 'checked_in' && (
                  <span className="text-[#34A853] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimer(liveSec)}
                  </span>
                )}
                {activeShift.shiftStatus === 'checked_out' && (
                  <span className="text-[#1A73E8]">
                    הסתיימה ב-{activeShift.checkOutTimestamp}
                  </span>
                )}
              </div>
            </div>

            {/* Check-in / Check-out Controls Bar (B5) */}
            <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <div className="font-semibold">
                  {activeShift.shiftStatus === 'confirmed' &&
                    'הפעלת Check-in מתעדת תחילת עבודה לצורך חיוב הוגן'}
                  {activeShift.shiftStatus === 'checked_in' &&
                    `Check-in תועד ב-${activeShift.checkInTimestamp} · ${activeShift.checkInLocation}`}
                  {activeShift.shiftStatus === 'checked_out' &&
                    `Check-out תועד ב-${activeShift.checkOutTimestamp} · השכר הועבר לארנק`}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {activeShift.shiftStatus === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      setLiveSec(0);
                      onCheckIn(activeShift.offerId);
                    }}
                    className="min-h-[42px] px-4 rounded-xl bg-[#34A853] text-white text-xs sm:text-sm font-bold hover:bg-[#2B8E44] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>התחלת עבודה (Check-in)</span>
                  </button>
                )}

                {activeShift.shiftStatus === 'checked_in' && (
                  <button
                    type="button"
                    onClick={() => {
                      onCheckOut(activeShift.offerId);
                      setShowSummaryGen(true);
                    }}
                    className="min-h-[42px] px-4 rounded-xl bg-[#1A73E8] text-white text-xs sm:text-sm font-bold hover:bg-[#1557B0] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>סיום עבודה (Check-out)</span>
                  </button>
                )}

                {activeShift.shiftStatus === 'checked_out' && (
                  <button
                    type="button"
                    onClick={() => setShowSummaryGen((v) => !v)}
                    className="min-h-[42px] px-4 rounded-xl bg-white text-[#222222] text-xs sm:text-sm font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#1A73E8]" />
                    <span>מחולל סיכום משמרת חכם</span>
                  </button>
                )}
              </div>
            </div>

            {/* Task Details Drawer */}
            <div className="bg-[#FAFAFA] border-b border-slate-200 px-4 py-2.5">
              <button
                type="button"
                onClick={() => setShowTaskDrawer((v) => !v)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#222222] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
                  <span>פרטי משימה וכתובת</span>
                </span>
                {showTaskDrawer ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showTaskDrawer && (
                <div className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {activeShift.fullAddress ? (
                    <div>
                      <span className="font-semibold text-[#34A853]">
                        כתובת מלאה נחשפה (משמרת מאושרת):{' '}
                      </span>
                      <span className="text-[#222222] font-medium">
                        {activeShift.fullAddress}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        כתובת מלאה תיחשף רק לאחר אישור העבודה ({activeShift.city}{' '}
                        · {activeShift.neighborhood})
                      </span>
                    </div>
                  )}
                  <span className="font-semibold text-[#1A73E8] tabular-nums">
                    תשלום משוער: ₪{activeShift.estimatedNet}
                  </span>
                </div>
              )}
            </div>

            {/* Smart Shift Summary Generator Drawer */}
            {showSummaryGen && (
              <form
                onSubmit={handleGenerateAndSendSummary}
                className="bg-[#1A73E8]/5 border-b border-[#1A73E8]/20 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-[#1A73E8] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>מחולל סיכום משמרת חכם להורה</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSummaryGen(false)}
                    className="text-xs text-slate-500 hover:text-[#222222] cursor-pointer"
                  >
                    סגור
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      אוכל:
                    </label>
                    <select
                      value={foodStatus}
                      onChange={(e) => setFoodStatus(e.target.value)}
                      className="w-full min-h-[38px] px-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="אכלו ארוחת ערב מלאה">אכלו ארוחת ערב מלאה</option>
                      <option value="אכלו נשנוש ערב קל ושתו מים">אכלו נשנוש קל ושתו מים</option>
                      <option value="שתו בקבוק / חלב לפני השינה">שתו בקבוק לפני השינה</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      שינה:
                    </label>
                    <select
                      value={sleepStatus}
                      onChange={(e) => setSleepStatus(e.target.value)}
                      className="w-full min-h-[38px] px-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="נרדמו בזמן ללא קושי">נרדמו בזמן ללא קושי</option>
                      <option value="נרדמו מעט מאוחר אבל ישנים עמוק">נרדמו מאוחר וישנים עמוק</option>
                      <option value="עדיין ערניים ורגועים">עדיין ערניים ורגועים</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      פעילות:
                    </label>
                    <select
                      value={activityStatus}
                      onChange={(e) => setActivityStatus(e.target.value)}
                      className="w-full min-h-[38px] px-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="שיחקנו בפאזלים וקראנו סיפור לפני השינה">
                        פאזלים וסיפור לפני השינה
                      </option>
                      <option value="הכנו שיעורי בית ושיחקנו ביצירה">
                        שיעורי בית ויצירה
                      </option>
                      <option value="שיחקנו במשחקי דמיון רגועים">
                        משחקי דמיון רגועים
                      </option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="min-h-[40px] px-4 rounded-xl bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1557B0] transition-colors cursor-pointer"
                >
                  יצירה ושליחת הודעת סיכום להורה
                </button>
              </form>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]/60">
              {activeShift.messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      className="text-center text-xs text-slate-500 bg-slate-100 rounded-xl px-3 py-2 max-w-md mx-auto"
                    >
                      {msg.text}
                    </div>
                  );
                }

                const isSitter = msg.sender === 'sitter';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSitter ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isSitter
                          ? 'bg-[#1A73E8] text-white rounded-tr-sm'
                          : 'bg-white border border-slate-200 text-[#222222] rounded-tl-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-[10px] mt-1 tabular-nums ${
                          isSitter ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSubmitMessage}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`שלחי הודעה ל${activeShift.parentName}...`}
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#FAFAFA] border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-[#1A73E8] text-white font-semibold text-sm hover:bg-[#1557B0] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="שליחת הודעה"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};
