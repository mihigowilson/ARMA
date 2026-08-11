import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ModelProfile } from '../../../types/arma';
import { validateData, adminCreateModelSchema } from '../../../lib/validationSchemas';

interface CreateModelModalProps {
  onClose: () => void;
}

export const CreateModelModal: React.FC<CreateModelModalProps> = ({ onClose }) => {
  const { addModel, agencies, showToast } = useAuth();

  const [fullName, setFullName] = useState('');
  const [stageName, setStageName] = useState('');
  const [category, setCategory] = useState<ModelProfile['category']>('High Fashion');
  const [gender, setGender] = useState<ModelProfile['gender']>('Female');
  const [agencyId, setAgencyId] = useState('');
  const [province, setProvince] = useState<ModelProfile['province']>('Kigali City');
  const [district, setDistrict] = useState('Nyarugenge');
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(58);
  const [shoeSizeEu, setShoeSizeEu] = useState<number>(39);
  const [hairColor, setHairColor] = useState('Black');
  const [eyeColor, setEyeColor] = useState('Dark Brown');
  const [nationality, setNationality] = useState('Rwandan');
  const [bio, setBio] = useState('');
  const [headshotUrl, setHeadshotUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800');
  const [fullBodyUrl, setFullBodyUrl] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800');
  const [instagram, setInstagram] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(adminCreateModelSchema, {
      fullName,
      stageName: stageName || fullName.split(' ')[0] || 'Model',
      gender,
      category,
      height: heightCm,
      province,
      district,
      experienceLevel: 'Professional',
      headshot: headshotUrl
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const selectedAgency = agencies.find((a) => a.id === agencyId);

    const newModel: ModelProfile = {
      id: `mod-${Date.now()}`,
      userId: `usr-mod-${Date.now()}`,
      fullName,
      stageName: stageName || undefined,
      category,
      gender,
      agencyId: selectedAgency ? selectedAgency.id : undefined,
      agencyName: selectedAgency ? selectedAgency.agencyName : undefined,
      province,
      district,
      photos: {
        headshot: headshotUrl,
        fullBody: fullBodyUrl,
        gallery: [headshotUrl, fullBodyUrl]
      },
      measurements: {
        heightCm,
        weightKg,
        shoeSizeEu,
        hairColor,
        eyeColor
      },
      nationality,
      languages: ['Kinyarwanda', 'English'],
      experienceYears: 1,
      bio: bio || `Registered professional ${category} model based in ${district}, ${province}.`,
      achievements: ['Registered ARMA Professional Member'],
      socials: {
        instagram: instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : undefined
      },
      availability: 'Available',
      verifiedBadge: true,
      featured: true,
      rating: 5.0
    };

    addModel(newModel);
    showToast(`Registered model ${fullName} in ARMA National Directory!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Register New Model Profile</h3>
            <p className="text-xs text-slate-500">Add a model profile to the official ARMA National Registry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Diane Uwase"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stage / Model Name</label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="e.g. Uwase D."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
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
              <label className="block font-semibold mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Representing Agency</label>
              <select
                value={agencyId}
                onChange={(e) => setAgencyId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="">Independent / Unassigned</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>{a.agencyName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value as any)}
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
              <label className="block font-semibold mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Gasabo"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          {/* Measurements */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#1E2630] space-y-2">
            <span className="font-semibold block text-[11px] uppercase tracking-wider text-slate-400">Model Measurements</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Shoe (EU)</label>
                <input
                  type="number"
                  value={shoeSizeEu}
                  onChange={(e) => setShoeSizeEu(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Hair Color</label>
                <input
                  type="text"
                  value={hairColor}
                  onChange={(e) => setHairColor(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Eye Color</label>
                <input
                  type="text"
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Headshot Photo URL</label>
            <input
              type="url"
              value={headshotUrl}
              onChange={(e) => setHeadshotUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Biography / Editorial Profile</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief professional summary..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg"
            >
              Add Model to ARMA Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
