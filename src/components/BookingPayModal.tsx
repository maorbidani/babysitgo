import React, { useMemo, useState } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { MINIMUM_WAGE_FLOOR, PLATFORM_SERVICE_FEE } from '../data/mockData';
import { Booking, ParentProfile, PaymentMethod, Sitter } from '../types';
import { AvatarWithFallback } from './AvatarWithFallback';

interface BookingPayModalProps {
  sitter: Sitter | null;
  parent: ParentProfile;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingPayModal: React.FC<BookingPayModalProps> = ({
  sitter,
  parent,
  onClose,
  onConfirmBooking,
}) => {
  const [date, setDate] = useState('2026-11-28');
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('23:30');
  const [includeEvening, setIncludeEvening] = useState(true);
  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [includeShortNotice, setIncludeShortNotice] = useState(false);
  const [tip, setTip] = useState<number>(15);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bit');
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);
  const [notes, setNotes] = useState(parent.requirements.join(', '));
  const [paymentDeclinedError, setPaymentDeclinedError] = useState(false);

  const hours = useMemo(() => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 4;
    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff <= 0) diff += 24 * 60;
    return Math.max(1, Math.round((diff / 60) * 2) / 2);
  }, [startTime, endTime]);

  if (!sitter) return null;

  const baseSubtotal = sitter.hourlyRate * hours;
  const eveningExtra = includeEvening ? Math.round(hours * 6) : 0;
  const weekendExtra = includeWeekend ? Math.round(hours * 10) : 0;
  const shortNoticeExtra = includeShortNotice ? 20 : 0;
  const totalEstimated =
    baseSubtotal +
    eveningExtra +
    weekendExtra +
    shortNoticeExtra +
    PLATFORM_SERVICE_FEE +
    tip;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentDeclinedError) {
      return;
    }
    const formattedDate = new Date(date).toLocaleDateString('he-IL', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    });
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      sitterId: sitter.id,
      date,
      dateLabel: formattedDate,
      startTime,
      endTime,
      hours,
      baseRate: sitter.hourlyRate,
      eveningExtra,
      weekendExtra,
      shortNoticeExtra,
      serviceFee: PLATFORM_SERVICE_FEE,
      tip,
      totalEstimated,
      paymentMethod,
      status: 'pending_checkin',
      generalAddress: `${parent.city} · ${parent.neighborhood}`,
      fullAddress: parent.fullAddress,
      notes,
      elapsedMinutes: 0,
      extensionRequested: false,
      reviewSubmitted: false,
    };
    onConfirmBooking(newBooking);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-pay-title"
    >
      <form
        onSubmit={handleConfirm}
        className="w-full sm:max-w-xl max-h-[92vh] bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#34A853]" />
            <h2 id="booking-pay-title" className="font-display font-bold text-lg text-[#222222]">
              סיכום הזמנה ותשלום מאובטח
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
            aria-label="סגירת מסך הזמנה"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Sitter Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AvatarWithFallback
                src={sitter.photo}
                alt={sitter.firstName}
                name={sitter.firstName}
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <div className="flex items-center gap-1.5 font-display font-bold text-base text-[#222222]">
                  <span>
                    {sitter.firstName} {sitter.lastInitial}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#34A853]" />
                </div>
                <p className="text-xs text-slate-500">
                  {parent.city} · {parent.neighborhood} (כתובת מלאה תיחשף מיד לאחר האישור)
                </p>
              </div>
            </div>
            <div className="text-left tabular-nums">
              <span className="font-display font-bold text-base text-[#1A73E8]">
                ₪{sitter.hourlyRate}
              </span>
              <span className="text-xs text-slate-500">/שעה</span>
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <h3 className="font-display font-bold text-sm text-[#222222]">
              מועד ושעות השמרטפות
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">תאריך</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">התחלה</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">סיום משוער</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">הנחיות לבייביסיטר</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="שעת השכבה, רגישויות או בקשות מיוחדות..."
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
              />
            </div>
          </div>

          {/* Transparent Pricing Calculator */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                מחשבון תמחור שקוף
              </h3>
              <span className="text-xs text-slate-500 tabular-nums">
                רצפת מינימום אזורית: ₪{MINIMUM_WAGE_FLOOR}/שעה
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#1A73E8] shrink-0 mt-0.5" />
              <span>
                הרצפה נקבעת לפי שכר המינימום. ניתן לבחור בייביסיטריות שמציעות תעריף גבוה יותר על סמך ניסיון.
              </span>
            </p>

            {/* Supplements Toggles */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIncludeEvening((v) => !v)}
                className={`min-h-[38px] px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  includeEvening
                    ? 'bg-[#1A73E8]/10 border-[#1A73E8] text-[#1A73E8]'
                    : 'bg-[#FAFAFA] border-slate-200 text-slate-600'
                }`}
              >
                תוספת ערב/לילה (+₪6/ש׳)
              </button>
              <button
                type="button"
                onClick={() => setIncludeWeekend((v) => !v)}
                className={`min-h-[38px] px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  includeWeekend
                    ? 'bg-[#1A73E8]/10 border-[#1A73E8] text-[#1A73E8]'
                    : 'bg-[#FAFAFA] border-slate-200 text-slate-600'
                }`}
              >
                תוספת סופ״ש (+₪10/ש׳)
              </button>
              <button
                type="button"
                onClick={() => setIncludeShortNotice((v) => !v)}
                className={`min-h-[38px] px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  includeShortNotice
                    ? 'bg-[#1A73E8]/10 border-[#1A73E8] text-[#1A73E8]'
                    : 'bg-[#FAFAFA] border-slate-200 text-slate-600'
                }`}
              >
                התראה קצרה (+₪20)
              </button>
            </div>

            {/* Optional Tip */}
            <div className="pt-2">
              <span className="block text-xs font-medium text-slate-600 mb-1.5">
                טיפ אופציונלי (100% עובר לבייביסיטר):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 15, 25, 40].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTip(amount)}
                    className={`min-h-[40px] rounded-xl text-xs font-semibold border tabular-nums transition-colors cursor-pointer ${
                      tip === amount
                        ? 'bg-[#34A853] border-[#34A853] text-white'
                        : 'bg-[#FAFAFA] border-slate-200 text-[#222222] hover:bg-slate-100'
                    }`}
                  >
                    {amount === 0 ? 'ללא' : `₪${amount}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown Lines */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>
                  תעריף בסיס (₪{sitter.hourlyRate} × {hours} שעות)
                </span>
                <span className="tabular-nums font-medium text-[#222222]">
                  ₪{baseSubtotal.toFixed(0)}
                </span>
              </div>
              {eveningExtra > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>תוספת ערב / לילה</span>
                  <span className="tabular-nums">₪{eveningExtra}</span>
                </div>
              )}
              {weekendExtra > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>תוספת סופ״ש</span>
                  <span className="tabular-nums">₪{weekendExtra}</span>
                </div>
              )}
              {shortNoticeExtra > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>תוספת התראה קצרה</span>
                  <span className="tabular-nums">₪{shortNoticeExtra}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>דמי שירות ואבטחת תשלום</span>
                <span className="tabular-nums">₪{PLATFORM_SERVICE_FEE}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between text-[#34A853]">
                  <span>טיפ לבייביסיטר</span>
                  <span className="tabular-nums">₪{tip}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-display font-bold text-base text-[#222222]">
                  סכום משוער להקפאה
                </span>
                <span className="font-display font-bold text-xl text-[#1A73E8] tabular-nums">
                  ₪{totalEstimated.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white/90 rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                אמצעי תשלום
              </h3>
              <button
                type="button"
                onClick={() => setPaymentDeclinedError((v) => !v)}
                className="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
              >
                {paymentDeclinedError ? 'בטל סימולציית שגיאה' : 'הדמיית תשלום נדחה'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'credit', label: 'אשראי', sub: '•••• 4580', icon: CreditCard },
                  { id: 'bit', label: 'Bit', sub: 'תשלום מיידי', icon: Smartphone },
                  { id: 'paybox', label: 'PayBox', sub: 'אישור מהיר', icon: Smartphone },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setPaymentDeclinedError(false);
                    }}
                    className={`min-h-[64px] p-2.5 rounded-2xl border text-right flex flex-col justify-between transition-colors cursor-pointer ${
                      active
                        ? 'border-[#1A73E8] bg-[#F0F6FF]'
                        : 'border-slate-200 bg-[#FFFDF9] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-[#1A73E8]' : 'text-slate-500'
                        }`}
                      />
                      {active && (
                        <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#222222]">
                        {m.label}
                      </div>
                      <div className="text-[11px] text-slate-500">{m.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentDeclinedError && (
              <div
                role="alert"
                className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start justify-between gap-3 text-xs text-red-900"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      ניסינו לחייב ולא הצלחנו. עדכנו פרטי תשלום או נסו Bit/PayBox.
                    </p>
                    <p className="text-red-700 mt-0.5">
                      בחרו באמצעי תשלום חלופי למעלה כדי להמשיך בהזמנה בבטחה.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('bit');
                    setPaymentDeclinedError(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-semibold shrink-0 hover:bg-red-700 cursor-pointer"
                >
                  עבור ל-Bit
                </button>
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-slate-600 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={savePaymentMethod}
                onChange={(e) => setSavePaymentMethod(e.target.checked)}
                className="w-4 h-4 accent-[#1A73E8] rounded"
              />
              <span>שמור אמצעי תשלום להזמנות הבאות</span>
            </label>
          </div>

          {/* Transparency & Cancellation Policy Microcopy */}
          <div className="rounded-2xl bg-[#FFF4EC]/75 border border-orange-100 p-3.5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <p className="font-medium text-[#222222]">
              גובים רק בסיום העבודה. הסכום כעת מוקפא לאבטחת ההזמנה.
            </p>
            <p>
              ביטול פחות מ־3 שעות לפני ההתחלה עשוי לחייב דמי ביטול חלקיים המועברים לבייביסיטר.
            </p>
          </div>
        </div>

        {/* Sticky Confirm CTA */}
        <div className="bg-white border-t border-slate-200 px-5 py-3.5 shrink-0">
          <button
            type="submit"
            disabled={paymentDeclinedError}
            className="w-full min-h-[50px] rounded-2xl bg-[#1A73E8] text-white font-display font-bold text-base hover:bg-[#1557B0] disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#1A73E8]/20 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>אישור והקפאת סכום (₪{totalEstimated.toFixed(0)})</span>
          </button>
        </div>
      </form>
    </div>
  );
};
