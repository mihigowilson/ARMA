import React from 'react';
import { AgencyProfile } from '../../types/arma';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from '../seo/Helmet';
import {
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Briefcase
} from 'lucide-react';

interface AgencyProfileModalProps {
  agency: AgencyProfile;
  onClose: () => void;
}

export const AgencyProfileModal: React.FC<AgencyProfileModalProps> = ({ agency, onClose }) => {
  const { models, castings, setSelectedModelModal } = useAuth();
  
  const agencyModels = models.filter((m) => m.agencyId === agency.id);
  const agencyCastings = castings.filter((c) => c.organizerName.toLowerCase().includes(agency.agencyName.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <Helmet
        title={`${agency.agencyName} | ARMA Rwanda Licensed Agency`}
        description={`Official ARMA dossier for ${agency.agencyName} (License: ${agency.licenseNumber}). CEO: ${agency.ceoName}. View represented models roster & contact information.`}
        ogImage={agency.logo}
      />
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cover Header */}
        <div className="relative h-44 bg-slate-900 overflow-hidden">
          <img src={agency.coverImage} alt="Cover" className="w-full h-full object-cover opacity-60" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agency Logo & Title Header */}
        <div className="px-8 -mt-12 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-end gap-4">
            <img
              src={agency.logo}
              alt={agency.agencyName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-[#12161A] shadow-xl bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold">{agency.agencyName}</h2>
                {agency.verified && <CheckCircle2 className="w-5 h-5 text-[#20603D]" />}
              </div>
              <p className="text-xs font-mono text-[#00A1DE] font-semibold mt-0.5">
                License: {agency.licenseNumber} • Status: <span className="text-[#20603D]">{agency.licensedStatus}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] font-bold">
              {agency.representedModelsCount} Models Represented
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          {/* Overview & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase text-slate-500">
                Agency Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {agency.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-mono font-bold uppercase text-slate-500 mb-2">
                Contact Dossier
              </h4>
              <p className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00A1DE]" /> CEO: {agency.ceoName}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#20603D]" /> {agency.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FAD201]" /> {agency.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" /> {agency.email}
              </p>
            </div>
          </div>

          {/* Represented Models Roster */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00A1DE]" />
              Represented Model Roster ({agencyModels.length})
            </h3>

            {agencyModels.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No models currently linked in preview roster.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {agencyModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModelModal(model)}
                    className="group rounded-2xl bg-slate-50 dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-[#00A1DE] transition-all p-2 text-center"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2">
                      <img src={model.photos.headshot} alt={model.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-xs font-bold font-serif block">{model.fullName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{model.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
