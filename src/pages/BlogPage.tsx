import React, { useEffect, useState } from 'react';
import { getPosts } from '@/data/mockPosts';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Star } from 'lucide-react';
import { BlogPost } from '@/types';

export const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(error => console.error("Failed to load posts", error));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-16 relative w-full">
        <div className="absolute -top-10 -left-10 text-neo-red opacity-80 hidden md:block">
          <Star className="w-48 h-48 fill-current drop-shadow-[8px_8px_0px_#000]" />
        </div>
        <div className="bg-neo-blue text-white p-8 md:p-12 border-8 border-neo-black shadow-neo-xl rotate-1 relative z-10 bg-american-stars">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-stroke-white-2 sm:drop-shadow-[4px_4px_0px_#000]">
            TOUTES LES DÉPÊCHES
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl font-bold bg-white text-neo-red uppercase inline-block px-3 py-1 sm:px-4 sm:py-2 border-4 border-neo-black -rotate-1 shadow-neo-md mt-4">
            LES CHRONIQUES DU PAYS HÔTE.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative w-full">
        {/* Background texture */}
        <div className="absolute inset-0 bg-american-stripes -z-10 opacity-20 scale-110"></div>
        {posts.map((post, index) => (
          <div key={post.id} className={`${index % 2 === 0 ? '-rotate-1' : 'rotate-1'} hover:z-10 transition-transform bg-white border-4 border-neo-black`}>
            <ArticleCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};
