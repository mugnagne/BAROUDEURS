import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { getPosts } from '@/data/mockPosts';
import { BlogPost, Joueur, MailingList } from '@/types';
import { Trash2, Shield, Edit, Eye, MousePointerClick, Share2, Users, Mail, Edit2, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserData {
  id: string;
  email: string;
  role: 'reader' | 'author' | 'admin';
  authorRequest?: boolean;
  joueurId?: string;
  pseudo?: string;
}

interface PostStatsData {
  id: string;
  views: number;
  clicks: number;
  shares: number;
}

export const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<Record<string, PostStatsData>>({});
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [mailingLists, setMailingLists] = useState<MailingList[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'joueurs' | 'mailingLists'>('users');
  const [newJoueurName, setNewJoueurName] = useState('');
  const [newJoueurImg, setNewJoueurImg] = useState('');
  const [newJoueurEmail, setNewJoueurEmail] = useState('');
  
  const [newMailingListName, setNewMailingListName] = useState('');
  const [selectedJoueursForML, setSelectedJoueursForML] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [sortColumn, setSortColumn] = useState<'name' | 'email'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [editJoueurId, setEditJoueurId] = useState<string | null>(null);
  const [editJoueurData, setEditJoueurData] = useState<Partial<Joueur>>({});

  const [editMailingListId, setEditMailingListId] = useState<string | null>(null);
  const [editMailingListData, setEditMailingListData] = useState<Partial<MailingList>>({});

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const loadData = async () => {
    if (!user || user.role !== 'admin') return;

    // Load users
    const usersSnap = await getDocs(collection(db, 'users'));
    const fetchedUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserData));
    setUsers(fetchedUsers);

    // Load posts
    const fetchedPosts = await getPosts(true);
    setPosts(fetchedPosts);

    // Load stats
    const statsSnap = await getDocs(collection(db, 'postStats'));
    const statsObj: Record<string, PostStatsData> = {};
    statsSnap.docs.forEach(d => {
      statsObj[d.id] = { id: d.id, ...d.data() } as PostStatsData;
    });
    setStats(statsObj);

    // Load joueurs
    const joueursSnap = await getDocs(collection(db, 'joueurs'));
    const fetchedJoueurs = joueursSnap.docs.map(d => ({ id: d.id, ...d.data() } as Joueur));
    setJoueurs(fetchedJoueurs);

    // Load mailing lists
    const mlSnap = await getDocs(collection(db, 'mailingLists'));
    const fetchedML = mlSnap.docs.map(d => ({ id: d.id, ...d.data() } as MailingList));
    setMailingLists(fetchedML);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRoleChange = async (userId: string, newRole: 'reader' | 'author' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole, authorRequest: false });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole, authorRequest: false } : u));
    } catch (e) {
      console.error(e);
      alert('Erreur lors du changement de rôle');
    }
  };

  const handleLinkJoueur = async (userId: string, newJoueurId: string) => {
    try {
      const joueurIdToSet = newJoueurId || null;
      let pseudoToSet: string | undefined = undefined;
      let photoUrlToSet: string | undefined = undefined;
      
      const updatesForUser: any = { joueurId: joueurIdToSet };

      if (joueurIdToSet) {
        const selectedJoueur = joueurs.find(j => j.id === joueurIdToSet);
        if (selectedJoueur) {
          pseudoToSet = selectedJoueur.name;
          photoUrlToSet = selectedJoueur.avatarUrl;
          if (pseudoToSet) updatesForUser.pseudo = pseudoToSet;
          if (photoUrlToSet) updatesForUser.photoUrl = photoUrlToSet;
          
          const userEmail = users.find(u => u.id === userId)?.email;
          if (userEmail) {
            await updateDoc(doc(db, 'joueurs', joueurIdToSet), {
              email: userEmail
            });
          }
        }
      }

      await updateDoc(doc(db, 'users', userId), updatesForUser);
      setUsers(users.map(u => u.id === userId ? { ...u, ...updatesForUser } : u));
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la liaison du joueur');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirmDeleteId !== postId) {
      setConfirmDeleteId(postId);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(p => p.id !== postId));
      // Optionally delete stats too
      await deleteDoc(doc(db, 'postStats', postId));
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression');
      setConfirmDeleteId(null);
    }
  };

  const handleAddJoueur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJoueurName.trim() || !newJoueurImg.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'joueurs'), {
        name: newJoueurName,
        avatarUrl: newJoueurImg,
        email: newJoueurEmail
      });
      setJoueurs([...joueurs, { id: docRef.id, name: newJoueurName, avatarUrl: newJoueurImg, email: newJoueurEmail }]);
      setNewJoueurName('');
      setNewJoueurImg('');
      setNewJoueurEmail('');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'ajout du joueur');
    }
  };

  const handleDeleteJoueur = async (vid: string) => {
    if (confirmDeleteId !== vid) {
      setConfirmDeleteId(vid);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'joueurs', vid));
      setJoueurs(joueurs.filter(v => v.id !== vid));
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression du joueur');
      setConfirmDeleteId(null);
    }
  };

  const handleAddMailingList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMailingListName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'mailingLists'), {
        name: newMailingListName,
        joueurIds: selectedJoueursForML
      });
      setMailingLists([...mailingLists, { id: docRef.id, name: newMailingListName, joueurIds: selectedJoueursForML }]);
      setNewMailingListName('');
      setSelectedJoueursForML([]);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de la mailing list');
    }
  };

  const handleDeleteMailingList = async (mlId: string) => {
    if (confirmDeleteId !== mlId) {
      setConfirmDeleteId(mlId);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'mailingLists', mlId));
      setMailingLists(mailingLists.filter(ml => ml.id !== mlId));
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression de la mailing list');
      setConfirmDeleteId(null);
    }
  };

  const handleStartEditJoueur = (v: Joueur) => {
    setEditJoueurId(v.id);
    setEditJoueurData({ name: v.name, email: v.email, avatarUrl: v.avatarUrl });
  };

  const handleSaveEditJoueur = async () => {
    if (!editJoueurId) return;
    try {
      await updateDoc(doc(db, 'joueurs', editJoueurId), editJoueurData as any);
      setJoueurs(joueurs.map(j => j.id === editJoueurId ? { ...j, ...editJoueurData } : j));
      setEditJoueurId(null);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour du joueur');
    }
  };

  const toggleSort = (col: 'name' | 'email') => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const handleStartEditMailingList = (ml: MailingList) => {
    setEditMailingListId(ml.id);
    setEditMailingListData({ name: ml.name, joueurIds: ml.joueurIds });
  };

  const handleSaveEditMailingList = async () => {
    if (!editMailingListId || !editMailingListData.name) return;
    try {
      await updateDoc(doc(db, 'mailingLists', editMailingListId), editMailingListData as any);
      setMailingLists(mailingLists.map(ml => ml.id === editMailingListId ? { ...ml, ...editMailingListData } : ml));
      setEditMailingListId(null);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour de la liste');
    }
  };

  const sortedJoueurs = [...joueurs].sort((a, b) => {
    const valA = (a[sortColumn] || '').toLowerCase();
    const valB = (b[sortColumn] || '').toLowerCase();
    return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  if (loading || !user) return <div className="p-20 text-center font-black text-4xl">CHARGEMENT...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-5xl md:text-6xl font-black uppercase mb-12 tracking-tight transform -rotate-1">
        Panneau <span className="text-neo-red relative">
          Administrateur
          <svg className="absolute w-full h-3 -bottom-1 left-0 text-neo-black" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q50,15 100,5" stroke="currentColor" strokeWidth="4" fill="transparent" />
          </svg>
        </span>
      </h1>

      <div className="flex gap-4 mb-8">
        <Button 
          variant={activeTab === 'users' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('users')}
        >
          <Shield className="mr-2 h-5 w-5" /> Utilisateurs
        </Button>
        <Button 
          variant={activeTab === 'posts' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('posts')}
        >
          <Edit className="mr-2 h-5 w-5" /> Articles & Statistiques
        </Button>
        <Button 
          variant={activeTab === 'joueurs' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('joueurs')}
        >
          <Users className="mr-2 h-5 w-5" /> Joueurs
        </Button>
        <Button 
          variant={activeTab === 'mailingLists' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('mailingLists')}
        >
          <Mail className="mr-2 h-5 w-5" /> Mail Lists
        </Button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-neo-black">
                <th className="py-4 px-4 font-black uppercase">Email</th>
                <th className="py-4 px-4 font-black uppercase">Joueur Lié</th>
                <th className="py-4 px-4 font-black uppercase">Rôle actuel</th>
                <th className="py-4 px-4 font-black uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b-2 border-neo-black border-dashed">
                  <td className="py-4 px-4 font-bold">
                    <div className="flex items-center gap-2">
                      {u.email}
                      {u.authorRequest && <span className="bg-neo-yellow text-neo-black px-2 py-1 text-xs font-black uppercase rounded border-2 border-neo-black animate-pulse">Demande Auteur</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={u.joueurId || ''}
                      onChange={(e) => handleLinkJoueur(u.id, e.target.value)}
                      className="border-2 border-neo-black font-bold p-1 cursor-pointer outline-none bg-white min-w-[150px]"
                    >
                      <option value="">-- Aucun --</option>
                      {joueurs.map(j => (
                        <option key={j.id} value={j.id}>{j.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-neo-blue text-white px-2 py-1 text-xs font-bold uppercase rounded border-2 border-neo-black">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="border-4 border-neo-black font-bold p-2 cursor-pointer outline-none bg-neo-yellow active:translate-y-1"
                    >
                        <option value="reader">Lecteur</option>
                        <option value="author">Auteur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-neo-black">
                <th className="py-4 px-4 font-black uppercase">Titre</th>
                <th className="py-4 px-4 font-black uppercase">Auteur</th>
                <th className="py-4 px-4 font-black uppercase text-center">Vues</th>
                <th className="py-4 px-4 font-black uppercase text-center">Clics</th>
                <th className="py-4 px-4 font-black uppercase text-center">Partages</th>
                <th className="py-4 px-4 font-black uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => {
                const s = stats[p.id!] || { views: 0, clicks: 0, shares: 0 };
                return (
                  <tr key={p.id} className="border-b-2 border-neo-black border-dashed">
                    <td className="py-4 px-4 font-bold truncate max-w-[200px]">{p.title}</td>
                    <td className="py-4 px-4 text-sm font-bold opacity-70">{p.author}</td>
                    <td className="py-4 px-4 text-center font-bold text-neo-blue"><Eye className="inline w-4 h-4 mr-1"/>{s.views || 0}</td>
                    <td className="py-4 px-4 text-center font-bold text-neo-green"><MousePointerClick className="inline w-4 h-4 mr-1"/>{s.clicks || 0}</td>
                    <td className="py-4 px-4 text-center font-bold text-neo-yellow"><Share2 className="inline w-4 h-4 mr-1"/>{s.shares || 0}</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => handleDeletePost(p.id!)}
                        className={`${confirmDeleteId === p.id ? 'bg-neo-black text-white px-4' : 'bg-neo-red text-white'} p-2 border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold`}
                      >
                        {confirmDeleteId === p.id ? 'Sûr ?' : <Trash2 className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'joueurs' && (
        <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 relative">
          <form onSubmit={handleAddJoueur} className="mb-8 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block font-bold">Nom</label>
              <input 
                type="text" 
                value={newJoueurName}
                onChange={e => setNewJoueurName(e.target.value)}
                className="w-full border-4 border-neo-black p-2 font-bold"
                placeholder="Ex: Paul"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block font-bold">Email</label>
              <input 
                type="email" 
                value={newJoueurEmail}
                onChange={e => setNewJoueurEmail(e.target.value)}
                className="w-full border-4 border-neo-black p-2 font-bold"
                placeholder="paul@example.com"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block font-bold">URL Avatar</label>
              <input 
                type="text" 
                value={newJoueurImg}
                onChange={e => setNewJoueurImg(e.target.value)}
                className="w-full border-4 border-neo-black p-2 font-bold"
                placeholder="https://..."
              />
            </div>
            <Button type="submit" variant="primary">Ajouter</Button>
          </form>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-neo-black">
                <th className="py-4 px-4 font-black uppercase">Avatar</th>
                <th 
                  className="py-4 px-4 font-black uppercase cursor-pointer hover:bg-neo-cream transition-colors text-left select-none"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-2">Nom {sortColumn === 'name' && (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>)}</div>
                </th>
                <th 
                  className="py-4 px-4 font-black uppercase cursor-pointer hover:bg-neo-cream transition-colors text-left select-none"
                  onClick={() => toggleSort('email')}
                >
                  <div className="flex items-center gap-2">Email {sortColumn === 'email' && (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>)}</div>
                </th>
                <th className="py-4 px-4 font-black uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedJoueurs.map(v => (
                <tr key={v.id} className="border-b-2 border-neo-black border-dashed">
                  {editJoueurId === v.id ? (
                    <td colSpan={4} className="py-4 px-4">
                      <div className="flex flex-col gap-4 bg-neo-cream p-4 border-4 border-neo-black">
                        <div className="flex flex-wrap gap-4 items-center">
                          <input type="text" value={editJoueurData.name || ''} onChange={e => setEditJoueurData({...editJoueurData, name: e.target.value})} className="border-4 border-neo-black p-2 font-bold w-full md:w-auto" placeholder="Nom"/>
                          <input type="email" value={editJoueurData.email || ''} onChange={e => setEditJoueurData({...editJoueurData, email: e.target.value})} className="border-4 border-neo-black p-2 font-bold w-full md:w-auto" placeholder="Email"/>
                          <input type="text" value={editJoueurData.avatarUrl || ''} onChange={e => setEditJoueurData({...editJoueurData, avatarUrl: e.target.value})} className="border-4 border-neo-black p-2 font-bold w-full md:w-auto" placeholder="Avatar URL"/>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="primary" onClick={handleSaveEditJoueur} className="p-2 w-auto"><Check className="w-5 h-5"/></Button>
                          <Button variant="secondary" onClick={() => setEditJoueurId(null)} className="p-2 w-auto"><X className="w-5 h-5"/></Button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-4 px-4">
                        <img src={v.avatarUrl} alt={v.name} className="w-12 h-12 object-cover border-2 border-neo-black rounded-full" />
                      </td>
                      <td className="py-4 px-4 font-bold">{v.name}</td>
                      <td className="py-4 px-4">{v.email || '-'}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStartEditJoueur(v)}
                            className="bg-neo-blue text-white p-2 border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteJoueur(v.id)}
                            className={`${confirmDeleteId === v.id ? 'bg-neo-black text-white px-4' : 'bg-neo-red text-white'} p-2 border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold`}
                          >
                            {confirmDeleteId === v.id ? 'Sûr ?' : <Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'mailingLists' && (
        <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 relative">
          <form onSubmit={handleAddMailingList} className="mb-8 flex flex-col gap-4">
            <div>
              <label className="block font-bold">Nom de la Mail List</label>
              <input 
                type="text" 
                value={newMailingListName}
                onChange={e => setNewMailingListName(e.target.value)}
                className="w-full border-4 border-neo-black p-2 font-bold max-w-md"
                placeholder="Ex: Toute l'équipe"
              />
            </div>
            
            <div>
              <label className="block font-bold mb-2">Sélectionnez les Joueurs</label>
              <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto w-full p-2 border-2 border-neo-black bg-white">
                {joueurs.map(j => (
                  <label key={j.id} className={`flex items-center gap-2 p-2 border-2 border-neo-black cursor-pointer ${selectedJoueursForML.includes(j.id) ? 'bg-neo-blue text-white' : 'bg-neo-cream'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selectedJoueursForML.includes(j.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedJoueursForML([...selectedJoueursForML, j.id]);
                        else setSelectedJoueursForML(selectedJoueursForML.filter(id => id !== j.id));
                      }}
                    />
                    <img src={j.avatarUrl} alt={j.name} className="w-6 h-6 rounded-full border border-neo-black shrink-0 object-cover" />
                    <span className="font-bold text-sm tracking-tight">{j.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" className="self-start">Créer la Mail List</Button>
          </form>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-neo-black">
                <th className="py-4 px-4 font-black uppercase">Nom</th>
                <th className="py-4 px-4 font-black uppercase">Membres</th>
                <th className="py-4 px-4 font-black uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mailingLists.map(ml => (
                <tr key={ml.id} className="border-b-2 border-neo-black border-dashed">
                  {editMailingListId === ml.id ? (
                    <td colSpan={3} className="py-4 px-4">
                      <div className="flex flex-col gap-4 bg-neo-cream p-4 border-4 border-neo-black">
                        <input type="text" value={editMailingListData.name || ''} onChange={e => setEditMailingListData({...editMailingListData, name: e.target.value})} className="border-4 border-neo-black p-2 font-bold max-w-md w-full" placeholder="Nom"/>
                        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto w-full p-2 border-2 border-neo-black bg-white">
                          {joueurs.map(j => (
                            <label key={'edit-'+j.id} className={`flex items-center gap-2 p-2 border-2 border-neo-black cursor-pointer ${editMailingListData.joueurIds?.includes(j.id) ? 'bg-neo-blue text-white' : 'bg-neo-cream'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={editMailingListData.joueurIds?.includes(j.id) || false}
                                onChange={(e) => {
                                  const currentIds = editMailingListData.joueurIds || [];
                                  if (e.target.checked) setEditMailingListData({...editMailingListData, joueurIds: [...currentIds, j.id]});
                                  else setEditMailingListData({...editMailingListData, joueurIds: currentIds.filter(id => id !== j.id)});
                                }}
                              />
                              <img src={j.avatarUrl} alt={j.name} className="w-6 h-6 rounded-full border border-neo-black shrink-0 object-cover" />
                              <span className="font-bold text-sm tracking-tight">{j.name}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="primary" onClick={handleSaveEditMailingList} className="p-2 w-auto"><Check className="w-5 h-5"/></Button>
                          <Button variant="secondary" onClick={() => setEditMailingListId(null)} className="p-2 w-auto"><X className="w-5 h-5"/></Button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-4 px-4 font-bold">{ml.name}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-2 w-full max-w-sm max-h-32 overflow-y-auto p-1 custom-scrollbar">
                           {ml.joueurIds.map(jid => {
                             const j = joueurs.find(jou => jou.id === jid);
                             if (!j) return null;
                             return <img key={jid} src={j.avatarUrl} alt={j.name} title={j.name} className="w-8 h-8 rounded-full border-2 border-neo-black object-cover shrink-0" />;
                           })}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStartEditMailingList(ml)}
                            className="bg-neo-blue text-white p-2 border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMailingList(ml.id)}
                            className={`${confirmDeleteId === ml.id ? 'bg-neo-black text-white px-4' : 'bg-neo-red text-white'} p-2 border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold`}
                          >
                            {confirmDeleteId === ml.id ? 'Sûr ?' : <Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
