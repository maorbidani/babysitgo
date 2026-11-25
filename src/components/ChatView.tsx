import React, { useState } from 'react';
import {
  Send,
  Mic,
  Video,
  Siren,
  ShieldAlert,
  MapPin,
  Lock,
  ChevronRight,
  PhoneOff,
  Award,
  ChevronDown,
  ChevronUp,
  CalendarClock,
} from 'lucide-react';
import { Booking, ChatThread, ParentProfile, Sitter } from '../types';
import { AvatarWithFallback } from './AvatarWithFallback';

interface ChatViewProps {
  threads: ChatThread[];
  sitters: Sitter[];
  bookings: Booking[];
  parent: ParentProfile;
  activeSitterId: string;
  onSelectThread: (sitterId: string) => void;
  onSendMessage: (
    sitterId: string,
    text: string,
    type?: 'text' | 'voice' | 'video_invite',
    durationLabel?: string
  ) => void;
  onOpenSOS: (context: string) => void;
  onBookSitter: (sitter: Sitter) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  threads,
  sitters,
  bookings,
  parent,
  activeSitterId,
  onSelectThread,
  onSendMessage,
  onOpenSOS,
  onBookSitter,
}) => {
  const [inputText, setInputText] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(true);
  const [showTaskDrawer, setShowTaskDrawer] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoPoorSignal, setVideoPoorSignal] = useState(false);

  const activeThread =
    threads.find((t) => t.sitterId === activeSitterId) ?? threads[0];
  const activeSitter = sitters.find((s) => s.id === activeThread?.sitterId);

  const activeBookingForSitter = bookings.find(
    (b) =>
      b.sitterId === activeSitter?.id &&
      (b.status === 'pending_checkin' || b.status === 'in_progress')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSitter) return;
    onSendMessage(activeSitter.id, inputText.trim(), 'text');
    setInputText('');
  };

  const handleVoiceNote = () => {
    if (!activeSitter) return;
    onSendMessage(activeSitter.id, 'הודעה קולית (0:14)', 'voice', '0:14');
  };

  return (
    <div className="space-y-4">
      {/* Prominent Red SOS Safety Bar + Quick Video Intro Button at Top of Chat */}
      <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-red-900">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">
            אל תמסרו מספר טלפון. השיחה מתבצעת דרך המערכת להגנתכם.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeSitter && (
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#1A73E8] font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>וידאו קצר (עד 2 דק׳)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onOpenSOS(
                activeSitter
                  ? `מתוך צ׳אט עם ${activeSitter.firstName} ${activeSitter.lastInitial}`
                  : 'מתוך מסך הצ׳אט'
              )
            }
            className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 text-white font-display font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <Siren className="w-4 h-4 shrink-0" />
            <span>SOS חירום</span>
          </button>
        </div>
      </div>

      {/* Main Split Chat Container */}
      <div className="glass-card rounded-3xl border overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px] shadow-sm">
        {/* Threads List */}
        <aside
          className={`lg:col-span-4 border-b lg:border-b-0 lg:border-l border-slate-200 flex flex-col ${
            mobileShowThread ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="px-4 py-3.5 border-b border-slate-100">
            <h1 className="font-display font-bold text-base text-[#222222]">
              שיחות עם בייביסיטריות
            </h1>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {threads.map((thread) => {
              const sitter = sitters.find((s) => s.id === thread.sitterId);
              if (!sitter) return null;
              const isSelected = thread.sitterId === activeThread?.sitterId;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <button
                  key={thread.sitterId}
                  type="button"
                  onClick={() => {
                    onSelectThread(thread.sitterId);
                    setMobileShowThread(true);
                  }}
                  className={`w-full text-right p-4 flex items-center gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#1A73E8]/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <AvatarWithFallback
                    src={sitter.photo}
                    alt={sitter.firstName}
                    name={sitter.firstName}
                    className="w-12 h-12 rounded-2xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-display font-bold text-sm text-[#222222] truncate">
                          {sitter.firstName} {sitter.lastInitial}
                        </span>
                        <span className="text-[11px] font-medium text-[#1A73E8] inline-flex items-center gap-0.5 shrink-0">
                          <Award className="w-3 h-3" />
                          {sitter.rank}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {lastMsg?.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-slate-600 truncate">
                        {lastMsg?.text}
                      </p>
                      <span
                        className={`text-[11px] shrink-0 ${
                          thread.online ? 'text-[#34A853]' : 'text-slate-400'
                        }`}
                      >
                        {thread.online ? 'מקוונת' : 'לא מקוונת'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Conversation Window */}
        {activeThread && activeSitter && (
          <section
            className={`lg:col-span-8 flex flex-col h-[560px] ${
              mobileShowThread ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* Conversation Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileShowThread(false)}
                  className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
                  aria-label="חזרה לרשימת שיחות"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <AvatarWithFallback
                  src={activeSitter.photo}
                  alt={activeSitter.firstName}
                  name={activeSitter.firstName}
                  className="w-10 h-10 rounded-xl"
                />
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-sm sm:text-base text-[#222222] truncate">
                    {activeSitter.firstName} {activeSitter.lastInitial}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeThread.online ? 'מקוונת כעת' : 'לא מקוונת'} · דרגת{' '}
                    {activeSitter.rank}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="min-h-[40px] px-3 rounded-xl border border-slate-200 text-xs font-semibold text-[#222222] hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  title="שיחת היכרות קצרה (עד 2 דק׳)"
                >
                  <Video className="w-4 h-4 text-[#1A73E8]" />
                  <span>וידאו קצר (עד 2 דק׳)</span>
                </button>
                {!activeBookingForSitter && (
                  <button
                    type="button"
                    onClick={() => onBookSitter(activeSitter)}
                    className="min-h-[40px] px-3.5 rounded-xl bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1557B0] cursor-pointer"
                  >
                    הזמנה
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
                  <span>מגירת פרטי משימה</span>
                </span>
                {showTaskDrawer ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showTaskDrawer && (
                <div className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5">
                  {activeBookingForSitter ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[#34A853]">
                          סטטוס:{' '}
                          {activeBookingForSitter.status === 'in_progress'
                            ? 'בעבודה כעת'
                            : 'הזמנה מאושרת · סכום מוקפא'}{' '}
                        </span>
                        <span aria-hidden="true">·</span>{' '}
                        <span className="text-[#222222] font-medium">
                          {activeBookingForSitter.fullAddress}
                        </span>
                      </div>
                      <span className="tabular-nums text-slate-500 inline-flex items-center gap-1">
                        <CalendarClock className="w-3.5 h-3.5 text-[#1A73E8]" />
                        {activeBookingForSitter.dateLabel} ·{' '}
                        {activeBookingForSitter.startTime}–
                        {activeBookingForSitter.endTime}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                        <span>
                          <strong className="text-[#222222]">
                            סטטוס: טרום הזמנה
                          </strong>{' '}
                          · כתובת מלאה נחשפת רק לאחר אישור והקפאת תשלום
                        </span>
                      </div>
                      <span className="text-slate-500 whitespace-nowrap">
                        אזור: {parent.city} · {parent.neighborhood}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video Call Overlay inside Chat */}
            {videoModalOpen && (
              <div className="bg-slate-900 text-white px-4 py-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">
                      שיחת היכרות קצרה (עד 2 דק׳) עם {activeSitter.firstName}
                    </p>
                    <p className="text-xs text-slate-300">
                      מספרי הטלפון מוסתרים לשמירה על פרטיותכם
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoPoorSignal((v) => !v)}
                      className="min-h-[36px] px-2.5 rounded-xl bg-white/10 text-amber-300 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                    >
                      {videoPoorSignal ? 'חזור לחיבור תקין' : 'הדמיית בעיית קליטה'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoModalOpen(false);
                        setVideoPoorSignal(false);
                      }}
                      className="min-h-[38px] px-3 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>סיום</span>
                    </button>
                  </div>
                </div>
                {videoPoorSignal && (
                  <div
                    role="alert"
                    className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-100"
                  >
                    <span>
                      אין קליטה בוידאו: בדקו רשת או נסו מעבר לשיחה טקסטואלית.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoModalOpen(false);
                        setVideoPoorSignal(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-900 font-bold cursor-pointer"
                    >
                      חזור לצ׳אט טקסטואלי
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Message Bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFDF9]/50">
              {activeThread.messages.map((msg) => {
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

                const isParent = msg.sender === 'parent';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isParent ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isParent
                          ? 'bg-[#1A73E8] text-white rounded-tr-sm'
                          : 'bg-white border border-slate-200 text-[#222222] rounded-tl-sm'
                      }`}
                    >
                      {msg.type === 'voice' ? (
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4 shrink-0" />
                          <span>{msg.text}</span>
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                      <span
                        className={`block text-[10px] mt-1 tabular-nums ${
                          isParent ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceNote}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="שליחת הודעה קולית"
                aria-label="שליחת הודעה קולית"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`כתבי הודעה ל${activeSitter.firstName}...`}
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#FAFAFA] border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-[#1A73E8] text-white font-semibold text-sm hover:bg-[#1557B0] disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                aria-label="שליחה"
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
