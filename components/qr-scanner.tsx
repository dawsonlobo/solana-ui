'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, StopCircle, Copy, Check, AlertCircle } from 'lucide-react';

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    setError('');
    setScannedData('');

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader');

      const qrCodeSuccessCallback = (decodedText: string) => {
        setScannedData(decodedText);
        html5QrCode.stop();
        setScanning(false);
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        () => {}
      );

      setScanner(html5QrCode);
      setScanning(true);
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setError(err?.message || 'Failed to start camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      try {
        await scanner.stop();
        setScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Scan QR Code
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use your webcam to scan a QR code
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div
          id="qr-reader"
          className={`w-full max-w-md ${scanning ? 'block' : 'hidden'} rounded-lg overflow-hidden border-2 border-slate-200`}
        ></div>

        {!scanning && !scannedData && (
          <div className="w-full max-w-md h-64 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center p-6">
              <Camera className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-sm text-muted-foreground">Click below to start scanning</p>
            </div>
          </div>
        )}

        {scannedData && (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Scanned Data</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-slate-100 p-4 rounded-md border border-slate-200">
              <code className="text-sm break-all text-slate-700">{scannedData}</code>
            </div>
          </div>
        )}

        {!scanning ? (
          <Button onClick={startScanning} className="gap-2" size="lg">
            <Camera className="w-4 h-4" />
            Start Scanning
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="destructive" className="gap-2" size="lg">
            <StopCircle className="w-4 h-4" />
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  );
}
