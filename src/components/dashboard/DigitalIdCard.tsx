import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, ShieldCheck, QrCode, CheckCircle2, Sparkles, Copy, Eye, X, Building2, MapPin } from 'lucide-react';
import { User, ModelProfile } from '../../types/arma';

interface DigitalIdCardProps {
  user: User;
  modelProfile?: ModelProfile;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ user, modelProfile, showToast }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showScanPreview, setShowScanPreview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const verificationUrl = `https://arma.org.rw/verify/${user.memberId}?name=${encodeURIComponent(user.name)}&role=${encodeURIComponent(user.role)}`;

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#12161A',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR Generation failed:', err));
  }, [user.memberId, verificationUrl]);

  const handleCopyVerificationLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    showToast('Official accreditation verification URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadImage = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI canvas dimensions (CR80 ID card ratio ~ 650x410 px)
    canvas.width = 650;
    canvas.height = 410;

    // Background fill (Dark Luxury Navy/Slate)
    ctx.fillStyle = '#12161A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Flag Accent Stripes at Top (Rwanda Cyan, Yellow, Green)
    ctx.fillStyle = '#00A1DE';
    ctx.fillRect(0, 0, canvas.width, 8);
    ctx.fillStyle = '#FAD201';
    ctx.fillRect(0, 8, canvas.width, 4);
    ctx.fillStyle = '#20603D';
    ctx.fillRect(0, 12, canvas.width, 4);

    // Border line
    ctx.strokeStyle = '#2A3644';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 22, canvas.width - 20, canvas.height - 32);

    // Header Text
    ctx.fillStyle = '#00A1DE';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('REPUBLIC OF RWANDA • ARMA NATIONAL DIRECTORY', 30, 48);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText('OFFICIAL DIGITAL ACCREDITATION PASS', 30, 72);

    // Divider
    ctx.strokeStyle = '#2A3644';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 84);
    ctx.lineTo(620, 84);
    ctx.stroke();

    // Trigger File Download Action
    const triggerFileDownload = () => {
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'jpg' ? 'jpg' : 'png';
      const link = document.createElement('a');
      link.download = `ARMA_Digital_ID_${user.memberId}.${ext}`;
      link.href = canvas.toDataURL(mimeType, 0.95);
      link.click();
      showToast(`Digital ID Accreditation Badge exported as ${format.toUpperCase()}!`, 'success');
    };

    // User Avatar drawing
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.src = user.avatar || modelProfile?.photos?.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';

    avatarImg.onload = () => {
      // Draw User Photo
      ctx.drawImage(avatarImg, 30, 100, 110, 130);
      ctx.strokeStyle = '#00A1DE';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 100, 110, 130);

      // User Details Text
      ctx.fillStyle = '#FAD201';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`MEMBER ID: ${user.memberId}`, 155, 115);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText(user.name, 155, 142);

      ctx.fillStyle = '#00A1DE';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`ROLE: ${user.role.toUpperCase()}`, 155, 165);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '12px sans-serif';
      const agencyName = modelProfile?.agencyName || user.agencyId || 'Independent Accredited Talent';
      ctx.fillText(`AGENCY: ${agencyName}`, 155, 185);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px sans-serif';
      const location = modelProfile ? `${modelProfile.district}, ${modelProfile.province}` : (user.location || 'Kigali City, Rwanda');
      ctx.fillText(`LOCATION: ${location}`, 155, 205);

      ctx.fillStyle = '#20603D';
      ctx.fillRect(155, 218, 140, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('VERIFIED NATIONAL TALENT', 163, 232);

      // Bottom Details
      ctx.fillStyle = '#64748B';
      ctx.font = '10px monospace';
      ctx.fillText(`ISSUED: 2026-01-15   |   STATUS: ACTIVE ACCREDITATION`, 30, 260);

      // Draw QR Code
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 480, 100, 130, 130);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.strokeRect(480, 100, 130, 130);

          ctx.fillStyle = '#00A1DE';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('SCAN TO VERIFY', 505, 245);

          // Watermark / Footer
          ctx.fillStyle = '#334155';
          ctx.fillRect(10, 360, 630, 38);
          ctx.fillStyle = '#94A3B8';
          ctx.font = '9px sans-serif';
          ctx.fillText('Property of ARMA Rwanda. Valid for official fashion shows, agency contracts, and casting entries.', 20, 382);

          triggerFileDownload();
        };
        qrImg.onerror = () => triggerFileDownload();
      } else {
        triggerFileDownload();
      }
    };

    avatarImg.onerror = () => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(30, 100, 110, 130);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText(user.name[0] || 'A', 75, 170);
      triggerFileDownload();
    };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hidden canvas used for high-res PNG export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Digital ID Accreditation Pass Card */}
      <div className="printable-id-card p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background Subtle Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>

        {/* Flag Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00A1DE] via-[#FAD201] to-[#20603D] rounded-full" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00A1DE] text-white flex items-center justify-center font-bold text-xs font-serif shadow-md">
              RW
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00A1DE] block tracking-wider">
                REPUBLIC OF RWANDA • ARMA DIRECTORY
              </span>
              <h2 className="text-sm sm:text-base font-serif font-bold text-white">
                Official Digital Accreditation Pass
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#20603D] text-white flex items-center gap-1 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-[#FAD201]" /> VERIFIED
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* User Photo */}
          <div className="relative group mx-auto sm:mx-0">
            <img
              src={user.avatar || modelProfile?.photos?.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={user.name}
              className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl object-cover border-2 border-[#00A1DE] shadow-xl"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[9px] font-mono text-[#FAD201] text-center border border-white/20">
              NATIONAL REGISTRY
            </div>
          </div>

          {/* User Details */}
          <div className="sm:col-span-1 space-y-2 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-mono text-[#FAD201] block font-bold">
                MEMBER ID: {user.memberId}
              </span>
              <h3 className="text-xl font-serif font-bold text-white">{user.name}</h3>
              <p className="text-xs font-semibold text-[#00A1DE]">{user.role}</p>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-[#00A1DE]" />
                <span>
                  {modelProfile?.agencyName || user.agencyId || 'Independent Accredited Model'}
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#FAD201]" />
                <span>
                  {modelProfile ? `${modelProfile.district}, ${modelProfile.province}` : (user.location || 'Kigali, Rwanda')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#20603D]/20 text-[#20603D] dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                ACCREDITED 2026
              </span>
            </div>
          </div>

          {/* High Density QR Code */}
          <div className="flex flex-col items-center justify-center space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="qr-code-img w-28 h-28 p-1.5 bg-white rounded-xl shadow-lg" />
            ) : (
              <div className="w-28 h-28 bg-slate-800 animate-pulse rounded-xl" />
            )}
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <QrCode className="w-3 h-3 text-[#00A1DE]" /> SCAN TO VERIFY
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar with Format Options (PDF, PNG, JPG) */}
        <div className="pt-4 border-t border-slate-800 space-y-2 print:hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD201]" /> Export & Print Format Options:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
              title="Print or Save as PDF via browser print dialogue"
            >
              <Printer className="w-4 h-4 text-[#00A1DE]" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => handleDownloadImage('png')}
              className="py-2.5 px-3 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow"
              title="Download high-definition PNG badge"
            >
              <Download className="w-4 h-4 text-[#FAD201]" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={() => handleDownloadImage('jpg')}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
              title="Download compressed JPG image"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export JPG</span>
            </button>

            <button
              onClick={() => setShowScanPreview(true)}
              className="py-2.5 px-3 rounded-xl bg-[#20603D] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              title="Preview QR scanner verification screen"
            >
              <Eye className="w-4 h-4 text-[#FAD201]" />
              <span>Scan Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Verification Link Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Official QR Verification Link
          </span>
          <p className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-md">
            {verificationUrl}
          </p>
        </div>

        <button
          onClick={handleCopyVerificationLink}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-colors flex items-center gap-1.5 shrink-0"
        >
          {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#00A1DE]" />}
          {copiedLink ? 'Copied!' : 'Copy Verification URL'}
        </button>
      </div>

      {/* QR Scanning Verification Modal Preview */}
      {showScanPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#20603D]" />
                <h3 className="font-serif font-bold text-base">ARMA Scanner Output</h3>
              </div>
              <button
                onClick={() => setShowScanPreview(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#20603D] text-white">
                  VALID & ACTIVE ACCREDITATION
                </span>
                <span className="text-[10px] font-mono text-slate-400">Live Firestore Lookup</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || modelProfile?.photos?.headshot}
                  alt={user.name}
                  className="w-14 h-14 rounded-xl object-cover border border-emerald-500/50"
                />
                <div>
                  <h4 className="font-serif font-bold text-base">{user.name}</h4>
                  <p className="text-xs font-mono text-[#00A1DE]">{user.role} • ID: {user.memberId}</p>
                  <p className="text-[11px] text-slate-500">
                    Agency: {modelProfile?.agencyName || 'Independent Model'}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] space-y-1 font-mono text-slate-600 dark:text-slate-300 border-t border-emerald-500/20">
                <p>✓ National Registry Verified: True</p>
                <p>✓ License Status: Active Standard</p>
                <p>✓ Verified Date: 2026-01-15</p>
              </div>
            </div>

            <button
              onClick={() => setShowScanPreview(false)}
              className="w-full py-2.5 rounded-xl bg-[#00A1DE] text-white font-semibold text-xs"
            >
              Close Scanner Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
