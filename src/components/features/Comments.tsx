import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

interface Comment {
  id: string;
  postId: string;
  text: string;
  authorId: string;
  authorPseudo: string;
  authorPhotoUrl: string;
  createdAt: number;
}

interface CommentsProps {
  postId: string;
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    }, (error) => {
      console.error('Error fetching comments:', error);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        text: newComment.trim(),
        authorId: user.uid,
        authorPseudo: user.pseudo || 'Anonyme',
        authorPhotoUrl: user.photoUrl || '',
        createdAt: Date.now()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 bg-white border-8 border-neo-black p-6 md:p-8 shadow-neo-xl rotate-1">
      <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Commentaires ({comments.length})</h3>

      {!user ? (
        <div className="bg-neo-cream border-4 border-neo-black p-6 mb-8 -rotate-1 shadow-neo-sm text-center font-bold">
          <p className="mb-4">Connectez-vous pour laisser un commentaire et rejoindre les visionnaires.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-12">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-4 border-neo-black p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-red mb-4 shadow-neo-sm h-32 resize-none"
            placeholder="Partagez votre vision..."
            required
          />
          <Button type="submit" variant="primary" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'ENVOI...' : 'COMMENTER'}
          </Button>
        </form>
      )}

      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id} className={`border-4 border-neo-black p-4 bg-neo-light-gray shadow-neo-sm ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 border-2 border-neo-black bg-neo-cream rounded-full overflow-hidden">
                {comment.authorPhotoUrl ? (
                  <img src={comment.authorPhotoUrl} alt={comment.authorPseudo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-xl text-neo-black">
                    {comment.authorPseudo.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <span className="font-black uppercase text-lg">{comment.authorPseudo}</span>
                <span className="ml-4 text-sm font-bold text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="font-medium text-lg leading-relaxed whitespace-pre-wrap">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
