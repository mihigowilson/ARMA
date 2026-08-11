import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ModelProfile, AgencyProfile } from '../../types/arma';
import {
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Ruler,
  Eye,
  FileText,
  Building2,
  UserCheck,
  User,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X,
  Footprints,
  Award,
  Sparkles,
  Scissors,
  Briefcase
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { models, agencies, setSelectedModelModal, setSelectedAgencyModal } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'models' | 'agencies' | 'scouts'>('models');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Advanced Measurement Filters
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [minHeight, setMinHeight] = useState<number>(150);
  const [maxHeight, setMaxHeight] = useState<number>(210);
  const [minWaist, setMinWaist] = useState<number>(50);
  const [maxWaist, setMaxWaist] = useState<number>(110);
  const [selectedShoeSize, setSelectedShoeSize] = useState<string>('All');

  // Experience Filters
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>('All');
  const [minExperienceYears, setMinExperienceYears] = useState<number>(0);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('All');
    setSelectedCategory('All');
    setSelectedGender('All');
    setVerifiedOnly(false);
    setMinHeight(150);
    setMaxHeight(210);
    setMinWaist(50);
    setMaxWaist(110);
    setSelectedShoeSize('All');
    setSelectedExperienceLevel('All');
    setMinExperienceYears(0);
  };

  // Check how many advanced filters are active
  const activeAdvancedCount = [
    minHeight > 150 || maxHeight < 210,
    minWaist > 50 || maxWaist < 110,
    selectedShoeSize !== 'All',
    selectedExperienceLevel !== 'All',
    minExperienceYears > 0,
    selectedGender !== 'All',
    verifiedOnly
  ].filter(Boolean).length;

  // Filter Models
  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.stageName && m.stageName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.agencyName && m.agencyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.achievements && m.achievements.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesProvince = selectedProvince === 'All' || m.province === selectedProvince;
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesGender = selectedGender === 'All' || m.gender === selectedGender;
    const matchesVerified = !verifiedOnly || m.verifiedBadge;

    // Physical Measurements
    const matchesHeight = m.measurements.heightCm >= minHeight && m.measurements.heightCm <= maxHeight;
    const modelWaist = m.measurements.waistCm || 65;
    const matchesWaist = modelWaist >= minWaist && modelWaist <= maxWaist;
    const matchesShoe = selectedShoeSize === 'All' || m.measurements.shoeSizeEu.toString() === selectedShoeSize;

    // Experience Filters
    const matchesMinExpYears = m.experienceYears >= minExperienceYears;
    let matchesExpLevel = true;
    if (selectedExperienceLevel === 'New Face (0-1 yrs)') {
      matchesExpLevel = m.experienceYears <= 1;
    } else if (selectedExperienceLevel === 'Intermediate (2-3 yrs)') {
      matchesExpLevel = m.experienceYears >= 2 && m.experienceYears <= 3;
    } else if (selectedExperienceLevel === 'Professional (4-6 yrs)') {
      matchesExpLevel = m.experienceYears >= 4 && m.experienceYears <= 6;
    } else if (selectedExperienceLevel === 'Veteran (7+ yrs)') {
      matchesExpLevel = m.experienceYears >= 7;
    }

    return (
      matchesSearch &&
      matchesProvince &&
      matchesCategory &&
      matchesGender &&
      matchesVerified &&
      matchesHeight &&
      matchesWaist &&
      matchesShoe &&
      matchesMinExpYears &&
      matchesExpLevel
    );
  });

  // Filter Agencies
  const filteredAgencies = agencies.filter((a) => {
    const matchesSearch =
      a.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ceoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === 'All' || a.province === selectedProvince;
    const matchesVerified = !verifiedOnly || a.verified;

    return matchesSearch && matchesProvince && matchesVerified;
  });

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <Search className="w-3.5 h-3.5 text-[#00A1DE]" />
            OFFICIAL ARMA NATIONAL REGISTRY
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            National Talent Directory
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Search, filter, and inspect verified Rwandan models by physical measurements, experience levels, licensed modeling agencies, and certified talent scouts.
          </p>
        </div>

        {/* Directory Tab Switcher */}
        <div className="flex justify-center">
          <div className="p-1.5 rounded-2xl bg-slate-200 dark:bg-[#1E2630] border border-slate-300 dark:border-slate-700 flex gap-2">
            <button
              onClick={() => setActiveTab('models')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'models'
                  ? 'bg-[#00A1DE] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Models ({filteredModels.length})
            </button>
            <button
              onClick={() => setActiveTab('agencies')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'agencies'
                  ? 'bg-[#00A1DE] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Agencies ({filteredAgencies.length})
            </button>
            <button
              onClick={() => setActiveTab('scouts')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'scouts'
                  ? 'bg-[#00A1DE] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Certified Scouts
            </button>
          </div>
        </div>

        {/* Search & Main Filter Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === 'models'
                    ? 'Search models by name, stage name, agency, location...'
                    : 'Search agencies by name, CEO, city...'
                }
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00A1DE]"
              />
            </div>

            {/* Province Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-[#00A1DE]"
              >
                <option value="All">All Provinces</option>
                <option value="Kigali City">Kigali City</option>
                <option value="Northern Province">Northern Province</option>
                <option value="Southern Province">Southern Province</option>
                <option value="Eastern Province">Eastern Province</option>
                <option value="Western Province">Western Province</option>
              </select>
            </div>

            {/* Category Filter (Models tab) */}
            {activeTab === 'models' && (
              <div className="w-full md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-[#00A1DE]"
                >
                  <option value="All">All Categories</option>
                  <option value="High Fashion">High Fashion</option>
                  <option value="Runway">Runway</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Editorial">Editorial</option>
                </select>
              </div>
            )}

            {/* Toggle Advanced Filters Button */}
            {activeTab === 'models' && (
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`w-full md:w-auto px-5 py-3 rounded-2xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
                  showAdvanced || activeAdvancedCount > 0
                    ? 'bg-[#00A1DE] text-white border-[#00A1DE] shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Measurements & Experience</span>
                {activeAdvancedCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-[#00A1DE] text-[10px] font-extrabold flex items-center justify-center shadow">
                    {activeAdvancedCount}
                  </span>
                )}
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Advanced Physical Measurement & Experience Filters Panel */}
          {activeTab === 'models' && showAdvanced && (
            <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00A1DE] uppercase tracking-wider">
                  <Ruler className="w-4 h-4 text-[#FAD201]" />
                  ADVANCED PHYSICAL MEASUREMENTS & EXPERIENCE FILTERS
                </div>

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All Filters
                </button>
              </div>

              {/* Grid of Measurements & Experience Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                {/* 1. Height Filter Range (cm) */}
                <div className="space-y-3">
                  <label className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#00A1DE]" /> Height Range
                    </span>
                    <span className="text-[#00A1DE] font-bold">{minHeight} - {maxHeight} cm</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono w-8">Min:</span>
                      <input
                        type="range"
                        min="150"
                        max="200"
                        value={minHeight}
                        onChange={(e) => setMinHeight(Number(e.target.value))}
                        className="w-full accent-[#00A1DE]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono w-8">Max:</span>
                      <input
                        type="range"
                        min="160"
                        max="210"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(Number(e.target.value))}
                        className="w-full accent-[#00A1DE]"
                      />
                    </div>
                  </div>
                  {/* Height Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      onClick={() => { setMinHeight(150); setMaxHeight(172); }}
                      className="px-2 py-1 rounded-md text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#00A1DE]"
                    >
                      Petite (&lt;172cm)
                    </button>
                    <button
                      onClick={() => { setMinHeight(175); setMaxHeight(185); }}
                      className="px-2 py-1 rounded-md text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#00A1DE]"
                    >
                      Runway (175-185cm)
                    </button>
                    <button
                      onClick={() => { setMinHeight(185); setMaxHeight(210); }}
                      className="px-2 py-1 rounded-md text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#00A1DE]"
                    >
                      Tall (185cm+)
                    </button>
                  </div>
                </div>

                {/* 2. Waist Size Filter Range (cm) */}
                <div className="space-y-3">
                  <label className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#FAD201]" /> Waist Measurement
                    </span>
                    <span className="text-[#FAD201] font-bold">{minWaist} - {maxWaist} cm</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono w-8">Min:</span>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        value={minWaist}
                        onChange={(e) => setMinWaist(Number(e.target.value))}
                        className="w-full accent-[#FAD201]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono w-8">Max:</span>
                      <input
                        type="range"
                        min="55"
                        max="110"
                        value={maxWaist}
                        onChange={(e) => setMaxWaist(Number(e.target.value))}
                        className="w-full accent-[#FAD201]"
                      />
                    </div>
                  </div>
                  {/* Waist Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      onClick={() => { setMinWaist(50); setMaxWaist(65); }}
                      className="px-2 py-1 rounded-md text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#FAD201]"
                    >
                      Slim (&lt;65cm)
                    </button>
                    <button
                      onClick={() => { setMinWaist(65); setMaxWaist(75); }}
                      className="px-2 py-1 rounded-md text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#FAD201]"
                    >
                      Commercial (65-75cm)
                    </button>
                    <button
                      onClick={() => { setMinWaist(76); setMaxWaist(110); }}
                      className="px-2 py-1 rounded-md text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#FAD201]"
                    >
                      Curve/Fit (76cm+)
                    </button>
                  </div>
                </div>

                {/* 3. Shoe Size Filter (EU) */}
                <div className="space-y-3">
                  <label className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Footprints className="w-3.5 h-3.5 text-emerald-500" /> Shoe Size (EU)
                    </span>
                    <span className="text-emerald-500 font-bold">{selectedShoeSize === 'All' ? 'All EU Sizes' : `EU ${selectedShoeSize}`}</span>
                  </label>

                  <select
                    value={selectedShoeSize}
                    onChange={(e) => setSelectedShoeSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold focus:outline-none focus:border-[#00A1DE]"
                  >
                    <option value="All">All EU Sizes</option>
                    {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((size) => (
                      <option key={size} value={size}>
                        EU Size {size}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {['All', '37', '38', '39', '40', '43', '44', '45'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedShoeSize(sz)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          selectedShoeSize === sz
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {sz === 'All' ? 'All' : `EU ${sz}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Specific Experience Level Filter */}
                <div className="space-y-3">
                  <label className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#00A1DE]" /> Experience Level
                    </span>
                    <span className="text-[#00A1DE] font-bold">{minExperienceYears}+ Yrs</span>
                  </label>

                  <select
                    value={selectedExperienceLevel}
                    onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold focus:outline-none focus:border-[#00A1DE]"
                  >
                    <option value="All">All Experience Levels</option>
                    <option value="New Face (0-1 yrs)">New Face / Emerging (0 - 1 yrs)</option>
                    <option value="Intermediate (2-3 yrs)">Intermediate (2 - 3 yrs)</option>
                    <option value="Professional (4-6 yrs)">Professional (4 - 6 yrs)</option>
                    <option value="Veteran (7+ yrs)">Veteran / Master (7+ yrs)</option>
                  </select>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">Min Yrs:</span>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={minExperienceYears}
                      onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                      className="w-full accent-[#00A1DE]"
                    />
                    <span className="text-xs font-bold text-[#00A1DE] font-mono">{minExperienceYears}y</span>
                  </div>
                </div>
              </div>

              {/* Gender & Verified Options Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-semibold">Gender Identity:</span>
                  {['All', 'Female', 'Male', 'Non-Binary'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`px-3 py-1 rounded-xl border transition-all ${
                        selectedGender === g
                          ? 'bg-[#00A1DE] text-white border-[#00A1DE] font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-[#00A1DE] focus:ring-[#00A1DE]"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20603D]" /> ARMA Verified Only
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Active Filters Pill Bar */}
          {activeTab === 'models' && activeAdvancedCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Active Filters:</span>
              {minHeight > 150 || maxHeight < 210 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-semibold">
                  Height: {minHeight}-{maxHeight}cm
                  <button onClick={() => { setMinHeight(150); setMaxHeight(210); }}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
              {minWaist > 50 || maxWaist < 110 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAD201]/20 text-[#00A1DE] dark:text-[#FAD201] text-xs font-mono font-semibold">
                  Waist: {minWaist}-{maxWaist}cm
                  <button onClick={() => { setMinWaist(50); setMaxWaist(110); }}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
              {selectedShoeSize !== 'All' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                  Shoe: EU {selectedShoeSize}
                  <button onClick={() => setSelectedShoeSize('All')}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
              {selectedExperienceLevel !== 'All' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-mono font-semibold">
                  Exp: {selectedExperienceLevel}
                  <button onClick={() => setSelectedExperienceLevel('All')}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
              {minExperienceYears > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
                  Min Exp: {minExperienceYears}y+
                  <button onClick={() => setMinExperienceYears(0)}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
              {selectedGender !== 'All' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
                  Gender: {selectedGender}
                  <button onClick={() => setSelectedGender('All')}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
              {verifiedOnly ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#20603D]/20 text-[#20603D] dark:text-emerald-400 text-xs font-mono font-semibold">
                  Verified Only
                  <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Models Grid */}
        {activeTab === 'models' && (
          <>
            {filteredModels.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-w-lg mx-auto">
                <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <h3 className="text-xl font-serif font-bold">No Models Match Criteria</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No verified models match your specific combination of height, waist size, shoe size, or experience level filters. Try broadening your measurement parameters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#00A1DE] text-white text-xs font-bold font-mono inline-flex items-center gap-2 hover:bg-[#0081B3] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Measurement Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className="group rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                      <img
                        src={model.photos.headshot}
                        alt={model.fullName}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#00A1DE] text-white shadow">
                          {model.category}
                        </span>
                        {model.verifiedBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-[#20603D] text-white flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-3 h-3 text-[#FAD201]" /> Verified
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-serif font-bold tracking-tight">
                          {model.fullName}
                        </h3>
                        <p className="text-[11px] text-slate-300 font-mono">
                          {model.agencyName || 'Independent Model'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Location & Experience Header */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#00A1DE]" />
                          {model.province}
                        </span>
                        <span className="flex items-center gap-1 text-[#00A1DE] font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-[#FAD201]" />
                          {model.experienceYears}y Exp
                        </span>
                      </div>

                      {/* Detailed Physical Measurements Bar */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1 text-center font-mono">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Height</span>
                          <strong className="text-xs text-slate-900 dark:text-white font-bold">{model.measurements.heightCm}cm</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Waist</span>
                          <strong className="text-xs text-slate-900 dark:text-white font-bold">{model.measurements.waistCm || 65}cm</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Shoe</span>
                          <strong className="text-xs text-slate-900 dark:text-white font-bold">EU {model.measurements.shoeSizeEu}</strong>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedModelModal(model)}
                          className="flex-1 py-2 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Portfolio
                        </button>
                        <button
                          onClick={() => setSelectedModelModal(model)}
                          className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                          title="Comp Card"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#FAD201]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Agencies Grid */}
        {activeTab === 'agencies' && (
          <>
            {filteredAgencies.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-w-lg mx-auto">
                <Building2 className="w-12 h-12 text-[#00A1DE] mx-auto opacity-70" />
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                  No Licensed Agencies Currently Listed
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  There are currently no registered modeling agencies listed in the official directory. Rwandan agency CEOs can apply for official ARMA accreditation and license registration through the portal.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={agency.logo}
                        alt={agency.agencyName}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                            {agency.agencyName}
                          </h3>
                          {agency.verified && (
                            <CheckCircle2 className="w-4 h-4 text-[#20603D]" />
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#00A1DE] mt-0.5">
                          License: {agency.licenseNumber}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          CEO: <strong>{agency.ceoName}</strong> • Location: {agency.province}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {agency.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                      <span className="text-slate-500">
                        Represented Models: <strong className="text-[#00A1DE]">{agency.representedModelsCount}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedAgencyModal(agency)}
                        className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors"
                      >
                        Agency Dossier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Scouts View */}
        {activeTab === 'scouts' && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6 text-center">
            <UserCheck className="w-12 h-12 text-[#20603D] mx-auto" />
            <h3 className="text-2xl font-serif font-bold">ARMA Official Scouting Network</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
              Scouts operating on behalf of ARMA must possess an active ARMA Certified Scout Code. Beware of fraudulent talent agents. Always demand scout credential verification.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20603D]/10 text-[#20603D] text-xs font-mono font-bold">
              Verification Code Hotline: +250 788 123 456
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

