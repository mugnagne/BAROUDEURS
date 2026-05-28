import React from 'react';
import { teams } from '@/data/teams';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, max = 5 }: { rating: number, max?: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const isFull = rating >= i + 1;
        const isHalf = !isFull && rating > i;
        
        return (
          <div key={i} className="relative w-4 h-4">
            <Star
              size={16}
              strokeWidth={3}
              className="text-gray-300 fill-transparent absolute inset-0"
            />
            {isFull && (
              <Star
                size={16}
                strokeWidth={3}
                className="absolute inset-0 text-neo-black fill-neo-black"
              />
            )}
            {isHalf && (
              <StarHalf
                size={16}
                strokeWidth={3}
                className="absolute inset-0 text-neo-black fill-neo-black"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TeamsList = () => {
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-white border-4 sm:border-8 border-neo-black shadow-neo-lg sm:shadow-neo-xl p-6 sm:p-8 md:p-12 relative overflow-hidden mt-12 sm:mt-16">
      <div className="absolute top-0 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-american-stripes rounded-full -translate-y-1/2 border-4 sm:border-8 border-neo-black scale-150 z-0"></div>
      
      <h2 className="relative z-10 text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-8 border-b-4 sm:border-b-8 border-neo-black pb-4 inline-block bg-white px-2">LES 48 ÉQUIPES</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {sortedTeams.map((team) => (
          <div key={team.id} className="border-4 border-neo-black bg-neo-cream p-4 shadow-neo-sm hover:shadow-neo-md hover:-translate-y-1 transition-all flex flex-col h-full bg-repeating-dots">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b-4 border-neo-black bg-white p-2">
              <div className="w-16 h-12 border-2 border-neo-black overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                 <img src={`https://flagcdn.com/w80/${team.countryCode}.png`} alt={`Drapeau ${team.name}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-black text-2xl uppercase tracking-tighter truncate leading-none">{team.name}</h3>
            </div>
            
            <div className="flex-grow flex flex-col gap-3 bg-white border-2 border-neo-black p-3 mb-4">
              <div className="flex justify-between items-center bg-neo-cream p-1 border-2 border-neo-black">
                <span className="font-bold text-sm uppercase px-2">Général</span>
                <StarRating rating={team.rating} />
              </div>
              <div className="flex justify-between items-center p-1">
                <span className="font-bold text-sm uppercase px-2">Attaque</span>
                <StarRating rating={team.offense} />
              </div>
              <div className="flex justify-between items-center p-1">
                <span className="font-bold text-sm uppercase px-2">Défense</span>
                <StarRating rating={team.defense} />
              </div>
            </div>

            <div className="mt-auto bg-white border-2 border-neo-black p-3">
               <p className="text-sm font-medium italic">"{team.summary}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
