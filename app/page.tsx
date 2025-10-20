'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateKeysFromSeed } from '@/lib/wallet';
import WalletInterface from '@/components/wallet-interface';
import { Key, AlertCircle } from 'lucide-react';

export default function Home() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [walletKeys, setWalletKeys] = useState<any>(null);
  const [error, setError] = useState('');

  const handleRestoreWallet = () => {
    setError('');

    if (!seedPhrase.trim()) {
      setError('Please enter a seed phrase');
      return;
    }

    const keys = generateKeysFromSeed(seedPhrase.trim(), passphrase);

    if (!keys) {
      setError('Invalid seed phrase. Please check and try again.');
      return;
    }

    setWalletKeys(keys);
  };

  const handleLogout = () => {
    setWalletKeys(null);
    setSeedPhrase('');
    setPassphrase('');
    setError('');
  };

  if (walletKeys) {
    return <WalletInterface walletKeys={walletKeys} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-900 p-4 rounded-full">
              <Key className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Restore Wallet</CardTitle>
          <CardDescription className="text-base">
            Enter your seed phrase to access your wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="seedPhrase" className="text-base font-semibold">
              Seed Phrase
            </Label>
            <Textarea
              id="seedPhrase"
              placeholder="Enter your 12 or 24 word seed phrase"
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Separate each word with a space
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passphrase" className="text-base font-semibold">
              BIP39 Passphrase (Optional)
            </Label>
            <Input
              id="passphrase"
              type="password"
              placeholder="Optional passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty if you didn't set a passphrase
            </p>
          </div>

          <Button
            onClick={handleRestoreWallet}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            Access Wallet
          </Button>

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Your wallet session will be destroyed after refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
