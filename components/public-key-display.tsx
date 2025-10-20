'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Key } from 'lucide-react';

interface PublicKeyDisplayProps {
  publicKey: string;
  address: string;
}

export default function PublicKeyDisplay({ publicKey, address }: PublicKeyDisplayProps) {
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = async (text: string, type: 'public' | 'address') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'public') {
        setCopiedPublic(true);
        setTimeout(() => setCopiedPublic(false), 2000);
      } else {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="shadow-lg border-2 border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-slate-700" />
          <CardTitle>Public Key Information</CardTitle>
        </div>
        <CardDescription>Your wallet's public information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Public Key</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(publicKey, 'public')}
              className="h-8 gap-2"
            >
              {copiedPublic ? (
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
            <code className="text-xs break-all text-slate-700">{publicKey}</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Address</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(address, 'address')}
              className="h-8 gap-2"
            >
              {copiedAddress ? (
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
            <code className="text-xs break-all text-slate-700">{address}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
