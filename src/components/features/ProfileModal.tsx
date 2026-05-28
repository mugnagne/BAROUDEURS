import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoUrl(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateUserProfile(pseudo, photoUrl);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neo-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-8 border-neo-black p-8 shadow-neo-xl max-w-md w-full relative -rotate-1">
        <button onClick={onClose} className="absolute -top-6 -right-6 bg-neo-red text-white border-4 border-neo-black p-2 hover:-rotate-12 transition-transform">
          <X strokeWidth={4} />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tight mb-8 text-center text-neo-blue">
          Mon Profil
        </h2>

        {error && <div className="bg-neo-red text-white p-4 font-bold border-4 border-neo-black mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-black uppercase mb-2">Pseudo</label>
            <input 
              type="text" 
              value={pseudo} 
              onChange={e => setPseudo(e.target.value)}
              className="w-full border-4 border-neo-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow" 
              required 
            />
          </div>
          <div>
            <label className="block font-black uppercase mb-2">Photo de profil</label>
            <div className="flex flex-col gap-4">
               {photoUrl && (
                  <div className="w-24 h-24 border-4 border-neo-black bg-neo-cream rounded-full mx-auto overflow-hidden">
                     <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
               )}
               <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleImageUpload}
                  className="w-full border-4 text-sm border-neo-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-4 file:border-neo-black file:font-black file:uppercase file:bg-neo-blue file:text-white hover:file:bg-neo-red cursor-pointer" 
               />
               <input 
                 type="url" 
                 value={photoUrl.startsWith('data:') ? '' : photoUrl} 
                 onChange={e => setPhotoUrl(e.target.value)}
                 placeholder="Ou entrez une URL (https://...)"
                 className="w-full border-4 border-neo-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow text-sm" 
               />
            </div>
          </div>
          
          <Button type="submit" variant="primary" className="w-full shadow-neo-sm" disabled={loading}>
            {loading ? 'SAUVEGARDE...' : 'SAUVEGARDER'}
          </Button>
        </form>
      </div>
    </div>
  );
};
