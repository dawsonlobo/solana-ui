'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signTransaction } from '@/lib/wallet';
import { generateQRCode } from '@/lib/qr';
import { Camera, Copy, Check, FileSignature, AlertCircle, QrCode, StopCircle } from 'lucide-react';
import Image from 'next/image';

interface TransactionSignerProps {
  privateKey: string;
  publicKey: string;
}

export default function TransactionSigner({ privateKey, publicKey }: TransactionSignerProps) {
  const [transactionData, setTransactionData] = useState('');
  const [signature, setSignature] = useState('');
  const [signatureQR, setSignatureQR] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [scanner]);

  const handleSign = async () => {
    setError('');
    setSignature('');
    setSignatureQR('');

    if (!transactionData.trim()) {
      setError('Please enter transaction data to sign');
      return;
    }

    try {
      const sig = signTransaction(privateKey, transactionData);
      setSignature(sig);

      const qr = await generateQRCode(sig);
      setSignatureQR(qr);
    } catch (err) {
      console.error('Error signing transaction:', err);
      setError('Failed to sign transaction. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const startScanning = async () => {
    setError('');

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('transaction-qr-reader');

      const qrCodeSuccessCallback = (decodedText: string) => {
        setTransactionData(decodedText);
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileSignature className="w-5 h-5" />
          Sign Transaction
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter transaction data or scan a QR code to sign
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transactionData">Transaction Data</Label>
          <Textarea
            id="transactionData"
            placeholder="Enter transaction data to sign"
            value={transactionData}
            onChange={(e) => setTransactionData(e.target.value)}
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          {!scanning ? (
            <Button onClick={startScanning} variant="outline" className="gap-2">
              <Camera className="w-4 h-4" />
              Scan QR
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="outline" className="gap-2">
              <StopCircle className="w-4 h-4" />
              Stop Scan
            </Button>
          )}
          <Button onClick={handleSign} className="gap-2">
            <FileSignature className="w-4 h-4" />
            Sign Transaction
          </Button>
        </div>

        <div
          id="transaction-qr-reader"
          className={`w-full max-w-md ${scanning ? 'block' : 'hidden'} rounded-lg overflow-hidden border-2 border-slate-200 mt-4`}
        ></div>

        {signature && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Signature</Label>
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
              <div className="bg-slate-100 p-3 rounded-md border border-slate-200">
                <code className="text-xs break-all text-slate-700">{signature}</code>
              </div>
            </div>

            {signatureQR && (
              <div className="flex flex-col items-center space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Signature QR Code
                </Label>
                <div className="bg-white p-4 rounded-lg border-2 border-slate-200 shadow-md">
                  <Image src={signatureQR} alt="Signature QR Code" width={250} height={250} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
