'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = (window.navigator as any).standalone === true;

    if (isIOS && !isStandalone) {
      // Show iOS instructions after 3 seconds
      const iosTimer = setTimeout(() => {
        const hasSeenIOSPrompt = localStorage.getItem('ios-install-prompt-seen');
        if (!hasSeenIOSPrompt) {
          setShowIOSInstructions(true);
        }
      }, 3000);

      return () => clearTimeout(iosTimer);
    }

    // Handle Android/Desktop install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 5 seconds
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide prompt after successful install
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  const handleIOSDismiss = () => {
    setShowIOSInstructions(false);
    localStorage.setItem('ios-install-prompt-seen', 'true');
  };

  // iOS Instructions Banner
  if (showIOSInstructions) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-800 text-white p-4 shadow-lg animate-in slide-in-from-top">
        <div className="max-w-md mx-auto flex items-start gap-3">
          <Download className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold mb-1">Install AgriSense App</p>
            <p className="text-sm opacity-90">
              Tap <span className="inline-flex items-center px-1.5 py-0.5 bg-white/20 rounded">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </span> then "Add to Home Screen"
            </p>
          </div>
          <button
            onClick={handleIOSDismiss}
            className="text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Android/Desktop Install Button
  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 animate-in slide-in-from-bottom">
      <div className="bg-green-800 text-white rounded-2xl shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-semibold mb-1">Install AgriSense</p>
            <p className="text-sm opacity-90 mb-3">
              Install our app for quick access and offline use!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
