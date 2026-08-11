import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CastingCall } from '../../types/arma';
import { validateData, castingCallSchema } from '../../lib/validationSchemas';
import { ImageUploader } from '../common/ImageUploader';
import {
  Briefcase,
  Search,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  X,
  Image as ImageIcon,
  Building2,
  Users
} from 'lucide-react';

export const CastingsPage: React.FC = () => {
  const { castings, appliedCastingIds, applyToCasting, user, addCasting, showToast } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedCasting, setSelectedCasting] = useState<CastingCall | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Casting Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Runway');
  const [location, setLocation] = useState('Kigali');
  const [date, setDate] = useState('2026-09-01');
  const [deadline, setDeadline] = useState('2026-08-25');
  const [compensation, setCompensation] = useState('400,000 RWF');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const filteredCastings = castings.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleCreateCasting = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(castingCallSchema, {
      title,
      category,
      location,
      payRange: compensation,
      requirements: description,
      deadline
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    if (!bannerImage) {
      showToast('A casting banner or campaign poster is required.', 'error');
      return;
    }

    const newCast: CastingCall = {
      id: `cast-${Date.now()}`,
      title,
      organizerName: user?.name || 'ARMA Partner Agency',
      organizerType: 'Agency',
      category,
      location,
      date,
      deadline,
      compensation,
      description,
      bannerImage,
      image: bannerImage,
      requirements: {
        gender: 'All',
        minHeightCm: 170,
        ageRange: '18-30'
      },
      status: user?.role === 'Admin' ? 'Open' : 'Pending Approval',
      applicantsCount: 0
    };
    addCasting(newCast);
    showToast(user?.role === 'Admin' ? `Posted casting call "${title}"!` : 'Casting submitted for Admin approval.', 'success');
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setBannerImage('');
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
              <Briefcase className="w-3.5 h-3.5 text-[#00A1DE]" />
              NATIONAL JOB & CASTING BOARD
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight mt-2">
              Castings & Commercial Campaigns
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Verified casting calls for runway shows, television commercials, brand ambassadorships, and magazine shoots in Rwanda.
            </p>
          </div>

          {(user?.role === 'Admin' || user?.role === 'Agency' || user?.role === 'Event Organizer') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-2xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-2 shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Casting Call
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, agency, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Runway">Runway</option>
              <option value="Commercial">Commercial</option>
              <option value="Editorial">Editorial</option>
            </select>
          </div>
        </div>

        {/* Casting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCastings.filter((casting) => casting.status === 'Open').map((casting) => {
            const hasApplied = appliedCastingIds.includes(casting.id);
            const banner = casting.bannerImage || casting.image;
            return (
              <div
                key={casting.id}
                className="rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Banner / Poster Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setSelectedCasting(casting)}>
                  {banner ? (
                    <img
                      src={banner}
                      alt={casting.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#00A1DE]/20 to-[#20603D]/20 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-10 h-10 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {casting.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-l from-[#FAD201] to-[#00A1DE] text-slate-900 text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow">
                      FEATURED
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-mono font-bold text-[#00A1DE] uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      {casting.organizerName} • {casting.category}
                    </span>
                    <h3 className="text-lg font-serif font-bold tracking-tight text-white mt-1 line-clamp-1">
                      {casting.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00A1DE] shrink-0" /> {casting.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#20603D] shrink-0" /> Casting Date: {casting.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#FAD201] shrink-0" /> Deadline: {casting.deadline}
                      </p>
                      <p className="flex items-center gap-2 font-bold text-[#20603D] dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" /> Compensation: {casting.compensation}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {casting.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCasting(casting)}
                      className="text-xs text-[#00A1DE] font-semibold hover:underline"
                    >
                      View Details
                    </button>

                    {hasApplied ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#20603D]/10 text-[#20603D] text-xs font-bold font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => applyToCasting(casting.id)}
                        className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-1 shadow-md"
                      >
                        Apply Now
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Casting Details Modal */}
      {selectedCasting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header Banner */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              {(selectedCasting.bannerImage || selectedCasting.image) ? (
                <img
                  src={selectedCasting.bannerImage || selectedCasting.image}
                  alt={selectedCasting.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedCasting(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00A1DE] text-white">
                  {selectedCasting.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {selectedCasting.title}
                </h2>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Organized by {selectedCasting.organizerName}
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">LOCATION</span>
                  <strong className="text-slate-900 dark:text-white">{selectedCasting.location}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CASTING DATE</span>
                  <strong className="text-slate-900 dark:text-white">{selectedCasting.date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DEADLINE</span>
                  <strong className="text-red-500">{selectedCasting.deadline}</strong>
                </div>
                <div className="col-span-2 sm:col-span-3 border-t border-slate-200 dark:border-slate-800 pt-2">
                  <span className="text-slate-400 block text-[10px]">COMPENSATION</span>
                  <strong className="text-[#20603D] dark:text-emerald-400 text-sm">{selectedCasting.compensation}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">Casting Brief & Guidelines</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedCasting.description}
                </p>
              </div>

              {selectedCasting.requirements && (
                <div className="p-3.5 rounded-2xl bg-[#00A1DE]/10 border border-[#00A1DE]/20 space-y-1">
                  <h5 className="font-bold text-[#00A1DE]">Model Requirements</h5>
                  <p className="text-slate-700 dark:text-slate-300">
                    Gender: {selectedCasting.requirements.gender || 'All'} | Min Height: {selectedCasting.requirements.minHeightCm || 170}cm | Age: {selectedCasting.requirements.ageRange || '18-30'}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCasting(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Close
                </button>
                {appliedCastingIds.includes(selectedCasting.id) ? (
                  <span className="px-5 py-2.5 rounded-xl bg-[#20603D]/10 text-[#20603D] font-bold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Application Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      applyToCasting(selectedCasting.id);
                      setSelectedCasting(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] shadow-md"
                  >
                    Submit Comp Card Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Casting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1E2630] text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg">Post Official Casting Call</h3>
              <button onClick={() => setShowCreateModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateCasting} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Casting Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  placeholder="e.g. Mercedes-Benz Fashion Week Catwalk Auditions"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  >
                    <option value="Runway">Runway</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Editorial">Editorial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Casting Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Compensation</label>
                <input
                  type="text"
                  required
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  placeholder="e.g. 500,000 RWF per show"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description & Requirements</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <ImageUploader
                  label="Casting Banner / Campaign Poster Upload *"
                  currentImage={bannerImage}
                  onImageChange={(newImg) => setBannerImage(newImg)}
                  aspectRatio="landscape"
                  placeholderText="Upload Casting Banner Image"
                  rounded="2xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] shadow-lg"
              >
                Publish to ARMA Job Board
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
