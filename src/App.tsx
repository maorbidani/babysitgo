import React, { useEffect, useState } from 'react';
import {
  Home,
  Search,
  MessageSquare,
  CalendarCheck,
  User,
  Plus,
  CheckCircle2,
  X,
  Briefcase,
  Wallet,
  Award,
  Radio,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import {
  INITIAL_BOOKINGS,
  INITIAL_CHAT_THREADS,
  INITIAL_PARENT_PROFILE,
  MOCK_SITTERS,
} from './data/mockData';
import {
  INITIAL_JOB_OFFERS,
  INITIAL_SITTER_PROFILE_SETTINGS,
  INITIAL_SITTER_QUESTS,
  INITIAL_SITTER_REWARDS,
  INITIAL_SITTER_SHIFTS,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_WEEKLY_AVAILABILITY,
  SITTER_PERSONA,
} from './data/sitterMockData';
import {
  INITIAL_ADMIN_KYC_QUEUE,
  INITIAL_ADMIN_SAFETY_ALERTS,
} from './data/adminMockData';
import {
  AdminKycItem,
  AdminSafetyAlert,
  AppLanguage,
  AppRole,
  Booking,
  ChatThread,
  JobOffer,
  ParentProfile,
  ParentRequest,
  Sitter,
  SitterProfileSettings,
  SitterQuest,
  SitterReward,
  SitterShift,
  SitterTabId,
  TabId,
  WalletTransaction,
} from './types';
import { UI_COPY } from './i18n/translations';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { ChatView } from './components/ChatView';
import { BookingsAndLiveView } from './components/BookingsAndLiveView';
import { ProfileView } from './components/ProfileView';
import { SitterProfileModal } from './components/SitterProfileModal';
import { BookingPayModal } from './components/BookingPayModal';
import { PostRequestModal } from './components/PostRequestModal';
import { SOSModal } from './components/SOSModal';
import { OnboardingKYCModal } from './components/OnboardingKYCModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SplashScreen } from './components/SplashScreen';
import { OfflineIndicator } from './components/PWAInstallButton';
import { SitterHomeView } from './components/sitter/SitterHomeView';
import { SitterJobsView } from './components/sitter/SitterJobsView';
import { SitterChatAndShiftView } from './components/sitter/SitterChatAndShiftView';
import { SitterWalletView } from './components/sitter/SitterWalletView';
import { SitterRanksView } from './components/sitter/SitterRanksView';

const PARENT_NAV_ITEMS: {
  id: TabId;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'home', icon: Home },
  { id: 'search', icon: Search },
  { id: 'chat', icon: MessageSquare },
  { id: 'bookings', icon: CalendarCheck },
  { id: 'profile', icon: User },
];

const SITTER_NAV_ITEMS: {
  id: SitterTabId;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'sitter_home', icon: Home },
  { id: 'sitter_jobs', icon: Briefcase },
  { id: 'sitter_chat', icon: MessageSquare },
  { id: 'sitter_wallet', icon: Wallet },
  { id: 'sitter_ranks', icon: Award },
];

export default function App() {
  // Splash Screen (7 seconds) & Language / RTL-LTR Switcher
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<AppLanguage>('he');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = UI_COPY[lang];

  // Active Role: Parent (A) | Sitter (B) | Admin (F)
  const [role, setRole] = useState<AppRole>('parent');

  // Parent Mode (A) State
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [parentProfile, setParentProfile] = useState<ParentProfile>(
    INITIAL_PARENT_PROFILE
  );
  const [sitters] = useState<Sitter[]>(MOCK_SITTERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [activeChatSitterId, setActiveChatSitterId] = useState<string>(
    INITIAL_CHAT_THREADS[0].sitterId
  );
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    INITIAL_BOOKINGS[0]?.id ?? null
  );
  const [profileModalSitter, setProfileModalSitter] = useState<Sitter | null>(null);
  const [bookingModalSitter, setBookingModalSitter] = useState<Sitter | null>(null);
  const [postRequestOpen, setPostRequestOpen] = useState(false);

  // Sitter Mode (B) + Gamification (C) State
  const [sitterTab, setSitterTab] = useState<SitterTabId>('sitter_home');
  const [sitterAvailableNow, setSitterAvailableNow] = useState(true);
  const [sitterSettings, setSitterSettings] = useState<SitterProfileSettings>(
    INITIAL_SITTER_PROFILE_SETTINGS
  );
  const [weeklyAvailability, setWeeklyAvailability] = useState<
    Record<string, string[]>
  >(INITIAL_WEEKLY_AVAILABILITY);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(INITIAL_JOB_OFFERS);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [sitterShifts, setSitterShifts] = useState<SitterShift[]>(
    INITIAL_SITTER_SHIFTS
  );
  const [activeShiftId, setActiveShiftId] = useState<string>(
    INITIAL_SITTER_SHIFTS[0].offerId
  );
  const [walletTransactions, setWalletTransactions] = useState<
    WalletTransaction[]
  >(INITIAL_WALLET_TRANSACTIONS);
  const [quests, setQuests] = useState<SitterQuest[]>(INITIAL_SITTER_QUESTS);
  const [rewards, setRewards] = useState<SitterReward[]>(INITIAL_SITTER_REWARDS);
  const [sitterPoints, setSitterPoints] = useState<number>(SITTER_PERSONA.points);

  // Admin Mode (F) & Onboarding KYC Wizard (A1 + B1) State
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [adminKycQueue, setAdminKycQueue] = useState<AdminKycItem[]>(
    INITIAL_ADMIN_KYC_QUEUE
  );
  const [adminSafetyAlerts, setAdminSafetyAlerts] = useState<AdminSafetyAlert[]>(
    INITIAL_ADMIN_SAFETY_ALERTS
  );

  // Shared SOS Modal & Toast
  const [sosContext, setSosContext] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4200);
  };

  // --- Onboarding KYC Completion ---
  const handleCompleteOnboarding = (payload: {
    role: 'parent' | 'sitter';
    parentPatch?: Partial<ParentProfile>;
    newSitterKyc?: AdminKycItem;
  }) => {
    if (payload.role === 'parent') {
      if (payload.parentPatch) {
        setParentProfile((prev) => ({ ...prev, ...payload.parentPatch }));
      }
      setRole('parent');
      setActiveTab('home');
      showToast('ברוכים הבאים! פרופיל ההורה אומת ומוכן לחיפוש בטוח.');
    } else {
      if (payload.newSitterKyc) {
        setAdminKycQueue((prev) => [payload.newSitterKyc!, ...prev]);
      }
      setRole('sitter');
      setSitterTab('sitter_home');
      showToast('אימות ה-KYC הושלם! המועמדות נקלטה בתור האדמין והפרופיל פעיל.');
    }
  };

  // --- Parent Mode Handlers ---
  const ensureThreadForSitter = (sitterId: string) => {
    setChatThreads((prev) => {
      if (prev.some((t) => t.sitterId === sitterId)) return prev;
      return [
        {
          sitterId,
          online: true,
          unreadCount: 0,
          messages: [
            {
              id: `sys-${Date.now()}`,
              sender: 'system',
              text: 'שיחה מאובטחת נפתחה. אל תמסרו מספר טלפון — השיחה מתבצעת דרך המערכת.',
              timestamp: 'כעת',
            },
          ],
        },
        ...prev,
      ];
    });
  };

  const handleOpenChatWithSitter = (sitterId: string) => {
    ensureThreadForSitter(sitterId);
    setActiveChatSitterId(sitterId);
    setProfileModalSitter(null);
    setActiveTab('chat');
  };

  const handleSendMessage = (
    sitterId: string,
    text: string,
    type: 'text' | 'voice' | 'video_invite' = 'text',
    durationLabel?: string
  ) => {
    const nowLabel = new Date().toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setChatThreads((prev) =>
      prev.map((t) =>
        t.sitterId === sitterId
          ? {
              ...t,
              unreadCount: 0,
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: 'parent',
                  text,
                  timestamp: nowLabel,
                  type,
                  durationLabel,
                },
              ],
            }
          : t
      )
    );
  };

  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedBookingId(newBooking.id);
    ensureThreadForSitter(newBooking.sitterId);
    setChatThreads((prev) =>
      prev.map((t) =>
        t.sitterId === newBooking.sitterId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `sys-book-${Date.now()}`,
                  sender: 'system',
                  text: `הזמנה אושרה ל-${newBooking.dateLabel} (${newBooking.startTime}–${newBooking.endTime}). סכום של ₪${newBooking.totalEstimated.toFixed(0)} הוקפא בבטחה והכתובת המלאה נחשפה במגירת המשימה.`,
                  timestamp: 'כעת',
                },
              ],
            }
          : t
      )
    );
    setBookingModalSitter(null);
    setProfileModalSitter(null);
    setActiveTab('bookings');
    showToast('ההזמנה אושרה! הסכום הוקפא לאבטחת ההזמנה והכתובת המלאה נחשפה.');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
    );
    showToast('ההזמנה בוטלה והסכום שהוקפא שוחרר בהתאם למדיניות הביטול.');
  };

  const handleCheckIn = (bookingId: string) => {
    const nowLabel = new Date().toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'in_progress', checkInAt: nowLabel, elapsedMinutes: 0 }
          : b
      )
    );
    showToast('העבודה התחילה. מאחלים ערב נעים!');
  };

  const handleRequestExtension = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              extensionRequested: true,
              hours: b.hours + 0.5,
              totalEstimated: b.totalEstimated + Math.round(b.baseRate * 0.5),
            }
          : b
      )
    );
    showToast('להאריך ב־30 דק׳? הבייביסיטר תאשר ותעודכן העלות.');
  };

  const handleFinishJob = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'completed' } : b
      )
    );
    showToast('העבודה הסתיימה והתשלום הסופי אושר. ניתן להשאיר ביקורת כעת.');
  };

  const handleSubmitReview = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, reviewSubmitted: true } : b
      )
    );
    showToast(
      'הביקורת נשלחה ותפורסם רק לאחר שגם הבייביסיטרית תדרג (או תוך 72 שעות).'
    );
  };

  const handleCreateRequest = (req: ParentRequest) => {
    setRequests((prev) => [req, ...prev]);

    const [sh, sm] = req.startTime.split(':').map(Number);
    const [eh, em] = req.endTime.split(':').map(Number);
    let diffMin = eh * 60 + em - (sh * 60 + sm);
    if (diffMin <= 0) diffMin += 24 * 60;
    const calcHours = Math.max(1, Math.round((diffMin / 60) * 2) / 2);
    const basePay = Math.round(req.maxRate * calcHours);
    const extrasPay = Math.round(calcHours * 6);

    const newOffer: JobOffer = {
      id: `offer-${req.id}`,
      parentName: `${parentProfile.firstName} ${parentProfile.lastName.slice(0, 1)}.`,
      city: parentProfile.city,
      neighborhood: parentProfile.neighborhood,
      fullAddress: parentProfile.fullAddress,
      distanceKm: 0.8,
      dateLabel: `${req.date} · ${req.startTime}–${req.endTime}`,
      startTime: req.startTime,
      endTime: req.endTime,
      hours: calcHours,
      childrenCount: req.childrenCount,
      childAges: req.childAges,
      hasPets: req.hasPets,
      skillsRequired: req.skills,
      familyNotes: req.notes || 'בקשה חדשה מההורה באזורך.',
      basePay,
      extrasPay,
      estimatedTotal: basePay + extrasPay,
      slaRemainingSec: 600,
      status: 'pending',
      mapCoords: { x: 62, y: 48 },
    };
    setJobOffers((prev) => [newOffer, ...prev]);

    setActiveTab('bookings');
    showToast('הבקשה פורסמה! בייביסיטריות באזורך מקבלות התראה');
  };

  // --- Sitter Mode Handlers ---
  const handleToggleSitterAvailable = () => {
    setSitterAvailableNow((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'זמינות מיידית הופעלה! הורים בסביבתך יכולים להזמין אותך כעת.'
          : 'זמינות מיידית כובתה.'
      );
      return next;
    });
  };

  const handleToggleWeeklySlot = (day: string, slot: string) => {
    setWeeklyAvailability((prev) => {
      const daySlots = prev[day] ?? [];
      const nextSlots = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];
      return { ...prev, [day]: nextSlots };
    });
  };

  const ensureShiftForOffer = (offer: JobOffer, isAccepted: boolean) => {
    setSitterShifts((prev) => {
      const existing = prev.find((s) => s.offerId === offer.id);
      if (existing) {
        if (isAccepted && !existing.fullAddress) {
          return prev.map((s) =>
            s.offerId === offer.id
              ? { ...s, fullAddress: offer.fullAddress }
              : s
          );
        }
        return prev;
      }
      const newShift: SitterShift = {
        offerId: offer.id,
        parentName: offer.parentName,
        city: offer.city,
        neighborhood: offer.neighborhood,
        fullAddress: isAccepted ? offer.fullAddress : '',
        dateLabel: offer.dateLabel,
        startTime: offer.startTime,
        endTime: offer.endTime,
        hours: offer.hours,
        basePay: offer.basePay,
        extrasPay: offer.extrasPay,
        estimatedNet: Math.round(offer.estimatedTotal * 0.88),
        shiftStatus: 'confirmed',
        online: true,
        messages: [
          {
            id: `sys-shift-${Date.now()}`,
            sender: 'system',
            text: isAccepted
              ? 'העבודה אושרה! הכתובת המלאה נחשפה כעת במגירת פרטי המשימה.'
              : 'שיחת היכרות פתוחה. כתובת מלאה תיחשף רק לאחר אישור העבודה.',
            timestamp: 'כעת',
          },
        ],
      };
      return [newShift, ...prev];
    });
  };

  const handleAcceptJobOffer = (offer: JobOffer) => {
    setJobOffers((prev) =>
      prev.map((o) => (o.id === offer.id ? { ...o, status: 'accepted' } : o))
    );
    ensureShiftForOffer(offer, true);
    setActiveShiftId(offer.id);
    setSitterTab('sitter_chat');
    showToast('העבודה אושרה! הכתובת המלאה זמינה כעת בצ׳אט ובמסך המשמרת.');
  };

  const handleDeclineJobOffer = (offerId: string) => {
    setJobOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'declined' } : o))
    );
    showToast('ההצעה נדחתה.');
  };

  const handleSitterOpenChatFromOffer = (offer: JobOffer) => {
    ensureShiftForOffer(offer, offer.status === 'accepted');
    setActiveShiftId(offer.id);
    setSitterTab('sitter_chat');
  };

  const handleSitterSendMessage = (offerId: string, text: string) => {
    const nowLabel = new Date().toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setSitterShifts((prev) =>
      prev.map((s) =>
        s.offerId === offerId
          ? {
              ...s,
              messages: [
                ...s.messages,
                {
                  id: `sm-${Date.now()}`,
                  sender: 'sitter',
                  text,
                  timestamp: nowLabel,
                },
              ],
            }
          : s
      )
    );
  };

  const handleSitterCheckIn = (offerId: string) => {
    const nowLabel = new Date().toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setSitterShifts((prev) =>
      prev.map((s) =>
        s.offerId === offerId
          ? {
              ...s,
              shiftStatus: 'checked_in',
              checkInTimestamp: nowLabel,
              checkInLocation: `${s.city} · אימות GPS`,
              messages: [
                ...s.messages,
                {
                  id: `ci-${Date.now()}`,
                  sender: 'system',
                  text: `Check-in בוצע בהצלחה ב-${nowLabel} (${s.city}). טיימר המשמרת פעיל.`,
                  timestamp: nowLabel,
                },
              ],
            }
          : s
      )
    );
    showToast('הפעלת Check-in מתעדת תחילת עבודה לצורך חיוב הוגן.');
  };

  const handleSitterCheckOut = (offerId: string) => {
    const nowLabel = new Date().toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const shift = sitterShifts.find((s) => s.offerId === offerId);
    if (!shift) return;

    const gross = shift.basePay + shift.extrasPay;
    const fee = Math.round(gross * (SITTER_PERSONA.commissionRate / 100));
    const net = gross - fee;

    setSitterShifts((prev) =>
      prev.map((s) =>
        s.offerId === offerId
          ? {
              ...s,
              shiftStatus: 'checked_out',
              checkOutTimestamp: nowLabel,
              messages: [
                ...s.messages,
                {
                  id: `co-${Date.now()}`,
                  sender: 'system',
                  text: `Check-out בוצע ב-${nowLabel}. סכום של ₪${net} נטו הועבר לארנק שלך!`,
                  timestamp: nowLabel,
                },
              ],
            }
          : s
      )
    );

    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        dateLabel: `היום · ${nowLabel}`,
        parentName: shift.parentName,
        hours: shift.hours,
        baseAmount: shift.basePay,
        extrasAmount: shift.extrasPay,
        tipAmount: 0,
        platformFee: fee,
        netAmount: net,
        status: 'paid_to_wallet',
      },
      ...prev,
    ]);

    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'q1' || q.id === 'q2'
          ? {
              ...q,
              current: Math.min(q.target, q.current + 1),
              completed: q.current + 1 >= q.target,
            }
          : q
      )
    );
    setSitterPoints((p) => p + 40);
    showToast(`משמרת הסתיימה! ₪${net} נוספו לארנק שלך (+40 נק׳ קהילה).`);
  };

  const handleWithdrawWallet = () => {
    setWalletTransactions((prev) =>
      prev.map((t) =>
        t.status === 'paid_to_wallet' ? { ...t, status: 'withdrawn' } : t
      )
    );
    showToast('הבקשה למשיכה לבנק (T+0/1) אושרה! הכסף בדרך לחשבונך.');
  };

  const handleRedeemReward = (rewardId: string) => {
    const target = rewards.find((r) => r.id === rewardId);
    if (!target || target.redeemed || sitterPoints < target.pointsCost) return;

    setSitterPoints((p) => p - target.pointsCost);
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, redeemed: true } : r))
    );
    showToast(`הפרס "${target.title}" מומש! הקוד: ${target.code}`);
  };

  // --- Admin Mode Handlers ---
  const handleApproveKyc = (id: string) => {
    setAdminKycQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
    showToast('אימות KYC אושר! המועמדת פעילה כעת במערכת.');
  };

  const handleRejectKyc = (id: string) => {
    setAdminKycQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
    showToast('אימות KYC נדחה ונשלחה הודעה להשלמת מסמכים.');
  };

  const handleUpdateAlertStatus = (
    id: string,
    status: 'open' | 'in_review' | 'resolved'
  ) => {
    setAdminSafetyAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(
      status === 'resolved'
        ? 'אירוע הבטיחות סומן כטופל ונסגר.'
        : 'האירוע עבר לטיפול נציג Trust & Safety.'
    );
  };

  const handleTriggerSOS = (context: string) => {
    setSosContext(context);
    setAdminSafetyAlerts((prev) => [
      {
        id: `sos-${Date.now()}`,
        severity: 'high',
        type: 'התרעת SOS חירום חיה',
        partyLabel: context,
        location: `${parentProfile.city} · ${parentProfile.neighborhood}`,
        timestamp: 'זה עתה',
        slaLabel: 'SLA: מיידי (5 דק׳)',
        status: 'open',
        details: 'נלחץ כפתור חירום SOS מתוך ממשק ההורה/בייביסיטר. יש ליצור קשר מיידי.',
      },
      ...prev,
    ]);
  };

  const totalUnreadChats = chatThreads.reduce((sum, t) => sum + t.unreadCount, 0);
  const pendingOffersCount = jobOffers.filter((o) => o.status === 'pending').length;
  const activeJobsCount = bookings.filter((b) => b.status === 'in_progress').length;

  return (
    <div
      className="min-h-screen text-[#222222] flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(155deg, #FFFDF9 0%, #FFF4EC 48%, #F0F6FF 100%)',
      }}
    >
      {/* Subtle Warm Background Artwork Layer (Soft opacity so text contrast stays crisp) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <img
          src="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
          alt=""
          className="w-full h-full object-cover opacity-[0.06] scale-105 blur-[1px]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 20%, rgba(255,244,236,0.72) 0%, rgba(255,253,249,0.78) 55%, rgba(240,246,255,0.82) 100%)',
          }}
        />
      </div>

      {/* 7-Second Animated Splash Screen */}
      {showSplash && (
        <SplashScreen lang={lang} onFinish={() => setShowSplash(false)} />
      )}

      {/* Top Header with BabysitGo Brand, Nav, Role Switcher, Language & Onboarding KYC Demo */}
      <header className="lg:sticky lg:top-0 z-30 bg-[#FFFDF9]/85 backdrop-blur-md border-b border-white/80 shadow-[0_2px_16px_rgba(34,34,34,0.03)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 lg:py-0 lg:h-16 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 lg:gap-4">
          {/* Top Row on Mobile / Left Zone on Desktop */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  role === 'parent'
                    ? setActiveTab('home')
                    : role === 'sitter'
                    ? setSitterTab('sitter_home')
                    : setRole('admin')
                }
                className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-[#1A73E8] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <img
                  src="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
                  alt="BabysitGo"
                  className="w-8 h-8 rounded-xl object-cover shadow-xs border border-white"
                />
                <span>{t.brand}</span>
              </button>

              {/* Desktop Navigation Links */}
              {role === 'parent' && (
                <nav
                  aria-label="ניווט ראשי הורה"
                  className="hidden lg:flex items-center gap-4"
                >
                  {PARENT_NAV_ITEMS.map((item) => {
                    const active = activeTab === item.id;
                    const label = t.navParent[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'text-[#1A73E8] font-semibold'
                            : 'text-slate-600 hover:text-[#222222]'
                        }`}
                      >
                        <span>{label}</span>
                        {item.id === 'chat' && totalUnreadChats > 0 && (
                          <span className="text-[11px] font-bold text-[#1A73E8] tabular-nums">
                            ({totalUnreadChats})
                          </span>
                        )}
                        {active && (
                          <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1A73E8] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}

              {role === 'sitter' && (
                <nav
                  aria-label="ניווט ראשי בייביסיטר"
                  className="hidden lg:flex items-center gap-4"
                >
                  {SITTER_NAV_ITEMS.map((item) => {
                    const active = sitterTab === item.id;
                    const label = t.navSitter[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSitterTab(item.id)}
                        className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'text-[#34A853] font-semibold'
                            : 'text-slate-600 hover:text-[#222222]'
                        }`}
                      >
                        <span>{label}</span>
                        {item.id === 'sitter_jobs' && pendingOffersCount > 0 && (
                          <span className="text-[11px] font-bold text-[#34A853] tabular-nums">
                            ({pendingOffersCount})
                          </span>
                        )}
                        {active && (
                          <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#34A853] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}

              {role === 'admin' && (
                <span className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-[#222222] whitespace-nowrap">
                  <ShieldCheck className="w-4 h-4 text-[#1A73E8]" />
                  <span>{t.adminCenter}</span>
                </span>
              )}
            </div>

            {/* Mobile KYC & Quick Language Button */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLang((l) => (l === 'he' ? 'en' : 'he'))}
                className="min-h-[36px] px-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs font-semibold text-[#222222] flex items-center gap-1 cursor-pointer"
                aria-label={t.languageLabel}
              >
                <Globe className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>{lang === 'he' ? 'EN' : 'עב'}</span>
              </button>
              <button
                type="button"
                onClick={() => setKycModalOpen(true)}
                className="min-h-[36px] px-2.5 rounded-xl bg-[#F0F6FF] border border-[#1A73E8]/25 text-[#1A73E8] text-xs font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>KYC</span>
              </button>
            </div>
          </div>

          {/* Role Switcher + Desktop KYC, Language & Action */}
          <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setLang((l) => (l === 'he' ? 'en' : 'he'))}
              className="hidden lg:inline-flex min-h-[38px] px-2.5 rounded-xl bg-white/85 border border-slate-200/80 text-[#222222] text-xs font-semibold hover:bg-white transition-colors items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={t.languageLabel}
            >
              <Globe className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>{lang === 'he' ? 'EN' : 'עב'}</span>
            </button>

            <button
              type="button"
              onClick={() => setKycModalOpen(true)}
              className="hidden lg:inline-flex min-h-[38px] px-3 rounded-xl bg-[#F0F6FF] border border-[#1A73E8]/25 text-[#1A73E8] text-xs font-semibold hover:bg-[#1A73E8]/10 transition-colors items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.kycDemoBtn}</span>
            </button>

            {/* 3-Way Role Switcher */}
            <div
              className="w-full lg:w-auto grid grid-cols-3 lg:inline-flex items-center p-1 bg-white/80 rounded-xl border border-slate-200/70"
              role="group"
              aria-label="מתג החלפת תפקידים"
            >
              <button
                type="button"
                onClick={() => {
                  setRole('parent');
                  showToast('עברת למצב הורה (צד A)');
                }}
                className={`min-h-[34px] px-2.5 sm:px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  role === 'parent'
                    ? 'bg-[#1A73E8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                {t.roleParent}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('sitter');
                  showToast('עברת למצב בייביסיטר (צד B)');
                }}
                className={`min-h-[34px] px-2.5 sm:px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  role === 'sitter'
                    ? 'bg-[#34A853] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                {t.roleSitter}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  showToast('עברת למצב אדמין (ניהול מערכת)');
                }}
                className={`min-h-[34px] px-2.5 sm:px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  role === 'admin'
                    ? 'bg-[#222222] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                {t.roleAdmin}
              </button>
            </div>

            {role === 'parent' && (
              <button
                type="button"
                onClick={() => setPostRequestOpen(true)}
                className="hidden lg:inline-flex min-h-[38px] px-3.5 py-2 rounded-xl bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1557B0] transition-colors items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.postRequest}</span>
              </button>
            )}

            {role === 'sitter' && (
              <button
                type="button"
                onClick={handleToggleSitterAvailable}
                className={`hidden lg:inline-flex min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  sitterAvailableNow
                    ? 'bg-[#34A853] text-white hover:bg-[#2B8E44]'
                    : 'bg-slate-200 text-[#222222] hover:bg-slate-300'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>
                  {sitterAvailableNow ? t.availableNow : t.enableAvailability}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 ${
          role === 'admin' ? 'pb-12' : 'pb-28 lg:pb-12'
        }`}
      >
        {role === 'parent' && (
          <>
            {activeTab === 'home' && (
              <HomeView
                parent={parentProfile}
                sitters={sitters}
                bookings={bookings}
                requests={requests}
                onGoToSearch={() => setActiveTab('search')}
                onSelectSitter={(s) => setProfileModalSitter(s)}
                onOpenBookingLive={(booking) => {
                  setSelectedBookingId(booking.id);
                  setActiveTab('bookings');
                }}
                onCancelBooking={handleCancelBooking}
                onOpenPostRequest={() => setPostRequestOpen(true)}
              />
            )}

            {activeTab === 'search' && (
              <SearchView
                sitters={sitters}
                onSelectSitter={(s) => setProfileModalSitter(s)}
                onBookSitter={(s) => setBookingModalSitter(s)}
                onNotify={showToast}
              />
            )}

            {activeTab === 'chat' && (
              <ChatView
                threads={chatThreads}
                sitters={sitters}
                bookings={bookings}
                parent={parentProfile}
                activeSitterId={activeChatSitterId}
                onSelectThread={(sitterId) => {
                  setActiveChatSitterId(sitterId);
                  setChatThreads((prev) =>
                    prev.map((t) =>
                      t.sitterId === sitterId ? { ...t, unreadCount: 0 } : t
                    )
                  );
                }}
                onSendMessage={handleSendMessage}
                onOpenSOS={handleTriggerSOS}
                onBookSitter={(s) => setBookingModalSitter(s)}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingsAndLiveView
                bookings={bookings}
                requests={requests}
                sitters={sitters}
                selectedBookingId={selectedBookingId}
                shareLocationDuringJob={parentProfile.shareLocationDuringJob}
                lang={lang}
                onSelectBooking={(id) => setSelectedBookingId(id)}
                onCheckIn={handleCheckIn}
                onRequestExtension={handleRequestExtension}
                onFinishJob={handleFinishJob}
                onCancelBooking={handleCancelBooking}
                onSubmitReview={handleSubmitReview}
                onOpenChat={(sitterId) => handleOpenChatWithSitter(sitterId)}
                onOpenSOS={handleTriggerSOS}
                onGoToSearch={() => setActiveTab('search')}
                onGoToSettings={() => setActiveTab('profile')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                profile={parentProfile}
                lang={lang}
                onChangeLang={setLang}
                onUpdateProfile={setParentProfile}
                onNotify={showToast}
              />
            )}
          </>
        )}

        {role === 'sitter' && (
          <>
            {sitterTab === 'sitter_home' && (
              <SitterHomeView
                availableNow={sitterAvailableNow}
                onToggleAvailableNow={handleToggleSitterAvailable}
                weeklyAvailability={weeklyAvailability}
                onToggleSlot={handleToggleWeeklySlot}
                offers={jobOffers}
                onGoToJobs={() => setSitterTab('sitter_jobs')}
                onSelectOffer={(offer) => {
                  setSelectedOfferId(offer.id);
                  setSitterTab('sitter_jobs');
                }}
                onGoToRanks={() => setSitterTab('sitter_ranks')}
              />
            )}

            {sitterTab === 'sitter_jobs' && (
              <SitterJobsView
                offers={jobOffers}
                selectedOfferId={selectedOfferId}
                onSelectOfferId={setSelectedOfferId}
                onAcceptOffer={handleAcceptJobOffer}
                onDeclineOffer={handleDeclineJobOffer}
                onOpenChatWithParent={handleSitterOpenChatFromOffer}
              />
            )}

            {sitterTab === 'sitter_chat' && (
              <SitterChatAndShiftView
                shifts={sitterShifts}
                activeShiftId={activeShiftId}
                onSelectShift={setActiveShiftId}
                onSendMessage={handleSitterSendMessage}
                onCheckIn={handleSitterCheckIn}
                onCheckOut={handleSitterCheckOut}
                onOpenSOS={handleTriggerSOS}
              />
            )}

            {sitterTab === 'sitter_wallet' && (
              <SitterWalletView
                transactions={walletTransactions}
                onWithdrawAll={handleWithdrawWallet}
              />
            )}

            {sitterTab === 'sitter_ranks' && (
              <SitterRanksView
                quests={quests}
                rewards={rewards}
                points={sitterPoints}
                sitterSettings={sitterSettings}
                lang={lang}
                onChangeLang={setLang}
                onUpdateSitterSettings={setSitterSettings}
                onRedeemReward={handleRedeemReward}
                onNotify={showToast}
              />
            )}
          </>
        )}

        {role === 'admin' && (
          <AdminDashboardView
            kycQueue={adminKycQueue}
            safetyAlerts={adminSafetyAlerts}
            activeJobsCount={activeJobsCount}
            onApproveKyc={handleApproveKyc}
            onRejectKyc={handleRejectKyc}
            onUpdateAlertStatus={handleUpdateAlertStatus}
          />
        )}
      </main>

      {/* Mobile Floating Action Button (Parent & Sitter only) */}
      {role === 'parent' && (
        <button
          type="button"
          onClick={() => setPostRequestOpen(true)}
          className="lg:hidden fixed bottom-20 left-4 z-30 min-h-[48px] px-4 py-3 rounded-full bg-[#1A73E8] text-white font-display font-bold text-sm shadow-lg shadow-[#1A73E8]/30 hover:bg-[#1557B0] active:scale-[0.97] transition-all flex items-center gap-1.5 cursor-pointer"
          aria-label={t.postRequest}
        >
          <Plus className="w-5 h-5" />
          <span>{t.postRequest}</span>
        </button>
      )}

      {role === 'sitter' && (
        <button
          type="button"
          onClick={handleToggleSitterAvailable}
          className={`lg:hidden fixed bottom-20 left-4 z-30 min-h-[48px] px-4 py-3 rounded-full font-display font-bold text-sm shadow-lg active:scale-[0.97] transition-all flex items-center gap-1.5 cursor-pointer ${
            sitterAvailableNow
              ? 'bg-[#34A853] text-white shadow-[#34A853]/30 hover:bg-[#2B8E44]'
              : 'bg-[#222222] text-white shadow-slate-900/25 hover:bg-slate-800'
          }`}
          aria-pressed={sitterAvailableNow}
        >
          <Radio className="w-4 h-4" />
          <span>{sitterAvailableNow ? t.availableNow : t.enableAvailability}</span>
        </button>
      )}

      {/* Mobile Fixed Bottom Tab-bar (Parent & Sitter) */}
      {role !== 'admin' && (
        <nav
          aria-label="תפריט ניווט תחתון"
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDF9]/90 backdrop-blur-md border-t border-white/80 shadow-[0_-4px_20px_rgba(34,34,34,0.06)] pb-safe"
        >
          {role === 'parent' ? (
            <div className="grid grid-cols-5 h-16 items-center">
              {PARENT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                const label = t.navParent[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`relative h-full min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                      active
                        ? 'text-[#1A73E8]'
                        : 'text-slate-500 hover:text-[#222222]'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.id === 'chat' && totalUnreadChats > 0 && (
                        <span className="absolute -top-1 -left-2 min-w-[16px] h-4 px-1 rounded-full bg-[#1A73E8] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                          {totalUnreadChats}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] leading-none whitespace-nowrap ${
                        active ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-5 h-16 items-center">
              {SITTER_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = sitterTab === item.id;
                const shortKey = `${item.id}_short` as keyof typeof t.navSitter;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSitterTab(item.id)}
                    className={`relative h-full min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                      active
                        ? 'text-[#34A853]'
                        : 'text-slate-500 hover:text-[#222222]'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.id === 'sitter_jobs' && pendingOffersCount > 0 && (
                        <span className="absolute -top-1 -left-2 min-w-[16px] h-4 px-1 rounded-full bg-[#34A853] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                          {pendingOffersCount}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] leading-none whitespace-nowrap ${
                        active ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      <span className="sm:hidden">{t.navSitter[shortKey]}</span>
                      <span className="hidden sm:inline">{t.navSitter[item.id]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      )}

      <OfflineIndicator lang={lang} />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#222222] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="סגירת הודעה"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <SitterProfileModal
        sitter={profileModalSitter}
        onClose={() => setProfileModalSitter(null)}
        onOpenChat={(sitter) => handleOpenChatWithSitter(sitter.id)}
        onBookNow={(sitter) => {
          setProfileModalSitter(null);
          setBookingModalSitter(sitter);
        }}
      />

      <BookingPayModal
        sitter={bookingModalSitter}
        parent={parentProfile}
        onClose={() => setBookingModalSitter(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      <PostRequestModal
        isOpen={postRequestOpen}
        onClose={() => setPostRequestOpen(false)}
        onCreateRequest={handleCreateRequest}
      />

      <OnboardingKYCModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      <SOSModal
        isOpen={sosContext !== null}
        onClose={() => setSosContext(null)}
        contextLabel={sosContext ?? undefined}
        onNotify={showToast}
      />
    </div>
  );
}
