import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '@/data/mockPosts';
import { format } from 'date-fns';
import { MatchScoreHeader, MatchTacticalBoard, MatchChronology, MatchMotm } from '@/components/features/MatchReportDisplay';
import { Comments } from '@/components/features/Comments';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Edit2 } from 'lucide-react';
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';

  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs && domNode.attribs['data-embed-code']) {
        let htmlContent = '';
        try {
          htmlContent = domNode.attribs['data-html-content'] ? decodeURIComponent(domNode.attribs['data-html-content']) : '';
        } catch(e) {
          htmlContent = domNode.attribs['data-html-content'] || '';
        }
        if (htmlContent) {
           return <div className="embed-container border-4 border-dashed border-neo-black p-2 my-8 bg-black/5">{parse(htmlContent)}</div>;
        }
      }
    }
  };
import { BlogPost, Joueur } from '@/types';
import { useAuth } from '@/lib/auth';
import { doc, setDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      getPost(id).then(async fetched => {
        setPost(fetched || null);
        if (fetched) {
          // Fetch visionnaires details
          if (fetched.joueurIds && fetched.joueurIds.length > 0) {
            const visList: Joueur[] = [];
            for (const vId of fetched.joueurIds) {
              try {
                const docSnap = await getDoc(doc(db, 'joueurs', vId));
                if (docSnap.exists()) {
                  visList.push({ id: docSnap.id, ...docSnap.data() } as Joueur);
                }
              } catch (e) {
                 console.error(e);
              }
            }
            setJoueurs(visList);
          }

          // Increment views
          setDoc(doc(db, 'postStats', id), { views: increment(1) }, { merge: true }).catch(console.error);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Lien copié dans le presse-papier !");
      navigator.clipboard.writeText(window.location.href);
    }
    // Increment shares
    if (id) {
      setDoc(doc(db, 'postStats', id), { shares: increment(1) }, { merge: true }).catch(console.error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-4xl font-black">CHARGEMENT...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-black mb-8">404 - ARTICLE INTROUVABLE</h1>
        <Link to="/blog">
          <Button variant="primary">RETOURNER AU BLOG</Button>
        </Link>
      </div>
    );
  }

  const isMatchReport = Boolean(post.isMatchReport && post.matchDetails);

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <Link to="/blog" className="inline-flex items-center gap-2 font-bold uppercase hover:underline decoration-4 underline-offset-4 bg-[#ff0000] text-white px-4 py-2 border-4 border-neo-black shadow-neo-sm">
            <ArrowLeft strokeWidth={4} /> RETOUR AUX DÉPÊCHES
          </Link>
        </div>
        {user && (user.uid === post.ownerId || user.role === 'admin' || user.role === 'author') && (
          <Link to={`/editor/${post.id}`} className="inline-flex items-center gap-2 font-bold uppercase hover:underline decoration-4 underline-offset-4 bg-neo-yellow px-4 py-2 border-4 border-neo-black shadow-neo-sm text-neo-black">
            <Edit2 strokeWidth={4} /> MODIFIER L'ARTICLE
          </Link>
        )}
      </div>

      <header className="mb-12 border-b-8 border-neo-black pb-8 relative bg-white border-8 p-8 shadow-neo-lg -rotate-1">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="border-2">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8">
          {post.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xl font-bold uppercase p-4 bg-neo-cream border-4 border-neo-black shadow-neo-sm rotate-1 w-fit">
          <span className="text-neo-blue">{format(new Date(post.date), 'dd MMMM yyyy')}</span>
          <span className="hidden sm:block w-2 h-2 bg-neo-black rounded-full" />
          <span>PAR : <span className="text-neo-red">{post.author}</span></span>
        </div>
      </header>

      {isMatchReport && post.matchDetails && (
         <div className="mb-12">
            <MatchScoreHeader details={post.matchDetails} />
         </div>
      )}

      {post.imageUrl && !isMatchReport && (
        <div className="mb-16 border-8 border-neo-black shadow-neo-lg rotate-1 hover:rotate-0 transition-transform p-4 bg-white">
          <div className="bg-neo-black aspect-video overflow-hidden border-4 border-neo-black">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isMatchReport ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8 lg:gap-12 mb-24`}>
        <div className={`${isMatchReport ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-12`}>
           {post.imageUrl && isMatchReport && (
             <div className="border-8 border-neo-black shadow-neo-lg rotate-1 hover:rotate-0 transition-transform p-4 bg-white">
               <div className="bg-neo-black aspect-video overflow-hidden border-4 border-neo-black">
                 <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
               </div>
             </div>
           )}

          {isMatchReport && post.matchDetails && (
             <MatchMotm motm={post.matchDetails.motm} />
          )}

          <div className="bg-white border-8 border-neo-black p-6 sm:p-8 md:p-12 shadow-neo-xl relative overflow-hidden">
            <div className="prose prose-lg sm:prose-xl max-w-none font-medium leading-relaxed
              prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4 prose-h4:text-2xl prose-h4:mt-6 prose-h4:mb-3 
              prose-p:mb-8 prose-img:border-4 prose-img:border-neo-black prose-img:shadow-neo-md prose-img:w-full prose-img:h-auto prose-img:object-cover
              prose-a:text-neo-red prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-4
              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-blockquote:border-l-8 prose-blockquote:border-neo-black prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-neo-cream prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:my-8 prose-blockquote:font-bold prose-blockquote:text-xl
              prose-strong:font-black prose-strong:text-neo-blue prose-em:italic px-0">
              {parse(post.content, parseOptions)}
            </div>
          </div>
        </div>
        
        {isMatchReport && post.matchDetails && (
            <div className="lg:col-span-1 space-y-12">
               <MatchChronology highlights={post.matchDetails.highlights} />
               <div className="hidden md:block">
                 <MatchTacticalBoard team1={post.matchDetails.team1} team2={post.matchDetails.team2} highlights={post.matchDetails.highlights} />
               </div>
            </div>
        )}
      </div>

      {joueurs.length > 0 && (
        <div className="mb-24 bg-neo-blue text-white border-8 border-neo-cream p-8 shadow-neo-lg rotate-[0.5deg]">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 text-neo-yellow">
            Hall of Fame
          </h2>
          <p className="font-bold text-xl mb-8">Ils ont pronostiqué le score exact</p>
          <div className="flex flex-wrap gap-6">
            {joueurs.map(v => (
              <div key={v.id} className="flex flex-col items-center gap-3 w-32 pb-4 bg-white border-4 border-neo-white text-neo-black hover:-translate-y-2 transition-transform cursor-crosshair">
                <div className="w-full h-24 border-b-4 border-neo-white bg-neo-cream">
                  <img src={v.avatarUrl} alt={v.name} className="w-full h-full object-cover transition-all" />
                </div>
                <span className="font-black uppercase text-center px-2">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-24">
        <Comments postId={post.id} />
      </div>

    </article>
  );
};
