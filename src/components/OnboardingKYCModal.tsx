import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  Camera,
  Video,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  UserCheck,
  Users,
  PawPrint,
  HeartPulse,
  MapPin,
} from 'lucide-react';
import { AdminKycItem, ParentProfile } from '../types';

interface OnboardingKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (payload: {
    role: 'parent' | 'sitter';
    parentPatch?: Partial<ParentProfile>;
    newSitterKyc?: AdminKycItem;
  }) => void;
}

export const OnboardingKYCModal: React.FC<OnboardingKYCModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [chosenRole, setChosenRole] = useState<'parent' | 'sitter'>('parent');

  // Step 2: OTP
  const [phone, setPhone] = useState('052-8472910');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '1']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Step 3 Parent fields (A1)
  const [parentFirstName, setParentFirstName] = useState('דנה');
  const [parentEmail, setParentEmail] = useState('dana.avrahami@gmail.com');
  const [parentCity, setParentCity] = useState('רמת גן');
  const [parentNeighborhood, setParentNeighborhood] = useState('מרום נווה');
  const [childrenCount, setChildrenCount] = useState(2);
  const [childAgesText, setChildAgesText] = useState('בן 4, בת שנתיים');
  const [petsText, setPetsText] = useState('ללא חיות מחמד');
  const [locationOptIn, setLocationOptIn] = useState(true);
  const [notificationsOptIn, setNotificationsOptIn] = useState(true);

  // Step 3 Sitter fields (B1)
  const [sitterFullName, setSitterFullName] = useState('מיכל רוזן');
  const [sitterAge, setSitterAge] = useState(22);
  const [sitterCity, setSitterCity] = useState('תל אביב');
  const [idUploaded, setIdUploaded] = useState(true);
  const [selfieMatched, setSelfieMatched] = useState(true);
  const [socialPlatform, setSocialPlatform] = useState<
    'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn'
  >('Instagram');
  const [socialUrl, setSocialUrl] = useState('instagram.com/michal_rozen_tlv');
  const [videoLengthSec, setVideoLengthSec] = useState(38);
  const [videoUploaded, setVideoUploaded] = useState(true);
  const [cprCert, setCprCert] = useState(true);
  const [sitterError, setSitterError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setOtpError(null);
      setSitterError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = window.setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    setOtpError(null);
  };

  const handleStep2Next = () => {
    const code = otpDigits.join('');
    if (code.length < 4) {
      setOtpError('הקוד לא זוהה. נסו שוב או שלחו קוד חדש בעוד 30 שנ׳.');
      return;
    }
    setOtpError(null);
    setStep(3);
  };

  const handleStep3Next = () => {
    if (chosenRole === 'sitter') {
      if (!idUploaded || !selfieMatched) {
        setSitterError('יש להשלים העלאת ת.ז. ואימות Selfie Liveness.');
        return;
      }
      if (!socialUrl.trim()) {
        setSitterError('חובה לצרף קישור לפרופיל ברשת חברתית לאימות זהות.');
        return;
      }
      if (!videoUploaded || videoLengthSec < 30 || videoLengthSec > 45) {
        setSitterError('הווידאו קצר או ארוך מדי. נסו בין 30–45 שניות.');
        return;
      }
    }
    setSitterError(null);
    setStep(4);
  };

  const handleFinish = () => {
    if (chosenRole === 'parent') {
      onCompleteOnboarding({
        role: 'parent',
        parentPatch: {
          firstName: parentFirstName.trim() || 'דנה',
          city: parentCity.trim() || 'רמת גן',
          neighborhood: parentNeighborhood.trim() || 'מרום נווה',
          pets: petsText.trim() || 'ללא חיות מחמד',
          shareLocationDuringJob: locationOptIn,
          notificationsEnabled: notificationsOptIn,
        },
      });
    } else {
      onCompleteOnboarding({
        role: 'sitter',
        newSitterKyc: {
          id: `kyc-${Date.now()}`,
          fullName: sitterFullName.trim() || 'מיכל רוזן',
          age: Math.max(18, sitterAge),
          city: sitterCity.trim() || 'תל אביב',
          submittedAt: 'זה עתה (מהאשף)',
          idAndSelfieVerified: idUploaded && selfieMatched,
          socialPlatform,
          socialUrl: socialUrl.trim(),
          videoDurationSec: videoLengthSec,
          cprCertificate: cprCert,
          status: 'pending',
        },
      });
    }
    onClose();
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kyc-wizard-title"
    >
      <div className="w-full sm:max-w-xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Progress Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 space-y-3 shrink-0 bg-gradient-to-l from-[#F3F8FF] to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A73E8]">
              <ShieldCheck className="w-4 h-4 text-[#34A853]" />
              <span className="tabular-nums">שלב {step} מתוך 4 · הרשמה ואימות (KYC)</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
              aria-label="סגירת אשף אימות"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-[#34A853] to-[#1A73E8] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <div className="space-y-5 text-center sm:text-right">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#1A73E8]/15 to-[#34A853]/15 text-[#1A73E8] flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-9 h-9 text-[#34A853]" />
              </div>

              <div className="space-y-2">
                <h2
                  id="kyc-wizard-title"
                  className="font-display text-2xl font-bold text-[#222222]"
                >
                  ביטחון ושקט נפשי — מתחילים באימות קצר
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  האימות לוקח עד דקה ומגן על הקהילה כולה. כל הפרטים הרגישים מוצפנים, אינם מפורסמים בפרופיל הציבורי ונשמרים רק לשם שמירה על בטיחות הילדים וההורים.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-right">
                <div className="p-4 rounded-2xl bg-[#F3F8FF] border border-[#1A73E8]/15 flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#222222]">
                      אימות זהות אמיתי וגיל 18+
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      בדיקת מספר טלפון, תעודה מזהה, סלפי חי וקישור חובה לרשת חברתית לבייביסיטריות.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F2FBF5] border border-[#34A853]/20 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#34A853] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#222222]">
                      פרטיות ותשלום מוגן
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      כתובת מלאה נחשפת רק לאחר אישור, והתשלום מוקפא ומוגן עד סיום העבודה.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2
                  id="kyc-wizard-title"
                  className="font-display text-xl font-bold text-[#222222]"
                >
                  בחירת תפקיד ואימות טלפון (OTP)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  מספר הטלפון נשאר מוסתר בשיחות בתוך האפליקציה
                </p>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChosenRole('parent')}
                  className={`p-4 rounded-2xl border text-right space-y-1 transition-all cursor-pointer ${
                    chosenRole === 'parent'
                      ? 'border-[#1A73E8] bg-[#F3F8FF] shadow-sm'
                      : 'border-slate-200 bg-[#FAFAFA] hover:border-slate-300'
                  }`}
                >
                  <div className="font-display font-bold text-base text-[#222222]">
                    הורה (צד A)
                  </div>
                  <p className="text-xs text-slate-600">
                    חיפוש והזמנת בייביסיטריות מאומתות באזור הבית
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setChosenRole('sitter')}
                  className={`p-4 rounded-2xl border text-right space-y-1 transition-all cursor-pointer ${
                    chosenRole === 'sitter'
                      ? 'border-[#34A853] bg-[#F2FBF5] shadow-sm'
                      : 'border-slate-200 bg-[#FAFAFA] hover:border-slate-300'
                  }`}
                >
                  <div className="font-display font-bold text-base text-[#222222]">
                    בייביסיטר (צד B)
                  </div>
                  <p className="text-xs text-slate-600">
                    קבלת הצעות עבודה, ארנק דיגיטלי וצבירת דרגות
                  </p>
                </button>
              </div>

              {/* Phone + 4-digit OTP */}
              <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    מספר טלפון נייד
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      className="w-full min-h-[44px] px-3.5 pl-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-right tabular-nums"
                    />
                    <Smartphone className="w-4 h-4 text-[#1A73E8] absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      הזינו קוד אימות בן 4 ספרות (נשלח ב-SMS)
                    </span>
                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={() => setResendTimer(30)}
                      className="text-xs font-semibold text-[#1A73E8] hover:underline disabled:text-slate-400 cursor-pointer"
                    >
                      {resendTimer > 0
                        ? `שליחה חוזרת בעוד ${resendTimer} שנ׳`
                        : 'שלח קוד חדש'}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto" dir="ltr">
                    {otpDigits.map((d, idx) => (
                      <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="h-14 text-center font-display font-bold text-2xl rounded-2xl border border-slate-300 bg-white text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] tabular-nums"
                        aria-label={`ספרה ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-600 text-center mt-2 font-medium">
                      {otpError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && chosenRole === 'parent' && (
            <div className="space-y-4">
              <div>
                <h2
                  id="kyc-wizard-title"
                  className="font-display text-xl font-bold text-[#222222]"
                >
                  יצירת פרופיל משפחה וכתובת כללית
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  כתובת מלאה תיחשף לבייביסיטר רק אחרי אישור והקפאת תשלום
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    שם פרטי
                  </label>
                  <input
                    type="text"
                    value={parentFirstName}
                    onChange={(e) => setParentFirstName(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    אימייל (לחשבוניות ועדכונים)
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    עיר
                  </label>
                  <input
                    type="text"
                    value={parentCity}
                    onChange={(e) => setParentCity(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    שכונה בלבד
                  </label>
                  <input
                    type="text"
                    value={parentNeighborhood}
                    onChange={(e) => setParentNeighborhood(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    <Users className="w-3.5 h-3.5 inline ml-1 text-[#1A73E8]" />
                    מספר ילדים וגילאים
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-20 min-h-[44px] px-2 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                    <input
                      type="text"
                      value={childAgesText}
                      onChange={(e) => setChildAgesText(e.target.value)}
                      className="flex-1 min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    <PawPrint className="w-3.5 h-3.5 inline ml-1 text-[#34A853]" />
                    חיות מחמד / רגישויות
                  </label>
                  <input
                    type="text"
                    value={petsText}
                    onChange={(e) => setPetsText(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F3F8FF] border border-[#1A73E8]/20 space-y-2.5 text-xs">
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="flex items-center gap-2 text-[#222222] font-medium">
                    <MapPin className="w-4 h-4 text-[#1A73E8] shrink-0" />
                    <span>
                      שיתוף מיקום — &quot;משתמשים בזה רק כדי להתאים קרובות לבית&quot;
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={locationOptIn}
                    onChange={(e) => setLocationOptIn(e.target.checked)}
                    className="w-4 h-4 accent-[#1A73E8]"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="text-slate-700">
                    קבלת התראות על אישור הזמנה ו-Check-in
                  </span>
                  <input
                    type="checkbox"
                    checked={notificationsOptIn}
                    onChange={(e) => setNotificationsOptIn(e.target.checked)}
                    className="w-4 h-4 accent-[#1A73E8]"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 3 && chosenRole === 'sitter' && (
            <div className="space-y-4">
              <div>
                <h2
                  id="kyc-wizard-title"
                  className="font-display text-xl font-bold text-[#222222]"
                >
                  אימות בייביסיטר מתקדם (KYC 18+)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  בדיקה מהירה להגנה על ההורים וליצירת תג האמינות בפרופיל שלך
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    שם מלא (כפי שמופיע בת.ז.)
                  </label>
                  <input
                    type="text"
                    value={sitterFullName}
                    onChange={(e) => setSitterFullName(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    גיל (18+ חובה)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={45}
                    value={sitterAge}
                    onChange={(e) => setSitterAge(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
                  />
                </div>
              </div>

              {/* ID Upload + Selfie Liveness */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIdUploaded((v) => !v)}
                  className={`p-3.5 rounded-2xl border text-right flex items-center justify-between transition-colors cursor-pointer ${
                    idUploaded
                      ? 'bg-[#F2FBF5] border-[#34A853] text-[#222222]'
                      : 'bg-[#FAFAFA] border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="text-xs">
                    <div className="font-bold">תעודת זהות / דרכון</div>
                    <div className="text-slate-500 mt-0.5">
                      {idUploaded ? 'צילום ת.ז. הועלה ואומת' : 'לחצי להעלאה'}
                    </div>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      idUploaded ? 'text-[#34A853]' : 'text-slate-300'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setSelfieMatched((v) => !v)}
                  className={`p-3.5 rounded-2xl border text-right flex items-center justify-between transition-colors cursor-pointer ${
                    selfieMatched
                      ? 'bg-[#F2FBF5] border-[#34A853] text-[#222222]'
                      : 'bg-[#FAFAFA] border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="text-xs">
                    <div className="font-bold">סלפי חי (Selfie Liveness)</div>
                    <div className="text-slate-500 mt-0.5">
                      {selfieMatched ? 'התאמת פנים אושרה' : 'לחצי לצילום'}
                    </div>
                  </div>
                  <Camera
                    className={`w-5 h-5 ${
                      selfieMatched ? 'text-[#34A853]' : 'text-slate-300'
                    }`}
                  />
                </button>
              </div>

              {/* Mandatory Social Link with calming privacy explanation */}
              <div className="p-3.5 rounded-2xl bg-[#F3F8FF] border border-[#1A73E8]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#222222]">
                    קישור לרשת חברתית (חובה לאימות)
                  </span>
                  <span className="text-[11px] font-semibold text-[#1A73E8]">
                    מוצג באדמין בלבד
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={socialPlatform}
                    onChange={(e) =>
                      setSocialPlatform(
                        e.target.value as
                          | 'Instagram'
                          | 'Facebook'
                          | 'TikTok'
                          | 'LinkedIn'
                      )
                    }
                    className="min-h-[40px] px-2 rounded-xl border border-slate-200 bg-white text-xs"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                  <input
                    type="text"
                    dir="ltr"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="instagram.com/username"
                    className="col-span-2 min-h-[40px] px-3 rounded-xl border border-slate-200 bg-white text-xs text-right"
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  &quot;קישור לרשת חברתית עוזר לנו לוודא שזהותך אמיתית. לא נחשוף את הקישור לציבור — רק תג אימות יופיע בפרופיל.&quot;
                </p>
              </div>

              {/* Intro Video 30-45 sec + CPR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#222222]">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-[#1A73E8]" />
                      וידאו היכרות (30–45 שנ׳)
                    </span>
                    <span className="tabular-nums text-[#34A853]">
                      {videoLengthSec} שנ׳
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={20}
                      max={50}
                      value={videoLengthSec}
                      onChange={(e) => {
                        setVideoLengthSec(Number(e.target.value));
                        setVideoUploaded(true);
                      }}
                      className="flex-1 accent-[#1A73E8]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#222222]">
                    <span className="flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-[#34A853]" />
                      תעודת עזרה ראשונה
                    </span>
                    <input
                      type="checkbox"
                      checked={cprCert}
                      onChange={(e) => setCprCert(e.target.checked)}
                      className="w-4 h-4 accent-[#34A853]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={sitterCity}
                      onChange={(e) => setSitterCity(e.target.value)}
                      placeholder="עיר פעילות"
                      className="w-full min-h-[34px] px-2.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {sitterError && (
                <p className="text-xs text-red-600 font-semibold">{sitterError}</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="py-4 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#34A853]/15 text-[#34A853] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-11 h-11" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#34A853]">
                  <Sparkles className="w-4 h-4" />
                  <span>אימות הושלם בהצלחה</span>
                </div>
                <h2
                  id="kyc-wizard-title"
                  className="font-display text-2xl font-bold text-[#222222]"
                >
                  הפרופיל שלך מאומת ומוכן!
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {chosenRole === 'parent'
                    ? `שלום ${parentFirstName}, פרופיל המשפחה ב${parentCity} (${parentNeighborhood}) עודכן. כעת תוכלי לחפש בייביסיטריות מאומתות בראש שקט.`
                    : `כל הכבוד ${sitterFullName}! הפרטים, הסלפי, הווידאו (${videoLengthSec} שנ׳) והקישור החברתי הועברו לאישור בתור ה-KYC של האדמין וכעת תוכלי להתחיל לעבוד במצב בייביסיטר.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-5 py-4 border-t border-slate-100 bg-[#FAFAFA] flex items-center justify-between gap-3 shrink-0">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="min-h-[46px] px-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה</span>
            </button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto min-h-[48px] px-7 rounded-2xl bg-[#1A73E8] text-white font-display font-bold text-sm hover:bg-[#1557B0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>התחלה בטוחה</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleStep2Next}
              className="min-h-[48px] px-7 rounded-2xl bg-[#1A73E8] text-white font-display font-bold text-sm hover:bg-[#1557B0] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>אמת קוד והמשך</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleStep3Next}
              className="min-h-[48px] px-7 rounded-2xl bg-[#34A853] text-white font-display font-bold text-sm hover:bg-[#2B8E44] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>שמירה וסיום אימות</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full min-h-[48px] px-7 rounded-2xl bg-[#1A73E8] text-white font-display font-bold text-base hover:bg-[#1557B0] transition-colors cursor-pointer"
            >
              כניסה לאפליקציה
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
