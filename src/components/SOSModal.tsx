import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, MapPin, CheckCircle2, X, Siren } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextLabel?: string;
  onNotify: (msg: string) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  contextLabel,
  onNotify,
}) => {
  const [incidentReported, setIncidentReported] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  if (!isOpen) return null;

  const handleReportSafety = () => {
    setIncidentReported(true);
    onNotify('התרעת בטיחות נשלחה לצוות Trust & Safety. נציג יצור עמך קשר תוך דקות.');
  };

  const handleShareLocation = () => {
    setLocationShared(true);
    onNotify('מיקום חי שותף עם איש הקשר לחירום שלך.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-red-100">
        <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Siren className="w-6 h-6 shrink-0" />
            <div>
              <h2 id="sos-modal-title" className="font-display font-bold text-lg leading-tight">
                מרכז חירום ובטיחות (SOS)
              </h2>
              {contextLabel && (
                <p className="text-xs text-red-100 mt-0.5">{contextLabel}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
            aria-label="סגור חלון חירום"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-sm text-[#222222]/80 leading-relaxed">
            בכל מקרה של חשש או חירום, הצוות שלנו זמין 24/7. ניתן להזעיק עזרה מיידית או לשתף את פרטי האירוע בלחיצה אחת.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="tel:100"
              className="min-h-[52px] flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors px-4"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>חיוג למשטרה (100)</span>
            </a>
            <a
              href="tel:101"
              className="min-h-[52px] flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-semibold text-sm hover:bg-red-100 transition-colors px-4"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>מד״א (101)</span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleShareLocation}
            disabled={locationShared}
            className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${
              locationShared
                ? 'bg-[#34A853]/10 border-[#34A853]/30 text-[#34A853]'
                : 'bg-slate-50 border-slate-200 text-[#222222] hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {locationShared ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <MapPin className="w-5 h-5 text-[#1A73E8] shrink-0" />
              )}
              <span>
                {locationShared
                  ? 'מיקום חי שותף עם איש הקשר לחירום'
                  : 'שיתוף מיקום חי ופרטי הבייביסיטר לאיש קשר'}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleReportSafety}
            disabled={incidentReported}
            className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${
              incidentReported
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-red-200 text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {incidentReported ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 shrink-0" />
              )}
              <span>
                {incidentReported
                  ? 'דיווח בטיחות נפתח — צוות אמון בדרך אליכם'
                  : 'פתיחת קריאת חירום לצוות אמון ובטיחות'}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] mt-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            סגירה וחזרה למסך
          </button>
        </div>
      </div>
    </div>
  );
};
