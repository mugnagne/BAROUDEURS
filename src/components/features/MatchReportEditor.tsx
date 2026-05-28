import React, { useState, useRef } from 'react';
import { MatchDetails, MatchHighlight, TeamDetails } from '@/types';
import { worldCupTeams, formations, countryFlagMap } from '@/data/worldCupTeams';
import { Plus, Trash2, Trophy, Clock, User, FileText, Image as ImageIcon, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MatchApiImporter } from './MatchApiImporter';
import { convertImageToBase64 } from '@/lib/imageUtils';

interface MatchReportEditorProps {
  data?: MatchDetails;
  onChange: (data: MatchDetails) => void;
}

const defaultTeam: TeamDetails = {
    name: 'États-Unis',
    flagUrl: '🇺🇸',
    form: 'W-W-D-W-L',
    formation: '4-3-3',
    color: '#002868'
};

const defaultMotm = {
    name: '',
    nickname: '',
    rating: '8',
    description: '',
    imageUrl: ''
};

const FormSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    // value is like "V-V-N-D-V"
    const results = value.split('-');
    // Ensure we have 5 items. If not, default to 'N' (middle/draw)
    const items = [...results.slice(0, 5), ...Array(Math.max(0, 5 - results.length)).fill('N')];
    
    // Cycle: V -> N -> D -> V
    const cycle = (current: string) => {
        if (current === 'V') return 'N';
        if (current === 'N') return 'D';
        return 'V';
    };

    const toggle = (index: number) => {
        const newResults = [...items];
        newResults[index] = cycle(newResults[index]);
        onChange(newResults.join('-'));
    };

    return (
        <div className="flex gap-2">
            {items.map((res, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    className={`w-8 h-8 rounded-full border-2 border-neo-black transition-all hover:scale-110 ${
                        res === 'V' ? 'bg-green-500' :
                        res === 'N' ? 'bg-yellow-400' :
                        'bg-red-500'
                    }`}
                />
            ))}
        </div>
    );
};

export const MatchReportEditor = ({ data, onChange }: MatchReportEditorProps) => {
  const currentData: MatchDetails = data || {
    team1: { ...defaultTeam },
    team2: { ...defaultTeam, name: 'Mexique', flagUrl: '🇲🇽', color: '#006847' },
    score: '0-0',
    highlights: [],
    motm: { ...defaultMotm }
  };

  const updateTeam = (teamKey: 'team1' | 'team2', field: keyof TeamDetails, value: string) => {
    let teamUpdate: Partial<TeamDetails> = { [field]: value };
    
    if (field === 'name') {
        teamUpdate.flagUrl = countryFlagMap[value] || '';
    }

    onChange({
      ...currentData,
      [teamKey]: { ...currentData[teamKey], ...teamUpdate }
    });
  };

  const updateMatch = (field: keyof MatchDetails, value: any) => {
    onChange({ ...currentData, [field]: value });
  };

  const updateMotm = (field: string, value: string) => {
    onChange({ ...currentData, motm: { ...currentData.motm, [field]: value } });
  };

  const addHighlight = () => {
    const newHighlight: MatchHighlight = {
      id: Math.random().toString(36).substr(2, 9),
      minute: '',
      player: '',
      description: '',
      type: 'goal'
    };
    onChange({ ...currentData, highlights: [...currentData.highlights, newHighlight] });
  };

  const updateHighlight = (id: string, field: keyof MatchHighlight, value: string) => {
    onChange({
      ...currentData,
      highlights: currentData.highlights.map(h => h.id === id ? { ...h, [field]: value } : h)
    });
  };

  const removeHighlight = (id: string) => {
    onChange({
      ...currentData,
      highlights: currentData.highlights.filter(h => h.id !== id)
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      updateMotm('imageUrl', base64);
    } catch (error) {
      console.error("Failed to convert image", error);
      alert("Erreur lors de l'import de l'image");
    }
  };

  const handleApiImport = (importedData: Partial<MatchDetails>) => {
    onChange({
      ...currentData,
      ...importedData,
      team1: { ...currentData.team1, ...importedData.team1 },
      team2: { ...currentData.team2, ...importedData.team2 },
    });
  };

  return (
    <div className="space-y-8 p-6 sm:p-8 bg-neo-cream border-4 border-neo-black shadow-neo-sm">
      <MatchApiImporter onImport={handleApiImport} />
      
      <h3 className="text-2xl font-black uppercase text-neo-black border-b-4 border-neo-black pb-2 inline-block">DONNÉES DU MATCH</h3>
      
      {/* SCORE & BASIC INFO */}
      <div className="bg-white p-4 border-4 border-neo-black shadow-neo-md">
        <label className="block text-xl font-black uppercase mb-2">Score Final</label>
        <input 
            type="text" 
            value={currentData.score} 
            onChange={(e) => updateMatch('score', e.target.value)}
            className="w-full text-center text-3xl font-black p-4 border-4 border-neo-black bg-neo-cream"
            placeholder="Ex: 2-1" 
        />
      </div>

      {/* TEAMS SETUP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((teamNum) => {
            const teamKey = `team${teamNum}` as 'team1' | 'team2';
            const team = currentData[teamKey];
            return (
                <div key={teamKey} className="bg-white p-4 border-4 border-neo-black space-y-4">
                    <h4 className="text-xl font-black uppercase flex items-center gap-2">
                        <Circle fill={team.color} stroke="#000" strokeWidth={2} size={24} /> 
                        Équipe {teamNum}
                    </h4>
                    <div>
                        <label className="block font-bold uppercase text-sm mb-1">Pays</label>
                        <select 
                            value={team.name}
                            onChange={(e) => updateTeam(teamKey, 'name', e.target.value)}
                            className="w-full p-2 border-2 border-neo-black font-bold"
                        >
                            {worldCupTeams.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="block font-bold uppercase text-sm mb-1">Drapeau (Emoji/URL)</label>
                            <input 
                                type="text" value={team.flagUrl} onChange={(e) => updateTeam(teamKey, 'flagUrl', e.target.value)} 
                                className="w-full p-2 border-2 border-neo-black"
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-sm mb-1">Couleur</label>
                            <input 
                                type="color" value={team.color} onChange={(e) => updateTeam(teamKey, 'color', e.target.value)} 
                                className="w-full h-[40px] border-2 border-neo-black p-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block font-bold uppercase text-sm mb-1">Formation</label>
                            <select 
                                value={team.formation} onChange={(e) => updateTeam(teamKey, 'formation', e.target.value)} 
                                className="w-full p-2 border-2 border-neo-black font-bold"
                            >
                                {formations.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-sm mb-1">Forme (5 derniers)</label>
                            <FormSelector value={team.form} onChange={(val) => updateTeam(teamKey, 'form', val)} />
                        </div>
                    </div>
                </div>
            )
        })}
      </div>

      {/* MAN OF THE MATCH */}
      <div className="bg-white p-4 border-4 border-neo-black shadow-neo-md space-y-4">
        <h4 className="text-xl font-black uppercase flex items-center gap-2 text-neo-yellow drop-shadow-[1px_1px_0px_#000]">
            <Trophy fill="currentColor" size={28} /> HOMME DU MATCH
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-bold uppercase text-sm mb-1"><User size={16} className="inline mr-1" /> Nom Complet</label>
                <input type="text" value={currentData.motm.name} onChange={(e) => updateMotm('name', e.target.value)} className="w-full p-2 border-2 border-neo-black" placeholder="Kylian Mbappé" />
            </div>
            <div>
                <label className="block font-bold uppercase text-sm mb-1">Surnom</label>
                <input type="text" value={currentData.motm.nickname} onChange={(e) => updateMotm('nickname', e.target.value)} className="w-full p-2 border-2 border-neo-black" placeholder="Le Guépard" />
            </div>
            <div>
                <label className="block font-bold uppercase text-sm mb-1">Note / 10</label>
                <input type="text" value={currentData.motm.rating} onChange={(e) => updateMotm('rating', e.target.value)} className="w-full p-2 border-2 border-neo-black font-black text-neo-red text-xl" placeholder="9.5" />
            </div>
            <div className="md:col-span-2">
                <label className="block font-bold uppercase text-sm mb-1"><ImageIcon size={16} className="inline mr-1" /> Image</label>
                <div className="flex gap-2">
                   <input type="text" value={currentData.motm.imageUrl} onChange={(e) => updateMotm('imageUrl', e.target.value)} className="w-full p-2 border-2 border-neo-black" placeholder="Coller une URL d'image..." />
                   <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} className="whitespace-nowrap">Importer</Button>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
                {currentData.motm.imageUrl && (
                    <img src={currentData.motm.imageUrl} alt="Preview" className="h-24 mt-2 object-cover border-2 border-neo-black" />
                )}
            </div>
            <div className="md:col-span-2">
                <label className="block font-bold uppercase text-sm mb-1"><FileText size={16} className="inline mr-1" /> Description de la performance</label>
                <textarea rows={3} value={currentData.motm.description} onChange={(e) => updateMotm('description', e.target.value)} className="w-full p-2 border-2 border-neo-black resize-none" placeholder="Il a tout simplement survolé les débats..." />
            </div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="bg-white p-4 border-4 border-neo-black shadow-neo-md space-y-4">
        <div className="flex justify-between items-center bg-neo-black text-white p-2">
            <h4 className="text-xl font-black uppercase flex items-center gap-2">
                <Clock size={24} /> LES TEMPS FORTS
            </h4>
            <Button type="button" onClick={addHighlight} variant="primary" size="sm" className="bg-neo-blue border-white text-white rotate-1">
                <Plus size={16} className="mr-1" /> AJOUTER
            </Button>
        </div>
        
        {currentData.highlights.length === 0 ? (
            <p className="text-center font-bold text-neo-black/60 py-4">Aucun fait de match ajouté.</p>
        ) : (
            <div className="space-y-4">
                {currentData.highlights.map((highlight) => (
                    <div key={highlight.id} className="flex flex-col sm:flex-row items-center gap-4 bg-neo-cream p-4 border-2 border-neo-black">
                        <div className="w-full sm:w-24 shrink-0">
                            <label className="block text-xs font-bold uppercase mb-1">Minute</label>
                            <input type="text" value={highlight.minute} onChange={(e) => updateHighlight(highlight.id, 'minute', e.target.value)} className="w-full p-2 border-2 border-neo-black text-center font-black" placeholder="e.g. 45'+2" />
                        </div>
                        <div className="w-full sm:w-32 shrink-0">
                            <label className="block text-xs font-bold uppercase mb-1">Type</label>
                            <select value={highlight.type} onChange={(e) => updateHighlight(highlight.id, 'type', e.target.value)} className="w-full p-2 border-2 border-neo-black font-bold">
                                <option value="goal">⚽ But</option>
                                <option value="yellowCard">🟨 Carton Jaune</option>
                                <option value="redCard">🟥 Carton Rouge</option>
                                <option value="substitution">🔄 Rempl.</option>
                            </select>
                        </div>
                        <div className="w-full flex-1">
                            <label className="block text-xs font-bold uppercase mb-1">Joueur(s) & Description</label>
                            <div className="flex flex-col gap-2">
                                <input type="text" value={highlight.player} onChange={(e) => updateHighlight(highlight.id, 'player', e.target.value)} className="w-full p-2 border-2 border-neo-black font-bold" placeholder="Nom du joueur" />
                                {highlight.type === 'goal' && (
                                    <input type="text" value={highlight.assist || ''} onChange={(e) => updateHighlight(highlight.id, 'assist', e.target.value)} className="w-full p-2 border-2 border-neo-black text-sm italic" placeholder="Passe décisive (ex: K. De Bruyne)" />
                                )}
                                <input type="text" value={highlight.description} onChange={(e) => updateHighlight(highlight.id, 'description', e.target.value)} className="w-full p-2 border-2 border-neo-black text-sm text-neo-black/80" placeholder="Courte description (optionnel)" />
                            </div>
                        </div>
                        <button type="button" onClick={() => removeHighlight(highlight.id)} className="w-full sm:w-auto p-4 bg-neo-red text-white border-2 border-neo-black hover:bg-black transition-colors self-end sm:self-center shrink-0">
                            <Trash2 size={24} />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

    </div>
  );
};

