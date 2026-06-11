import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Joueur } from '@/types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

export const JoueurLinkModal = () => {
  const { user, linkJoueur } = useAuth();
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show only if authenticated and no joueurId is currently set
    if (user && !user.joueurId && user.role !== 'admin') {
       // Check if they dismissed it this session, optional. We will just show it.
       setIsVisible(true);
       loadJoueurs();
    } else {
       setIsVisible(false);
    }
  }, [user]);

  const loadJoueurs = async () => {
    try {
      const snap = await getDocs(collection(db, 'joueurs'));
      setJoueurs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Joueur)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLink = async (joueur: Joueur) => {
    setLoading(true);
    try {
      await linkJoueur(joueur.id, joueur.name, joueur.avatarUrl);
      setIsVisible(false);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'association.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-neo-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-8 border-neo-black p-6 md:p-8 shadow-neo-xl max-w-2xl w-full relative rotate-1 max-h-[90vh] flex flex-col">
        <button 
          onClick={() => setIsVisible(false)} 
          className="absolute -top-4 -right-4 bg-neo-red text-white border-4 border-neo-black p-2 hover:-rotate-12 transition-transform shadow-[4px_4px_0px_#000]"
        >
          <X strokeWidth={4} />
        </button>

        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 text-center text-neo-blue leading-none">
          Associer mon compte
        </h2>
        
        <p className="text-lg font-bold text-center mb-6 bg-neo-cream p-3 border-4 border-neo-black -rotate-1 shadow-neo-sm">
          Vous participez à la compétiton MPP ? Associez votre compte à votre profil joueur !
        </p>

        <div className="flex-1 overflow-y-auto min-h-[300px] border-4 border-neo-black p-4 bg-gray-50 flex flex-col gap-4">
          {joueurs.length === 0 ? (
             <div className="text-center font-bold text-gray-500 py-8">Chargement des joueurs...</div>
          ) : (
            joueurs.map((j) => (
              <div key={j.id} className="flex items-center justify-between p-3 border-4 border-neo-black bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all">
                <div className="flex items-center gap-4">
                  {j.avatarUrl ? (
                    <img src={j.avatarUrl} alt={j.name} className="w-12 h-12 rounded-full border-2 border-neo-black object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-neo-black bg-neo-blue text-white flex items-center justify-center font-black">
                      {j.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-black uppercase text-xl">{j.name}</span>
                </div>
                <Button 
                  onClick={() => handleLink(j)} 
                  disabled={loading}
                  variant="primary" 
                  size="sm"
                >
                  C'EST MOI !
                </Button>
              </div>
            ))
          )}
        </div>
        
        <Button 
           variant="secondary" 
           onClick={() => setIsVisible(false)} 
           className="mt-6 w-full"
        >
           JE NE SUIS PAS UN JOUEUR
        </Button>
      </div>
    </div>
  );
};
