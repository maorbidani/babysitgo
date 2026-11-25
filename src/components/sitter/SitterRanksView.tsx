import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Gift,
  Star,
  ShieldCheck,
  Target,
  AlertCircle,
  UserCheck,
  Globe,
  MapPin,
  Bell,
  Download,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';
import { SITTER_PERSONA } from '../../data/sitterMockData';
import { UI_COPY } from '../../i18n/translations';
import {
  AppLanguage,
  SitterProfileSettings,
  SitterQuest,
  SitterReward,
} from '../../types';
import { PWAInstallButton } from '../PWAInstallButton';

interface SitterRanksViewProps {
  quests: SitterQuest[];
  rewards: SitterReward[];
  points: number;
  sitterSettings: SitterProfileSettings;
  lang: AppLanguage;
  onChangeLang: (next: AppLanguage) => void;
  onUpdateSitterSettings: (next: SitterProfileSettings) => void;
  onRedeemReward: (rewardId: string) => void;
  onNotify: (msg: string) => void;
}

const RANK_LADDER = [
  { name: 'Newbie', criteria: 'פתיחת פרופיל ואימות KYC' },
  { name: 'Bronze', criteria: '3 עבודות בציון 4.6+' },
  { name: 'Silver', criteria: '10 עבודות · אמינות 90%+' },
  { name: 'Gold', criteria: '30 עבודות · 0 ביטולי רגע אחרון' },
  { name: 'Star', criteria: 'שגרירת קהילה מובילה' },
];

export const SitterRanksView: React.FC<SitterRanksViewProps> = ({
  quests,
  rewards,
  points,
  sitterSettings,
  lang,
  onChangeLang,
  onUpdateSitterSettings,
  onRedeemReward,
  onNotify,
}) => {
  const [reviews, setReviews] = useState(SITTER_PERSONA.receivedReviews);
  const [appealingId, setAppealingId] = useState<string | null>(null);
  const [appealText, setAppealText] = useState('');
  const [savedProfile, setSavedProfile] = useState(false);
  const t = UI_COPY[lang];

  const handleAppealSubmit = (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, appealed: true } : r))
    );
    setAppealingId(null);
    setAppealText('');
    onNotify('הערעור נשלח לצוות Trust & Safety לבדיקה.');
  };

  const handleSaveSitterProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedProfile(true);
    onNotify(
      lang === 'he'
        ? 'פרופיל הבייביסיטר והגדרות הזמינות נשמרו.'
        : 'Sitter profile & settings saved.'
    );
    window.setTimeout(() => setSavedProfile(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Location Disabled Warning (Spec G) */}
      {!sitterSettings.shareLocationDuringJob && (
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
            onClick={() =>
              onUpdateSitterSettings({
                ...sitterSettings,
                shareLocationDuringJob: true,
              })
            }
            className="min-h-[38px] px-3.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer"
          >
            {t.enableNow}
          </button>
        </div>
      )}

      {/* Rank Ladder Banner (C) */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#222222]">
              מרכז דרגות, מדליות ופרופיל בייביסיטר
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              השלמת משימות שומרת על אמינות גבוהה, מפחיתה עמלה ופותחת הטבות
            </p>
          </div>
          <div className="text-left bg-[#F0F6FF] px-4 py-2 rounded-2xl border border-[#1A73E8]/15">
            <span className="text-[11px] text-slate-600 block">יתרת נקודות</span>
            <span className="font-display font-bold text-xl text-[#1A73E8] tabular-nums">
              {points} נק׳
            </span>
          </div>
        </div>

        {/* 5-Stage Rank Progression */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {RANK_LADDER.map((stage, index) => {
            const isCurrent = stage.name === SITTER_PERSONA.currentRank;
            const isPassed = index < 2;
            return (
              <div
                key={stage.name}
                className={`p-3 rounded-2xl border text-right space-y-1 ${
                  isCurrent
                    ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-sm'
                    : isPassed
                    ? 'bg-[#34A853]/10 border-[#34A853]/30 text-[#222222]'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-display font-bold">
                  <span>{stage.name}</span>
                  {(isPassed || isCurrent) && (
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isCurrent ? 'text-white' : 'text-[#34A853]'
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-[11px] leading-snug ${
                    isCurrent ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {stage.criteria}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Medals & Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quests */}
        <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#1A73E8]" />
            <h2 className="font-display font-bold text-lg text-[#222222]">
              משימות פעילות (Quests)
            </h2>
          </div>

          <div className="space-y-3.5">
            {quests.map((quest) => {
              const pct = Math.min(
                100,
                Math.round((quest.current / quest.target) * 100)
              );
              return (
                <div
                  key={quest.id}
                  className="p-4 rounded-2xl bg-white/80 border border-slate-200/70 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-[#222222]">
                      {quest.title}
                    </h3>
                    <span className="text-xs font-bold text-[#1A73E8] tabular-nums shrink-0">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{quest.description}</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        quest.completed ? 'bg-[#34A853]' : 'bg-[#1A73E8]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-[#34A853]">
                    תגמול: {quest.rewardLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Medals & Rewards Store */}
        <div className="space-y-6">
          <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#34A853]" />
              <h2 className="font-display font-bold text-lg text-[#222222]">
                מדליות שהושגו
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SITTER_PERSONA.medals.map((medal) => (
                <div
                  key={medal.id}
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    medal.earned
                      ? 'bg-white/90 border-slate-200'
                      : 'bg-slate-50/70 border-slate-200/60 opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-[#222222]">
                      {medal.name}
                    </span>
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        medal.earned ? 'text-[#34A853]' : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-slate-600">{medal.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#1A73E8]" />
                <h2 className="font-display font-bold text-lg text-[#222222]">
                  מועדון הטבות VIP ותגמולים
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#1A73E8]">
                זמין למימוש מיידי
              </span>
            </div>

            <div className="space-y-3">
              {rewards.map((reward) => {
                const canAfford = points >= reward.pointsCost;
                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      reward.redeemed
                        ? 'bg-gradient-to-l from-[#F2FBF5] to-white border-[#34A853]/40 shadow-xs'
                        : 'bg-gradient-to-l from-[#F0F6FF] via-white to-[#FFF4EC]/70 border-slate-200 hover:shadow-md hover:border-[#1A73E8]/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#1A73E8]">
                          כרטיס VIP
                        </span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="text-xs font-semibold text-[#1A73E8] tabular-nums">
                          {reward.pointsCost} נק׳
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#222222]">
                        {reward.title}
                      </h3>
                      <p className="text-xs text-slate-600">{reward.description}</p>
                      {reward.redeemed && (
                        <p className="text-xs font-bold text-[#34A853] pt-1">
                          קוד הטבה פתוח לשימוש: {reward.code}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={reward.redeemed || !canAfford}
                      onClick={() => onRedeemReward(reward.id)}
                      className={`min-h-[44px] px-5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-[0.97] cursor-pointer ${
                        reward.redeemed
                          ? 'bg-[#34A853]/15 text-[#34A853] cursor-default'
                          : canAfford
                          ? 'bg-[#1A73E8] text-white hover:bg-[#1557B0] shadow-sm shadow-[#1A73E8]/20'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {reward.redeemed ? 'מומש בהצלחה ✓' : 'ממש פרס'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Sitter Profile, Settings, App Icon Preview & Language Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleSaveSitterProfile}
          className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#34A853]" />
            <h2 className="font-display font-bold text-lg text-[#222222]">
              {lang === 'he'
                ? 'עריכת פרופיל בייביסיטר ותעריף'
                : 'Edit Sitter Profile & Rate'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {lang === 'he' ? 'עיר מגורים' : 'City'}
              </label>
              <input
                type="text"
                value={sitterSettings.city}
                onChange={(e) =>
                  onUpdateSitterSettings({
                    ...sitterSettings,
                    city: e.target.value,
                  })
                }
                className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-white/90 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {lang === 'he' ? 'תעריף לשעה (₪)' : 'Hourly Rate (₪)'}
              </label>
              <input
                type="number"
                min={42}
                max={150}
                value={sitterSettings.hourlyRate}
                onChange={(e) =>
                  onUpdateSitterSettings({
                    ...sitterSettings,
                    hourlyRate: Number(e.target.value) || 42,
                  })
                }
                className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-white/90 text-sm tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {lang === 'he' ? 'תיאור קצר להורים' : 'Short Bio for Parents'}
            </label>
            <textarea
              rows={3}
              value={sitterSettings.bio}
              onChange={(e) =>
                onUpdateSitterSettings({
                  ...sitterSettings,
                  bio: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-white/90 text-sm"
            />
          </div>

          <button
            type="submit"
            className="min-h-[44px] px-5 rounded-2xl bg-[#34A853] text-white font-semibold text-sm hover:bg-[#2B8E44] inline-flex items-center gap-2 cursor-pointer"
          >
            {savedProfile && <CheckCircle2 className="w-4 h-4" />}
            <span>
              {lang === 'he' ? 'שמירת פרטי בייביסיטר' : 'Save Sitter Profile'}
            </span>
          </button>
        </form>

        <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#1A73E8]" />
            <h2 className="font-display font-bold text-lg text-[#222222]">
              {lang === 'he'
                ? 'הגדרות בטיחות, שפה ואפליקציה'
                : 'Safety, Language & App Icon'}
            </h2>
          </div>

          <div className="divide-y divide-slate-200/60">
            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#34A853]" />
                <span className="text-xs sm:text-sm font-semibold text-[#222222]">
                  {lang === 'he'
                    ? 'שיתוף GPS ב-Check-in (מומלץ)'
                    : 'Share GPS on Check-in'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSitterSettings({
                    ...sitterSettings,
                    shareLocationDuringJob:
                      !sitterSettings.shareLocationDuringJob,
                  })
                }
                aria-pressed={sitterSettings.shareLocationDuringJob}
                className={`min-w-[48px] h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  sitterSettings.shareLocationDuringJob
                    ? 'bg-[#34A853]'
                    : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    sitterSettings.shareLocationDuringJob
                      ? lang === 'he'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[#1A73E8]" />
                <span className="text-xs sm:text-sm font-semibold text-[#222222]">
                  {lang === 'he'
                    ? 'התראות על משמרות באזור'
                    : 'Nearby Shift Alerts'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSitterSettings({
                    ...sitterSettings,
                    notificationsEnabled: !sitterSettings.notificationsEnabled,
                  })
                }
                aria-pressed={sitterSettings.notificationsEnabled}
                className={`min-w-[48px] h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  sitterSettings.notificationsEnabled
                    ? 'bg-[#1A73E8]'
                    : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    sitterSettings.notificationsEnabled
                      ? lang === 'he'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#222222]">
                <Globe className="w-4 h-4 text-[#1A73E8]" />
                <span>{t.languageLabel}</span>
              </div>
              <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200">
                <button
                  type="button"
                  onClick={() => onChangeLang('he')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    lang === 'he' ? 'bg-[#1A73E8] text-white' : 'text-slate-600'
                  }`}
                >
                  עברית
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    lang === 'en' ? 'bg-[#1A73E8] text-white' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/60">
            <img
              src="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
              alt="BabysitGo Icon"
              className="w-11 h-11 rounded-2xl object-cover shadow-xs"
            />
            <PWAInstallButton lang={lang} />
            <a
              href="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
              download="BabysitGo-App-Icon.jpg"
              className="min-h-[42px] px-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-[#222222] hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#1A73E8]" />
              <span>{t.downloadIconBtn}</span>
            </a>
          </div>
        </section>
      </div>

      {/* Sitter Reviews & Appeal Option (B7) */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#222222]">
            ביקורות שהתקבלו מהורים
          </h2>
          <span className="text-sm font-bold text-[#222222] tabular-nums inline-flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            {SITTER_PERSONA.averageRating} ממוצע
          </span>
        </div>

        <div className="divide-y divide-slate-200/60">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#222222]">
                  {rev.parentName} · {rev.dateLabel}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-600 tabular-nums">
                    ★ {rev.rating}.0
                  </span>
                  {rev.appealed ? (
                    <span className="text-[#1A73E8] font-medium">
                      ערעור בטיפול
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setAppealingId((curr) =>
                          curr === rev.id ? null : rev.id
                        )
                      }
                      className="text-slate-500 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>ערעור</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-700">{rev.comment}</p>
              <p className="text-xs text-[#34A853] font-medium">
                {rev.tags.join(' · ')}
              </p>

              {appealingId === rev.id && (
                <form
                  onSubmit={(e) => handleAppealSubmit(e, rev.id)}
                  className="pt-2 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    required
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    placeholder="פרטי בקצרה את סיבת הערעור לצוות Trust & Safety..."
                    className="flex-1 min-h-[40px] px-3 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 rounded-xl bg-[#1A73E8] text-white text-xs font-semibold cursor-pointer"
                  >
                    שליחת ערעור
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
