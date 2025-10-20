"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, Check, Eye, ShieldAlert, EyeOff } from "lucide-react";

interface PrivateKeyDisplayProps {
  privateKey: string;
}

export default function PrivateKeyDisplay({
  privateKey,
}: PrivateKeyDisplayProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleHide = () => {
    setRevealed(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Private Key
        </h3>
      </div>

      <Alert variant="destructive" className="border-2">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription className="font-semibold">
          Warning: Never share your private key with anyone. Anyone with access
          to your private key has full control over your wallet.
        </AlertDescription>
      </Alert>

      {!revealed ? (
        <div className="space-y-4">
          <div className="bg-slate-100 p-8 rounded-lg border-2 border-dashed border-slate-300 text-center">
            <EyeOff className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm text-muted-foreground">
              Your private key is hidden for security
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2" size="lg">
                <Eye className="w-4 h-4" />
                Reveal Private Key
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-destructive" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <p>
                      Revealing your private key exposes sensitive information.
                      Make sure:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>You are in a private location</li>
                      <li>No one is watching your screen</li>
                      <li>You understand the security implications</li>
                    </ul>
                    <p className="font-semibold pt-2">
                      Do not share this key with anyone or enter it on untrusted
                      websites.
                    </p>
                  </div>
                </AlertDialogDescription> 
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReveal}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  I Understand, Reveal Key
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-destructive">
                Private Key (Visible)
              </Label>
              <div className="flex gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHide}
                  className="h-8 gap-2"
                >
                  <EyeOff className="w-4 h-4" />
                  Hide
                </Button>
              </div>
            </div>
            <div className="bg-destructive/10 p-4 rounded-md border-2 border-destructive/30">
              <code className="text-xs break-all text-slate-900 font-semibold">
                {privateKey}
              </code>
            </div>
          </div>

          <Alert className="border-amber-500 bg-amber-50">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              Your private key is currently visible. Hide it when youre done.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
