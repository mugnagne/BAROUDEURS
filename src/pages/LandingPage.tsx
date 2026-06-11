import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts } from '@/data/mockPosts';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Star, X } from 'lucide-react';
import { BlogPost } from '@/types';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/features/AuthModal';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const LandingPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthorRequestModalOpen, setIsAuthorRequestModalOpen] = useState(false);
  const [requestSending, setRequestSending] = useState(false);

  useEffect(() => {
    getPosts().then(fetched => {
      setPosts(fetched.slice(0, 3));
    }).catch(error => {
      console.error("Failed to load posts", error);
    });
  }, []);

  const handleWriteArticleClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else if (user.role === 'admin' || user.role === 'author') {
      navigate('/editor');
    } else {
      setIsAuthorRequestModalOpen(true);
    }
  };

  const handleRequestAuthor = async () => {
    if (!user) return;
    setRequestSending(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { authorRequest: true });
      alert('Ta demande a bien été envoyée ! Un administrateur va la valider.');
      setIsAuthorRequestModalOpen(false);
    } catch (error) {
      console.error("Failed to request author", error);
      alert('Erreur lors de l\'envoi de la demande.');
    } finally {
      setRequestSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 overflow-hidden w-full">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mt-8 md:mt-12">
        {/* Decorative elements */}
        <div className="absolute top-10 left-0 hidden lg:block z-20">
          <Star className="w-24 h-24 stroke-[4px] text-neo-red fill-white animate-spin-slow rotate-12 drop-shadow-[8px_8px_0px_#000]" />
        </div>
        <div className="absolute bottom-10 right-10 hidden lg:block z-20">
          <Star className="w-24 h-24 stroke-[4px] text-neo-blue fill-white animate-spin-slow -rotate-12 drop-shadow-[8px_8px_0px_#000]" />
        </div>

        <div className="bg-american-stripes border-8 border-neo-black shadow-neo-xl relative overflow-hidden p-4 md:p-8">
          <div className="bg-neo-blue text-white border-8 border-neo-black shadow-neo-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-american-stars opacity-40"></div>
            
            <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col items-center text-center">
              <span className="bg-neo-red text-white border-4 border-neo-black px-4 py-1 sm:px-6 sm:py-2 font-black uppercase tracking-widest text-sm sm:text-lg md:text-xl -rotate-2 mb-6 sm:mb-8 shadow-neo-sm inline-block">
                COUPE DU MONDE 2026 AUX USA
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-6 sm:mb-8 text-white drop-shadow-[4px_4px_0px_#000] sm:drop-shadow-[8px_8px_0px_#000] rotate-1">
                BAROUDEURS 2026
              </h1>
              <p className="text-lg sm:text-xl md:text-3xl font-bold max-w-3xl mx-auto leading-tight mb-8 sm:mb-12 text-white bg-neo-black border-4 border-neo-black p-3 sm:p-4 -rotate-1 shadow-neo-md">
                Le blog officiel de la BAROUDEURS League
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/blog" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="text-xl md:text-2xl shadow-neo-md text-white border-white hover:border-white w-full px-6 whitespace-nowrap">
                    LIRE LE DERNIER ARTICLE
                  </Button>
                </Link>
                <Link to="/world-cup" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="text-xl md:text-2xl shadow-neo-md w-full px-6 whitespace-nowrap">
                    GUIDE DU TOURNOI <ArrowRight className="ml-2 stroke-[4px]" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="w-full relative py-12 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[150vw] h-[150%] bg-american-stripes -z-10 opacity-20 -rotate-3"></div>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <div className="flex justify-between items-end mb-12 border-b-8 border-neo-black pb-8 bg-white p-4">
            <div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-neo-blue">DERNIERS POSTS</h2>
              <p className="text-xl font-bold mt-2 text-neo-red uppercase">Les analyses 100% à l'ouest des matchs de la coupe du monde</p>
            </div>
            <Link to="/blog" className="hidden md:flex font-black uppercase text-xl hover:text-neo-blue transition-colors group items-center gap-2">
              TOUT VOIR <ArrowRight strokeWidth={4} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="first:rotate-1 last:-rotate-1 lg:first:-translate-y-4 lg:last:translate-y-4 transition-transform hover:z-10">
                <ArticleCard post={post} />
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden bg-white p-4 border-4 border-black">
            <Link to="/blog" className="block w-full">
              <Button size="lg" variant="outline" className="w-full text-xl">
                VOIR TOUS LES ARTICLES
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* USA Banner */}
      <section className="bg-american-stripes border-y-8 border-neo-black py-16 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap opacity-90 text-neo-black bg-white py-2 border-y-8 border-neo-black -rotate-2 absolute w-[110%] -left-4 top-1/4">
           <span className="text-7xl font-black uppercase tracking-tighter mr-8">BAROUDEURS /</span>
           <span className="text-7xl font-black uppercase tracking-tighter mr-8">BAROUDEURS /</span>
           <span className="text-7xl font-black uppercase tracking-tighter mr-8">BAROUDEURS /</span>
           <span className="text-7xl font-black uppercase tracking-tighter mr-8">BAROUDEURS /</span>
        </div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center text-white mt-12 bg-neo-blue border-8 border-neo-black p-12 shadow-neo-xl rotate-1">
            <div className="absolute inset-0 bg-american-stars opacity-50"></div>
            <h2 className="relative z-10 text-4xl sm:text-6xl md:text-8xl font-black uppercase text-stroke-white-2 drop-shadow-[4px_4px_0px_#000] sm:drop-shadow-[8px_8px_0px_#000] mb-8">
              WE NEED YOU
            </h2>
            <div className="relative z-10 w-full md:w-auto inline-block">
              <Button onClick={handleWriteArticleClick} size="lg" variant="primary" className="rotate-2 text-xl sm:text-2xl shadow-neo-md border-white w-full sm:w-auto px-4 sm:px-8">
                DONNE TON AVIS - ÉCRIS UN ARTICLE
              </Button>
            </div>
        </div>
      </section>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isAuthorRequestModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-neo-cream border-8 border-neo-black p-6 md:p-8 max-w-lg w-full shadow-neo-xl rotate-1 relative">
            <button 
              onClick={() => setIsAuthorRequestModalOpen(false)}
              className="absolute top-2 right-2 p-2 bg-neo-red text-white border-2 border-neo-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
            <h2 className="text-3xl font-black uppercase text-neo-blue mb-4 leading-tight">Envie d'écrire ?</h2>
            <p className="text-lg font-bold text-neo-black leading-snug mb-8">
              Tu veux écrire des articles pour le blog officiel de la Baroudeurs League ? Fais ta demande pour devenir auteur !
            </p>
            <Button
              onClick={handleRequestAuthor}
              disabled={requestSending}
              className="w-full text-xl"
              size="lg"
            >
              {requestSending ? 'Envoi...' : 'DEVENIR AUTEUR'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
