import React, { useState, useEffect } from 'react';
import { AuthModal } from './features/AuthModal';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export const WelcomePopup = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const hasSeen = localStorage.getItem('hasSeenWelcomePopup');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [user, loading]);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcomePopup', 'true');
    setIsOpen(false);
  };

  const handleConnect = () => {
    localStorage.setItem('hasSeenWelcomePopup', 'true');
    setIsOpen(false);
    setShowAuthModal(true);
  };

  if (!isOpen && !showAuthModal) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-neo-cream border-8 border-neo-black p-8 w-full max-w-md shadow-neo-xl relative rotate-1">
            <button onClick={handleClose} className="absolute -top-6 -right-6 bg-neo-red text-white border-4 border-neo-black p-2 hover:rotate-12 transition-transform shadow-neo-sm">
              <X strokeWidth={4} />
            </button>
            <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter mb-8 text-center leading-tight">
              Nouveau ici ?<br/> Connecte toi pour profiter à 100% du blog
            </h3>
            <div className="flex flex-col gap-4">
              <Button onClick={handleConnect} variant="primary" size="lg" className="w-full text-xl h-14">
                SE CONNECTER
              </Button>
              <Button onClick={handleClose} variant="ghost" className="w-full h-12 text-neo-black uppercase font-black">
                UNE PROCHAINE FOIS
              </Button>
            </div>
          </div>
        </div>
      )}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
