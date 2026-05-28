import React from 'react';
import { format } from 'date-fns';
import { Card } from './Card';
import { Badge } from './Badge';
import { BlogPost } from '@/types';
import { ArrowRight } from 'lucide-react';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const ArticleCard = ({ post }: { post: BlogPost }) => {
  const handleClick = () => {
    if (post.id) {
       setDoc(doc(db, 'postStats', post.id), { clicks: increment(1) }, { merge: true }).catch(console.error);
    }
  };

  return (
    <Card to={`/blog/${post.id}`} onClick={handleClick} className="flex flex-col h-full bg-white overflow-hidden group">
      {post.imageUrl && (
        <div className="h-48 border-b-4 border-neo-black overflow-hidden relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="rotate-3 shadow-none border-2">
                {post.tags[0]}
              </Badge>
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-4 text-sm font-bold uppercase">
          <span className="text-neo-blue">{format(new Date(post.date), 'dd MMM yyyy')}</span>
          <span className="w-1 h-1 bg-neo-black rounded-full" />
          <span>PAR {post.author}</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:underline decoration-4 underline-offset-4 decoration-neo-red line-clamp-2">
          {post.title}
        </h3>
        <p className="font-medium text-lg leading-snug flex-grow mb-6 line-clamp-3">
          {post.summary}
        </p>
        <div className="mt-auto flex items-center gap-2 font-bold uppercase text-neo-red group-hover:text-neo-blue transition-colors">
          Lire la suite <ArrowRight strokeWidth={4} size={20} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Card>
  );
};
