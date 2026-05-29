import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-neo-blue border-t-8 border-neo-black text-white py-16 px-4 mt-20 relative overflow-hidden bg-american-stars">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left items-center md:items-start">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 text-white drop-shadow-[4px_4px_0px_#000] rotate-2 inline-block bg-neo-black px-4 py-2 border-4 border-white">
              BAROUDEURS
            </h2>
            <p className="text-xl font-bold max-w-md mx-auto md:mx-0 bg-white text-neo-black border-4 border-neo-black p-4 rotate-1 shadow-neo-md">
              LE BLOG NON-OFFICIEL POUR LA COUPE DU MONDE MADE IN ROI ARTHUR
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center space-y-4">
             <Link to="/" className="font-bold uppercase tracking-widest bg-white text-neo-black border-4 border-neo-black px-4 py-2 hover:bg-neo-red hover:text-white shadow-neo-sm hover:shadow-neo-md transition-all">Accueil</Link>
             <Link to="/blog" className="font-bold uppercase tracking-widest bg-white text-neo-black border-4 border-neo-black px-4 py-2 hover:bg-neo-red hover:text-white shadow-neo-sm hover:shadow-neo-md transition-all">Articles</Link>
             <Link to="/world-cup" className="font-bold uppercase tracking-widest bg-white text-neo-black border-4 border-neo-black px-4 py-2 hover:bg-neo-red hover:text-white shadow-neo-sm hover:shadow-neo-md transition-all">Mondial 2026</Link>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t-4 border-neo-black border-dashed flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 bg-white text-neo-black p-4 border-4 shadow-neo-sm">
          <p className="font-bold text-sm uppercase">&copy; {new Date().getFullYear()} BAROUDEURS. TOUS DROITS RÉSERVÉS.</p>
          <div className="flex items-center gap-2">
			  <span className="w-4 h-4 bg-neo-red border-2 border-neo-black rotate-45 inline-block"></span>
			  <span className="w-4 h-4 bg-white border-2 border-neo-black -rotate-12 inline-block"></span>
			  <span className="w-4 h-4 bg-neo-blue border-2 border-neo-black rotate-12 inline-block"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
