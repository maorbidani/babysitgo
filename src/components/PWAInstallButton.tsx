import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import { UI_COPY } from '../i18n/translations';
import { AppLanguage } from '../types';

interface PWAInstallButtonProps {
  lang: AppLanguage;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const t = UI_COPY[lang];

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#1A73E8] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#1557B0] transition-colors inline-flex items-center gap-2 cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{t.installApp}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        className="min-h-[44px] px-4 py-2 rounded-2xl border border-[#1A73E8]/30 bg-[#F0F6FF] text-[#1A73E8] text-xs sm:text-sm font-semibold hover:bg-[#1A73E8]/10 transition-colors inline-flex items-center gap-2 cursor-pointer"
      >
        <Smartphone className="w-4 h-4 shrink-0" />
        <span>{isIOS ? t.installIos : t.installApp}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-[#FFFDF9] border border-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#222222]">
                {t.iosTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-h-[36px] min-w-[36px] rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF4EC]/80">
              <img
                src="/assets/aistudio/image_25fe8cd8_48a9c339.jpg"
                alt="BabysitGo"
                className="w-12 h-12 rounded-2xl object-cover shadow-xs"
              />
              <div className="text-xs text-slate-700 leading-relaxed">
                <p>{t.iosStep1}</p>
                <p className="mt-1">{t.iosStep2}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full min-h-[44px] rounded-2xl bg-[#1A73E8] text-white text-sm font-semibold hover:bg-[#1557B0] cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC<{ lang: AppLanguage }> = ({ lang }) => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>{UI_COPY[lang].offlineBanner}</span>
    </div>
  );
};
