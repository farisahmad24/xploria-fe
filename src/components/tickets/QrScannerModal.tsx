import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  X,
  QrCode,
  AlertCircle,
  Upload,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  pendingSampleCodes?: string[];
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  pendingSampleCodes = [],
}) => {
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerId = 'qr-reader-target';

  // Helper untuk mengekstrak kode tiket jika isi QR berupa JSON atau URL
  const extractTicketCode = (rawText: string): string => {
    const text = rawText.trim();
    // Jika format URL: misal https://ploria.id/ticket/TK-20261108-001
    const urlMatch = text.match(/TK-\d{8}-\d{3}/i);
    if (urlMatch) {
      return urlMatch[0].toUpperCase();
    }
    // Jika format JSON: {"code": "TK-20261108-001"}
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.code === 'string') {
        return parsed.code.trim().toUpperCase();
      }
    } catch {
      // bukan JSON
    }
    return text.toUpperCase();
  };

  const handleDetected = (rawText: string) => {
    const cleanCode = extractTicketCode(rawText);
    setScannedCode(cleanCode);

    // Stop scanner
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current?.clear();
        })
        .catch(() => {});
    }

    // Berikan feedback visual sebentar lalu kirimkan ke form input
    setTimeout(() => {
      onScanSuccess(cleanCode);
      onClose();
    }, 600);
  };

  useEffect(() => {
    if (!isOpen) {
      setScannerError(null);
      setScannedCode(null);
      setIsStarting(false);
      return;
    }

    setIsStarting(true);
    setScannerError(null);
    setScannedCode(null);

    let isMounted = true;
    const scanner = new Html5Qrcode(containerId);
    html5QrCodeRef.current = scanner;

    const startScanner = async () => {
      try {
        const config = {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (isMounted) {
              handleDetected(decodedText);
            }
          },
          () => {
            // Error frame scanning biasa (saat frame belum menemukan QR) - diabaikan
          }
        );

        if (isMounted) {
          setIsStarting(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsStarting(false);
          const errMsg =
            typeof err === 'string'
              ? err
              : err?.message || 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.';
          setScannerError(errMsg);
        }
      }
    };

    // Jalankan setelah DOM elemen reader terpasang
    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scanner && scanner.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [isOpen]);

  // Handler jika user mengunggah file gambar QR
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !html5QrCodeRef.current) return;

    try {
      const decodedText = await html5QrCodeRef.current.scanFile(file, true);
      handleDetected(decodedText);
    } catch {
      setScannerError('Tidak dapat mendeteksi kode QR pada file gambar yang diunggah.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#286EF2] text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pindai QR Code Tiket</h3>
              <p className="text-xs text-blue-100">Arahkan kamera ke QR Code pada tiket pengunjung</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition"
            aria-label="Tutup pemindai"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder Container */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-inner">
            {/* HTML5 QR Code Container Target */}
            <div id={containerId} className="w-full h-full object-cover" />

            {/* Loading Indicator */}
            {isStarting && !scannerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white gap-3 z-10">
                <RefreshCw className="h-8 w-8 animate-spin text-[#286EF2]" />
                <p className="text-xs font-semibold text-slate-300">Mengaktifkan kamera...</p>
              </div>
            )}

            {/* Error Message */}
            {scannerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/95 text-white gap-3 z-10">
                <AlertCircle className="h-10 w-10 text-rose-400" />
                <p className="text-sm font-bold text-slate-200">Gagal Mengakses Kamera</p>
                <p className="text-xs text-slate-400 max-w-xs">{scannerError}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  <Upload className="h-4 w-4" />
                  <span>Unggah Gambar QR</span>
                </button>
              </div>
            )}

            {/* Success Animation */}
            {scannedCode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/90 text-white gap-2 z-20 animate-scaleUp">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-bounce" />
                <p className="text-sm font-bold text-white">QR Berhasil Terbaca!</p>
                <p className="font-mono text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-emerald-200">
                  {scannedCode}
                </p>
              </div>
            )}

            {/* Target Laser Overlay (hanya saat aktif) */}
            {!isStarting && !scannerError && !scannedCode && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 rounded-2xl border-2 border-dashed border-[#286EF2]/80 relative flex items-center justify-center">
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#286EF2] to-transparent animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Opsi Tambahan: Upload File & Simulasi */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>Unggah Gambar QR</span>
            </button>

            {pendingSampleCodes.length > 0 && (
              <button
                type="button"
                onClick={() => handleDetected(pendingSampleCodes[0])}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 px-3.5 py-2 text-xs font-bold text-[#286EF2] hover:bg-blue-100 transition shadow-xs"
                title="Simulasi scan otomatis tiket antrean pertama"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Simulasi Scan ({pendingSampleCodes[0]})</span>
              </button>
            )}
          </div>

          <p className="mt-3 text-[11px] text-slate-400 text-center">
            Posisikan QR code tiket di dalam kotak pemindai untuk membaca kode otomatis.
          </p>
        </div>
      </div>
    </div>
  );
};
