import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ModelProfile } from '../../types/arma';
import { validateData, modelProfileDossierSchema } from '../../lib/validationSchemas';
import {
  User as UserIcon,
  Briefcase,
  Award,
  FileText,
  Bell,
  Settings,
  Sparkles,
  CheckCircle2,
  Download,
  Edit,
  Save,
  QrCode,
  Building2,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Camera,
  Shield,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import QRCode from 'qrcode';
import { DigitalIdCard } from './DigitalIdCard';
import { AgencyCeoDashboard } from './AgencyCeoDashboard';
import { EmailVerificationBanner } from '../security/EmailVerificationBanner';
import { MFASettingsCard } from '../security/MFASettingsCard';
import { ImageUploader } from '../common/ImageUploader';

export const UserDashboard: React.FC = () => {
  const {
    user,
    models,
    updateModelProfile,
    updateUserProfilePicture,
    updateModelPhotosAndCompCard,
    appliedCastingIds,
    castings,
    showToast
  } = useAuth();

  // If logged in user is an Agency CEO
  if (user?.role === 'Agency') {
    return (
      <div className="py-6 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <AgencyCeoDashboard />
        </div>
      </div>
    );
  }
  
  const myModelProfile = models.find((m) => m.userId === user?.id) || models[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'compcard' | 'castings' | 'security'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Profile Edit state
  const [heightCm, setHeightCm] = useState(myModelProfile?.measurements?.heightCm || 178);
  const [bustCm, setBustCm] = useState(myModelProfile?.measurements?.bustCm || 84);
  const [waistCm, setWaistCm] = useState(myModelProfile?.measurements?.waistCm || 62);
  const [hipsCm, setHipsCm] = useState(myModelProfile?.measurements?.hipsCm || 90);
  const [bioText, setBioText] = useState(myModelProfile?.bio || '');

  // Comp card photo states
  const [headshotUrl, setHeadshotUrl] = useState(myModelProfile?.photos?.headshot || user?.avatar || '');
  const [fullBodyUrl, setFullBodyUrl] = useState(myModelProfile?.photos?.fullBody || '');
  const [runwayUrl, setRunwayUrl] = useState(myModelProfile?.photos?.runway || '');
  const [editorialUrl, setEditorialUrl] = useState(myModelProfile?.photos?.editorial || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(myModelProfile?.photos?.gallery || []);

  const [idQr, setIdQr] = useState('');

  React.useEffect(() => {
    if (user) {
      QRCode.toDataURL(`https://arma.org.rw/verify/${user.memberId}`, { margin: 1, width: 120 })
        .then((url) => setIdQr(url))
        .catch((e) => console.error(e));
    }
  }, [user]);

  React.useEffect(() => {
    if (myModelProfile) {
      setHeadshotUrl(myModelProfile.photos.headshot || user?.avatar || '');
      setFullBodyUrl(myModelProfile.photos.fullBody || '');
      setRunwayUrl(myModelProfile.photos.runway || '');
      setEditorialUrl(myModelProfile.photos.editorial || '');
      setGalleryUrls(myModelProfile.photos.gallery || []);
    }
  }, [myModelProfile, user]);

  const handleSaveProfile = () => {
    if (!myModelProfile) return;

    const validation = validateData(modelProfileDossierSchema, {
      bio: bioText,
      heightCm,
      bustCm,
      waistCm,
      hipsCm
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const updated: ModelProfile = {
      ...myModelProfile,
      bio: bioText,
      measurements: {
        ...myModelProfile.measurements,
        heightCm,
        bustCm,
        waistCm,
        hipsCm
      }
    };
    updateModelProfile(updated);
    setIsEditing(false);
  };

  const handleSaveCompCardPhotos = () => {
    if (!myModelProfile) return;
    updateModelPhotosAndCompCard(myModelProfile.id, {
      headshot: headshotUrl,
      fullBody: fullBodyUrl,
      runway: runwayUrl,
      editorial: editorialUrl,
      gallery: galleryUrls
    });
  };

  const handleUserAvatarUpload = (newAvatarUrl: string) => {
    if (newAvatarUrl) {
      updateUserProfilePicture(newAvatarUrl);
      setShowAvatarModal(false);
    }
  };

  const handleAddGalleryPhoto = (newPhotoUrl: string) => {
    if (newPhotoUrl) {
      setGalleryUrls((prev) => [...prev, newPhotoUrl]);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const myAppliedCastings = castings.filter((c) => appliedCastingIds.includes(c.id));

  return (
    <div className="py-6 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Email Verification Security Banner */}
        <EmailVerificationBanner />

        {/* Welcome Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12161A] via-[#1E2630] to-[#12161A] text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            {/* Avatar with Upload trigger */}
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <img
                src={user?.avatar || myModelProfile?.photos?.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00A1DE] shadow-xl"
              />
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5 text-[#00A1DE]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold">{user?.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-[#20603D]" />
              </div>
              <p className="text-xs font-mono text-[#00A1DE] mt-0.5">
                Role: {user?.role} • Member ID: {user?.memberId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={() => setShowAvatarModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#00A1DE]/20 hover:bg-[#00A1DE]/30 border border-[#00A1DE]/40 text-xs font-semibold text-[#00A1DE] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" /> Upload Profile Photo
            </button>
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center text-xs font-mono">
              <span className="text-slate-400 block text-[9px]">PROFILE STATUS</span>
              <strong className="text-[#FAD201] text-xs">95% Accredited</strong>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Trigger Button */}
        <div className="sm:hidden flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A1DE] animate-pulse" />
            <span className="text-xs font-serif font-bold text-slate-900 dark:text-white capitalize">
              {activeTab === 'overview' && 'Overview & Digital ID'}
              {activeTab === 'compcard' && 'Comp Card & Photos'}
              {activeTab === 'castings' && `Applications (${myAppliedCastings.length})`}
              {activeTab === 'security' && 'Security & 2FA'}
            </span>
          </div>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <Menu className="w-4 h-4" /> Menu
          </button>
        </div>

        {/* Slide-out Mobile Navigation Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#12161A] text-slate-900 dark:text-white h-full z-50 p-6 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-1 w-full bg-gradient-to-r from-[#00A1DE] via-[#FAD201] to-[#20603D] rounded-full" />
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user?.avatar || myModelProfile?.photos?.headshot}
                        alt={user?.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#00A1DE]"
                      />
                      <div>
                        <h3 className="text-sm font-serif font-bold truncate max-w-[140px]">{user?.name}</h3>
                        <p className="text-[10px] font-mono text-[#00A1DE]">Member ID: {user?.memberId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block px-1">
                    Dashboard Navigation
                  </span>

                  <button
                    onClick={() => {
                      setActiveTab('overview');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left text-xs font-semibold ${
                      activeTab === 'overview' ? 'bg-[#00A1DE] text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <UserIcon className="w-4 h-4 text-[#FAD201]" />
                      <span>Overview & Digital ID</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('compcard');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left text-xs font-semibold ${
                      activeTab === 'compcard' ? 'bg-[#00A1DE] text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#FAD201]" />
                      <span>Comp Card & Photos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('castings');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left text-xs font-semibold ${
                      activeTab === 'castings' ? 'bg-[#00A1DE] text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#FAD201]" />
                      <span>My Applications ({myAppliedCastings.length})</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('security');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left text-xs font-semibold ${
                      activeTab === 'security' ? 'bg-[#00A1DE] text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-[#FAD201]" />
                      <span>Security & 2FA</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" /> Overview & ID
          </button>
          <button
            onClick={() => setActiveTab('compcard')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'compcard' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-[#FAD201]" /> Comp Card & Photos
          </button>
          <button
            onClick={() => setActiveTab('castings')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'castings' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" /> My Applications ({myAppliedCastings.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'security' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-500" /> Security & 2FA
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {user && (
              <DigitalIdCard user={user} modelProfile={myModelProfile} showToast={showToast} />
            )}

            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-serif font-bold">Personal Dossier & Bio</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-semibold flex items-center gap-1 hover:bg-[#00A1DE]/20 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  {isEditing ? 'Cancel Edit' : 'Edit Measurements'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Biography</label>
                    <textarea
                      rows={3}
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Bust (cm)</label>
                      <input
                        type="number"
                        value={bustCm}
                        onChange={(e) => setBustCm(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Waist (cm)</label>
                      <input
                        type="number"
                        value={waistCm}
                        onChange={(e) => setWaistCm(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Hips (cm)</label>
                      <input
                        type="number"
                        value={hipsCm}
                        onChange={(e) => setHipsCm(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] flex items-center gap-1 shadow-md"
                  >
                    <Save className="w-4 h-4" /> Save Profile Updates
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{myModelProfile?.bio || 'Registered ARMA accredited talent.'}"
                  </p>

                  <div className="grid grid-cols-4 gap-2 font-mono text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div><span className="text-slate-400 block text-[9px]">HEIGHT</span><strong>{myModelProfile?.measurements?.heightCm || 178} cm</strong></div>
                    <div><span className="text-slate-400 block text-[9px]">BUST</span><strong>{myModelProfile?.measurements?.bustCm || '-'} cm</strong></div>
                    <div><span className="text-slate-400 block text-[9px]">WAIST</span><strong>{myModelProfile?.measurements?.waistCm || '-'} cm</strong></div>
                    <div><span className="text-slate-400 block text-[9px]">HIPS</span><strong>{myModelProfile?.measurements?.hipsCm || '-'} cm</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMP CARD & PHOTOS TAB */}
        {activeTab === 'compcard' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold">Comp Card Photo Portfolio Manager</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Upload official model photos for your composite card, agency castings, and client export.
                  </p>
                </div>
                <button
                  onClick={handleSaveCompCardPhotos}
                  className="px-5 py-2.5 rounded-2xl bg-[#00A1DE] text-white text-xs font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-2 shadow-lg shrink-0"
                >
                  <Save className="w-4 h-4" /> Save All Photos & Update Comp Card
                </button>
              </div>

              {/* Main Photo Uploaders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Headshot */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-slate-900 dark:text-white">Headshot Photo</span>
                    <span className="text-[10px] font-mono text-[#00A1DE]">Primary</span>
                  </div>
                  <ImageUploader
                    currentImage={headshotUrl}
                    onImageChange={(val) => setHeadshotUrl(val)}
                    aspectRatio="portrait"
                    placeholderText="Upload Headshot"
                  />
                </div>

                {/* Full Body */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-slate-900 dark:text-white">Full Body Shot</span>
                    <span className="text-[10px] font-mono text-[#FAD201]">Comp Card</span>
                  </div>
                  <ImageUploader
                    currentImage={fullBodyUrl}
                    onImageChange={(val) => setFullBodyUrl(val)}
                    aspectRatio="portrait"
                    placeholderText="Upload Full Body"
                  />
                </div>

                {/* Runway Photo */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-slate-900 dark:text-white">Runway Action</span>
                    <span className="text-[10px] font-mono text-[#20603D]">High Fashion</span>
                  </div>
                  <ImageUploader
                    currentImage={runwayUrl}
                    onImageChange={(val) => setRunwayUrl(val)}
                    aspectRatio="portrait"
                    placeholderText="Upload Runway Photo"
                  />
                </div>

                {/* Editorial Photo */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-slate-900 dark:text-white">Editorial / Print</span>
                    <span className="text-[10px] font-mono text-purple-400">Magazine</span>
                  </div>
                  <ImageUploader
                    currentImage={editorialUrl}
                    onImageChange={(val) => setEditorialUrl(val)}
                    aspectRatio="portrait"
                    placeholderText="Upload Editorial Photo"
                  />
                </div>
              </div>

              {/* Gallery / Portfolio Photos */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-serif font-bold">Comp Card Gallery Shots</h4>
                    <p className="text-xs text-slate-500">Additional portfolio photos included on your digital Comp Card export.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#00A1DE]">{galleryUrls.length} Photos</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleryUrls.map((gUrl, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-[3/4] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                      <img src={gUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                        title="Remove Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add New Gallery Photo Slot */}
                  <div className="aspect-[3/4]">
                    <ImageUploader
                      onImageChange={handleAddGalleryPhoto}
                      aspectRatio="portrait"
                      placeholderText="Add Gallery Photo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Castings Applications Tab */}
        {activeTab === 'castings' && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-serif font-bold">Applied Casting Calls</h3>
            {myAppliedCastings.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No active casting applications found.</p>
            ) : (
              <div className="space-y-3">
                {myAppliedCastings.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold font-serif text-sm">{c.title}</h4>
                      <span className="text-[#00A1DE] font-mono">{c.organizerName} • {c.location}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#20603D]/10 text-[#20603D] font-mono font-bold">
                      Under Review
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECURITY & MFA TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <MFASettingsCard />
          </div>
        )}

        {/* PROFILE PICTURE MODAL */}
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center mx-auto mb-2 border border-[#00A1DE]/20">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold">Update Profile Avatar</h3>
                <p className="text-xs text-slate-500">
                  Select an image from your device or paste a web image URL.
                </p>
              </div>

              <div className="py-2">
                <ImageUploader
                  currentImage={user?.avatar}
                  onImageChange={handleUserAvatarUpload}
                  aspectRatio="square"
                  rounded="2xl"
                  placeholderText="Click to upload new avatar"
                />
              </div>

              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
