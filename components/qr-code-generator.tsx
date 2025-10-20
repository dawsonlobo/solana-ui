'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateQRCode } from '@/lib/qr';
import { Download, QrCode } from 'lucide-react';
import Image from 'next/image';

interface QRCodeGeneratorProps {
  publicKey: string;
  address: string;
}

export default function QRCodeGenerator({ publicKey, address }: QRCodeGeneratorProps) {
  const [qrType, setQrType] = useState<'publicKey' | 'address'>('address');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const data = qrType === 'publicKey' ? publicKey : address;
      const qr = await generateQRCode(data);
      setQrDataUrl(qr);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrType) {
      generateQR();
    }
  }, [qrType]);

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `wallet-${qrType}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Generate QR Code
        </h3>
        <RadioGroup value={qrType} onValueChange={(value) => setQrType(value as 'publicKey' | 'address')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="address" id="address" />
            <Label htmlFor="address" className="cursor-pointer">
              Address
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="publicKey" id="publicKey" />
            <Label htmlFor="publicKey" className="cursor-pointer">
              Public Key
            </Label>
          </div>
        </RadioGroup>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      ) : qrDataUrl ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-slate-200 shadow-md">
            <Image src={qrDataUrl} alt="QR Code" width={300} height={300} />
          </div>
          <Button onClick={downloadQR} className="gap-2">
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>
      ) : null}
    </div>
  );
}
