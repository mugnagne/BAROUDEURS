import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '../features/AuthModal';
import { ProfileModal } from '../features/ProfileModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();
  const { user, logOut } = useAuth();

  const links = [
    { name: 'Accueil', path: '/' },
    { name: 'Articles', path: '/blog' },
    { name: 'Mondial 2026', path: '/world-cup' },
    { name: 'Équipes', path: '/teams' },
    ...(user && ['admin', 'author'].includes(user.role as string) ? [{ name: 'Écrire', path: '/editor' }] : []),
    ...(user && user.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-neo-cream border-b-8 border-neo-black shadow-neo-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-neo-red border-4 border-neo-black w-12 h-12 flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform shadow-neo-sm">
                  <span className="text-white font-black text-2xl tracking-tighter">B</span>
                </div>
                <span className="font-black text-3xl tracking-tighter group-hover:-rotate-1 transition-transform inline-block">
                  BAROUDEUR<span className="text-neo-red">.</span>
                </span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'font-bold uppercase tracking-wider text-sm px-3 py-2 border-4 transition-all',
                      location.pathname === link.path
                        ? 'bg-neo-blue text-white border-neo-black shadow-neo-sm -translate-y-1'
                        : 'border-transparent hover:border-neo-black hover:bg-white hover:text-neo-black hover:shadow-neo-sm hover:-translate-y-1'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <div className="flex items-center gap-4">
                     <button onClick={() => setIsProfileModalOpen(true)} className="font-bold uppercase tracking-wider hover:text-neo-red text-sm">
                        Profil ({user.pseudo || 'User'})
                     </button>
                     <Button onClick={logOut} variant="secondary" size="sm">Déconnexion</Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsAuthModalOpen(true)} variant="primary" size="sm">Connexion</Button>
                )}
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border-4 border-neo-black p-2 shadow-neo-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                {isOpen ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t-4 border-neo-black bg-white absolute w-full left-0 z-50">
            <div className="px-4 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block font-bold items-center uppercase tracking-wider px-4 py-3 border-4 transition-all text-center',
                    location.pathname === link.path
                      ? 'bg-neo-blue text-white border-neo-black shadow-neo-sm'
                      : 'bg-white border-neo-black shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t-4 border-neo-black flex flex-col gap-4">
                 {user ? (
                    <>
                       <button onClick={() => { setIsProfileModalOpen(true); setIsOpen(false); }} className="font-bold uppercase tracking-wider text-center w-full py-2 hover:text-neo-red border-4 border-transparent">
                          Profil ({user.pseudo || 'User'})
                       </button>
                       <Button onClick={() => { logOut(); setIsOpen(false); }} variant="secondary" className="w-full text-center flex justify-center">Déconnexion</Button>
                    </>
                 ) : (
                    <Button onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }} variant="primary" className="w-full text-center flex justify-center">Connexion</Button>
                 )}
              </div>
            </div>
          </div>
        )}
      </nav>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
    </>
  );
};
