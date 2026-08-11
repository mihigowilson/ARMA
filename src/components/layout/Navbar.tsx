import React, { useState, useRef, useEffect } from 'react';
import { ArmaLogo } from './ArmaLogo';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Search,
  Calendar,
  Briefcase,
  FileText,
  Award,
  BookOpen,
  Info,
  PhoneCall,
  Menu,
  X,
  ShieldCheck,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Grid,
  ArrowRight,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAuthModal }) => {
  const { user, isDarkMode, themeMode, setThemeMode, toggleDarkMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'directory', label: 'Directory', icon: Search },
    { id: 'castings', label: 'Castings', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  const resourceItems = [
    { id: 'membership', label: 'Membership', desc: 'Category tiers & benefits', icon: UserIcon },
    { id: 'certification', label: 'Certificates', desc: 'Accreditation verification', icon: Award },
    { id: 'documents', label: 'Documents & Guidelines', desc: 'Code of conduct & files', icon: FileText },
    { id: 'news', label: 'News & Media', desc: 'Industry announcements', icon: BookOpen },
  ];

  const aboutItems = [
    { id: 'about', label: 'About ARMA', desc: 'Executive Board & Vision', icon: Info },
    { id: 'security', label: 'Security & Terms', desc: 'Governance & Privacy', icon: ShieldCheck },
    { id: 'contact', label: 'Contact Us', desc: 'Secretariat Headquarters', icon: PhoneCall },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
    setAboutDropdownOpen(false);
    setMegaMenuOpen(false);
  };

  const isResourceActive = resourceItems.some(i => i.id === currentTab);
  const isAboutActive = aboutItems.some(i => i.id === currentTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#12161A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top National Ribbon - Rwanda Flag Colors (#00A1DE Blue, #FAD201 Yellow, #20603D Green) */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/2 bg-[#00A1DE]" />
        <div className="h-full w-1/4 bg-[#FAD201]" />
        <div className="h-full w-1/4 bg-[#20603D]" />
      </div>

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <div onClick={() => handleNavClick('home')} className="cursor-pointer shrink-0">
            <ArmaLogo size="md" />
          </div>

          {/* Desktop Navigation - Streamlined & Dropdown-based to avoid overflow */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#00A1DE] font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
            >
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isResourceActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#00A1DE] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#1E2630] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 mb-1">
                    Industry Resources
                  </div>
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                          isActive
                            ? 'bg-[#00A1DE]/10 text-[#00A1DE]'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-[#00A1DE] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-[#00A1DE]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight">{item.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About ARMA Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isAboutActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#00A1DE] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>About</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#1E2630] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 mb-1">
                    Governance & Info
                  </div>
                  {aboutItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                          isActive
                            ? 'bg-[#00A1DE]/10 text-[#00A1DE]'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-[#00A1DE] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-[#00A1DE]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight">{item.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Mega Menu Trigger Button */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  megaMenuOpen
                    ? 'bg-[#00A1DE] text-white border-[#00A1DE]'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#00A1DE]'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Mega Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Mega Menu Dropdown Container */}
              {megaMenuOpen && (
                <div className="absolute top-full right-0 lg:-right-32 mt-2 w-[720px] max-w-[90vw] bg-white dark:bg-[#12161A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-slate-800 dark:text-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE]">
                        <Grid className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base">ARMA Portal Directory & Navigation</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Complete access to models, castings, regulations & secretariats</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#20603D]/10 text-[#20603D] dark:text-emerald-400 font-bold border border-[#20603D]/20">
                      Official Portal
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Category 1 */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-[#00A1DE]" /> Core Portals
                      </h5>
                      <div className="space-y-1">
                        {mainNavItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between group transition-colors ${
                              currentTab === item.id
                                ? 'bg-[#00A1DE]/10 text-[#00A1DE]'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00A1DE]" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category 2 */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#FAD201]" /> Resources & Standards
                      </h5>
                      <div className="space-y-1">
                        {resourceItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between group transition-colors ${
                              currentTab === item.id
                                ? 'bg-[#00A1DE]/10 text-[#00A1DE]'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00A1DE]" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category 3 */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#20603D]" /> Governance & Legal
                      </h5>
                      <div className="space-y-1">
                        {aboutItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between group transition-colors ${
                              currentTab === item.id
                                ? 'bg-[#00A1DE]/10 text-[#00A1DE]'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00A1DE]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Sparkles className="w-4 h-4 text-[#FAD201]" />
                      <span>Current Portal Role: <strong className="text-slate-900 dark:text-white">{user ? user.role : 'Guest Visitor'}</strong></span>
                    </div>

                    {user ? (
                      <button
                        onClick={() => { setCurrentTab(user.role === 'Admin' ? 'admin' : 'dashboard'); setMegaMenuOpen(false); }}
                        className="px-4 py-1.5 rounded-xl bg-[#00A1DE] text-white font-semibold text-xs hover:bg-[#0081B3] transition-all shadow"
                      >
                        {user.role === 'Admin' ? 'Admin Dashboard' : 'My User Portal'}
                      </button>
                    ) : (
                      <button
                        onClick={() => { openAuthModal(); setMegaMenuOpen(false); }}
                        className="px-4 py-1.5 rounded-xl bg-[#00A1DE] text-white font-semibold text-xs hover:bg-[#0081B3] transition-all shadow"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Global Theme Mode Selector Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700/60 shadow-xs"
                title={`Current Theme: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode`}
                aria-label="Toggle system, light, or dark theme"
              >
                {themeMode === 'system' ? (
                  <Monitor className="w-4 h-4 text-[#00A1DE]" />
                ) : themeMode === 'dark' ? (
                  <Moon className="w-4 h-4 text-[#FAD201]" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold capitalize hidden xl:inline">{themeMode}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#1E252B] border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                    Theme Preferences
                  </div>
                  <button
                    onClick={() => { setThemeMode('light'); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      themeMode === 'light'
                        ? 'bg-[#00A1DE]/10 text-[#00A1DE] font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                    </span>
                    {themeMode === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-[#00A1DE]" />}
                  </button>

                  <button
                    onClick={() => { setThemeMode('dark'); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      themeMode === 'dark'
                        ? 'bg-[#00A1DE]/10 text-[#00A1DE] font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-[#FAD201]" /> Dark Mode
                    </span>
                    {themeMode === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-[#00A1DE]" />}
                  </button>

                  <button
                    onClick={() => { setThemeMode('system'); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      themeMode === 'system'
                        ? 'bg-[#00A1DE]/10 text-[#00A1DE] font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-[#00A1DE]" /> System Auto
                    </span>
                    {themeMode === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-[#00A1DE]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Account / Dashboard Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab(user.role === 'Admin' ? 'admin' : 'dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#00A1DE] text-white hover:bg-[#0081B3] transition-all shadow-md shadow-[#00A1DE]/20 whitespace-nowrap"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {user.role === 'Admin' ? 'Admin Panel' : 'My Portal'}
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#00A1DE] text-white hover:bg-[#0081B3] transition-all shadow-md shadow-[#00A1DE]/20 flex items-center gap-2 whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4" />
                Sign In / Join
              </button>
            )}
          </div>

          {/* Mobile & Medium Screen Hamburger Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Toggle theme mode"
              title={`Theme: ${themeMode}`}
            >
              {themeMode === 'system' ? (
                <Monitor className="w-5 h-5 text-[#00A1DE]" />
              ) : isDarkMode ? (
                <Sun className="w-5 h-5 text-[#FAD201]" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161A] px-4 pt-3 pb-8 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Quick theme mode segmented selector for mobile */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Appearance Theme</span>
              <span className="text-[10px] font-mono font-bold text-[#00A1DE] uppercase">{themeMode} mode</span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200 dark:bg-slate-900 rounded-xl text-xs font-medium">
              <button
                onClick={() => setThemeMode('light')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#FAD201]" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-[#00A1DE]" />
                <span>System</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Main Portals</div>
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                  currentTab === item.id
                    ? 'bg-[#00A1DE]/10 text-[#00A1DE] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Resources & Standards</div>
            {resourceItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    currentTab === item.id
                      ? 'bg-[#00A1DE]/10 text-[#00A1DE] font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#00A1DE]" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Governance & Legal</div>
            {aboutItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    currentTab === item.id
                      ? 'bg-[#00A1DE]/10 text-[#00A1DE] font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#20603D]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <button
                onClick={() => { setCurrentTab(user.role === 'Admin' ? 'admin' : 'dashboard'); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-xl bg-[#00A1DE] text-white text-center font-bold text-sm shadow-md"
              >
                {user.role === 'Admin' ? 'Open Admin Control Center' : 'Access My User Portal'}
              </button>
            ) : (
              <button
                onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-xl bg-[#00A1DE] text-white text-center font-bold text-sm shadow-md"
              >
                Sign In / Join Association
              </button>
            )}
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Dock */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#12161A]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 lg:hidden flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
            currentTab === 'home' ? 'text-[#00A1DE] font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('directory')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
            currentTab === 'directory' ? 'text-[#00A1DE] font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Directory</span>
        </button>

        <button
          onClick={() => handleNavClick('castings')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
            currentTab === 'castings' ? 'text-[#00A1DE] font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Castings</span>
        </button>

        <button
          onClick={() => handleNavClick('events')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
            currentTab === 'events' ? 'text-[#00A1DE] font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => {
            if (user) {
              handleNavClick(user.role === 'Admin' ? 'admin' : 'dashboard');
            } else {
              openAuthModal();
            }
          }}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
            currentTab === 'dashboard' || currentTab === 'admin' ? 'text-[#00A1DE] font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>{user ? (user.role === 'Admin' ? 'Admin' : 'Portal') : 'Sign In'}</span>
        </button>
      </div>
    </header>
  );
};
