import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { Navigate } from 'react-router-dom';
import { CalendarMatch, getCalendarMatches, reserveMatch, cancelMatchReservation } from '../lib/api/calendarMatches';
import { generateWorldCupMatches } from '../data/worldCupMatches';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, UserCheck, ShieldAlert, Loader2 } from 'lucide-react';

export const CalendarPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<CalendarMatch[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user || !['admin', 'author'].includes((user.role as string))) {
    return <Navigate to="/" replace />;
  }

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await getCalendarMatches();
      setMatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleReserve = async (matchId: string) => {
    try {
      await reserveMatch(matchId, user.uid, (user.pseudo as string) || 'Auteur inconnu');
      await loadMatches();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la réservation');
    }
  };

  const handleCancel = async (matchId: string) => {
    try {
      await cancelMatchReservation(matchId);
      await loadMatches();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'annulation");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
      <div className="mb-12 border-b-8 border-neo-black pb-8 bg-white p-4">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-neo-blue flex items-center gap-4">
          <Calendar className="w-16 h-16" />
          Calendrier des Matchs
        </h1>
        <p className="text-xl font-bold mt-2 text-neo-red uppercase">
          Espace Rédacteurs : Réservez vos matchs !
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-16 h-16 animate-spin text-neo-blue" />
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white border-4 border-neo-black p-8 text-center shadow-neo-md">
          <p className="text-2xl font-bold mb-4">Le calendrier est actuellement vide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const isReservedByMe = match.reservedBy === user.uid;
            const isReservedByOther = match.reservedBy && match.reservedBy !== user.uid;

            return (
              <div
                key={match.id}
                className={`bg-white border-4 border-neo-black p-4 flex flex-col gap-2 relative ${
                  isReservedByMe ? 'ring-8 ring-neo-red' : ''
                } ${isReservedByOther ? 'opacity-80' : 'hover:-translate-y-1 hover:shadow-neo-md transition-all'}`}
              >
                <div className="flex justify-between items-center border-b-4 border-neo-black pb-2 mb-2">
                  <span className="font-black text-neo-blue bg-neo-yellow px-2 border-2 border-neo-black uppercase">
                    Match {match.matchNumber}
                  </span>
                  <span className="font-bold text-sm bg-gray-100 px-2 py-1 border-2 border-neo-black rounded">
                    {format(new Date(match.date), 'dd MMM yyyy - HH:mm', { locale: fr })}
                  </span>
                </div>
                
                <div className="text-center py-4">
                  <p className="font-bold text-sm text-gray-500 uppercase">{match.stage}</p>
                  <p className="font-black text-xl my-2">
                    {match.homeTeam} <span className="text-neo-red">vs</span> {match.awayTeam}
                  </p>
                </div>

                <div className="mt-auto">
                  {isReservedByMe ? (
                    <div className="flex flex-col gap-2">
                      <div className="bg-neo-red text-white font-bold p-2 text-center uppercase flex items-center justify-center gap-2">
                        <UserCheck className="w-5 h-5" /> Réservé par vous
                      </div>
                      <Button onClick={() => handleCancel(match.id)} variant="outline" size="sm">
                        Annuler la réservation
                      </Button>
                    </div>
                  ) : isReservedByOther ? (
                    <div className="bg-gray-200 text-gray-700 border-2 border-gray-400 font-bold p-2 text-center uppercase flex items-center justify-center gap-2">
                      <ShieldAlert className="w-5 h-5" />
                      Réservé [{match.reservedByName}]
                    </div>
                  ) : (
                    <Button onClick={() => handleReserve(match.id)} variant="primary" className="w-full">
                      Réserver ce match
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
