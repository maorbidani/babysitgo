import React, { useState } from 'react';
import { X, Plus, PawPrint, Users } from 'lucide-react';
import { ALL_SKILLS } from '../data/mockData';
import { ParentRequest } from '../types';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRequest: (req: ParentRequest) => void;
}

const AGE_GROUPS = [
  'תינוק (0–1)',
  'פעוט (1–3)',
  'גיל גן (3–6)',
  'בית ספר (6+)',
];

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  isOpen,
  onClose,
  onCreateRequest,
}) => {
  const [date, setDate] = useState('2026-11-29');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('23:00');
  const [maxRate, setMaxRate] = useState(70);
  const [childrenCount, setChildrenCount] = useState(2);
  const [childAges, setChildAges] = useState<string[]>([
    'גיל גן (3–6)',
    'פעוט (1–3)',
    'תינוק (0–1)',
    'בית ספר (6+)',
  ]);
  const [hasPets, setHasPets] = useState(false);
  const [skills, setSkills] = useState<string[]>([
    'עזרה ראשונה / החייאה',
    'ניסיון עם תינוקות',
  ]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleChildAgeChange = (idx: number, age: string) => {
    setChildAges((prev) => prev.map((item, i) => (i === idx ? age : item)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest({
      id: `req-${Date.now()}`,
      date,
      startTime,
      endTime,
      maxRate,
      childrenCount,
      childAges: childAges.slice(0, childrenCount),
      hasPets,
      skills,
      notes,
      createdAt: 'כעת',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-request-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-lg max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2
              id="post-request-title"
              className="font-display font-bold text-lg text-[#222222]"
            >
              פרסום בקשה חדשה
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              הבקשה תישלח לבייביסיטריות מאומתות וזמינות באזורך
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
            aria-label="סגור טופס פרסום בקשה"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                תאריך
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                משעה
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                עד שעה
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                תקציב משוער לשעה (₪)
              </label>
              <input
                type="number"
                min={42}
                max={150}
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                מספר ילדים
              </label>
              <select
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm"
              >
                <option value={1}>ילד אחד</option>
                <option value={2}>2 ילדים</option>
                <option value={3}>3 ילדים</option>
                <option value={4}>4 ילדים</option>
              </select>
            </div>
          </div>

          {/* Per-child ages */}
          <div className="space-y-2 bg-[#FAFAFA] p-3.5 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#222222]">
              <Users className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>גילאי הילדים:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.from({ length: childrenCount }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap w-14">
                    ילד/ה {idx + 1}:
                  </span>
                  <select
                    value={childAges[idx] ?? AGE_GROUPS[1]}
                    onChange={(e) => handleChildAgeChange(idx, e.target.value)}
                    className="flex-1 min-h-[40px] px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  >
                    {AGE_GROUPS.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requirements & Pets */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-600 block">
              דרישות מיוחדות ומיומנויות:
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((sk) => {
                const active = skills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`min-h-[38px] px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                        : 'bg-[#FAFAFA] border-slate-200 text-[#222222]'
                    }`}
                  >
                    {sk}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setHasPets((v) => !v)}
                className={`min-h-[38px] px-3 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  hasPets
                    ? 'bg-[#34A853] border-[#34A853] text-white'
                    : 'bg-[#FAFAFA] border-slate-200 text-[#222222]'
                }`}
              >
                <PawPrint className="w-3.5 h-3.5" />
                <span>יש חיית מחמד בבית</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              הערות נוספות לבייביסיטר
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="לדוגמה: הרדמה ב-20:30, אלרגיה לבוטנים, כלב ידידותי בבית..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-200 bg-[#FAFAFA] shrink-0">
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-2xl bg-[#1A73E8] text-white font-display font-bold text-sm hover:bg-[#1557B0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>פרסום בקשה ושליחת התראה</span>
          </button>
        </div>
      </form>
    </div>
  );
};
