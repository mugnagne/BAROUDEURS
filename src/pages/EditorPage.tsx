import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { savePost, updatePost, getPost } from '@/data/mockPosts';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { MatchReportEditor } from '@/components/features/MatchReportEditor';
import { MatchDetails, BlogPost, Joueur, MailingList } from '@/types';
import { useAuth } from '@/lib/auth';
import { convertImageToBase64 } from '@/lib/imageUtils';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { X, Trophy, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

export const EditorPage = () => {
  const { id: editId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMatchReport, setIsMatchReport] = useState(true);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | undefined>();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    imageUrl: '',
    tags: ''
  });
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [selectedJoueurs, setSelectedJoueurs] = useState<string[]>([]);
  const [mailingLists, setMailingLists] = useState<MailingList[]>([]);
  const [selectedMailingList, setSelectedMailingList] = useState<string>('');
  const [showHallOfFamePopup, setShowHallOfFamePopup] = useState(false);

  useEffect(() => {
    if (!user || !['admin', 'author'].includes(user.role as string)) {
      navigate('/');
    } else {
       getDocs(collection(db, 'joueurs')).then(snap => {
         setJoueurs(snap.docs.map(d => ({id: d.id, ...d.data()} as Joueur)));
       }).catch(console.error);

       getDocs(collection(db, 'mailingLists')).then(snap => {
         setMailingLists(snap.docs.map(d => ({id: d.id, ...d.data()} as MailingList)));
       }).catch(console.error);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (editId) {
      getPost(editId).then(existingPost => {
        if (existingPost) {
          if (existingPost.ownerId !== user?.uid) {
            navigate('/blog');
            return;
          }
          setFormData({
              title: existingPost.title || '',
              summary: existingPost.summary || '',
              content: existingPost.content || '',
              author: existingPost.author || '',
              imageUrl: existingPost.imageUrl || '',
              tags: existingPost.tags?.join(', ') || ''
          });
          setIsMatchReport(!!existingPost.isMatchReport);
          setMatchDetails(existingPost.matchDetails);
          setSelectedJoueurs(existingPost.joueurIds || []);
          setSelectedMailingList(existingPost.mailingListId || '');
        }
      }).catch(err => console.error("Failed to fetch post", err));
    }
  }, [editId, user, navigate]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      setFormData(prev => ({ ...prev, imageUrl: base64 }));
    } catch (error) {
      console.error("Failed to convert image", error);
      alert("Erreur lors de l'import de l'image");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return; // Prevent submission if not logged in

    const id = editId || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const postData: any = {
      id,
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      author: formData.author || 'ANONYMOUS FAN',
      ownerId: user.uid,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbb6b49048?q=80&w=2000&auto=format&fit=crop',
      date: new Date().toISOString(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      isMatchReport,
      joueurIds: selectedJoueurs,
      mailingListId: selectedMailingList
    };

    if (isMatchReport && matchDetails) {
      postData.matchDetails = matchDetails;
    }

    if (editId) {
      await updatePost(editId, postData as BlogPost);
    } else {
      await savePost(postData as BlogPost);
      try {
        await fetch('/api/email/notify-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: postData.title,
            author: postData.author,
            url: window.location.origin + `/blog/${id}`
          })
        });
      } catch (err) {
        console.error("Failed to trigger email notification:", err);
      }
    }
    
    navigate(`/blog/${id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-6 sm:py-12">
      <div className="bg-white border-8 border-neo-black p-6 sm:p-8 md:p-12 shadow-neo-xl rotate-1 mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-balance">
          {editId ? "MODIFIER L'ARTICLE" : "ENVOIE TES INFOS"}
        </h1>
        <p className="text-lg sm:text-xl font-bold uppercase text-neo-red text-balance">
          {editId ? "METS À JOUR TES ANALYSES ET RUMEURS." : "UN SCOOP ? UNE ANALYSE TACTIQUE ? SOUMETS-LE ICI."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-white p-4 sm:p-6 md:p-8 border-4 sm:border-8 border-neo-black shadow-neo-lg -rotate-1 relative overflow-hidden max-w-full w-full box-border">
        <div className="absolute inset-0 bg-american-stripes opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <label htmlFor="title" className="block text-xl sm:text-2xl font-black uppercase mb-2">Titre / Manchette</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all placeholder:text-neo-black/40"
            placeholder="FAIS DU BRUIT."
          />
        </div>

        <div className="relative z-10">
          <label htmlFor="summary" className="block text-xl sm:text-2xl font-black uppercase mb-2">Résumé</label>
          <input
            type="text"
            id="summary"
            name="summary"
            required
            value={formData.summary}
            onChange={handleChange}
            className="w-full h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all placeholder:text-neo-black/40"
            placeholder="LE RÉSUMÉ EN BREF."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 relative z-10">
          <div className="flex-1">
            <label htmlFor="author" className="block text-xl sm:text-2xl font-black uppercase mb-2">Alias / Auteur</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all placeholder:text-neo-black/40"
              placeholder="EX: OEIL D'AIGLE"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="tags" className="block text-xl sm:text-2xl font-black uppercase mb-2">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all placeholder:text-neo-black/40"
              placeholder="USA, TACTIQUE..."
            />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 py-4">
          <input
            type="checkbox"
            id="isMatchReport"
            checked={isMatchReport}
            onChange={(e) => setIsMatchReport(e.target.checked)}
            className="w-6 h-6 border-4 border-neo-black"
          />
          <label htmlFor="isMatchReport" className="text-xl font-black uppercase">Ceci est un compte-rendu de match</label>
        </div>

        {isMatchReport && (
          <div className="relative z-10">
            <MatchReportEditor data={matchDetails} onChange={setMatchDetails} />
          </div>
        )}

        <div className="relative z-10">
           <label htmlFor="imageUrl" className="block text-xl sm:text-2xl font-black uppercase mb-2">Image de couverture</label>
           <div className="flex flex-col gap-4">
               {formData.imageUrl && (
                   <img src={formData.imageUrl} alt="Preview" className="h-48 object-cover border-4 border-neo-black" />
               )}
               <div className="flex flex-col sm:flex-row gap-4">
                 <input
                   type="text"
                   id="imageUrl"
                   name="imageUrl"
                   value={formData.imageUrl}
                   onChange={handleChange}
                   className="flex-1 h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all placeholder:text-neo-black/40"
                   placeholder="Colle une URL d'image ici..."
                 />
                 <span className="font-black text-xl py-4 sm:py-0 self-center uppercase">OU</span>
                 <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} className="h-14 sm:h-16 whitespace-nowrap">
                    IMPORTER DU PC
                 </Button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   accept="image/*" 
                   className="hidden" 
                 />
               </div>
           </div>
        </div>

        <div className="relative z-10 pb-8 px-4">
          <label className="block text-xl sm:text-2xl font-black uppercase mb-4 pt-4">Les Joueurs (Hall of Fame)</label>
          <div className="flex items-center gap-4">
            <Button type="button" variant="secondary" onClick={() => setShowHallOfFamePopup(true)} className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Gérer le Hall of Fame ({selectedJoueurs.length} sélectionnés)
            </Button>
          </div>
          
          {showHallOfFamePopup && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 overflow-y-auto w-full h-full">
              <div className="bg-white border-4 border-neo-black shadow-neo-brutal p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6 border-b-4 border-neo-black pb-4">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-neo-yellow" /> 
                    Sélectionner les joueurs
                  </h2>
                  <button 
                    type="button"
                    onClick={() => setShowHallOfFamePopup(false)}
                    className="p-2 border-2 text-white bg-neo-black border-neo-black hover:bg-neo-red transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {joueurs.map(v => (
                    <label key={v.id} className={`flex items-center gap-3 p-3 border-4 border-neo-black cursor-pointer transition-colors ${selectedJoueurs.includes(v.id) ? 'bg-neo-blue text-white' : 'bg-neo-cream hover:bg-neo-yellow'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={selectedJoueurs.includes(v.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedJoueurs([...selectedJoueurs, v.id]);
                          else setSelectedJoueurs(selectedJoueurs.filter(id => id !== v.id));
                        }}
                      />
                      <img src={v.avatarUrl} alt={v.name} className="w-10 h-10 object-cover border-2 border-current rounded-full" />
                      <span className="font-bold text-lg">{v.name}</span>
                    </label>
                  ))}
                  {joueurs.length === 0 && <span className="font-bold">Aucun joueur configuré (voir panel admin).</span>}
                </div>
                
                <div className="mt-8 pt-4 border-t-4 border-neo-black flex justify-end">
                  <Button type="button" variant="primary" onClick={() => setShowHallOfFamePopup(false)}>
                    Valider {selectedJoueurs.length > 0 && `(${selectedJoueurs.length})`}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>

        <div className="relative z-10 pb-8">
          <label className="block text-xl sm:text-2xl font-black uppercase mb-4 pl-4 pt-4">Mail List de diffusion</label>
          <div className="px-4">
            <select
              value={selectedMailingList}
              onChange={(e) => setSelectedMailingList(e.target.value)}
              className="w-full h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all cursor-pointer"
            >
              <option value="">-- Ne pas envoyer par mail --</option>
              {mailingLists.map(ml => (
                <option key={ml.id} value={ml.id}>{ml.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative z-10 group focus-within:shadow-neo-sm focus-within:border-neo-blue pb-8 text-neo-black">
          <label className="block text-xl sm:text-2xl font-black uppercase mb-4 pl-4 pt-4">Contenu de la Dépêche</label>
          <div className="px-4">
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Rédige ton article ici... Tu peux ajouter des images, des liens, etc."
            />
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t-4 border-neo-black relative z-10">
          <Button type="submit" size="lg" variant="primary" className="w-full text-xl sm:text-2xl h-16 sm:h-20 shadow-neo-md">
            {editId ? "SAUVEGARDER LES MODIFICATIONS" : "PUBLIER LA DÉPÊCHE"}
          </Button>
        </div>
      </form>
    </div>
  );
};
