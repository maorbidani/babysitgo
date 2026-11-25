import React, { useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Bookmark,
  Star,
  ShieldCheck,
  MapPin,
  RotateCcw,
  Check,
} from 'lucide-react';
import { ALL_LANGUAGES, ALL_SKILLS } from '../data/mockData';
import { Sitter } from '../types';
import { SitterCard } from './SitterCard';
import { AvatarWithFallback } from './AvatarWithFallback';

interface SearchViewProps {
  sitters: Sitter[];
  onSelectSitter: (sitter: Sitter) => void;
  onBookSitter: (sitter: Sitter) => void;
  onNotify: (msg: string) => void;
}

type SortOption = 'smart' | 'distance' | 'price' | 'reliability';

export const SearchView: React.FC<SearchViewProps> = ({
  sitters,
  onSelectSitter,
  onBookSitter,
  onNotify,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(true);
  const [date, setDate] = useState('2026-11-24');
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('23:30');
  const [maxPrice, setMaxPrice] = useState(85);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('הכל');
  const [onlyAvailableTonight, setOnlyAvailableTonight] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('smart');
  const [selectedMapSitterId, setSelectedMapSitterId] = useState<string>(
    sitters[0]?.id ?? ''
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const resetFilters = () => {
    setMaxPrice(85);
    setSelectedSkills([]);
    setSelectedLanguage('הכל');
    setOnlyAvailableTonight(false);
    setSortBy('smart');
  };

  const filteredSitters = useMemo(() => {
    const list = sitters.filter((s) => {
      if (s.hourlyRate > maxPrice) return false;
      if (onlyAvailableTonight && !s.availableTonight) return false;
      if (selectedLanguage !== 'הכל' && !s.languages.includes(selectedLanguage)) {
        return false;
      }
      if (
        selectedSkills.length > 0 &&
        !selectedSkills.every((sk) => s.skills.includes(sk))
      ) {
        return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distanceKm - b.distanceKm;
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'reliability':
          return b.reliability - a.reliability;
        case 'smart':
        default:
          return b.smartScore - a.smartScore;
      }
    });
  }, [sitters, maxPrice, onlyAvailableTonight, selectedLanguage, selectedSkills, sortBy]);

  const activeMapSitter =
    filteredSitters.find((s) => s.id === selectedMapSitterId) ?? filteredSitters[0];

  const handleSaveSearch = () => {
    onNotify('שמירת החיפוש בוצעה. נעדכן כשיש התאמות חדשות.');
  };

  return (
    <div className="space-y-5">
      {/* Top Search & Mode Switcher */}
      <section className="glass-card rounded-3xl border p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#222222]">
              חיפוש בייביסיטר באזורך
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              מתי צריך בייביסיטר? סנני לפי שעות, תעריף וכישורים מאומתים
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Map / List Toggle */}
            <div
              className="inline-flex items-center p-1 bg-slate-100 rounded-xl"
              role="group"
              aria-label="מתג תצוגת מפה או רשימה"
            >
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`min-h-[40px] px-3.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'list'
                    ? 'bg-white text-[#1A73E8] shadow-xs'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                <List className="w-4 h-4" />
                <span>רשימה</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`min-h-[40px] px-3.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'map'
                    ? 'bg-white text-[#1A73E8] shadow-xs'
                    : 'text-slate-600 hover:text-[#222222]'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span>מפה</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`min-h-[44px] px-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                showFilters
                  ? 'border-[#1A73E8] bg-[#1A73E8]/5 text-[#1A73E8]'
                  : 'border-slate-200 text-[#222222] hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>סינון</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSearch}
              className="min-h-[44px] px-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-[#222222] hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="שמירת חיפוש להתראות"
            >
              <Bookmark className="w-4 h-4 text-[#1A73E8]" />
              <span className="hidden sm:inline">שמור חיפוש</span>
            </button>
          </div>
        </div>

        {/* Date, Time & Price Controls */}
        {showFilters && (
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  מתי צריך בייביסיטר? (תאריך)
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    משעה
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm text-[#222222] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
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
                    className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm text-[#222222] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>טווח מחיר מקסימלי לשעה</span>
                  <span className="font-bold text-[#1A73E8] tabular-nums">
                    עד ₪{maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={90}
                  step={5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 mt-3 accent-[#1A73E8] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  שפה מועדפת
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#FAFAFA] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                >
                  <option value="הכל">כל השפות</option>
                  {ALL_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Skill Filter Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  כישורים והסמכות:
                </span>
                <button
                  type="button"
                  onClick={() => setOnlyAvailableTonight((v) => !v)}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    onlyAvailableTonight
                      ? 'bg-[#34A853]/10 border-[#34A853] text-[#34A853]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {onlyAvailableTonight && <Check className="w-3.5 h-3.5" />}
                  <span>זמינות הערב בלבד</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                          : 'bg-[#FAFAFA] border-slate-200 text-[#222222] hover:border-slate-300'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sort & Count Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Search className="w-4 h-4 text-[#1A73E8]" />
            <span className="font-semibold text-[#222222] tabular-nums">
              {filteredSitters.length} תוצאות זמינות בגוש דן
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">מיון לפי:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
              {(
                [
                  { id: 'smart', label: 'Smart Rank' },
                  { id: 'distance', label: 'מרחק' },
                  { id: 'price', label: 'מחיר' },
                  { id: 'reliability', label: 'אמינות' },
                ] as { id: SortOption; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  className={`min-h-[34px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-white text-[#1A73E8] shadow-xs'
                      : 'text-slate-600 hover:text-[#222222]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredSitters.length === 0 ? (
        <div className="glass-card rounded-3xl border p-10 text-center space-y-4 shadow-sm">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-[#222222]">
              לא נמצאו התאמות לפי הסינון שבחרת
            </h2>
            <p className="text-sm text-slate-600">
              הצעה: נסו להרחיב את טווח הזמן, להעלות מעט את המחיר המרבי או להסיר חלק מהכישורים.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold hover:bg-[#1557B0] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>איפוס מסננים</span>
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSitters.map((sitter) => (
            <SitterCard
              key={sitter.id}
              sitter={sitter}
              onSelect={onSelectSitter}
              variant="detailed"
            />
          ))}
        </div>
      ) : (
        /* Map View (Interactive Gush Dan Vector Map + Preview Card) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-2 glass-card rounded-3xl border overflow-hidden relative min-h-[380px] sm:min-h-[440px] shadow-sm">
            {/* Stylized Gush Dan Map SVG */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full min-h-[380px] sm:min-h-[440px] bg-[#EEF3F8]"
              preserveAspectRatio="xMidYMid slice"
              aria-label="מפת בייביסיטריות באזור גוש דן"
            >
              {/* Coastline / Sea on the West (left side in map coordinates) */}
              <path
                d="M0,0 L16,0 C14,25 12,55 10,80 L0,80 Z"
                fill="#D5E7FA"
              />
              {/* Yarkon Park / River */}
              <path
                d="M14,24 Q45,19 88,26"
                fill="none"
                stroke="#B9DEC6"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M14,24 Q45,19 88,26"
                fill="none"
                stroke="#A5D4F7"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Ayalon Highway & Major Roads */}
              <path
                d="M44,0 L42,80"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
              />
              <path
                d="M15,48 L95,44"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.6"
              />
              <path
                d="M22,64 L85,32"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.1"
              />
              <path
                d="M60,15 L66,75"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.1"
              />

              {/* Neighborhood Labels */}
              <text x="27" y="18" fontSize="2.8" fill="#5F6B7A" fontWeight="600">
                הצפון הישן
              </text>
              <text x="24" y="45" fontSize="3.2" fill="#4B5563" fontWeight="700">
                תל אביב
              </text>
              <text x="53" y="61" fontSize="2.9" fill="#4B5563" fontWeight="700">
                גבעתיים
              </text>
              <text x="67" y="38" fontSize="3.2" fill="#4B5563" fontWeight="700">
                רמת גן
              </text>
              <text x="74" y="70" fontSize="2.7" fill="#5F6B7A" fontWeight="600">
                מרום נווה
              </text>

              {/* Parent Home Approximate Area Radius */}
              <circle
                cx="62"
                cy="50"
                r="10"
                fill="#1A73E8"
                fillOpacity="0.08"
                stroke="#1A73E8"
                strokeOpacity="0.3"
                strokeDasharray="1.5 1.5"
                strokeWidth="0.4"
              />
              <circle cx="62" cy="50" r="1.6" fill="#1A73E8" />
            </svg>

            {/* Map Legend Top-Right */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 shadow-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>המיקום הכללי שלך: רמת גן · מרום נווה</span>
            </div>

            {/* Interactive Sitter Pins */}
            {filteredSitters.map((sitter) => {
              const isSelected = activeMapSitter?.id === sitter.id;
              return (
                <button
                  key={sitter.id}
                  type="button"
                  onClick={() => setSelectedMapSitterId(sitter.id)}
                  style={{
                    left: `${sitter.mapCoords.x}%`,
                    top: `${sitter.mapCoords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[38px] px-3 py-1 rounded-full font-display font-bold text-xs tabular-nums shadow-md transition-transform cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1A73E8] text-white scale-110 z-20 ring-4 ring-[#1A73E8]/25'
                      : 'bg-white text-[#222222] border border-slate-300 hover:scale-105 z-10'
                  }`}
                >
                  <span>₪{sitter.hourlyRate}</span>
                  <span className="font-sans font-medium opacity-90">
                    {sitter.firstName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Pin Sitter Preview Panel */}
          {activeMapSitter && (
            <div className="glass-card rounded-3xl border p-5 flex flex-col justify-between gap-4 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <AvatarWithFallback
                    src={activeMapSitter.photo}
                    alt={activeMapSitter.firstName}
                    name={activeMapSitter.firstName}
                    className="w-16 h-16 rounded-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-lg text-[#222222]">
                        {activeMapSitter.firstName} {activeMapSitter.lastInitial}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-[#34A853]" />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {activeMapSitter.city} · {activeMapSitter.neighborhood} ({activeMapSitter.distanceKm} ק״מ)
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold tabular-nums">
                      <span className="text-[#34A853]">
                        אמינות {activeMapSitter.reliability}%
                      </span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#222222]">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        {activeMapSitter.rating.toFixed(1)} ({activeMapSitter.completedJobs})
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {activeMapSitter.bio}
                </p>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="font-semibold text-[#222222]">כישורים: </span>
                    {activeMapSitter.skills.join(' · ')}
                  </div>
                  <div>
                    <span className="font-semibold text-[#222222]">שפות: </span>
                    {activeMapSitter.languages.join(', ')}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">תעריף בסיס</span>
                  <span className="font-display font-bold text-lg text-[#1A73E8] tabular-nums">
                    ₪{activeMapSitter.hourlyRate}/שעה
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectSitter(activeMapSitter)}
                    className="min-h-[44px] px-3 rounded-xl border border-slate-200 text-sm font-semibold text-[#222222] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    פרופיל מלא
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookSitter(activeMapSitter)}
                    className="min-h-[44px] px-3 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold hover:bg-[#1557B0] transition-colors cursor-pointer"
                  >
                    הזמן עכשיו
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
