import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { UI_COPY } from '../i18n/translations';
import { AppLanguage } from '../types';

interface SplashScreenProps {
  lang: AppLanguage;
  onFinish: () => void;
}

const SPLASH_DURATION_MS = 7000;

export const SplashScreen: React.FC<SplashScreenProps> = ({
  lang,
  onFinish,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(7);
  const t = UI_COPY[lang];

  useEffect(() => {
    const finishTimer = window.setTimeout(() => {
      onFinish();
    }, SPLASH_DURATION_MS);

    const countdownInterval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(finishTimer);
      window.clearInterval(countdownInterval);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, #FFF4EC 0%, #FFFDF9 48%, #F0F6FF 100%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="BabysitGo Splash Screen"
    >
      {/* Subtle decorative warm glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FFF4EC] opacity-80 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#F0F6FF] opacity-90 blur-3xl"
      />

      {/* Skip Button in corner for quick testing */}
      <button
        type="button"
        onClick={onFinish}
        className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 min-h-[40px] px-4 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 text-xs font-semibold text-slate-600 hover:text-[#222222] hover:bg-white shadow-xs transition-all cursor-pointer tabular-nums"
      >
        {t.skip} ({secondsLeft}s)
      </button>

      {/* Center Brand Showcase */}
      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center space-y-6">
        <div className="relative animate-splash-float">
          <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-[#1A73E8]/15 via-[#FFF4EC] to-[#34A853]/15 blur-xl" />
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[2.25rem] overflow-hidden shadow-2xl border-4 border-white/90 bg-[#FFFDF9]">
            <img
              src="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
              alt="BabysitGo — בייביסיטר ותינוק"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34A853]">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {lang === 'he'
                ? 'פלטפורמת בייביסיטר מאומתת'
                : 'Verified Family Care'}
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#1A73E8]">
            BabysitGo
          </h1>
          <p className="text-base sm:text-lg font-medium text-[#222222] leading-relaxed">
            {t.splashTagline}
          </p>
        </div>

        {/* 7-Second Progress Bar */}
        <div className="w-full max-w-[260px] space-y-2 pt-2">
          <div className="w-full h-2 rounded-full bg-white/80 border border-slate-200/70 overflow-hidden shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-l from-[#1A73E8] to-[#34A853] animate-splash-progress" />
          </div>
          <p className="text-xs text-slate-500 tabular-nums">
            {t.loadingSeconds}
          </p>
        </div>
      </div>
    </div>
  );
};
