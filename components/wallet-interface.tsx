'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletKeys } from '@/lib/wallet';
import PublicKeyDisplay from '@/components/public-key-display';
import QRCodeGenerator from '@/components/qr-code-generator';
import QRScanner from '@/components/qr-scanner';
import TransactionSigner from '@/components/transaction-signer';
import PrivateKeyDisplay from '@/components/private-key-display';
import { Wallet, LogOut } from 'lucide-react';

interface WalletInterfaceProps {
  walletKeys: WalletKeys;
  onLogout: () => void;
}

export default function WalletInterface({ walletKeys, onLogout }: WalletInterfaceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-3 rounded-full">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">My Wallet</h1>
          </div>
          <Button onClick={onLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          <PublicKeyDisplay publicKey={walletKeys.publicKey} address={walletKeys.address} />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Wallet Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="qr-generate" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="qr-generate">Generate QR</TabsTrigger>
                  <TabsTrigger value="qr-scan">Scan QR</TabsTrigger>
                  <TabsTrigger value="sign">Sign Transaction</TabsTrigger>
                  <TabsTrigger value="private">Private Key</TabsTrigger>
                </TabsList>

                <TabsContent value="qr-generate" className="mt-6">
                  <QRCodeGenerator publicKey={walletKeys.publicKey} address={walletKeys.address} />
                </TabsContent>

                <TabsContent value="qr-scan" className="mt-6">
                  <QRScanner />
                </TabsContent>

                <TabsContent value="sign" className="mt-6">
                  <TransactionSigner privateKey={walletKeys.privateKey} publicKey={walletKeys.publicKey} />
                </TabsContent>

                <TabsContent value="private" className="mt-6">
                  <PrivateKeyDisplay privateKey={walletKeys.privateKey} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
