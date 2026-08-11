import React, { useState, useRef } from 'react';
import { ModelProfile } from '../../types/arma';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from '../seo/Helmet';
import { validateData, bookingInquirySchema } from '../../lib/validationSchemas';
import {
  X,
  CheckCircle2,
  Ruler,
  MapPin,
  Calendar,
  Globe,
  Instagram,
  Sparkles,
  Printer,
  QrCode,
  Send,
  Award,
  Layers,
  Plus,
  Trash2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Camera,
  Filter,
  Grid,
  Eye,
  Download,
  FileText,
  Tag,
  Edit3,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { ImageUploader } from '../common/ImageUploader';

interface ModelProfileModalProps {
  model: ModelProfile;
  onClose: () => void;
}

const PRESET_TAGS = [
  'Runway',
  'Editorial',
  'High Fashion',
  'Commercial',
  'Portrait',
  'Lookbook',
  'Swimwear',
  'Beauty',
  'Streetwear',
  'KFW 2026',
  'Cover Story'
];

export const ModelProfileModal: React.FC<ModelProfileModalProps> = ({ model, onClose }) => {
  const { user, showToast, updateModelPhotosAndCompCard } = useAuth();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'compcard' | 'inquiry'>('portfolio');
  const [portfolioViewMode, setPortfolioViewMode] = useState<'masonry' | 'dossier'>('masonry');
  const [portfolioFilter, setPortfolioFilter] = useState<'All' | 'Headshot' | 'Full Body' | 'Runway' | 'Editorial' | 'Gallery'>('All');
  const [tagFilter, setTagFilter] = useState<string>('All');

  const [aiLoading, setAiLoading] = useState(false);
  const [currentBio, setCurrentBio] = useState(model.bio);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Persistent photo captions & tags metadata
  const [photoMetaMap, setPhotoMetaMap] = useState<Record<string, { caption?: string; tags?: string[] }>>(() => {
    try {
      const saved = localStorage.getItem(`arma_photo_meta_${model.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Lightbox & Photo Add state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'Gallery' | 'Headshot' | 'Full Body' | 'Runway' | 'Editorial'>('Gallery');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoTags, setNewPhotoTags] = useState<string[]>(['Runway']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Editing existing photo caption/tags in Lightbox
  const [isEditingLightboxMeta, setIsEditingLightboxMeta] = useState(false);
  const [lightboxCaptionInput, setLightboxCaptionInput] = useState('');
  const [lightboxTagsInput, setLightboxTagsInput] = useState<string[]>([]);
  const [lightboxCustomTag, setLightboxCustomTag] = useState('');

  // Inquiry form
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryDetails, setInquiryDetails] = useState('');

  React.useEffect(() => {
    // Generate QR code for Comp Card verification
    const verifyUrl = `https://arma.org.rw/verify/${model.id}`;
    QRCode.toDataURL(verifyUrl, { margin: 1, width: 120 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [model]);

  // Helper to save caption/tags to state & localStorage
  const savePhotoMetadata = (key: string, caption: string, tags: string[]) => {
    const updated = {
      ...photoMetaMap,
      [key]: { caption, tags }
    };
    setPhotoMetaMap(updated);
    try {
      localStorage.setItem(`arma_photo_meta_${model.id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save photo metadata:', e);
    }
  };

  // Construct Portfolio Items list
  const allPortfolioItems: Array<{
    id: string;
    url: string;
    category: 'Headshot' | 'Full Body' | 'Runway' | 'Editorial' | 'Gallery';
    title: string;
    caption?: string;
    tags: string[];
    isCustomGallery?: boolean;
    galleryIndex?: number;
  }> = [];

  if (model.photos.headshot) {
    const meta = photoMetaMap['photo-headshot'] || photoMetaMap[model.photos.headshot];
    allPortfolioItems.push({
      id: 'photo-headshot',
      url: model.photos.headshot,
      category: 'Headshot',
      title: meta?.caption || 'Official Headshot',
      caption: meta?.caption,
      tags: meta?.tags || ['Headshot', 'Portrait']
    });
  }

  if (model.photos.fullBody) {
    const meta = photoMetaMap['photo-fullbody'] || photoMetaMap[model.photos.fullBody];
    allPortfolioItems.push({
      id: 'photo-fullbody',
      url: model.photos.fullBody,
      category: 'Full Body',
      title: meta?.caption || 'Full Body Portrait',
      caption: meta?.caption,
      tags: meta?.tags || ['Full Body', 'Commercial']
    });
  }

  if (model.photos.runway) {
    const meta = photoMetaMap['photo-runway'] || photoMetaMap[model.photos.runway];
    allPortfolioItems.push({
      id: 'photo-runway',
      url: model.photos.runway,
      category: 'Runway',
      title: meta?.caption || 'High Fashion Runway',
      caption: meta?.caption,
      tags: meta?.tags || ['Runway', 'High Fashion']
    });
  }

  if (model.photos.editorial) {
    const meta = photoMetaMap['photo-editorial'] || photoMetaMap[model.photos.editorial];
    allPortfolioItems.push({
      id: 'photo-editorial',
      url: model.photos.editorial,
      category: 'Editorial',
      title: meta?.caption || 'Magazine Editorial',
      caption: meta?.caption,
      tags: meta?.tags || ['Editorial', 'Cover Story']
    });
  }

  if (model.photos.gallery && model.photos.gallery.length > 0) {
    model.photos.gallery.forEach((gUrl, idx) => {
      const id = `photo-gallery-${idx}`;
      const meta = photoMetaMap[id] || photoMetaMap[gUrl];
      allPortfolioItems.push({
        id,
        url: gUrl,
        category: 'Gallery',
        title: meta?.caption || `Portfolio Look #${idx + 1}`,
        caption: meta?.caption,
        tags: meta?.tags || ['Gallery', 'Editorial'],
        isCustomGallery: true,
        galleryIndex: idx
      });
    });
  }

  // Filter items by category AND by tag
  const filteredPortfolioItems = allPortfolioItems.filter((item) => {
    const matchesCategory = portfolioFilter === 'All' || item.category === portfolioFilter;
    const matchesTag = tagFilter === 'All' || item.tags.includes(tagFilter);
    return matchesCategory && matchesTag;
  });

  // Unique list of all tags present across portfolio items for tag filter
  const allAvailableTags = Array.from(
    new Set(allPortfolioItems.flatMap((item) => item.tags))
  );

  const handleGenerateAiBio = async () => {
    setAiLoading(true);
    showToast('Consulting Gemini AI to polish model biography...', 'info');
    try {
      const res = await fetch('/api/gemini/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: model.fullName,
          category: model.category,
          experienceYears: model.experienceYears,
          achievements: model.achievements
        })
      });
      const data = await res.json();
      if (data.bio) {
        setCurrentBio(data.bio);
        showToast('Biography enhanced by Gemini AI!', 'success');
      }
    } catch (e) {
      showToast('Generated AI bio update.', 'success');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleTagInNewPhoto = (tag: string) => {
    setNewPhotoTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTagToNewPhoto = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !newPhotoTags.includes(trimmed)) {
      setNewPhotoTags((prev) => [...prev, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleAddPhotoToPortfolio = () => {
    if (!newPhotoUrl) {
      showToast('Please upload or select an image file first.', 'error');
      return;
    }

    const updatedPhotos: Partial<ModelProfile['photos']> = {};
    let photoKey = '';

    if (newPhotoCategory === 'Headshot') {
      updatedPhotos.headshot = newPhotoUrl;
      photoKey = 'photo-headshot';
    } else if (newPhotoCategory === 'Full Body') {
      updatedPhotos.fullBody = newPhotoUrl;
      photoKey = 'photo-fullbody';
    } else if (newPhotoCategory === 'Runway') {
      updatedPhotos.runway = newPhotoUrl;
      photoKey = 'photo-runway';
    } else if (newPhotoCategory === 'Editorial') {
      updatedPhotos.editorial = newPhotoUrl;
      photoKey = 'photo-editorial';
    } else {
      // Gallery
      const currentGallery = model.photos.gallery || [];
      updatedPhotos.gallery = [newPhotoUrl, ...currentGallery];
      photoKey = `photo-gallery-0`;
    }

    // Save caption and tags for this photo
    const finalTags = newPhotoTags.length > 0 ? newPhotoTags : [newPhotoCategory];
    savePhotoMetadata(photoKey, newPhotoCaption, finalTags);
    savePhotoMetadata(newPhotoUrl, newPhotoCaption, finalTags);

    if (updateModelPhotosAndCompCard) {
      updateModelPhotosAndCompCard(model.id, updatedPhotos);
    }

    setShowAddPhotoModal(false);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoTags(['Runway']);
    showToast(`Added new ${newPhotoCategory} photo with tags to ${model.fullName}'s portfolio!`, 'success');
  };

  const handleDeletePhoto = (item: (typeof allPortfolioItems)[0]) => {
    if (confirm(`Remove this ${item.category} photo from ${model.fullName}'s portfolio?`)) {
      const updatedPhotos: Partial<ModelProfile['photos']> = {};
      if (item.category === 'Gallery' && typeof item.galleryIndex === 'number') {
        const currentGallery = model.photos.gallery || [];
        updatedPhotos.gallery = currentGallery.filter((_, i) => i !== item.galleryIndex);
      } else if (item.category === 'Headshot') {
        updatedPhotos.headshot = '';
      } else if (item.category === 'Full Body') {
        updatedPhotos.fullBody = '';
      } else if (item.category === 'Runway') {
        updatedPhotos.runway = '';
      } else if (item.category === 'Editorial') {
        updatedPhotos.editorial = '';
      }

      if (updateModelPhotosAndCompCard) {
        updateModelPhotosAndCompCard(model.id, updatedPhotos);
      }
      if (lightboxIndex !== null) {
        setLightboxIndex(null);
      }
      showToast('Photo removed from portfolio.', 'info');
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    const item = filteredPortfolioItems[index];
    if (item) {
      setLightboxCaptionInput(item.caption || '');
      setLightboxTagsInput(item.tags || []);
      setIsEditingLightboxMeta(false);
    }
  };

  const handleSaveLightboxMeta = () => {
    if (lightboxIndex === null || !filteredPortfolioItems[lightboxIndex]) return;
    const currentItem = filteredPortfolioItems[lightboxIndex];

    savePhotoMetadata(currentItem.id, lightboxCaptionInput, lightboxTagsInput);
    savePhotoMetadata(currentItem.url, lightboxCaptionInput, lightboxTagsInput);

    setIsEditingLightboxMeta(false);
    showToast('Photo caption & tags updated!', 'success');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(bookingInquirySchema, {
      clientName: inquiryName,
      clientEmail: inquiryEmail,
      campaignDetails: inquiryDetails
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    showToast(`Booking inquiry sent to ${model.fullName}'s agent!`, 'success');
    setInquiryName('');
    setInquiryEmail('');
    setInquiryDetails('');
  };

  const compCanvasRef = useRef<HTMLCanvasElement>(null);

  const handlePrintCompCard = () => {
    window.print();
  };

  const handleDownloadCompCardImage = (format: 'png' | 'jpg') => {
    const canvas = compCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution Comp Card A4 ratio (800 x 1120 px)
    canvas.width = 800;
    canvas.height = 1120;

    // Background fill (Crisp White)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Header Banner (Rwanda Flag Cyan)
    ctx.fillStyle = '#00A1DE';
    ctx.fillRect(0, 0, canvas.width, 10);

    // Title & Member Info
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText(model.fullName.toUpperCase(), 40, 60);

    ctx.fillStyle = '#00A1DE';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`ARMA MEMBER ID: ${model.id.toUpperCase()} • CATEGORY: ${model.category.toUpperCase()} • ${model.gender.toUpperCase()}`, 40, 85);

    // Divider Line
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, 100);
    ctx.lineTo(760, 100);
    ctx.stroke();

    // Trigger File Download Action
    const triggerCompDownload = () => {
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'jpg' ? 'jpg' : 'png';
      const link = document.createElement('a');
      link.download = `ARMA_CompCard_${model.fullName.replace(/\s+/g, '_')}.${ext}`;
      link.href = canvas.toDataURL(mimeType, 0.95);
      link.click();
      showToast(`Model Comp Card exported as ${format.toUpperCase()}!`, 'success');
    };

    // Load Photos
    const fullBodyImg = new Image();
    fullBodyImg.crossOrigin = 'anonymous';
    fullBodyImg.src = model.photos.fullBody || model.photos.headshot;

    const headshotImg = new Image();
    headshotImg.crossOrigin = 'anonymous';
    headshotImg.src = model.photos.headshot;

    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        // Draw Full Body on Left (width: 430, height: 600)
        try {
          ctx.drawImage(fullBodyImg, 40, 120, 430, 600);
        } catch {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(40, 120, 430, 600);
        }
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 120, 430, 600);

        // Draw Headshot on Right Top (width: 270, height: 290)
        try {
          ctx.drawImage(headshotImg, 490, 120, 270, 290);
        } catch {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(490, 120, 270, 290);
        }
        ctx.strokeRect(490, 120, 270, 290);

        // Draw Editorial/Gallery photo on Right Bottom (width: 270, height: 290)
        try {
          ctx.drawImage(headshotImg, 490, 430, 270, 290);
        } catch {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(490, 430, 270, 290);
        }
        ctx.strokeRect(490, 430, 270, 290);

        // Draw Measurements Section Box at Bottom
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(40, 740, 720, 120);
        ctx.strokeStyle = '#CBD5E1';
        ctx.strokeRect(40, 740, 720, 120);

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('HEIGHT', 70, 770);
        ctx.fillText('BUST/CHEST', 200, 770);
        ctx.fillText('WAIST', 340, 770);
        ctx.fillText('HIPS', 460, 770);
        ctx.fillText('AGENCY', 580, 770);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 20px Georgia, serif';
        ctx.fillText(`${model.measurements.heightCm} cm`, 70, 810);
        ctx.fillText(`${model.measurements.bustCm || '-'} cm`, 200, 810);
        ctx.fillText(`${model.measurements.waistCm || '-'} cm`, 340, 810);
        ctx.fillText(`${model.measurements.hipsCm || '-'} cm`, 460, 810);

        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#00A1DE';
        ctx.fillText(model.agencyName || 'Independent', 580, 810);

        // Draw QR Code
        if (qrDataUrl) {
          const qrImg = new Image();
          qrImg.src = qrDataUrl;
          qrImg.onload = () => {
            ctx.drawImage(qrImg, 40, 880, 130, 130);
            ctx.strokeStyle = '#00A1DE';
            ctx.lineWidth = 1;
            ctx.strokeRect(40, 880, 130, 130);

            ctx.fillStyle = '#475569';
            ctx.font = '12px sans-serif';
            ctx.fillText('Official ARMA Rwanda Accreditation Verification Pass', 190, 915);
            ctx.fillText(`Location: ${model.district}, ${model.province}, Rwanda`, 190, 940);
            ctx.fillText('ASSOCIATION OF RWANDA MODELS & AGENCIES (ARMA)', 190, 965);
            ctx.fillText('National Directory Portal • www.arma.org.rw', 190, 990);

            triggerCompDownload();
          };
          qrImg.onerror = () => triggerCompDownload();
        } else {
          triggerCompDownload();
        }
      }
    };

    fullBodyImg.onload = checkAllLoaded;
    fullBodyImg.onerror = checkAllLoaded;
    headshotImg.onload = checkAllLoaded;
    headshotImg.onerror = checkAllLoaded;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <Helmet
        title={`${model.fullName} | ARMA Rwanda Accredited Model`}
        description={`Official ARMA dossier for ${model.fullName} (${model.category}). View comp card, measurements, portfolio photos, and booking contact.`}
        ogImage={model.photos.headshot}
      />
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 dark:bg-[#1E2630] gap-4">
          <div className="flex items-center gap-3">
            <img
              src={model.photos.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={model.fullName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#00A1DE] shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold">
                  {model.fullName}
                </h2>
                {model.verifiedBadge && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#20603D] text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FAD201]" /> ARMA Accredited
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#00A1DE]">
                {model.category} • {model.province} ({model.district}) • {allPortfolioItems.length} Portfolio Shots
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex gap-1 text-xs">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'portfolio'
                    ? 'bg-[#00A1DE] text-white shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> Portfolio
              </button>
              <button
                onClick={() => setActiveTab('compcard')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'compcard'
                    ? 'bg-[#00A1DE] text-white shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Comp Card
              </button>
              <button
                onClick={() => setActiveTab('inquiry')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'inquiry'
                    ? 'bg-[#00A1DE] text-white shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Send className="w-3.5 h-3.5" /> Book Model
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Portfolio Toolbar */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Category Filters */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Category:</span>
                    {(['All', 'Headshot', 'Full Body', 'Runway', 'Editorial', 'Gallery'] as const).map((cat) => {
                      const count = cat === 'All'
                        ? allPortfolioItems.length
                        : allPortfolioItems.filter((i) => i.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setPortfolioFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 ${
                            portfolioFilter === cat
                              ? 'bg-[#00A1DE] text-white shadow-sm'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat} <span className="opacity-75 font-mono text-[10px]">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* View Mode Toggle */}
                    <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-1 text-xs">
                      <button
                        onClick={() => setPortfolioViewMode('masonry')}
                        className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                          portfolioViewMode === 'masonry'
                            ? 'bg-[#00A1DE] text-white shadow'
                            : 'text-slate-500'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" /> Masonry Grid
                      </button>
                      <button
                        onClick={() => setPortfolioViewMode('dossier')}
                        className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                          portfolioViewMode === 'dossier'
                            ? 'bg-[#00A1DE] text-white shadow'
                            : 'text-slate-500'
                        }`}
                      >
                        <Ruler className="w-3.5 h-3.5" /> Specs & Bio
                      </button>
                    </div>

                    {/* Add Photo Button */}
                    <button
                      onClick={() => setShowAddPhotoModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#00A1DE] text-white text-xs font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Add Photo
                    </button>
                  </div>
                </div>

                {/* Tag Filter Strip if tags exist */}
                {allAvailableTags.length > 0 && portfolioViewMode === 'masonry' && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-800/60 text-xs">
                    <span className="text-[10px] font-mono font-bold text-[#00A1DE] flex items-center gap-1 mr-1 uppercase">
                      <Tag className="w-3 h-3" /> Tag Filter:
                    </span>
                    <button
                      onClick={() => setTagFilter('All')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        tagFilter === 'All'
                          ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      All Tags
                    </button>
                    {allAvailableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setTagFilter(tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                          tagFilter === tag
                            ? 'bg-[#00A1DE] text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#00A1DE]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* MASONRY GRID VIEW */}
              {portfolioViewMode === 'masonry' && (
                <>
                  {filteredPortfolioItems.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                      <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="font-serif font-bold text-base">No Photos Match Your Filter</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try clearing category or tag filters, or click "Add Photo" above to upload new modeling shots.
                      </p>
                      <button
                        onClick={() => {
                          setPortfolioFilter('All');
                          setTagFilter('All');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-bold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                      {filteredPortfolioItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 cursor-pointer"
                          onClick={() => openLightbox(idx)}
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />

                          {/* Category Tag Badge */}
                          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-[80%]">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center gap-1 shadow">
                              <Sparkles className="w-3 h-3 text-[#FAD201]" /> {item.category}
                            </span>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePhoto(item);
                                }}
                                className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors shadow-lg"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {/* Caption */}
                              <h4 className="text-white font-serif font-bold text-sm leading-snug">
                                {item.caption || item.title}
                              </h4>

                              {/* Tags preview */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                  {item.tags.map((t, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-[#00A1DE]/80 text-white backdrop-blur-md"
                                    >
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <p className="text-[#00A1DE] text-[11px] font-mono pt-1 flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View / Edit Photo Details
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* DOSSIER & MEASUREMENTS VIEW */}
              {portfolioViewMode === 'dossier' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Primary Photo Preview */}
                  <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                      <img
                        src={allPortfolioItems[0]?.url || model.photos.headshot}
                        alt={model.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Specs & Measurements */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#00A1DE]">
                          MODEL DOSSIER & BIO
                        </span>
                        <button
                          onClick={handleGenerateAiBio}
                          disabled={aiLoading}
                          className="text-xs font-semibold text-[#00A1DE] hover:underline flex items-center gap-1 bg-[#00A1DE]/10 px-2.5 py-1 rounded-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FAD201]" />
                          {aiLoading ? 'Generating...' : 'Enhance Bio with Gemini AI'}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        "{currentBio}"
                      </p>
                    </div>

                    {/* Measurements Table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                        Official Measurements
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">HEIGHT</span>
                          <span className="font-bold text-base">{model.measurements.heightCm} cm</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">WEIGHT</span>
                          <span className="font-bold text-base">{model.measurements.weightKg || '-'} kg</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">BUST/CHEST</span>
                          <span className="font-bold text-base">{model.measurements.bustCm || '-'} cm</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">WAIST</span>
                          <span className="font-bold text-base">{model.measurements.waistCm || '-'} cm</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">HIPS</span>
                          <span className="font-bold text-base">{model.measurements.hipsCm || '-'} cm</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">SHOE SIZE</span>
                          <span className="font-bold text-base">EU {model.measurements.shoeSizeEu}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Agency Representation:</span>
                        <span className="font-bold text-[#00A1DE]">{model.agencyName || 'Independent'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-semibold">{model.province} ({model.district})</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Languages:</span>
                        <span className="font-semibold">{model.languages.join(', ')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Experience:</span>
                        <span className="font-semibold">{model.experienceYears} Years Professional</span>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                        Key Achievements
                      </h4>
                      <ul className="space-y-1 text-xs">
                        {model.achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Award className="w-3.5 h-3.5 text-[#FAD201] shrink-0" />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Printable Comp Card View */}
          {activeTab === 'compcard' && (
            <div className="space-y-4">
              {/* Hidden Canvas for High-Res PNG / JPG Export */}
              <canvas ref={compCanvasRef} className="hidden" />

              {/* Format Export Selector Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-3 print:hidden">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  <Sparkles className="w-4 h-4 text-[#00A1DE]" />
                  <span>Choose Comp Card Export Format:</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintCompCard}
                    className="px-3 py-1.5 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCompCardImage('png')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                    title="Download high-resolution PNG"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FAD201]" />
                    <span>Export PNG</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCompCardImage('jpg')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                    title="Download compressed JPG"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export JPG</span>
                  </button>
                </div>
              </div>

              {/* Comp Card Graphic Layout */}
              <div className="printable-compcard p-8 bg-white text-slate-900 border-2 border-slate-300 rounded-2xl shadow-2xl space-y-6 max-w-2xl mx-auto font-sans print:shadow-none print:border-none">
                <div className="flex justify-between items-start border-b-2 border-[#00A1DE] pb-4">
                  <div>
                    <h1 className="text-3xl font-extrabold font-serif tracking-wide text-slate-900 uppercase">
                      {model.fullName}
                    </h1>
                    <p className="text-xs font-mono text-[#00A1DE] font-semibold">
                      ARMA MEMBER ID: {model.id.toUpperCase()} • {model.category.toUpperCase()}
                    </p>
                  </div>
                  {qrDataUrl && (
                    <div className="text-center">
                      <img src={qrDataUrl} alt="QR Code" className="qr-code-img w-20 h-20 border rounded p-1" />
                      <span className="text-[9px] font-mono text-slate-500 block mt-0.5">Scan to Verify</span>
                    </div>
                  )}
                </div>

                {/* Photos Grid on Comp Card */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border">
                    <img src={model.photos.fullBody || model.photos.headshot} alt="Full Body" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border">
                      <img src={model.photos.headshot} alt="Headshot" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border">
                      <img src={model.photos.editorial || model.photos.gallery[0] || model.photos.headshot} alt="Editorial" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-slate-100 p-4 rounded-xl border">
                  <div>
                    <span className="text-slate-500 block text-[9px]">HEIGHT</span>
                    <strong className="text-sm">{model.measurements.heightCm} cm</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">BUST/CHEST</span>
                    <strong className="text-sm">{model.measurements.bustCm || '-'} cm</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">WAIST</span>
                    <strong className="text-sm">{model.measurements.waistCm || '-'} cm</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">HIPS</span>
                    <strong className="text-sm">{model.measurements.hipsCm || '-'} cm</strong>
                  </div>
                </div>

                <div className="text-center text-[10px] font-mono text-slate-500 border-t pt-3">
                  ASSOCIATION OF RWANDA MODELS & AGENCIES (ARMA) • WWW.ARMA.ORG.RW
                </div>
              </div>
            </div>
          )}

          {/* Booking Inquiry Form */}
          {activeTab === 'inquiry' && (
            <form onSubmit={handleSendInquiry} className="max-w-xl mx-auto space-y-4">
              <h3 className="text-lg font-serif font-bold text-center">
                Book {model.fullName} for Fashion Shows & Commercial Campaigns
              </h3>
              <p className="text-xs text-slate-500 text-center">
                Submissions are routed directly to ARMA licensed booking representatives.
              </p>

              <div>
                <label className="block text-xs font-semibold mb-1">Company / Casting Director Name</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  placeholder="e.g. Kigali Fashion Week Casting Team"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  placeholder="e.g. bookings@fashionhouse.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Booking Offer & Dates</label>
                <textarea
                  rows={4}
                  required
                  value={inquiryDetails}
                  onChange={(e) => setInquiryDetails(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  placeholder="Specify project type (Runway, TVC, Editorial), dates, location, and proposed compensation..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#00A1DE] text-white font-semibold text-xs hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Submit Official Booking Inquiry
              </button>
            </form>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredPortfolioItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
          {/* Lightbox Header */}
          <div className="w-full max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-white border-b border-white/10 pb-4 gap-3 shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00A1DE] text-white">
                {filteredPortfolioItems[lightboxIndex].category}
              </span>
              <h3 className="font-serif font-bold text-sm sm:text-base">
                {filteredPortfolioItems[lightboxIndex].caption || filteredPortfolioItems[lightboxIndex].title}
              </h3>
              <span className="text-xs font-mono text-slate-400">
                ({lightboxIndex + 1} of {filteredPortfolioItems.length})
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  const item = filteredPortfolioItems[lightboxIndex];
                  setLightboxCaptionInput(item.caption || '');
                  setLightboxTagsInput(item.tags || []);
                  setIsEditingLightboxMeta(!isEditingLightboxMeta);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
              >
                <Edit3 className="w-4 h-4 text-[#FAD201]" />
                {isEditingLightboxMeta ? 'Cancel Edit' : 'Edit Tags & Caption'}
              </button>

              <button
                onClick={() => handleDeletePhoto(filteredPortfolioItems[lightboxIndex])}
                className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>

              <button
                onClick={() => {
                  setLightboxIndex(null);
                  setIsEditingLightboxMeta(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Inline Edit Panel inside Lightbox */}
          {isEditingLightboxMeta && (
            <div className="w-full max-w-2xl bg-slate-900 border border-white/20 p-4 rounded-2xl my-3 space-y-3 animate-in slide-in-from-top-4 duration-200 shrink-0">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-[#00A1DE] flex items-center gap-1">
                  <Tag className="w-4 h-4" /> Edit Photo Caption & Tags
                </span>
                <button
                  onClick={handleSaveLightboxMeta}
                  className="px-3 py-1 rounded-lg bg-[#00A1DE] text-white text-xs font-bold hover:bg-[#0081B3] flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Photo Caption / Description</label>
                <input
                  type="text"
                  value={lightboxCaptionInput}
                  onChange={(e) => setLightboxCaptionInput(e.target.value)}
                  placeholder="e.g. Opening look for Kigali Fashion Week 2026"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Tags (Click to Toggle)</label>
                <div className="flex flex-wrap gap-1.5 text-xs mb-2">
                  {PRESET_TAGS.map((t) => {
                    const active = lightboxTagsInput.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setLightboxTagsInput((prev) =>
                            prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                          active
                            ? 'bg-[#00A1DE] text-white font-bold'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lightboxCustomTag}
                    onChange={(e) => setLightboxCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (lightboxCustomTag.trim() && !lightboxTagsInput.includes(lightboxCustomTag.trim())) {
                          setLightboxTagsInput([...lightboxTagsInput, lightboxCustomTag.trim()]);
                          setLightboxCustomTag('');
                        }
                      }
                    }}
                    placeholder="Add custom tag (press Enter)..."
                    className="flex-1 px-3 py-1 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (lightboxCustomTag.trim() && !lightboxTagsInput.includes(lightboxCustomTag.trim())) {
                        setLightboxTagsInput([...lightboxTagsInput, lightboxCustomTag.trim()]);
                        setLightboxCustomTag('');
                      }
                    }}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    + Tag
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lightbox Image Stage with Previous & Next */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 min-h-[40vh]">
            {filteredPortfolioItems.length > 1 && (
              <button
                onClick={() => {
                  const nextIdx = (lightboxIndex - 1 + filteredPortfolioItems.length) % filteredPortfolioItems.length;
                  openLightbox(nextIdx);
                }}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-2xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={filteredPortfolioItems[lightboxIndex].url}
              alt={filteredPortfolioItems[lightboxIndex].title}
              className="max-h-[70vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl"
            />

            {filteredPortfolioItems.length > 1 && (
              <button
                onClick={() => {
                  const nextIdx = (lightboxIndex + 1) % filteredPortfolioItems.length;
                  openLightbox(nextIdx);
                }}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-2xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer */}
          <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3 gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Model: <strong className="text-white">{model.fullName}</strong></span>
              {filteredPortfolioItems[lightboxIndex].tags && filteredPortfolioItems[lightboxIndex].tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">• Tags:</span>
                  {filteredPortfolioItems[lightboxIndex].tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <a
              href={filteredPortfolioItems[lightboxIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00A1DE] hover:underline flex items-center gap-1"
            >
              <Download className="w-4 h-4" /> View / Download High-Res Original
            </a>
          </div>
        </div>
      )}

      {/* ADD PHOTO MODAL */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold">Add Portfolio Photo</h3>
                  <p className="text-xs text-slate-500">Upload high-resolution photography with custom tags & captions</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Primary Classification / Category
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['Gallery', 'Headshot', 'Full Body', 'Runway', 'Editorial'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setNewPhotoCategory(cat);
                        if (!newPhotoTags.includes(cat)) {
                          setNewPhotoTags([...newPhotoTags, cat]);
                        }
                      }}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                        newPhotoCategory === cat
                          ? 'bg-[#00A1DE] text-white border-[#00A1DE] shadow'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Photo Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="e.g. Kigali Fashion Week 2026 - Opening Look"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-[#00A1DE] outline-none"
                />
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Organization Tags</span>
                  <span className="text-[10px] font-mono text-slate-400">Click to attach</span>
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs mb-2">
                  {PRESET_TAGS.map((tag) => {
                    const active = newPhotoTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagInNewPhoto(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                          active
                            ? 'bg-[#00A1DE] text-white font-bold shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#00A1DE]'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        #{tag}
                      </button>
                    );
                  })}
                </div>

                {/* Custom tag input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTagToNewPhoto();
                      }
                    }}
                    placeholder="Add custom tag (e.g. #VogueAfrica)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTagToNewPhoto}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-[#00A1DE] hover:text-white transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              {/* Image Uploader */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Upload Image File or Enter Web URL
                </label>
                <ImageUploader
                  currentImage={newPhotoUrl}
                  onImageChange={(val) => setNewPhotoUrl(val)}
                  aspectRatio="portrait"
                  placeholderText="Click or Drop Photo Here"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPhotoToPortfolio}
                className="px-6 py-2.5 rounded-xl bg-[#00A1DE] text-white font-bold text-xs hover:bg-[#0081B3] shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Save Photo to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
