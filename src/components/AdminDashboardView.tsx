import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Video,
  ExternalLink,
  Search,
  Siren,
  Clock,
} from 'lucide-react';
import { AdminKycItem, AdminSafetyAlert, KycQueueStatus } from '../types';

interface AdminDashboardViewProps {
  kycQueue: AdminKycItem[];
  safetyAlerts: AdminSafetyAlert[];
  activeJobsCount: number;
  onApproveKyc: (id: string) => void;
  onRejectKyc: (id: string) => void;
  onUpdateAlertStatus: (
    id: string,
    status: 'open' | 'in_review' | 'resolved'
  ) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  kycQueue,
  safetyAlerts,
  activeJobsCount,
  onApproveKyc,
  onRejectKyc,
  onUpdateAlertStatus,
}) => {
  const [kycFilter, setKycFilter] = useState<'all' | KycQueueStatus>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingKycCount = kycQueue.filter((k) => k.status === 'pending').length;
  const openAlertsCount = safetyAlerts.filter((a) => a.status !== 'resolved').length;

  const filteredKyc = useMemo(() => {
    return kycQueue.filter((item) => {
      if (kycFilter !== 'all' && item.status !== kycFilter) return false;
      if (
        searchQuery.trim() &&
        !item.fullName.includes(searchQuery.trim()) &&
        !item.city.includes(searchQuery.trim())
      ) {
        return false;
      }
      return true;
    });
  }, [kycQueue, kycFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-[#1A73E8]">
            ממשק תפעול ובטיחות · פיילוט גוש דן
          </span>
          <h1 className="font-display text-2xl font-bold text-[#222222] mt-0.5">
            לוח בקרה וניהול מערכת (Admin)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            בקרת אימותי זהות ורשת חברתית (KYC), ניטור עסקאות ומוקד Trust & Safety
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs tabular-nums">
          <div className="px-3.5 py-2 rounded-2xl bg-[#F3F8FF] border border-[#1A73E8]/20">
            <span className="text-slate-600 block">ממתינות ל-KYC</span>
            <span className="font-display font-bold text-lg text-[#1A73E8]">
              {pendingKycCount}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-red-50 border border-red-200">
            <span className="text-red-700 block">אירועים פתוחים</span>
            <span className="font-display font-bold text-lg text-red-700">
              {openAlertsCount}
            </span>
          </div>
        </div>
      </section>

      {/* Top 4 KPI Cards */}
      <section
        aria-label="מדדי מערכת מרכזיים"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="glass-card rounded-2xl border p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>עסקאות היום</span>
            <TrendingUp className="w-4 h-4 text-[#34A853]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#222222] tabular-nums">
            ₪18,450
          </div>
          <p className="text-xs text-[#34A853] font-medium tabular-nums">
            42 הזמנות מאושרות · +14% מאתמול
          </p>
        </div>

        <div className="glass-card rounded-2xl border p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>הזמנות פעילות כרגע</span>
            <Clock className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#222222] tabular-nums">
            {22 + activeJobsCount}
          </div>
          <p className="text-xs text-slate-600">
            Check-in פעיל בגוש דן
          </p>
        </div>

        <div className="glass-card rounded-2xl border p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>יחס הורים / בייביסיטריות</span>
            <Users className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#222222] tabular-nums">
            1 : 1.5
          </div>
          <p className="text-xs text-slate-600 tabular-nums">
            1,020 הורים · 1,540 בייביסיטריות
          </p>
        </div>

        <div className="glass-card rounded-2xl border p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>מדד אמון ממוצע</span>
            <ShieldCheck className="w-4 h-4 text-[#34A853]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#34A853] tabular-nums">
            4.82 / 5
          </div>
          <p className="text-xs text-slate-600 tabular-nums">
            שיעור תלונות: 0.8% (יעד &lt; 2%)
          </p>
        </div>
      </section>

      {/* KYC Verification Queue Table */}
      <section className="glass-card rounded-3xl border overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#222222]">
              תור אימותי KYC (בדיקת זהות, רשת חברתית ווידאו)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              קישורי הרשתות החברתיות חשופים לאדמין בלבד לצורך אימות ואינם מוצגים לציבור
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי שם או עיר..."
                className="min-h-[38px] px-3 pr-9 rounded-xl border border-slate-200 bg-[#FAFAFA] text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              {(
                [
                  { id: 'pending', label: 'ממתינות' },
                  { id: 'approved', label: 'אושרו' },
                  { id: 'rejected', label: 'נדחו' },
                  { id: 'all', label: 'הכל' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setKycFilter(tab.id)}
                  className={`min-h-[34px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    kycFilter === tab.id
                      ? 'bg-white text-[#1A73E8] shadow-xs'
                      : 'text-slate-600 hover:text-[#222222]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-slate-200 text-xs text-slate-500">
                <th className="py-3 px-4 font-semibold">מועמדת</th>
                <th className="py-3 px-4 font-semibold">ת.ז. + סלפי</th>
                <th className="py-3 px-4 font-semibold">קישור רשת חברתית (פנימי)</th>
                <th className="py-3 px-4 font-semibold">וידאו היכרות</th>
                <th className="py-3 px-4 font-semibold">סטטוס</th>
                <th className="py-3 px-4 font-semibold">פעולות אימות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredKyc.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    אין בקשות אימות התואמות לסינון הנוכחי.
                  </td>
                </tr>
              ) : (
                filteredKyc.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#222222]">
                        {item.fullName} (בת {item.age})
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.city} · {item.submittedAt}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className="text-[#34A853] font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        תעודה + סלפי תואם
                      </span>
                      {item.cprCertificate && (
                        <span className="block text-slate-500 mt-0.5">
                          + תעודת החייאה
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-medium text-[#1A73E8] inline-flex items-center gap-1" dir="ltr">
                        <ExternalLink className="w-3 h-3" />
                        {item.socialUrl}
                      </span>
                      <span className="block text-slate-500 mt-0.5">
                        {item.socialPlatform} (מוסתר לציבור)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs tabular-nums">
                      <span className="inline-flex items-center gap-1 text-[#222222] font-medium">
                        <Video className="w-3.5 h-3.5 text-[#1A73E8]" />
                        {item.videoDurationSec} שנ׳ · אומת
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold">
                      {item.status === 'pending' && (
                        <span className="text-amber-700">ממתינה לבדיקה</span>
                      )}
                      {item.status === 'approved' && (
                        <span className="text-[#34A853]">מאושרת לפעילות</span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="text-red-600">נדחתה</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onApproveKyc(item.id)}
                            className="min-h-[36px] px-3 rounded-xl bg-[#34A853] text-white text-xs font-semibold hover:bg-[#2B8E44] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            אשר אימות
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectKyc(item.id)}
                            className="min-h-[36px] px-3 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            דחה
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">טופל</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Safety & SOS Complaints Center */}
      <section className="glass-card rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 text-red-600" />
            <h2 className="font-display font-bold text-lg text-[#222222]">
              מוקד בטיחות, SOS ותלונות (Safety & Trust)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            ניטור אירועים בזמן אמת וזמני SLA
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {safetyAlerts.map((alert) => {
            const severityColor =
              alert.severity === 'high'
                ? 'text-red-600'
                : alert.severity === 'medium'
                ? 'text-amber-700'
                : 'text-slate-600';
            return (
              <div
                key={alert.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-bold inline-flex items-center gap-1 ${severityColor}`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {alert.type}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 tabular-nums">
                      {alert.timestamp}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#1A73E8] tabular-nums">
                      {alert.slaLabel}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[#222222]">
                    {alert.partyLabel} ·{' '}
                    <span className="font-normal text-slate-600">
                      {alert.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{alert.details}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {alert.status === 'open' && (
                    <button
                      type="button"
                      onClick={() => onUpdateAlertStatus(alert.id, 'in_review')}
                      className="min-h-[38px] px-3.5 rounded-xl bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1557B0] cursor-pointer"
                    >
                      קח לטיפול
                    </button>
                  )}
                  {alert.status !== 'resolved' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                      className="min-h-[38px] px-3.5 rounded-xl bg-[#34A853] text-white text-xs font-semibold hover:bg-[#2B8E44] cursor-pointer"
                    >
                      סמן כטופל
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[#34A853] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      נפתר ונסגר
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
