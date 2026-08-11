import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ModelProfile, AgencyProfile } from '../../types/arma';
import {
  validateData,
  agencyRegisterModelSchema,
  agencyCeoQuestionsSchema,
  castingCallSchema,
  agencyInviteSchema
} from '../../lib/validationSchemas';
import {
  Building2,
  Users,
  Briefcase,
  Plus,
  UserPlus,
  UserMinus,
  CheckCircle2,
  HelpCircle,
  Save,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  Mail,
  Clock,
  Eye,
  X,
  Menu,
  ChevronRight,
  Lock,
  Camera
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';

export const AgencyCeoDashboard: React.FC = () => {
  const {
    user,
    agencies,
    models,
    castings,
    addModelToAgency,
    removeModelFromAgency,
    updateModelProfile,
    updateAgencyProfile,
    addCasting,
    emailNotifications,
    setSelectedEmailModal,
    markEmailAsRead,
    showToast,
    setSelectedModelModal,
    updateModelPhotosAndCompCard
  } = useAuth();

  // Strictly find agency matching user's agencyId, user id, or CEO email (DO NOT fallback to another agency)
  const myAgency: AgencyProfile | undefined = agencies.find(
    (a) =>
      a.id === user?.agencyId ||
      a.userId === user?.id ||
      (user?.email && a.email.toLowerCase() === user.email.toLowerCase())
  );

  if (!myAgency) {
    return (
      <div className="py-12 px-4 max-w-3xl mx-auto text-center space-y-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center mx-auto border border-[#00A1DE]/20 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-[#00A1DE]" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] font-mono text-xs font-bold uppercase tracking-wider">
              {user?.role === 'Admin' ? 'Super Admin Security Policy' : 'Agency Access Control'}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {user?.role === 'Admin'
                ? 'Super Admin Governance & Agency Privacy Boundary'
                : 'No Associated Agency Account'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
            {user?.role === 'Admin' ? (
              <>
                As an <strong>ARMA Secretariat Super Admin</strong>, your role focuses on national regulatory oversight, accreditation licensing, and registry compliance.
                <br /><br />
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  Under ARMA Governance Regulations: Super Admins are strictly prohibited from viewing, modifying, or managing the private internal dashboards and model rosters of independent modeling agencies.
                </span> You may only manage an agency dashboard if your account is specifically registered as the authorized CEO of that particular agency.
              </>
            ) : (
              'You are not currently registered as the authorized CEO of a licensed modeling agency in Rwanda.'
            )}
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 font-mono text-slate-600 dark:text-slate-400">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00A1DE]" /> Security & Governance Controls:
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Super Admins oversee national accreditation from the <strong>Admin Control Panel</strong>.</li>
              <li>Each Licensed Agency CEO independently manages their own agency roster & talent.</li>
              <li>Modifying or managing another agency's private roster without CEO authorization is blocked.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'roster' | 'notices' | 'addModel' | 'questions' | 'castings'>('roster');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Invite state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInput, setInviteInput] = useState('');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(agencyInviteSchema, { input: inviteInput });
    if (!validation.success) {
      showToast(validation.errors.input || 'Please enter model name or member ID', 'error');
      return;
    }

    // Check if input matches an unassigned model or candidate
    const foundModel = unassignedModels.find(
      (m) =>
        m.fullName.toLowerCase().includes(inviteInput.trim().toLowerCase()) ||
        m.id.toLowerCase().includes(inviteInput.trim().toLowerCase()) ||
        m.stageName?.toLowerCase().includes(inviteInput.trim().toLowerCase())
    );

    if (foundModel) {
      addModelToAgency(foundModel.id, myAgency.id);
      showToast(`Official agency invitation sent & accepted for ${foundModel.fullName}! Bound to ${myAgency.agencyName} in Firestore.`, 'success');
    } else {
      showToast(`Agency invitation link generated and sent to "${inviteInput.trim()}". Model can join ${myAgency.agencyName} upon login.`, 'info');
    }

    setShowInviteModal(false);
    setInviteInput('');
  };

  const ceoEmails = emailNotifications.filter(
    (e) => e.agencyId === myAgency.id || e.recipientEmail === myAgency.email || e.recipientName.toLowerCase().includes(myAgency.ceoName.toLowerCase())
  );
  const latestEmail = ceoEmails[0];

  // Roster state
  const myRosterModels = models.filter((m) => m.agencyId === myAgency.id);
  const unassignedModels = models.filter((m) => !m.agencyId || m.agencyId !== myAgency.id);

  const [searchRoster, setSearchRoster] = useState('');
  const [searchRecruit, setSearchRecruit] = useState('');

  // New Model Registration state
  const [showNewModelModal, setShowNewModelModal] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelCategory, setNewModelCategory] = useState<'High Fashion' | 'Commercial' | 'Runway' | 'Editorial' | 'Fitness' | 'Plus Size' | 'Petite'>('High Fashion');
  const [newModelGender, setNewModelGender] = useState<'Female' | 'Male' | 'Non-Binary'>('Female');
  const [newModelHeight, setNewModelHeight] = useState('178');
  const [newModelShoe, setNewModelShoe] = useState('39');
  const [newModelProvince, setNewModelProvince] = useState<'Kigali City' | 'Northern Province' | 'Southern Province' | 'Eastern Province' | 'Western Province'>('Kigali City');
  const [newModelDistrict, setNewModelDistrict] = useState('Gasabo');
  const [newModelBio, setNewModelBio] = useState('');
  const [newModelHeadshot, setNewModelHeadshot] = useState('');
  const [newModelFullBody, setNewModelFullBody] = useState('');

  // CEO Model Photo Management State
  const [photoEditModel, setPhotoEditModel] = useState<ModelProfile | null>(null);
  const [editHeadshot, setEditHeadshot] = useState('');
  const [editFullBody, setEditFullBody] = useState('');
  const [editRunway, setEditRunway] = useState('');
  const [editEditorial, setEditEditorial] = useState('');
  const [editGallery, setEditGallery] = useState<string[]>([]);

  const handleOpenPhotoManager = (model: ModelProfile) => {
    setPhotoEditModel(model);
    setEditHeadshot(model.photos.headshot || '');
    setEditFullBody(model.photos.fullBody || '');
    setEditRunway(model.photos.runway || '');
    setEditEditorial(model.photos.editorial || '');
    setEditGallery(model.photos.gallery || []);
  };

  const handleSaveModelPhotosByCeo = () => {
    if (!photoEditModel) return;
    updateModelPhotosAndCompCard(photoEditModel.id, {
      headshot: editHeadshot || photoEditModel.photos.headshot,
      fullBody: editFullBody || photoEditModel.photos.fullBody,
      runway: editRunway,
      editorial: editEditorial,
      gallery: editGallery
    });
    setPhotoEditModel(null);
  };

  const handleRegisterNewModel = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = newModelName.trim().split(' ');
    const calculatedStageName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];

    const validation = validateData(agencyRegisterModelSchema, {
      fullName: newModelName,
      stageName: calculatedStageName,
      gender: newModelGender,
      height: parseInt(newModelHeight) || 178,
      province: newModelProvince,
      category: newModelCategory,
      headshot: newModelHeadshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      bio: newModelBio
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const newModelId = `mod-${Date.now()}`;
    const newModel: ModelProfile = {
      id: newModelId,
      userId: `usr-${Date.now()}`,
      fullName: newModelName.trim(),
      stageName: calculatedStageName,
      category: newModelCategory,
      gender: newModelGender,
      agencyId: myAgency.id,
      agencyName: myAgency.agencyName,
      province: newModelProvince,
      district: newModelDistrict,
      photos: {
        headshot: newModelHeadshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        fullBody: newModelFullBody || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
        gallery: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
        ]
      },
      measurements: {
        heightCm: parseInt(newModelHeight) || 178,
        shoeSizeEu: parseInt(newModelShoe) || 39,
        hairColor: 'Black',
        eyeColor: 'Dark Brown',
        skinTone: 'Melanin Dark'
      },
      nationality: 'Rwandan',
      languages: ['Kinyarwanda', 'English'],
      experienceYears: 1,
      bio: newModelBio || `${newModelName} is a newly registered model represented by ${myAgency.agencyName} in Kigali, Rwanda.`,
      achievements: [`Signed with ${myAgency.agencyName} - ARMA National Registry`],
      socials: {
        instagram: '@arma_talent',
        website: ''
      },
      availability: 'Available',
      verifiedBadge: true,
      featured: false,
      rating: 4.8
    };

    updateModelProfile(newModel);
    updateAgencyProfile({
      ...myAgency,
      representedModelsCount: myAgency.representedModelsCount + 1
    });

    showToast(`Registered and associated ${newModelName} with ${myAgency.agencyName} in National Directory!`, 'success');
    setShowNewModelModal(false);
    setNewModelName('');
    setNewModelBio('');
  };

  // 3 Professional Questions editing state
  const [operatingYears, setOperatingYears] = useState(
    myAgency.ceoQuestions?.operatingYears || '5 Years in Kigali & East Africa'
  );
  const [welfarePolicies, setWelfarePolicies] = useState(
    myAgency.ceoQuestions?.welfarePolicies ||
      '100% written contract guarantee, age 18+ strict verification, minimum 200k RWF day-rate, safe set chaperone policy.'
  );
  const [primaryFocus, setPrimaryFocus] = useState(
    myAgency.ceoQuestions?.primaryFocus ||
      'High Fashion Runway, Paris & Milan Placements, Luxury Commercial Campaigns'
  );

  // New Casting Call Form state
  const [showNewCastingModal, setShowNewCastingModal] = useState(false);
  const [castingTitle, setCastingTitle] = useState('');
  const [castingCategory, setCastingCategory] = useState('High Fashion Runway');
  const [castingLocation, setCastingLocation] = useState('Kigali');
  const [castingDate, setCastingDate] = useState('2026-09-01');
  const [castingDeadline, setCastingDeadline] = useState('2026-08-25');
  const [castingCompensation, setCastingCompensation] = useState('400,000 RWF per show');
  const [castingDescription, setCastingDescription] = useState('');
  const [castingBanner, setCastingBanner] = useState('');

  const handleSaveQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(agencyCeoQuestionsSchema, {
      operatingYears,
      welfarePolicies,
      primaryFocus
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const updated: AgencyProfile = {
      ...myAgency,
      ceoQuestions: {
        operatingYears,
        welfarePolicies,
        primaryFocus
      }
    };
    updateAgencyProfile(updated);
    showToast('Updated CEO accreditation responses in Firestore!', 'success');
  };

  const handleCreateCasting = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(castingCallSchema, {
      title: castingTitle,
      category: castingCategory,
      location: castingLocation,
      payRange: castingCompensation,
      requirements: castingDescription,
      deadline: castingDeadline
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    addCasting({
      id: `cast-${Date.now()}`,
      title: castingTitle,
      organizerName: myAgency.agencyName,
      organizerType: 'Agency',
      category: castingCategory,
      location: castingLocation,
      date: castingDate,
      deadline: castingDeadline,
      compensation: castingCompensation,
      description: castingDescription,
      bannerImage: castingBanner || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
      image: castingBanner || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
      requirements: {
        gender: 'All',
        minHeightCm: 175,
        ageRange: '18 - 28',
        experienceLevel: 'Intermediate'
      },
      status: 'Open',
      applicantsCount: 0,
      featured: true
    });

    setShowNewCastingModal(false);
    setCastingTitle('');
    setCastingDescription('');
    setCastingBanner('');
  };

  const filteredRoster = myRosterModels.filter((m) =>
    m.fullName.toLowerCase().includes(searchRoster.toLowerCase())
  );

  const filteredRecruit = unassignedModels.filter((m) =>
    m.fullName.toLowerCase().includes(searchRecruit.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* CEO Agency Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12161A] via-[#1E2630] to-[#12161A] text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={myAgency.logo}
            alt={myAgency.agencyName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FAD201] shadow-xl shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {myAgency.agencyName}
              </h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                myAgency.licensedStatus === 'Licensed'
                  ? 'bg-[#20603D] text-white'
                  : myAgency.licensedStatus === 'Provisionary'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-blue-600 text-white'
              }`}>
                {myAgency.licensedStatus}
              </span>
            </div>
            <p className="text-xs font-mono text-[#FAD201]">
              CEO Admin: <strong>{user?.name || myAgency.ceoName}</strong> • License: {myAgency.licenseNumber}
            </p>
            <p className="text-[11px] text-slate-400">
              Location: {myAgency.district}, {myAgency.province} • Active Roster: {myRosterModels.length} Models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setActiveTab('addModel')}
            className="px-4 py-2.5 rounded-xl bg-[#00A1DE] text-white font-semibold text-xs hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow"
          >
            <UserPlus className="w-4 h-4" /> Recruit New Model
          </button>
          <button
            onClick={() => setShowNewCastingModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FAD201] text-slate-900 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" /> Post Casting Call
          </button>
        </div>
      </div>

      {/* Latest Official Email Notification Banner */}
      {latestEmail && (
        <div className="p-4 rounded-2xl bg-[#00A1DE]/10 dark:bg-[#00A1DE]/15 border border-[#00A1DE]/30 text-slate-900 dark:text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A1DE] text-white flex items-center justify-center font-bold shrink-0">
              <Mail className="w-5 h-5 text-[#FAD201]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#00A1DE] uppercase">
                  LATEST OFFICIAL SECRETARIAT DIRECTIVE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(latestEmail.sentAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm font-serif">
                {latestEmail.subject}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                markEmailAsRead(latestEmail.id);
                setSelectedEmailModal(latestEmail);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#00A1DE] text-white text-xs font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-1 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" /> Read Full Official Email
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Trigger Button */}
      <div className="sm:hidden flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00A1DE] animate-pulse" />
          <span className="text-xs font-serif font-bold text-slate-900 dark:text-white capitalize">
            {activeTab === 'roster' && `Agency Management (${myRosterModels.length})`}
            {activeTab === 'addModel' && 'Recruit / Unassigned Talent'}
            {activeTab === 'notices' && `ARMA Directives (${ceoEmails.length})`}
            {activeTab === 'questions' && 'CEO Evaluation'}
            {activeTab === 'castings' && 'Agency Castings'}
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#12161A] text-slate-900 dark:text-white h-full z-50 p-6 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800 overflow-y-auto transform transition-transform duration-300 ease-out">
            <div className="space-y-6">
              {/* Flag Bar & Header */}
              <div className="space-y-3">
                <div className="h-1 w-full bg-gradient-to-r from-[#00A1DE] via-[#FAD201] to-[#20603D] rounded-full" />
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#00A1DE] text-white flex items-center justify-center font-bold text-xs font-serif shadow">
                      CEO
                    </div>
                    <div>
                      <h3 className="text-sm font-serif font-bold truncate max-w-[140px]">{myAgency.agencyName}</h3>
                      <p className="text-[10px] font-mono text-emerald-500">CEO: {myAgency.ceoName}</p>
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

              {/* Sections List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block px-1">
                  CEO Portal Sections
                </span>

                <button
                  onClick={() => {
                    setActiveTab('roster');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between text-left text-xs font-semibold ${
                    activeTab === 'roster'
                      ? 'bg-[#00A1DE] text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#FAD201]" />
                    <div>
                      <p className="font-bold">Agency Management</p>
                      <p className="text-[10px] opacity-80">{myRosterModels.length} Represented Models</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('addModel');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between text-left text-xs font-semibold ${
                    activeTab === 'addModel'
                      ? 'bg-[#00A1DE] text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-[#00A1DE]" />
                    <div>
                      <p className="font-bold">Recruit Talent</p>
                      <p className="text-[10px] opacity-80">Recruit independent models</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('notices');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between text-left text-xs font-semibold ${
                    activeTab === 'notices'
                      ? 'bg-[#00A1DE] text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-bold">ARMA Directives</p>
                      <p className="text-[10px] opacity-80">{ceoEmails.length} Official Bulletins</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('questions');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between text-left text-xs font-semibold ${
                    activeTab === 'questions'
                      ? 'bg-[#00A1DE] text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#20603D]" />
                    <div>
                      <p className="font-bold">CEO Evaluation</p>
                      <p className="text-[10px] opacity-80">Operational & Welfare Policies</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('castings');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between text-left text-xs font-semibold ${
                    activeTab === 'castings'
                      ? 'bg-[#00A1DE] text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-[#FAD201]" />
                    <div>
                      <p className="font-bold">Agency Castings</p>
                      <p className="text-[10px] opacity-80">Post & Manage Auditions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="p-3 rounded-2xl bg-[#00A1DE]/10 border border-[#00A1DE]/30 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00A1DE] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#00A1DE] block">
                    LICENSED AGENCY CEO
                  </span>
                  <span className="text-[10px] text-slate-500 block">Status: {myAgency.licensedStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Nav Tabs */}
      <div className="hidden sm:flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-[#00A1DE] text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#FAD201]" /> Agency Management ({myRosterModels.length})
        </button>
        <button
          onClick={() => setActiveTab('addModel')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'addModel'
              ? 'bg-[#00A1DE] text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4 text-[#00A1DE]" /> Recruit / Unassigned Talent
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'notices'
              ? 'bg-[#00A1DE] text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400" /> ARMA Directives ({ceoEmails.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-[#00A1DE] text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#20603D]" /> CEO Evaluation
        </button>
        <button
          onClick={() => setActiveTab('castings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'castings'
              ? 'bg-[#00A1DE] text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Agency Castings
        </button>
      </div>

      {/* Tab: ARMA Secretariat Email Directives */}
      {activeTab === 'notices' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#00A1DE]" /> ARMA Official Accreditation Directives & Mailbox
              </h3>
              <p className="text-xs text-slate-500">
                Official automated email notifications dispatched by the Super Administrator regarding {myAgency.agencyName}'s standing.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#00A1DE] bg-[#00A1DE]/10 px-3 py-1 rounded-xl border border-[#00A1DE]/20">
              Current Standing: {myAgency.licensedStatus}
            </span>
          </div>

          {ceoEmails.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono italic">
              No official email directives currently recorded in your inbox.
            </div>
          ) : (
            <div className="space-y-3">
              {ceoEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                    email.read
                      ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      : 'bg-[#00A1DE]/5 border-[#00A1DE]/40 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!email.read && (
                        <span className="px-2 py-0.5 rounded bg-[#00A1DE] text-white font-mono text-[10px] font-bold">
                          NEW UNREAD DIRECTIVE
                        </span>
                      )}
                      <h4 className="font-bold text-slate-900 dark:text-white font-serif">{email.subject}</h4>
                    </div>

                    <p className="text-slate-500 font-mono text-[11px]">
                      From: <strong>ARMA National Secretariat &lt;secretariat@arma.org.rw&gt;</strong>
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00A1DE]" /> {new Date(email.sentAt).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>
                        Standing: {email.previousStatus} → <strong className="text-emerald-400">{email.newStatus}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      markEmailAsRead(email.id);
                      setSelectedEmailModal(email);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 text-xs shrink-0 shadow-sm"
                  >
                    <Eye className="w-4 h-4" /> View Official Email Notice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Agency Management / Roster */}
      {activeTab === 'roster' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00A1DE]" /> Agency Management & Contracted Roster
              </h3>
              <p className="text-xs text-slate-500">
                View, invite, and disassociate models contracted under {myAgency.agencyName}. All updates synchronize directly with Firestore.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#20603D] hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#FAD201]" /> Invite Model
              </button>

              <button
                onClick={() => setShowNewModelModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Register New Talent
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchRoster}
                  onChange={(e) => setSearchRoster(e.target.value)}
                  placeholder="Search roster..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-40"
                />
              </div>
            </div>
          </div>

          {filteredRoster.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No models currently in your active roster.</p>
              <button
                onClick={() => setActiveTab('addModel')}
                className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold"
              >
                Recruit Models Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoster.map((model) => (
                <div
                  key={model.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-[#00A1DE]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={model.photos.headshot}
                      alt={model.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                    />
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="font-bold text-sm font-serif truncate">{model.fullName}</h4>
                      <span className="text-[10px] font-mono text-[#00A1DE] font-semibold block">
                        {model.category} • {model.measurements.heightCm} cm
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {model.district}, {model.province}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => handleOpenPhotoManager(model)}
                      className="px-2.5 py-1 rounded-lg bg-[#00A1DE]/10 text-[#00A1DE] font-semibold hover:bg-[#00A1DE]/20 transition-colors text-[11px] flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" /> Edit Photos
                    </button>

                    <button
                      onClick={() => setSelectedModelModal(model)}
                      className="text-slate-600 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" /> Portfolio
                    </button>

                    <button
                      onClick={() => removeModelFromAgency(model.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors text-[11px] flex items-center gap-1"
                    >
                      <UserMinus className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Recruit / Add Unassigned Models */}
      {activeTab === 'addModel' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                Recruit Independent Talent to Roster
              </h3>
              <p className="text-xs text-slate-500">
                Browse available Rwandan models or register a new candidate directly into {myAgency.agencyName}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewModelModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#00A1DE] text-white font-medium hover:bg-sky-600 transition-colors text-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Register New Model
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchRecruit}
                  onChange={(e) => setSearchRecruit(e.target.value)}
                  placeholder="Search candidates..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-44"
                />
              </div>
            </div>
          </div>

          {filteredRecruit.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No unrepresented models found matching your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecruit.map((model) => (
                <div
                  key={model.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={model.photos.headshot}
                      alt={model.fullName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="font-bold font-serif text-slate-900 dark:text-white truncate">
                        {model.fullName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {model.category} • {model.measurements.heightCm}cm
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addModelToAgency(model.id, myAgency.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#20603D] text-white font-semibold hover:bg-emerald-700 transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#FAD201]" /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: CEO Professional Questions Evaluation */}
      {activeTab === 'questions' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#20603D]" />
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                CEO Mandatory Professional Evaluation Questions
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              As Agency CEO, these 3 standard answers establish your official accreditation score in ARMA's National Directory.
            </p>
          </div>

          <form onSubmit={handleSaveQuestions} className="space-y-4 text-xs">
            {/* Q1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block font-serif font-bold text-sm text-[#00A1DE]">
                1. Operating Experience in Rwanda & East Africa
              </label>
              <input
                type="text"
                required
                value={operatingYears}
                onChange={(e) => setOperatingYears(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Q2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block font-serif font-bold text-sm text-[#FAD201]">
                2. Standard Contract Protections & Model Welfare Policies
              </label>
              <textarea
                rows={3}
                required
                value={welfarePolicies}
                onChange={(e) => setWelfarePolicies(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Q3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block font-serif font-bold text-sm text-[#20603D]">
                3. Primary Commercial Focus & Client Portfolio
              </label>
              <input
                type="text"
                required
                value={primaryFocus}
                onChange={(e) => setPrimaryFocus(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" /> Save Professional Answers
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Castings Management */}
      {activeTab === 'castings' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold">Agency Casting Calls</h3>
              <p className="text-xs text-slate-500">Casting notices published by {myAgency.agencyName}.</p>
            </div>
            <button
              onClick={() => setShowNewCastingModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Post New Call
            </button>
          </div>

          <div className="space-y-3">
            {castings
              .filter((c) => c.organizerName === myAgency.agencyName || c.organizerType === 'Agency')
              .map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white">{c.title}</h4>
                    <p className="text-slate-500 font-mono">
                      Category: {c.category} • Compensation: {c.compensation}
                    </p>
                    <p className="text-slate-400">
                      Location: {c.location} • Deadline: {c.deadline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] font-mono font-bold">
                      {c.applicantsCount} Applicants
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Post New Casting Modal */}
      {showNewCastingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold">Post Agency Casting Call</h3>
            <form onSubmit={handleCreateCasting} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Casting Title *</label>
                <input
                  type="text"
                  required
                  value={castingTitle}
                  onChange={(e) => setCastingTitle(e.target.value)}
                  placeholder="e.g. Kigali Haute Couture Spring Show Models"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={castingCategory}
                    onChange={(e) => setCastingCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="High Fashion Runway">High Fashion Runway</option>
                    <option value="Commercial Print & TVC">Commercial Print & TVC</option>
                    <option value="Editorial Photography">Editorial Photography</option>
                    <option value="Brand Ambassador">Brand Ambassador</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={castingLocation}
                    onChange={(e) => setCastingLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Casting Date</label>
                  <input
                    type="date"
                    value={castingDate}
                    onChange={(e) => setCastingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={castingDeadline}
                    onChange={(e) => setCastingDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Compensation Details</label>
                <input
                  type="text"
                  value={castingCompensation}
                  onChange={(e) => setCastingCompensation(e.target.value)}
                  placeholder="e.g. 300,000 RWF per show day"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description & Requirements *</label>
                <textarea
                  rows={3}
                  required
                  value={castingDescription}
                  onChange={(e) => setCastingDescription(e.target.value)}
                  placeholder="Requirements, height limits, outfit guidelines..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <ImageUploader
                  label="Casting Banner / Campaign Poster Upload *"
                  currentImage={castingBanner}
                  onImageChange={(newImg) => setCastingBanner(newImg)}
                  aspectRatio="landscape"
                  placeholderText="Upload Casting Banner Image"
                  rounded="2xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCastingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3]"
                >
                  Publish Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register New Model Profile */}
      {showNewModelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#00A1DE]" /> Register Model to Roster
                </h3>
                <p className="text-xs text-slate-500">
                  Adds new model directly to {myAgency.agencyName} & National Directory in Firestore.
                </p>
              </div>
              <button
                onClick={() => setShowNewModelModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewModel} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Model Full Name *</label>
                <input
                  type="text"
                  required
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="e.g. Diane Umutoni"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Primary Category</label>
                  <select
                    value={newModelCategory}
                    onChange={(e) => setNewModelCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="High Fashion">High Fashion</option>
                    <option value="Runway">Runway</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Plus Size">Plus Size</option>
                    <option value="Petite">Petite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Gender</label>
                  <select
                    value={newModelGender}
                    onChange={(e) => setNewModelGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Height (cm)</label>
                  <input
                    type="number"
                    value={newModelHeight}
                    onChange={(e) => setNewModelHeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Shoe Size (EU)</label>
                  <input
                    type="number"
                    value={newModelShoe}
                    onChange={(e) => setNewModelShoe(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Province</label>
                  <select
                    value={newModelProvince}
                    onChange={(e) => setNewModelProvince(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="Kigali City">Kigali City</option>
                    <option value="Northern Province">Northern Province</option>
                    <option value="Southern Province">Southern Province</option>
                    <option value="Eastern Province">Eastern Province</option>
                    <option value="Western Province">Western Province</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">District</label>
                  <input
                    type="text"
                    value={newModelDistrict}
                    onChange={(e) => setNewModelDistrict(e.target.value)}
                    placeholder="e.g. Gasabo"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Short Bio / Editorial Notes</label>
                <textarea
                  rows={2}
                  value={newModelBio}
                  onChange={(e) => setNewModelBio(e.target.value)}
                  placeholder="Special attributes, experience, runway walking background..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModelModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#20603D] text-white font-semibold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#FAD201]" /> Register & Associate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Send Agency Invitation */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#20603D]" />
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                  Invite Model to {myAgency.agencyName}
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Model Name, Email, or Member ID *
                </label>
                <input
                  type="text"
                  required
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="e.g. Sonia Kayitesi or ARMA-MOD-001"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  You can search among registered independent talent or invite a new candidate by email.
                </p>
              </div>

              {/* Quick candidate list selector */}
              {unassignedModels.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Suggested Available Independent Models
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {unassignedModels.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setInviteInput(m.fullName)}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#00A1DE]/10 transition-colors flex items-center justify-between text-left text-[11px]"
                      >
                        <span className="font-bold font-serif">{m.fullName}</span>
                        <span className="text-[10px] font-mono text-[#00A1DE]">{m.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#20603D] text-white font-semibold hover:bg-emerald-700 flex items-center gap-1.5 shadow"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#FAD201]" /> Dispatch Official Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CEO Modal: Manage Model Photos & Comp Card */}
      {photoEditModel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#00A1DE]" /> Manage Photos & Comp Card: {photoEditModel.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  As Agency CEO, you can upload and update official headshots, comp card photos, and portfolio galleries.
                </p>
              </div>
              <button
                onClick={() => setPhotoEditModel(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Uploaders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-bold font-serif text-slate-900 dark:text-white block">Headshot / Profile</span>
                <ImageUploader
                  currentImage={editHeadshot}
                  onImageChange={(url) => setEditHeadshot(url)}
                  aspectRatio="portrait"
                  placeholderText="Upload Headshot"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-bold font-serif text-slate-900 dark:text-white block">Full Body Shot</span>
                <ImageUploader
                  currentImage={editFullBody}
                  onImageChange={(url) => setEditFullBody(url)}
                  aspectRatio="portrait"
                  placeholderText="Upload Full Body"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-bold font-serif text-slate-900 dark:text-white block">Runway Shot</span>
                <ImageUploader
                  currentImage={editRunway}
                  onImageChange={(url) => setEditRunway(url)}
                  aspectRatio="portrait"
                  placeholderText="Upload Runway"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-bold font-serif text-slate-900 dark:text-white block">Editorial Shot</span>
                <ImageUploader
                  currentImage={editEditorial}
                  onImageChange={(url) => setEditEditorial(url)}
                  aspectRatio="portrait"
                  placeholderText="Upload Editorial"
                />
              </div>
            </div>

            {/* Comp Card Gallery Photos */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold font-serif text-slate-900 dark:text-white">Comp Card Gallery Images</span>
                <span className="font-mono text-[#00A1DE] font-semibold">{editGallery.length} Photos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {editGallery.map((gUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[3/4] border border-slate-200 dark:border-slate-800 bg-slate-900">
                    <img src={gUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setEditGallery((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="aspect-[3/4]">
                  <ImageUploader
                    onImageChange={(url) => url && setEditGallery((prev) => [...prev, url])}
                    aspectRatio="portrait"
                    placeholderText="Add Gallery Photo"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPhotoEditModel(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModelPhotosByCeo}
                className="px-6 py-2 rounded-xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] flex items-center gap-1.5 shadow text-xs"
              >
                <Save className="w-4 h-4" /> Save Model Photos & Update Comp Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
