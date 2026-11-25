import { AppLanguage } from '../types';

export const UI_COPY: Record<
  AppLanguage,
  {
    brand: string;
    splashTagline: string;
    skip: string;
    loadingSeconds: string;
    kycDemoBtn: string;
    roleParent: string;
    roleSitter: string;
    roleAdmin: string;
    adminCenter: string;
    postRequest: string;
    availableNow: string;
    enableAvailability: string;
    navParent: {
      home: string;
      search: string;
      chat: string;
      bookings: string;
      profile: string;
    };
    navSitter: {
      sitter_home: string;
      sitter_home_short: string;
      sitter_jobs: string;
      sitter_jobs_short: string;
      sitter_chat: string;
      sitter_chat_short: string;
      sitter_wallet: string;
      sitter_wallet_short: string;
      sitter_ranks: string;
      sitter_ranks_short: string;
    };
    languageLabel: string;
    languageSub: string;
    langHe: string;
    langEn: string;
    installApp: string;
    installIos: string;
    iosTitle: string;
    iosStep1: string;
    iosStep2: string;
    close: string;
    offlineBanner: string;
    appIconPreviewTitle: string;
    appIconPreviewSub: string;
    downloadIconBtn: string;
    locationMissingWarning: string;
    enableNow: string;
    archiveTitle: string;
    archiveEmpty: string;
    viewReceipt: string;
    downloadReceipt: string;
    receiptTitle: string;
  }
> = {
  he: {
    brand: 'BabysitGo',
    splashTagline: 'ביטחון, חום ושקט נפשי למשפחה שלך',
    skip: 'דלג',
    loadingSeconds: 'טוען חוויה מאובטחת...',
    kycDemoBtn: 'הדגמת הרשמה ואימות (KYC)',
    roleParent: 'מצב הורה',
    roleSitter: 'מצב בייביסיטר',
    roleAdmin: 'מצב אדמין (ניהול)',
    adminCenter: 'מרכז בקרה ואימותים',
    postRequest: 'פרסום בקשה',
    availableNow: 'זמינה עכשיו',
    enableAvailability: 'הפעל זמינות',
    navParent: {
      home: 'בית',
      search: 'חיפוש',
      chat: 'צ׳אט',
      bookings: 'הזמנות',
      profile: 'פרופיל',
    },
    navSitter: {
      sitter_home: 'בית',
      sitter_home_short: 'בית',
      sitter_jobs: 'הצעות עבודה',
      sitter_jobs_short: 'הצעות',
      sitter_chat: 'צ׳אט',
      sitter_chat_short: 'צ׳אט',
      sitter_wallet: 'ארנק',
      sitter_wallet_short: 'ארנק',
      sitter_ranks: 'דרגות ופרופיל',
      sitter_ranks_short: 'פרופיל',
    },
    languageLabel: 'שפת ממשק וכיווניות',
    languageSub: 'החלפה מלאה בין עברית (RTL) לאנגלית (LTR)',
    langHe: 'עברית (RTL)',
    langEn: 'English (LTR)',
    installApp: 'התקנת האפליקציה למסך הבית',
    installIos: 'הוספה למסך הבית (iPhone)',
    iosTitle: 'התקנת BabysitGo באייפון / אייפד',
    iosStep1: '1. לחצו על כפתור השיתוף (Share) בסרגל Safari.',
    iosStep2: '2. גללו ובחרו "הוספה למסך הבית" (Add to Home Screen).',
    close: 'סגירה',
    offlineBanner: 'מצב לא מקוון — נתונים שמורים זמינים לצפייה.',
    appIconPreviewTitle: 'אייקון BabysitGo למסך הבית',
    appIconPreviewSub:
      'תצוגה מקדימה של האייקון הרשמי כפי שהוא מופיע במסך הבית בנייד.',
    downloadIconBtn: 'הורדת אייקון (PNG/JPG)',
    locationMissingWarning:
      'שיתוף מיקום משפר בטיחות. אפשר/י בהגדרות (מומלץ).',
    enableNow: 'אפשר כעת',
    archiveTitle: 'ארכיון הזמנות וקבלות דיגיטליות',
    archiveEmpty: 'לא נמצאו הזמנות קודמות בארכיון.',
    viewReceipt: 'צפייה בקבלה',
    downloadReceipt: 'הורדת קבלה דיגיטלית',
    receiptTitle: 'קבלה דיגיטלית מפורטת · BabysitGo',
  },
  en: {
    brand: 'BabysitGo',
    splashTagline: 'Safety, warmth & peace of mind for your family',
    skip: 'Skip',
    loadingSeconds: 'Preparing safe marketplace...',
    kycDemoBtn: 'Onboarding & KYC Demo',
    roleParent: 'Parent Mode',
    roleSitter: 'Sitter Mode',
    roleAdmin: 'Admin Console',
    adminCenter: 'Trust & Safety Admin',
    postRequest: 'Post Request',
    availableNow: 'Available Now',
    enableAvailability: 'Go Online',
    navParent: {
      home: 'Home',
      search: 'Search',
      chat: 'Chat',
      bookings: 'Bookings',
      profile: 'Profile',
    },
    navSitter: {
      sitter_home: 'Home',
      sitter_home_short: 'Home',
      sitter_jobs: 'Job Offers',
      sitter_jobs_short: 'Offers',
      sitter_chat: 'Chat',
      sitter_chat_short: 'Chat',
      sitter_wallet: 'Wallet',
      sitter_wallet_short: 'Wallet',
      sitter_ranks: 'Ranks & Profile',
      sitter_ranks_short: 'Profile',
    },
    languageLabel: 'Interface Language & Direction',
    languageSub: 'Switch seamlessly between Hebrew (RTL) and English (LTR)',
    langHe: 'עברית (RTL)',
    langEn: 'English (LTR)',
    installApp: 'Install BabysitGo App',
    installIos: 'Add to Home Screen (iOS)',
    iosTitle: 'Install BabysitGo on iPhone / iPad',
    iosStep1: '1. Tap the Share button in Safari toolbar.',
    iosStep2: '2. Scroll down and tap "Add to Home Screen".',
    close: 'Close',
    offlineBanner: 'Offline Mode — Showing cached family & shift data.',
    appIconPreviewTitle: 'BabysitGo Home Screen Icon',
    appIconPreviewSub:
      'Live preview of how the BabysitGo app icon looks on your phone home screen.',
    downloadIconBtn: 'Download App Icon',
    locationMissingWarning:
      'Location sharing improves safety. Enable in Settings (Recommended).',
    enableNow: 'Enable Now',
    archiveTitle: 'Bookings Archive & Digital Receipts',
    archiveEmpty: 'No archived bookings match your filter.',
    viewReceipt: 'View Receipt',
    downloadReceipt: 'Download Digital Receipt',
    receiptTitle: 'Digital Receipt · BabysitGo',
  },
};
