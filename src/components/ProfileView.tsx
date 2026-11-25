import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Bell,
  Users,
  Lock,
  CheckCircle2,
  Globe,
  Download,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import { UI_COPY } from '../i18n/translations';
import { AppLanguage, ParentProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileViewProps {
  profile: ParentProfile;
  lang: AppLanguage;
  onChangeLang: (next: AppLanguage) => void;
  onUpdateProfile: (next: ParentProfile) => void;
  onNotify: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  lang,
  onChangeLang,
  onUpdateProfile,
  onNotify,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);
  const t = UI_COPY[lang];

  const toggleLocation = () => {
    const nextVal = !profile.shareLocationDuringJob;
    onUpdateProfile({
      ...profile,
      shareLocationDuringJob: nextVal,
    });
    onNotify(
      nextVal
        ? 'שיתוף מיקום בזמן עבודה הופעל (מומלץ לבטיחות).'
        : 'שיתוף מיקום בזמן עבודה כובה.'
    );
  };

  const toggleNotifications = () => {
    onUpdateProfile({
      ...profile,
      notificationsEnabled: !profile.notificationsEnabled,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    onNotify(
      lang === 'he'
        ? 'פרופיל המשפחה עודכן ונשמר בהצלחה.'
        : 'Family profile updated successfully.'
    );
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Location Disabled Edge-Case Safety Banner (Spec Section G) */}
      {!profile.shareLocationDuringJob && (
        <div
          role="alert"
          className="rounded-3xl bg-amber-50/90 backdrop-blur-md border border-amber-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-900 font-medium">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t.locationMissingWarning}</span>
          </div>
          <button
            type="button"
            onClick={toggleLocation}
            className="min-h-[38px] px-3.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors cursor-pointer"
          >
            {t.enableNow}
          </button>
        </div>
      )}

      {/* Identity & Verification Card */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A73E8]/15 to-[#FFF4EC] text-[#1A73E8] font-display font-bold text-2xl flex items-center justify-center shrink-0 border border-white">
            {profile.firstName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-xl text-[#222222]">
                {profile.firstName} {profile.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#34A853]">
                <ShieldCheck className="w-4 h-4" />
                {lang === 'he' ? 'הורה מאומת' : 'Verified Parent'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {lang === 'he'
                ? `אימות טלפון (OTP) הושלם · אזור כללי: ${profile.city}, ${profile.neighborhood}`
                : `OTP Phone Verified · General area: ${profile.city}, ${profile.neighborhood}`}
            </p>
          </div>
        </div>
      </section>

      {/* BabysitGo Home Screen App Icon Preview & PWA Install */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm bg-gradient-to-l from-[#F0F6FF]/85 via-[#FFFDF9]/90 to-[#FFF4EC]/85">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#1A73E8]" />
              <h2 className="font-display font-bold text-lg text-[#222222]">
                {t.appIconPreviewTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
              {t.appIconPreviewSub}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/75 border border-white shadow-inner">
          {/* Miniature Home Screen Mockup */}
          <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-lg w-36 shrink-0">
            <div className="w-16 h-16 rounded-[18px] overflow-hidden shadow-md ring-2 ring-white/25 bg-[#FFFDF9]">
              <img
                src="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
                alt="BabysitGo App Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-[11px] font-medium tracking-tight text-white/95">
              BabysitGo
            </span>
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-start">
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'he'
                ? 'האפליקציה תומכת בהתקנה מלאה (PWA) על מסך הבית באנדרואיד ובאייפון עם גישה מהירה לצ׳אט, מעקב חי וכפתור SOS.'
                : 'Install BabysitGo as a native-like PWA on your Android or iOS home screen for instant access to live tracking, chat & SOS.'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <PWAInstallButton lang={lang} />
              <a
                href="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
                download="BabysitGo-App-Icon.jpg"
                onClick={() =>
                  onNotify(
                    lang === 'he'
                      ? 'האייקון של BabysitGo הורד למכשירך!'
                      : 'BabysitGo icon downloaded!'
                  )
                }
                className="min-h-[44px] px-4 py-2 rounded-2xl border border-slate-200 bg-white text-[#222222] text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#1A73E8]" />
                <span>{t.downloadIconBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Family Profile Form */}
      <form
        onSubmit={handleSave}
        className="glass-card rounded-3xl border p-5 sm:p-6 space-y-5 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1A73E8]" />
          <h2 className="font-display font-bold text-lg text-[#222222]">
            {lang === 'he' ? 'פרופיל משפחה והעדפות' : 'Family Profile & Preferences'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {lang === 'he' ? 'עיר / אזור מגורים' : 'City / Area'}
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) =>
                onUpdateProfile({ ...profile, city: e.target.value })
              }
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200/90 bg-white/90 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {lang === 'he' ? 'שכונה (מוצג בחיפוש)' : 'Neighborhood (Shown in Search)'}
            </label>
            <input
              type="text"
              value={profile.neighborhood}
              onChange={(e) =>
                onUpdateProfile({ ...profile, neighborhood: e.target.value })
              }
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200/90 bg-white/90 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {lang === 'he'
              ? 'כתובת מלאה (נחשפת לבייביסיטר רק לאחר אישור הזמנה)'
              : 'Full Address (Revealed only after booking approval)'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={profile.fullAddress}
              onChange={(e) =>
                onUpdateProfile({ ...profile, fullAddress: e.target.value })
              }
              className="w-full min-h-[44px] px-3 pl-9 rounded-xl border border-slate-200/90 bg-white/90 text-sm"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-600 block">
            {lang === 'he' ? 'ילדים במשפחה:' : 'Children:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {profile.children.map((child) => (
              <div
                key={child.id}
                className="px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between text-sm"
              >
                <span className="font-semibold text-[#222222]">
                  {child.name}
                </span>
                <span className="text-slate-600 text-xs">{child.ageLabel}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {lang === 'he' ? 'חיות מחמד בבית' : 'Pets at Home'}
          </label>
          <input
            type="text"
            value={profile.pets}
            onChange={(e) =>
              onUpdateProfile({ ...profile, pets: e.target.value })
            }
            className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200/90 bg-white/90 text-sm"
          />
        </div>

        <button
          type="submit"
          className="min-h-[46px] px-6 rounded-2xl bg-[#1A73E8] text-white font-semibold text-sm hover:bg-[#1557B0] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          {savedNotice && <CheckCircle2 className="w-4 h-4" />}
          <span>{lang === 'he' ? 'שמירת פרטי משפחה' : 'Save Family Profile'}</span>
        </button>
      </form>

      {/* Safety, Privacy & Language Settings */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <h2 className="font-display font-bold text-lg text-[#222222]">
          {lang === 'he'
            ? 'בטיחות, פרטיות, שפה והתראות'
            : 'Safety, Privacy, Language & Alerts'}
        </h2>

        <div className="divide-y divide-slate-200/60">
          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#34A853] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#222222]">
                  {lang === 'he'
                    ? 'שיתוף מיקום בזמן עבודה (מומלץ)'
                    : 'Share Location During Active Shift (Recommended)'}
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'he'
                    ? 'משתמשים בזה רק כדי לאמת Check-in/out ולהגביר את הבטיחות.'
                    : 'Used strictly to verify Check-in/out and ensure family safety.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleLocation}
              aria-pressed={profile.shareLocationDuringJob}
              className={`min-w-[52px] h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                profile.shareLocationDuringJob ? 'bg-[#34A853]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  profile.shareLocationDuringJob
                    ? lang === 'he'
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[#222222]">
                  {lang === 'he' ? 'התראות Push ו-SMS' : 'Push & SMS Notifications'}
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'he'
                    ? 'עדכונים על אישור הזמנה, Check-in והודעות חדשות בצ׳אט.'
                    : 'Alerts for booking approvals, Check-in and chat messages.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleNotifications}
              aria-pressed={profile.notificationsEnabled}
              className={`min-w-[52px] h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                profile.notificationsEnabled ? 'bg-[#1A73E8]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  profile.notificationsEnabled
                    ? lang === 'he'
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Interactive RTL / LTR Language Switcher */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#1A73E8] shrink-0" />
              <div>
                <div className="font-semibold text-[#222222]">{t.languageLabel}</div>
                <p className="text-xs text-slate-500">{t.languageSub}</p>
              </div>
            </div>
            <div
              className="inline-flex p-1 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs self-start sm:self-center"
              role="group"
              aria-label={t.languageLabel}
            >
              <button
                type="button"
                onClick={() => onChangeLang('he')}
                className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  lang === 'he'
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                {t.langHe}
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('en')}
                className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                {t.langEn}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
