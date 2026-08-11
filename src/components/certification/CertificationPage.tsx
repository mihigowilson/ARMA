import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Search, CheckCircle2, AlertCircle, QrCode, Download, Printer, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';

export const CertificationPage: React.FC = () => {
  const { certificates, showToast } = useAuth();
  const [searchCode, setSearchCode] = useState('');
  const [searchedRecord, setSearchedRecord] = useState<any | null>(certificates[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [certQrUrl, setCertQrUrl] = useState('');

  const certCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleDownloadCertImage = (format: 'png' | 'jpg') => {
    if (!searchedRecord) return;
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 650;

    // Background fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Border
    ctx.strokeStyle = '#00A1DE';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = '#FAD201';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // Header Text
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASSOCIATION OF RWANDA MODELS & AGENCIES', canvas.width / 2, 90);

    ctx.fillStyle = '#00A1DE';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('REPUBLIC OF RWANDA • NATIONAL ACCREDITATION BOARD', canvas.width / 2, 115);

    // Title
    ctx.fillStyle = '#64748B';
    ctx.font = '13px monospace';
    ctx.fillText('OFFICIAL CERTIFICATE OF ACCOMPLISHMENT', canvas.width / 2, 160);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(searchedRecord.courseTitle || 'National Professional Accreditation', canvas.width / 2, 200);

    ctx.fillStyle = '#64748B';
    ctx.font = '14px sans-serif';
    ctx.fillText('This is to officially certify that', canvas.width / 2, 245);

    ctx.fillStyle = '#00A1DE';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(searchedRecord.recipientName, canvas.width / 2, 295);

    ctx.fillStyle = '#475569';
    ctx.font = '13px sans-serif';
    ctx.fillText('has met all professional standards, ethics codes, and catwalk qualifications required under the ARMA Rwanda National Charter.', canvas.width / 2, 345);

    // Certificate Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('CERTIFICATE NO.', 80, 420);
    ctx.fillText('ISSUE DATE', 350, 420);
    ctx.fillText('ISSUING AUTHORITY', 620, 420);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(searchedRecord.certificateNumber, 80, 445);
    ctx.fillText(searchedRecord.issueDate, 350, 445);
    ctx.fillText(searchedRecord.issuerName || 'ARMA Secretariat', 620, 445);

    // Seal and QR
    const triggerCertDownload = () => {
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'jpg' ? 'jpg' : 'png';
      const link = document.createElement('a');
      link.download = `ARMA_Certificate_${searchedRecord.certificateNumber}.${ext}`;
      link.href = canvas.toDataURL(mimeType, 0.95);
      link.click();
      showToast(`Certificate exported as ${format.toUpperCase()}!`, 'success');
    };

    if (certQrUrl) {
      const qrImg = new Image();
      qrImg.src = certQrUrl;
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 730, 490, 110, 110);
        ctx.strokeStyle = '#00A1DE';
        ctx.lineWidth = 1;
        ctx.strokeRect(730, 490, 110, 110);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 13px Georgia, serif';
        ctx.fillText('Hon. Sandrine Umutoni, President', 80, 540);
        ctx.fillStyle = '#64748B';
        ctx.font = '11px monospace';
        ctx.fillText('OFFICIAL DIGITAL SEAL & SIGNATURE', 80, 560);

        triggerCertDownload();
      };
      qrImg.onerror = () => triggerCertDownload();
    } else {
      triggerCertDownload();
    }
  };

  React.useEffect(() => {
    if (searchedRecord) {
      QRCode.toDataURL(searchedRecord.qrCodeData || `https://arma.org.rw/verify/${searchedRecord.certificateNumber}`, { margin: 1, width: 140 })
        .then((url) => setCertQrUrl(url))
        .catch((err) => console.error(err));
    }
  }, [searchedRecord]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setErrorMsg('');
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(searchCode.trim())}`);
      const data = await res.json();
      if (data.found && data.record) {
        setSearchedRecord(data.record);
        showToast('Official ARMA Certificate / ID verified successfully!', 'success');
      } else {
        setErrorMsg('No official record matching code. Beware of unaccredited certificates.');
        setSearchedRecord(null);
        showToast('Verification failed: Code not found in registry', 'error');
      }
    } catch (err) {
      // Local fallback lookup
      const found = certificates.find((c) => c.certificateNumber.toLowerCase().includes(searchCode.toLowerCase()));
      if (found) {
        setSearchedRecord(found);
        showToast('Certificate verified locally', 'success');
      } else {
        setErrorMsg('Invalid or unverified certificate code.');
        setSearchedRecord(null);
      }
    }
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-[#00A1DE]" />
            NATIONAL CERTIFICATION & ACCREDITATION VERIFICATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            Official QR Certificate Verification
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Verify the authenticity of ARMA Catwalk Masterclass Certificates, Agency Operational Licenses, and Member Accreditations instantly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <form onSubmit={handleVerify} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Certificate Code (e.g. ARMA-CERT-2026-8801)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase focus:outline-none focus:border-[#00A1DE]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors shadow"
            >
              Verify Now
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}
        </div>

        {/* Certificate Display Card */}
        {searchedRecord && (
          <div className="space-y-4 max-w-3xl mx-auto my-8">
            {/* Hidden canvas for high-res PNG / JPG certificate export */}
            <canvas ref={certCanvasRef} className="hidden" />

            <div className="printable-certificate p-10 bg-white text-slate-900 border-4 border-[#00A1DE] rounded-3xl shadow-2xl relative space-y-6 print:shadow-none print:border-none font-serif">
              {/* Watermark Emblem */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <ShieldCheck className="w-96 h-96 text-[#00A1DE]" />
              </div>

              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#00A1DE] flex items-center justify-center font-extrabold text-2xl">
                    A
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-wider uppercase">
                      ASSOCIATION OF RWANDA MODELS & AGENCIES
                    </h2>
                    <span className="text-[10px] font-mono text-[#00A1DE] font-bold block">
                      REPUBLIC OF RWANDA • NATIONAL ACCREDITATION BOARD
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#20603D] text-white flex items-center gap-1 shadow">
                  <CheckCircle2 className="w-4 h-4 text-[#FAD201]" /> VERIFIED AUTHENTIC
                </span>
              </div>

              <div className="text-center space-y-4 py-4 relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Official Certificate of Accomplishment
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {searchedRecord.courseTitle || 'National Professional Accreditation'}
                </h1>
                <p className="text-xs font-sans text-slate-600">This is to officially certify that</p>
                <h2 className="text-3xl font-bold text-[#00A1DE] font-sans underline decoration-2 underline-offset-4">
                  {searchedRecord.recipientName}
                </h2>
                <p className="text-xs font-sans text-slate-600 max-w-lg mx-auto">
                  has met all professional standards, ethics codes, and catwalk qualifications required under the ARMA Rwanda National Charter.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 relative z-10 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">CERTIFICATE NUMBER</span>
                  <strong className="text-slate-900">{searchedRecord.certificateNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ISSUE DATE</span>
                  <strong className="text-slate-900">{searchedRecord.issueDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ISSUER AUTHORITY</span>
                  <strong className="text-[#00A1DE]">{searchedRecord.issuerName || 'ARMA Secretariat'}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">OFFICIAL DIGITAL SEAL</span>
                  <div className="font-mono text-[11px] font-bold text-slate-800">
                    Hon. Sandrine Umutoni, President
                  </div>
                </div>

                {certQrUrl && (
                  <div className="text-center">
                    <img src={certQrUrl} alt="QR Code" className="qr-code-img w-20 h-20 border rounded p-1" />
                    <span className="text-[8px] font-mono text-slate-500 block">QR Validated</span>
                  </div>
                )}
              </div>

              {/* Format Toolbar Options */}
              <div className="pt-4 border-t border-slate-200 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                  Select Export Format:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-4 h-4" /> Print / PDF
                  </button>
                  <button
                    onClick={() => handleDownloadCertImage('png')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                    title="Export high-res PNG image"
                  >
                    <Download className="w-4 h-4 text-[#FAD201]" /> Export PNG
                  </button>
                  <button
                    onClick={() => handleDownloadCertImage('jpg')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                    title="Export compressed JPG image"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Export JPG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
