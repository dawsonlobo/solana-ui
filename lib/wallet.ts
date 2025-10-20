import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { derivePath }  from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58  from 'bs58';

export interface WalletKeys {
  publicKey: string;
  privateKey: string;
  address: string;
}

export function generateKeysFromSeed(seedPhrase: string, passphrase: string = '', accountIndex = 0, change = 0): WalletKeys | null {
  try {
    // if (!bip39.validateMnemonic(seedPhrase)) {
    //   return null;
    // }

    // const seed = bip39.mnemonicToSeedSync(seedPhrase, passphrase);
    // const derivedSeed = seed.slice(0, 32);

    // const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);

    // const publicKey = Buffer.from(keyPair.publicKey).toString('hex');
    // const privateKey = Buffer.from(keyPair.secretKey).toString('hex');
    // const address = publicKey.substring(0, 40);

    // return {
    //   publicKey,
    //   privateKey,
    //   address
    // };

    if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error('Invalid mnemonic phrase');
  }

  // Convert mnemonic to seed (64 bytes)
  const seed = bip39.mnemonicToSeedSync(seedPhrase, passphrase); // Buffer

  // Solana's standard derivation path: m/44'/501'/{accountIndex}'/{change}'
  // Some wallets (e.g., Phantom) use m/44'/501'/{accountIndex}' (without change index),
  // but using change index 0 is common and compatible.
  const path = `m/44'/501'/${accountIndex}'/${change}'`;

  // derivePath accepts seed as hex string or buffer — we pass hex string for compatibility
  const { key } = derivePath(path, seed.toString('hex')); // key is 32-byte Buffer

  // Create Solana Keypair from 32-byte private seed
  const keypair = Keypair.fromSeed(key);

  // For convenience return publicKey, secretKey (base58), and raw secret (Uint8Array)
  return {
    // keypair:keypair,
    publicKey: keypair.publicKey.toBase58(),
    address: keypair.publicKey.toBase58(),
    // secretKeyBase58: bs58.encode(keypair.secretKey), // 64-byte Uint8Array -> base58
    privateKey: bs58.encode(keypair.secretKey),
    // secretKeyBytes: keypair.secretKey, // Uint8Array (64 bytes: private + public)
    // derivationPath: path
  };
  } catch (error) {
    console.error('Error generating keys:', error);
    return null;
  }
}

export function signTransaction(privateKeyHex: string, transactionData: string): string {
  try {
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(transactionData);

    const signature = nacl.sign.detached(messageBytes, privateKey);

    return Buffer.from(signature).toString('hex');
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
}

export function verifySignature(publicKeyHex: string, message: string, signatureHex: string): boolean {
  try {
    const publicKey = Buffer.from(publicKeyHex, 'hex');
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const signature = Buffer.from(signatureHex, 'hex');

    return nacl.sign.detached.verify(messageBytes, signature, publicKey);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}
