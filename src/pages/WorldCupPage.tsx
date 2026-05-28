import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StadiumMap } from '@/components/StadiumMap';
import { GROUPS, STADIUMS } from '@/data/worldCupData';

export const WorldCupPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-6 sm:py-0">
       <div className="bg-neo-blue text-white p-6 sm:p-8 md:p-12 border-4 sm:border-8 border-neo-black shadow-neo-lg sm:shadow-neo-xl mb-12 sm:mb-16 relative overflow-hidden bg-american-stars">
          <div className="relative z-10">
            <Badge variant="white" className="mb-4 sm:mb-6 rotate-2 shadow-neo-sm text-neo-black">ÉVÉNEMENT GÉANT</Badge>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-normal uppercase tracking-tighter mb-4 text-white drop-shadow-[4px_4px_0px_#000]">
              GUIDE 2026
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl font-bold uppercase text-neo-red bg-white inline-block px-3 py-1 sm:px-4 sm:py-2 border-2 sm:border-4 border-neo-black shadow-neo-sm sm:shadow-neo-md -rotate-1">
              TOUT CE QU'IL FAUT SAVOIR SUR LE TOURNOI.
            </p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
         <Card className="p-6 sm:p-8 -rotate-1 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-american-stripes rounded-full translate-x-1/2 -translate-y-1/2 border-4 sm:border-8 border-neo-black scale-150"></div>
           <div className="relative z-10">
             <h3 className="text-3xl sm:text-4xl font-bold text-neo-black uppercase mb-4 tracking-tighter">48 ÉQUIPES</h3>
             <p className="text-lg sm:text-xl font-bold">Pour la première fois, la Coupe du Monde passe de 32 à 48 équipes. Plus de nations, plus de matchs, plus de drama.</p>
           </div>
         </Card>
         <Card className="p-6 sm:p-8 rotate-1 bg-neo-red text-white">
           <h3 className="text-3xl sm:text-4xl font-normal text-white uppercase mb-4 tracking-tighter text-stroke-white-1 drop-shadow-[2px_2px_0px_#000]">3 PAYS HÔTES</h3>
           <p className="text-lg sm:text-xl font-bold">Les USA, le Canada et le Mexique s'unissent. Mais soyons honnêtes, les USA accueillent la part du lion.</p>
         </Card>
         <Card className="p-6 sm:p-8 rotate-1 bg-white md:col-span-2 shadow-neo-lg bg-american-stripes">
           <div className="bg-neo-blue text-white border-4 sm:border-8 border-neo-black p-6 sm:p-8 shadow-neo-md -rotate-1 bg-american-stars">
             <h3 className="text-3xl sm:text-4xl font-black uppercase mb-4 tracking-tighter text-stroke-white-1 drop-shadow-[2px_2px_0px_#000] text-white">104 MATCHS</h3>
             <p className="text-lg sm:text-xl font-bold">Avec le nouveau format, le nombre total de matchs grimpe à 104. Un marathon de soccer étalé sur plus d'un mois à travers toute l'Amérique du Nord.</p>
           </div>
         </Card>
       </div>

       <div className="bg-white border-4 sm:border-8 border-neo-black shadow-neo-lg sm:shadow-neo-xl p-6 sm:p-8 md:p-12 relative overflow-hidden mb-12 sm:mb-16">
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-american-stripes rounded-full translate-x-1/2 -translate-y-1/2 border-4 sm:border-8 border-neo-black scale-150 z-0"></div>
          
          <h2 className="relative z-10 text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-8 border-b-4 sm:border-b-8 border-neo-black pb-4 inline-block bg-white px-2">LES GROUPES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(group => (
              <div key={group} className="border-4 border-neo-black bg-neo-cream shadow-neo-sm overflow-hidden flex flex-col">
                <div className="bg-neo-blue text-white p-2 font-black text-center border-b-4 border-neo-black">GROUPE {group}</div>
                <div className="p-4 flex flex-col gap-2">
                   {GROUPS.filter(t => t.group === group).map(team => (
                     <div key={team.name} className="font-bold flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-1 last:border-0 last:pb-0">
                       <span className="truncate pr-2">{team.name}</span>
                       <span className="text-xl shrink-0">{team.flag}</span>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
       </div>

       <div className="bg-white border-4 sm:border-8 border-neo-black shadow-neo-lg sm:shadow-neo-xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-american-stripes rounded-full translate-x-1/3 translate-y-1/3 border-4 sm:border-8 border-neo-black scale-150 z-0"></div>
          <h2 className="relative z-10 text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-6 sm:mb-8 border-b-4 sm:border-b-8 border-neo-black pb-4 inline-block bg-white px-2">CARTE DES STADES</h2>
          
          <StadiumMap />

          <h3 className="relative z-10 text-3xl font-black uppercase tracking-tighter mb-4 inline-block bg-white px-2">ÉTATS-UNIS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10 mb-8">
            {STADIUMS.filter(s => s.cc === 'us').map((s) => (
              <CityBadge key={s.name} name={s.city} stadium={s.name} />
            ))}
          </div>

          <h3 className="relative z-10 text-3xl font-black uppercase tracking-tighter mb-4 inline-block bg-white px-2 mt-4">MEXIQUE</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10 mb-8">
            {STADIUMS.filter(s => s.cc === 'mx').map((s) => (
               <CityBadge key={s.name} name={s.city} stadium={s.name} />
            ))}
          </div>

          <h3 className="relative z-10 text-3xl font-black uppercase tracking-tighter mb-4 inline-block bg-white px-2 mt-4">CANADA</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
            {STADIUMS.filter(s => s.cc === 'ca').map((s) => (
               <CityBadge key={s.name} name={s.city} stadium={s.name} />
            ))}
          </div>
       </div>
    </div>
  );
};

const CityBadge = ({ name, stadium }: { name: string, stadium: string }) => (
  <div className="border-4 border-neo-black bg-neo-cream p-3 text-center hover:-translate-y-1 hover:shadow-neo-sm hover:bg-neo-blue hover:text-white transition-all cursor-default flex flex-col justify-center items-center h-full">
    <span className="font-black uppercase tracking-wider text-sm md:text-base leading-tight mb-1">{name}</span>
    <span className="text-xs font-bold opacity-80 leading-tight">{stadium}</span>
  </div>
);
