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
  const [postStatus, setPostStatus] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    tags: ''
  });
  const [customEmailMessage, setCustomEmailMessage] = useState('');
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [selectedJoueurs, setSelectedJoueurs] = useState<string[]>([]);
  const [mailingLists, setMailingLists] = useState<MailingList[]>([]);
  const [selectedMailingList, setSelectedMailingList] = useState<string>('');
  const [showMailingListPopup, setShowMailingListPopup] = useState(false);
  const [showHallOfFamePopup, setShowHallOfFamePopup] = useState(false);

  const submitPostRef = useRef<any>(null);
  
  useEffect(() => {
    submitPostRef.current = submitPost;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (submitPostRef.current) {
        submitPostRef.current(true, true);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
          if (existingPost.ownerId !== user?.uid && user?.role !== 'admin' && user?.role !== 'author') {
            navigate('/blog');
            return;
          }
          setFormData({
              title: existingPost.title || '',
              summary: existingPost.summary || '',
              content: existingPost.content || '',
              imageUrl: existingPost.imageUrl || '',
              tags: existingPost.tags?.join(', ') || ''
          });
          setPostStatus(existingPost.status || 'published');
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

  const sendEmailNotification = async (postId: string) => {
    try {
      let bccEmails: string[] = [];
      if (selectedMailingList) {
        const ml = mailingLists.find(m => m.id === selectedMailingList);
        if (ml) {
          bccEmails = ml.joueurIds
              .map(jid => joueurs.find(j => j.id === jid)?.email)
              .filter(Boolean) as string[];
        }
      }

      await fetch('/api/email/notify-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          author: user?.pseudo || user?.displayName || 'ANONYMOUS FAN',
          customMessage: customEmailMessage,
          url: 'https://www.baroudeurscup.com/blog/' + postId,
          bccEmails: bccEmails
        })
      });
      return true;
    } catch (err) {
      console.error("Failed to trigger email notification:", err);
      return false;
    }
  };

  const handleResendEmail = async () => {
    const id = editId || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `draft-${Date.now()}`;
    const success = await sendEmailNotification(id);
    if (success) {
      alert("L'email a été renvoyé avec succès !");
    } else {
      alert("Une erreur est survenue lors de l'envoi de l'email.");
    }
  };

  const submitPost = async (isDraft: boolean = false, isAutoSave: boolean = false) => {
    if (!user) return; // Prevent submission if not logged in

    // Ignore empty draft save
    if (!formData.title && isDraft && !editId) return;

    const id = editId || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `draft-${Date.now()}`;
    
    const postData: any = {
      id,
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      author: user?.pseudo || user?.displayName || 'ANONYMOUS FAN',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbb6b49048?q=80&w=2000&auto=format&fit=crop',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      isMatchReport,
      joueurIds: selectedJoueurs,
      mailingListId: selectedMailingList,
      status: (isDraft && !(isAutoSave && postStatus === 'published')) ? 'draft' : 'published'
    };

    if (isMatchReport && matchDetails) {
      postData.matchDetails = matchDetails;
    }

    const isFirstTimePublishing = (!editId && !isDraft) || (editId && postStatus === 'draft' && !isDraft);

    if (editId || (isDraft && editId)) {
      // For updates, we omit ownerId to prevent breaking immutability rules.
      await updatePost(id, postData as BlogPost);
    } else {
      postData.ownerId = user.uid;
      postData.date = new Date().toISOString();
      await savePost(postData as BlogPost);
      
      if (isDraft) {
        navigate(`/editor/${id}`, { replace: true });
      }
    }

    if (isFirstTimePublishing) {
      await sendEmailNotification(id);
    }
    
    if (isDraft && !isAutoSave) {
      alert('Brouillon sauvegardé !');
    }

    if (!isDraft) {
      navigate(`/blog/${id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPost(false);
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

        <div className="relative z-10 w-full mb-6">
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
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedMailingList}
                onChange={(e) => setSelectedMailingList(e.target.value)}
                className="flex-1 w-full h-14 sm:h-16 px-4 bg-neo-cream border-4 border-neo-black font-bold text-lg sm:text-xl focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all cursor-pointer"
              >
                <option value="">-- Ne pas envoyer par mail --</option>
                {mailingLists.map(ml => (
                  <option key={ml.id} value={ml.id}>{ml.name}</option>
                ))}
              </select>
              {selectedMailingList && (
                <Button 
                  type="button" 
                  onClick={() => setShowMailingListPopup(true)}
                  className="h-14 sm:h-16 whitespace-nowrap bg-neo-cream"
                >
                  Voir la liste
                </Button>
              )}
            </div>
          </div>
          
          {showMailingListPopup && selectedMailingList && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 overflow-y-auto w-full h-full">
              <div className="bg-white border-4 border-neo-black shadow-neo-brutal p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                <button
                  type="button"
                  onClick={() => setShowMailingListPopup(false)}
                  className="absolute top-4 right-4 p-2 bg-neo-red text-white border-2 border-neo-black shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-black uppercase mb-4">
                  Membres de la liste
                </h2>
                <div className="space-y-2">
                  {mailingLists.find(ml => ml.id === selectedMailingList)?.joueurIds.map(jid => {
                    const j = joueurs.find(joueur => joueur.id === jid);
                    return j ? (
                      <div key={jid} className="p-3 border-2 border-neo-black bg-neo-cream flex justify-between items-center break-all">
                        <span className="font-bold mr-2">{j.name}</span>
                        <span className="text-sm text-gray-600">{j.email || 'Aucun email'}</span>
                      </div>
                    ) : null;
                  })}
                  {mailingLists.find(ml => ml.id === selectedMailingList)?.joueurIds.length === 0 && (
                    <div className="p-3 border-2 border-neo-black bg-neo-cream text-center font-bold">
                      Aucun membre dans cette liste
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
          
          {selectedMailingList && (
            <div className="mt-6 px-4">
              <label className="block text-lg font-black uppercase mb-2">Message d'accroche personnalisé (Optionnel)</label>
              <textarea
                value={customEmailMessage}
                onChange={(e) => setCustomEmailMessage(e.target.value)}
                className="w-full p-4 bg-neo-cream border-4 border-neo-black font-bold text-sm sm:text-base focus-visible:bg-neo-blue focus-visible:text-white focus-visible:shadow-neo-sm focus-visible:outline-none transition-all placeholder:text-neo-black/40 min-h-[100px] mb-4"
                placeholder="Un petit mot personnalisé pour vos lecteurs..."
              />
              
              <div className="p-4 bg-white border-4 border-neo-black mt-2">
                <h4 className="font-black uppercase mb-4 text-sm text-neo-black/60">Prévisualisation de l'email :</h4>
                <div className="border-4 border-black p-4 md:p-8 font-sans text-black bg-[#FFFDF5] flex justify-center">
                  <div className="max-w-[600px] w-full bg-white border-4 border-black p-4 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                    <div className="bg-[#0A3161] p-4 border-4 border-black mb-4 text-white uppercase">
                      <h1 className="m-0 text-xl md:text-2xl font-black tracking-tighter">★ NOUVEL ARTICLE ★</h1>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase mb-3 border-b-4 border-black pb-3 break-words">{formData.title || "[TITRE DE L'ARTICLE]"}</h2>
                    <p className="text-base font-bold bg-[#FFD600] inline-block px-3 py-1 border-2 border-black mb-6 uppercase">
                      PAR {user?.pseudo || user?.displayName || 'ANONYMOUS FAN'}
                    </p>
                    
                    {customEmailMessage && (
                      <div 
                        className="text-left bg-[#FFFDF5] border-2 border-dashed border-black p-4 text-base mb-6 font-bold" 
                        dangerouslySetInnerHTML={{ __html: customEmailMessage.replace(/\n/g, '<br>') }} 
                      />
                    )}
                    
                    <div className="mt-6">
                      <span className="bg-[#E6192B] text-white px-6 py-3 no-underline font-black text-base md:text-lg uppercase border-4 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        LIRE L'ARTICLE
                      </span>
                    </div>
                    
                    <div className="mt-8 border-t-4 border-black pt-4 text-xs font-bold uppercase">
                      BAROUDEUR WORLD CUP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

        <div className="pt-6 sm:pt-8 border-t-4 border-neo-black relative z-10 flex flex-col sm:flex-row gap-4">
          <Button 
            type="button" 
            onClick={() => submitPostRef.current && submitPostRef.current(true)} 
            size="lg" 
            className="w-full sm:w-1/3 text-[14px] sm:text-lg h-16 sm:h-20 shadow-neo-md bg-neo-yellow text-neo-black border-4 border-neo-black hover:bg-yellow-400 font-black uppercase"
          >
            ENREGISTRER EN BROUILLON
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            variant="primary" 
            className="w-full sm:w-2/3 text-[14px] sm:text-xl md:text-2xl h-16 sm:h-20 shadow-neo-md"
          >
            {editId ? "SAUVEGARDER ET PUBLIER" : "PUBLIER LA DÉPÊCHE"}
          </Button>
        </div>
        {postStatus === 'published' && editId && (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleResendEmail}
              className="bg-white text-neo-black border-4 border-neo-black font-black hover:bg-gray-100 uppercase"
            >
              RÉENVOYER LE MAIL À LA LISTE
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
