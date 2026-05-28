import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { signIn, signInWithEmail, signUpWithEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, pseudo);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur Google Sign-In');
    }
  };

  return (
    <div className="fixed inset-0 bg-neo-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-8 border-neo-black p-8 shadow-neo-xl max-w-md w-full relative rotate-1">
        <button onClick={onClose} className="absolute -top-6 -right-6 bg-neo-red text-white border-4 border-neo-black p-2 hover:rotate-12 transition-transform">
          <X strokeWidth={4} />
        </button>
        
        <h2 className="text-4xl font-black uppercase tracking-tight mb-8 text-center text-neo-blue">
          {isLogin ? 'Connexion' : 'Inscription'}
        </h2>

        {error && <div className="bg-neo-red text-white p-4 font-bold border-4 border-neo-black mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {!isLogin && (
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
          )}
          <div>
            <label className="block font-black uppercase mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full border-4 border-neo-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow" 
              required 
            />
          </div>
          <div>
            <label className="block font-black uppercase mb-2">Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full border-4 border-neo-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow" 
              required 
            />
          </div>
          
          <Button type="submit" variant="primary" className="w-full shadow-neo-sm" disabled={loading}>
            {loading ? 'CHARGEMENT...' : isLogin ? 'SE CONNECTER' : "S'INSCRIRE"}
          </Button>
        </form>

        <div className="border-t-4 border-neo-black pt-6 text-center">
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-neo-light-gray border-4 border-neo-black font-black uppercase p-3 mb-6 flex items-center justify-center gap-3 active:translate-y-1 shadow-neo-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Continuer avec Google
          </button>

          <p className="font-bold text-gray-600">
             {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
             <button 
               type="button" 
               className="ml-2 text-neo-blue hover:text-neo-red uppercase underline decoration-4 underline-offset-4"
               onClick={() => setIsLogin(!isLogin)}
             >
               {isLogin ? "S'inscrire" : "Se connecter"}
             </button>
          </p>
        </div>
      </div>
    </div>
  );
};
