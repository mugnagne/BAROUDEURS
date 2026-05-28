import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { getPosts } from '@/data/mockPosts';
import { BlogPost, Visionnaire } from '@/types';
import { Trash2, Shield, Edit, Eye, MousePointerClick, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserData {
  id: string;
  email: string;
  role: 'reader' | 'author' | 'admin';
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
  const [visionnaires, setVisionnaires] = useState<Visionnaire[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'visionnaires'>('users');
  const [newVisName, setNewVisName] = useState('');
  const [newVisImg, setNewVisImg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
    const fetchedPosts = await getPosts();
    setPosts(fetchedPosts);

    // Load stats
    const statsSnap = await getDocs(collection(db, 'postStats'));
    const statsObj: Record<string, PostStatsData> = {};
    statsSnap.docs.forEach(d => {
      statsObj[d.id] = { id: d.id, ...d.data() } as PostStatsData;
    });
    setStats(statsObj);

    // Load visionnaires
    const visSnap = await getDocs(collection(db, 'visionnaires'));
    const fetchedVis = visSnap.docs.map(d => ({ id: d.id, ...d.data() } as Visionnaire));
    setVisionnaires(fetchedVis);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRoleChange = async (userId: string, newRole: 'reader' | 'author' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (e) {
      console.error(e);
      alert('Erreur lors du changement de rôle');
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

  const handleAddVisionnaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisName.trim() || !newVisImg.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'visionnaires'), {
        name: newVisName,
        avatarUrl: newVisImg
      });
      setVisionnaires([...visionnaires, { id: docRef.id, name: newVisName, avatarUrl: newVisImg }]);
      setNewVisName('');
      setNewVisImg('');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'ajout du visionnaire');
    }
  };

  const handleDeleteVisionnaire = async (vid: string) => {
    if (confirmDeleteId !== vid) {
      setConfirmDeleteId(vid);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'visionnaires', vid));
      setVisionnaires(visionnaires.filter(v => v.id !== vid));
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression du visionnaire');
      setConfirmDeleteId(null);
    }
  };

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
          variant={activeTab === 'visionnaires' ? 'primary' : 'secondary'} 
          onClick={() => setActiveTab('visionnaires')}
        >
          <Users className="mr-2 h-5 w-5" /> Visionnaires
        </Button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-neo-black">
                <th className="py-4 px-4 font-black uppercase">Email</th>
                <th className="py-4 px-4 font-black uppercase">Rôle actuel</th>
                <th className="py-4 px-4 font-black uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b-2 border-neo-black border-dashed">
                  <td className="py-4 px-4 font-bold">{u.email}</td>
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
      {activeTab === 'visionnaires' && (
        <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 relative">
          <form onSubmit={handleAddVisionnaire} className="mb-8 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block font-bold">Nom</label>
              <input 
                type="text" 
                value={newVisName}
                onChange={e => setNewVisName(e.target.value)}
                className="w-full border-4 border-neo-black p-2 font-bold"
                placeholder="Ex: Paul"
              />
            </div>
            <div className="flex-1">
              <label className="block font-bold">URL Avatar</label>
              <input 
                type="text" 
                value={newVisImg}
                onChange={e => setNewVisImg(e.target.value)}
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
                <th className="py-4 px-4 font-black uppercase">Nom</th>
                <th className="py-4 px-4 font-black uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visionnaires.map(v => (
                <tr key={v.id} className="border-b-2 border-neo-black border-dashed">
                  <td className="py-4 px-4">
                    <img src={v.avatarUrl} alt={v.name} className="w-12 h-12 object-cover border-2 border-neo-black rounded-full" />
                  </td>
                  <td className="py-4 px-4 font-bold">{v.name}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => handleDeleteVisionnaire(v.id)}
                      className={`${confirmDeleteId === v.id ? 'bg-neo-black text-white px-4' : 'bg-neo-red text-white'} p-2 border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold`}
                    >
                      {confirmDeleteId === v.id ? 'Sûr ?' : <Trash2 className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
