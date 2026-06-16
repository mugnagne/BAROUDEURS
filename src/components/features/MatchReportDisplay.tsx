import React from 'react';
import { MatchDetails, MatchHighlight, TeamDetails } from '@/types';
import { Trophy, Activity, Star } from 'lucide-react';

const FormationVisual = ({ team, highlights, isReversed }: { team: TeamDetails, highlights: MatchHighlight[], isReversed?: boolean }) => {
    // formation is typically "4-3-3", "4-4-2", etc.
    const formation = team.formation || '4-3-3';
    const lines = [1, ...formation.split('-').map(Number)];
    
    // Create a flat array of players if lineup exists
    const players = team.lineup && team.lineup.length >= 11 ? [...team.lineup] : null;
    let playerIndex = 0;

    return (
        <div className={`w-full max-w-[280px] mx-auto flex flex-col justify-between items-center py-6 bg-green-700/20 rounded-lg relative h-[420px] md:h-[480px] border-4 border-neo-black overflow-hidden group shadow-neo-inner ${isReversed ? 'rotate-180' : ''}`}>
            {/* Field lines */}
            <div className="absolute inset-x-0 top-1/2 h-0 border-t-4 border-white/30 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            
            {lines.map((count, lineIndex) => (
                <div key={lineIndex} className="flex justify-around w-full px-2 z-10 relative">
                    {Array.from({ length: count }).map((_, i) => {
                        const player = players ? players[playerIndex++] : null;
                        
                        let goalCount = 0;
                        if (player) {
                           // Try to match player name. API might return "K. Mbappé" or "Kylian Mbappé", we do a simple check.
                           const lastName = player.name.split(' ').pop() || player.name;
                           goalCount = highlights.filter(h => h.type === 'goal' && h.player.includes(lastName)).length;
                        }

                        return (
                            <div key={i} className={`flex flex-col items-center group/player ${isReversed ? 'rotate-180' : ''}`}>
                                <div className="relative">
                                    <div 
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-neo-black shadow-md transform transition-transform group-hover/player:scale-110 flex items-center justify-center text-xs md:text-sm font-black text-white"
                                        style={{ backgroundColor: team.color }}
                                    >
                                        {player?.number || ''}
                                    </div>
                                    {goalCount > 0 && (
                                        <div className="absolute -top-3 -right-3 flex gap-0.5 z-20">
                                            {Array.from({length: goalCount}).map((_, j) => (
                                                <span key={j} className="text-sm bg-white rounded-full leading-none shadow-neo-sm border-2 border-neo-black p-[1px]">⚽</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {player && (
                                    <span className="text-[10px] md:text-xs font-black bg-white/90 text-neo-black mt-1 px-1.5 py-0.5 rounded border-2 border-neo-black truncate max-w-[65px] md:max-w-[85px] text-center shadow-neo-sm">
                                        {player.name.split(' ').pop() || player.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

const HighlightIcon = ({ type }: { type: MatchHighlight['type'] }) => {
    switch (type) {
        case 'goal': return <span>⚽</span>;
        case 'yellowCard': return <span>🟨</span>;
        case 'redCard': return <span>🟥</span>;
        case 'substitution': return <span>🔄</span>;
        default: return <span>📌</span>;
    }
};

export const MatchScoreHeader = ({ details }: { details: MatchDetails }) => {
    return (
      <div className="bg-neo-blue text-white p-6 md:p-8 border-8 border-neo-black shadow-neo-xl rotate-1 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-american-stars">
        
        {/* TEAM 1 */}
        <div className="flex flex-col items-center flex-1 z-10 w-full sm:w-auto">
            {details.team1.flagUrl.startsWith('http') ? (
               <img src={details.team1.flagUrl} alt="crest" className="h-16 w-16 mb-2 drop-shadow-md object-contain" />
            ) : (
               <span className="text-6xl mb-2 drop-shadow-md">{details.team1.flagUrl}</span>
            )}
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white bg-[#e6192b] px-3 py-1 border-4 border-neo-black shadow-[4px_4px_0px_#000] -rotate-2">{details.team1.name}</h1>
            <div className="flex gap-1 mt-4">
                {details.team1.form.split('-').map((res, i) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-neo-black text-neo-black ${res === 'W' || res === 'V' ? 'bg-green-400' : res === 'N' ? 'bg-yellow-400' : 'bg-red-400'}`}>
                        {res}
                    </span>
                ))}
            </div>
        </div>

        {/* SCORE */}
        <div className="flex flex-col items-center shrink-0 z-10 bg-white text-neo-black p-4 border-8 border-neo-black -rotate-2 shadow-neo-md min-w-[150px]">
            <span className="text-sm font-black uppercase tracking-widest text-neo-red mb-2">SCORE FINAL</span>
            <div className="text-5xl md:text-7xl font-black">{details.score}</div>
        </div>

        {/* TEAM 2 */}
        <div className="flex flex-col items-center flex-1 z-10 w-full sm:w-auto">
            {details.team2.flagUrl.startsWith('http') ? (
               <img src={details.team2.flagUrl} alt="crest" className="h-16 w-16 mb-2 drop-shadow-md object-contain" />
            ) : (
               <span className="text-6xl mb-2 drop-shadow-md">{details.team2.flagUrl}</span>
            )}
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white bg-[#e6192b] px-3 py-1 border-4 border-neo-black shadow-[4px_4px_0px_#000] rotate-2">{details.team2.name}</h1>
            <div className="flex gap-1 mt-4">
                {details.team2.form.split('-').map((res, i) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-neo-black text-neo-black ${res === 'W' || res === 'V' ? 'bg-green-400' : res === 'N' ? 'bg-yellow-400' : 'bg-red-400'}`}>
                        {res}
                    </span>
                ))}
            </div>
        </div>
      </div>
    );
};

export const MatchTacticalBoard = ({ team1, team2, highlights }: { team1: TeamDetails, team2: TeamDetails, highlights: MatchHighlight[] }) => {
    if (!team1.lineup?.length && !team2.lineup?.length) {
        return null; // Do not show anything if no lineup details
    }
    return (
        <div className="bg-white border-4 border-neo-black p-6 shadow-neo-lg -rotate-1 relative flex flex-col gap-4 mt-4">
            <h3 className="absolute -top-5 left-4 bg-neo-red text-white px-4 py-1 border-4 border-neo-black font-black uppercase shadow-[4px_4px_0px_#000] transform -rotate-2 z-20">
              Compositions
            </h3>
            
            <div className="flex flex-col mt-4">
              <span className="font-bold text-center mb-2">{team1.name} ({team1.formation})</span>
              <FormationVisual team={team1} highlights={highlights} />
            </div>
            <div className="flex flex-col mt-4 items-center w-full">
              <span className="font-bold text-center mb-2">{team2.name} ({team2.formation})</span>
              <FormationVisual team={team2} highlights={highlights} isReversed={true} />
            </div>
        </div>
    );
};

export const MatchChronology = ({ highlights }: { highlights: MatchHighlight[] }) => {
    if (!highlights || highlights.length === 0) {
        return null; // Do not show anything if no highlights
    }
    return (
        <div className="bg-white text-neo-black border-4 border-neo-black p-6 shadow-neo-lg rotate-1 relative mt-8">
          <h3 className="absolute -top-5 right-4 bg-[#e6192b] px-4 py-1 border-4 border-neo-black font-black uppercase shadow-neo-sm transform rotate-2 text-white z-20">
              Chronologie
          </h3>
          <div className="mt-8 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {highlights.length > 0 ? highlights.map((h, i) => (
                  <div key={i} className="flex gap-3 bg-neo-cream p-3 border-2 border-neo-black shadow-neo-sm">
                      <span className="font-black text-neo-red w-12 shrink-0 text-xl">{h.minute}</span>
                      <span className="text-2xl shrink-0"><HighlightIcon type={h.type} /></span>
                      <div className="flex flex-col justify-center">
                          <span className="font-black uppercase text-sm leading-tight">
                              {h.player} {h.type === 'goal' && h.assist && <span className="text-xs lowercase text-neo-black/60 italic font-medium ml-1">(Passe: {h.assist})</span>}
                          </span>
                          {h.description && <span className="text-xs font-bold text-neo-black/70 italic mt-1">{h.description}</span>}
                      </div>
                  </div>
              )) : (
                  <p className="text-center font-bold opacity-60 bg-neo-cream p-4 border-2 border-neo-black">Attente des faits de jeu...</p>
              )}
          </div>
        </div>
    );
};

export const MatchMotm = ({ motm }: { motm: MatchDetails['motm'] }) => {
    if (!motm.name) return null;
    return (
        <div className="bg-neo-cream border-8 border-neo-black p-0 shadow-neo-xl flex flex-col md:flex-row overflow-hidden transform group transition-transform">
            {motm.imageUrl ? (
                <div className="w-full md:w-1/3 aspect-square md:aspect-auto md:h-auto border-b-8 md:border-b-0 md:border-r-8 border-neo-black relative overflow-hidden">
                    <img src={motm.imageUrl} alt={motm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-0 left-0 bg-neo-black text-white px-4 py-2 border-r-4 border-b-4 border-neo-black font-black text-2xl flex items-center justify-center rounded-br-lg shadow-neo-sm">
                        <Star className="fill-neo-yellow text-neo-yellow mr-2" /> {motm.rating}
                    </div>
                </div>
            ) : (
                <div className="w-full md:w-1/4 h-32 md:h-auto border-b-8 md:border-b-0 md:border-r-8 border-neo-black bg-neo-black flex items-center justify-center p-4">
                     <span className="text-4xl block transform -rotate-6 text-center font-black uppercase text-neo-yellow">
                        MVP<br/>{motm.rating}
                     </span>
                </div>
            )}
            
            <div className="p-6 flex-1 flex flex-col relative bg-white overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Trophy size={160} />
                </div>
                
                <h4 className="text-sm font-black uppercase mb-1 bg-neo-black text-white inline-block px-3 py-1 border-2 border-neo-black -rotate-1 w-fit shadow-neo-sm">
                    L'Homme du Match
                </h4>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 relative z-10 text-neo-black">
                    {motm.name}
                </h3>
                {motm.nickname && (
                    <p className="text-lg md:text-xl font-bold italic text-neo-red mb-4">
                        "{motm.nickname}"
                    </p>
                )}
                <div className="prose prose-lg leading-snug font-medium relative z-10 text-neo-black">
                    <p>{motm.description}</p>
                </div>
            </div>
        </div>
    );
};

