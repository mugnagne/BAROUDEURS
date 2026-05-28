import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MatchDetails, TeamDetails, MatchHighlight } from '@/types';
import { Download, Loader2 } from 'lucide-react';
import { countryFlagMap } from '@/data/worldCupTeams';

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  league: {
    name: string;
    season: number;
  };
  teams: {
    home: { id: number; name: string; winner: boolean };
    away: { id: number; name: string; winner: boolean };
  };
  goals: {
    home: number;
    away: number;
  };
}

interface MatchApiImporterProps {
  onImport: (data: Partial<MatchDetails>) => void;
}

const countryTranslationMap: Record<string, string> = {
  "USA": "États-Unis",
  "South Korea": "République de Corée",
  "Iran": "RI Iran",
  "South Africa": "Afrique du Sud",
  "Ivory Coast": "Côte d'Ivoire",
  "Netherlands": "Pays-Bas",
  "New Zealand": "Nouvelle-Zélande",
  "Cape Verde": "Cap-Vert",
  "Saudi Arabia": "Arabie saoudite",
  "Morocco": "Maroc",
  "DR Congo": "RD Congo",
  "England": "Angleterre",
  "Germany": "Allemagne",
  "Spain": "Espagne",
  "Italy": "Italie",
  "Brazil": "Brésil",
  "Cameroon": "Cameroun",
  "Denmark": "Danemark",
  "Wales": "Pays de Galles",
  "Poland": "Pologne",
  "Serbia": "Serbie",
  "Croatia": "Croatie",
  "Switzerland": "Suisse",
  "Japan": "Japon",
  "Senegal": "Sénégal",
  "Belgium": "Belgique",
  "Uruguay": "Uruguay",
  "Ghana": "Ghana",
  "Qatar": "Qatar",
  "Ecuador": "Équateur",
  "Argentina": "Argentine",
  "Mexico": "Mexique",
  "Australia": "Australie",
  "Tunisia": "Tunisie",
  "Costa Rica": "Costa Rica",
  "Algeria": "Algérie",
  "Egypt": "Égypte",
  "Norway": "Norvège",
  "Austria": "Autriche",
  "Sweden": "Suède",
  "Turkey": "Turquie",
  "Scotland": "Écosse",
  "Uzbekistan": "Ouzbékistan",
  "Colombia": "Colombie",
  "Peru": "Pérou",
  "Panama": "Panamá",
  "Iraq": "Irak",
  "Jordan": "Jordanie"
};

export const MatchApiImporter = ({ onImport }: MatchApiImporterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (isOpen && fixtures.length === 0) {
      fetchFixtures();
    }
  }, [isOpen]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/football/fixtures');
      const data = await res.json();
      if (data.response) {
        setFixtures(data.response);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleImport = async () => {
    if (!selectedFixtureId) return;
    setImporting(true);
    try {
      const res = await fetch(`/api/football/fixtures/${selectedFixtureId}`);
      const data = await res.json();
      if (data.response && data.response.length > 0) {
        const fixtureInfo = data.response[0];
        
        // Translate some common names to French to match our DB, or handle manually
        let homeName = fixtureInfo.teams.home.name;
        let awayName = fixtureInfo.teams.away.name;
        
        homeName = countryTranslationMap[homeName] || homeName;
        awayName = countryTranslationMap[awayName] || awayName;
        // More translations can be added, assuming API gives english names.
        
        const team1: Partial<TeamDetails> = {
          name: homeName,
          flagUrl: countryFlagMap[homeName] || '',
        };
        const team2: Partial<TeamDetails> = {
          name: awayName,
          flagUrl: countryFlagMap[awayName] || '',
        };
        
        const score = `${fixtureInfo.goals.home ?? 0}-${fixtureInfo.goals.away ?? 0}`;
        
        // Highlights (Events)
        let highlights: MatchHighlight[] = [];
        if (fixtureInfo.events) {
          highlights = fixtureInfo.events
            .filter((e: any) => e.type === 'Goal' || e.type === 'Card' || (e.type === 'subst' && e.player?.name))
            .map((e: any) => {
              let type: MatchHighlight['type'] = 'goal';
              if (e.type === 'Goal') type = 'goal';
              if (e.type === 'Card' && e.detail.toLowerCase().includes('yellow')) type = 'yellowCard';
              if (e.type === 'Card' && e.detail.toLowerCase().includes('red')) type = 'redCard';
              if (e.type === 'subst') type = 'substitution';
              
              let assistName = e.assist?.name;
              
              let description = type === 'goal' ? 'But !' : (type === 'yellowCard' ? 'Carton jaune' : (type === 'redCard' ? 'Carton rouge' : 'Remplacement'));
              if (type === 'substitution' && assistName) {
                  description = `Sortie de ${e.player.name}`; // e.player is the one coming OUT, e.assist is IN
              }

              return {
                id: Math.random().toString(36).substr(2, 9),
                minute: String(e.time.elapsed),
                player: type === 'substitution' && assistName ? assistName : e.player.name,
                assist: type === 'goal' && assistName ? assistName : undefined,
                description,
                type
              };
            });
        }
        
        // Lineups (formation and players)
        if (fixtureInfo.lineups && fixtureInfo.lineups.length === 2) {
           const homeLineup = fixtureInfo.lineups.find((l: any) => l.team.id === fixtureInfo.teams.home.id);
           const awayLineup = fixtureInfo.lineups.find((l: any) => l.team.id === fixtureInfo.teams.away.id);

           if (homeLineup) {
               team1.formation = homeLineup.formation || '4-3-3';
               if (homeLineup.startXI) {
                   team1.lineup = homeLineup.startXI.map((p: any) => ({
                       name: p.player.name,
                       number: p.player.number,
                       pos: p.player.pos,
                       grid: p.player.grid
                   }));
               }
           }
           if (awayLineup) {
               team2.formation = awayLineup.formation || '4-3-3';
               if (awayLineup.startXI) {
                   team2.lineup = awayLineup.startXI.map((p: any) => ({
                       name: p.player.name,
                       number: p.player.number,
                       pos: p.player.pos,
                       grid: p.player.grid
                   }));
               }
           }
        }

        // Form (recent matches)
        try {
          const homeFormRes = await fetch(`/api/football/teams/${fixtureInfo.teams.home.id}/form`);
          const homeFormData = await homeFormRes.json();
          if (homeFormData.response?.form) {
            team1.form = homeFormData.response.form.slice(-5).split('').join('-');
          }

          const awayFormRes = await fetch(`/api/football/teams/${fixtureInfo.teams.away.id}/form`);
          const awayFormData = await awayFormRes.json();
          if (awayFormData.response?.form) {
            team2.form = awayFormData.response.form.slice(-5).split('').join('-');
          }
        } catch (err) {
          console.error("Failed to fetch form data", err);
        }

        onImport({
          score,
          team1: team1 as TeamDetails,
          team2: team2 as TeamDetails,
          highlights
        });
      }
    } catch (err) {
      console.error(err);
    }
    setImporting(false);
    setIsOpen(false);
  };

  return (
    <div className="mb-6 bg-white border-4 border-neo-black p-4 shadow-neo-sm">
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          <Download size={18} /> IMPORTER LES DONNÉES DU MATCH
        </Button>
      ) : (
        <div className="flex flex-col gap-4">
          <h4 className="font-black uppercase">Sélectionner un match (WC 2022)</h4>
          {loading ? (
             <div className="flex items-center gap-2 text-gray-500 font-bold uppercase"><Loader2 className="animate-spin" /> Chargement...</div>
          ) : (
             <div className="flex gap-4 items-center">
                 <select 
                    className="flex-1 p-2 border-4 border-neo-black bg-neo-cream font-bold"
                    value={selectedFixtureId}
                    onChange={(e) => setSelectedFixtureId(e.target.value)}
                 >
                     <option value="">-- Choisir un match --</option>
                     {fixtures.map(f => (
                         <option key={f.fixture.id} value={f.fixture.id}>
                             {new Date(f.fixture.date).toLocaleDateString()} : {f.teams.home.name} {f.goals.home} - {f.goals.away} {f.teams.away.name}
                         </option>
                     ))}
                 </select>
                 <Button onClick={handleImport} disabled={!selectedFixtureId || importing} className="bg-neo-blue text-white">
                     {importing ? <Loader2 className="animate-spin" /> : "IMPORTER"}
                 </Button>
                 <Button variant="outline" onClick={() => setIsOpen(false)}>ANNULER</Button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
