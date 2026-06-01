export const countryFlagMap: Record<string, string> = {
  "Canada": "🇨🇦", "États-Unis": "🇺🇸", "Mexique": "🇲🇽",
  "Arabie saoudite": "🇸🇦", "Australie": "🇦🇺", "Irak": "🇮🇶", "Japon": "🇯🇵", "Jordanie": "🇯🇴", "Ouzbékistan": "🇺🇿", "Qatar": "🇶🇦", "République de Corée": "🇰🇷", "RI Iran": "🇮🇷",
  "Afrique du Sud": "🇿🇦", "Algérie": "🇩🇿", "Cap-Vert": "🇨🇻", "Côte d'Ivoire": "🇨🇮", "Égypte": "🇪🇬", "Ghana": "🇬🇭", "Maroc": "🇲🇦", "RD Congo": "🇨🇩", "Sénégal": "🇸🇳", "Tunisie": "🇹🇳",
  "Curaçao": "🇨🇼", "Haïti": "🇭🇹", "Panamá": "🇵🇦",
  "Argentine": "🇦🇷", "Brésil": "🇧🇷", "Colombie": "🇨🇴", "Équateur": "🇪🇨", "Paraguay": "🇵🇾", "Uruguay": "🇺🇾",
  "Nouvelle-Zélande": "🇳🇿",
  "Allemagne": "🇩🇪", "Angleterre": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Autriche": "🇦🇹", "Belgique": "🇧🇪", "Bosnie-et-Herzégovine": "🇧🇦", "Croatie": "🇭🇷", "Écosse": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "France": "🇫🇷", "Espagne": "🇪🇸", "Norvège": "🇳🇴", "Pays-Bas": "🇳🇱", "Portugal": "🇵🇹", "Suède": "🇸🇪", "Suisse": "🇨🇭", "Tchéquie": "🇨🇿", "Turquie": "🇹🇷",
  "Danemark": "🇩🇰", "Pologne": "🇵🇱", "Pays de Galles": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Serbie": "🇷🇸", "Cameroun": "🇨🇲", "Costa Rica": "🇨🇷"
};

export const countryColorMap: Record<string, string> = {
  "Canada": "#FF0000", "États-Unis": "#002868", "Mexique": "#006847",
  "Arabie saoudite": "#006C35", "Australie": "#FFCD00", "Irak": "#007A3D", "Japon": "#000555", "Jordanie": "#CE1126", "Ouzbékistan": "#0099B5", "Qatar": "#8A1538", "République de Corée": "#C60C30", "RI Iran": "#239F40",
  "Afrique du Sud": "#007749", "Algérie": "#006233", "Cap-Vert": "#003893", "Côte d'Ivoire": "#F77F00", "Égypte": "#CE1126", "Ghana": "#006B3F", "Maroc": "#C1272D", "RD Congo": "#007FFF", "Sénégal": "#00853F", "Tunisie": "#E70013",
  "Curaçao": "#002B7F", "Haïti": "#00209F", "Panamá": "#DA291C",
  "Argentine": "#43A1D5", "Brésil": "#FFDF00", "Colombie": "#FCD116", "Équateur": "#FFD100", "Paraguay": "#D52B1E", "Uruguay": "#0038A8",
  "Nouvelle-Zélande": "#000000",
  "Allemagne": "#000000", "Angleterre": "#FFFFFF", "Autriche": "#ED2939", "Belgique": "#E30613", "Bosnie-et-Herzégovine": "#002395", "Croatie": "#FF0000", "Écosse": "#005EB8", "France": "#002395", "Espagne": "#AA151B", "Norvège": "#BA0C2F", "Pays-Bas": "#F36C21", "Portugal": "#FF0000", "Suède": "#FECC00", "Suisse": "#FF0000", "Tchéquie": "#11457E", "Turquie": "#E30A17",
  "Danemark": "#C60C30", "Pologne": "#DC143C", "Pays de Galles": "#CF142B", "Serbie": "#C6363C", "Cameroun": "#007A5E", "Costa Rica": "#CE1126"
};

export const worldCupTeams = Object.keys(countryFlagMap);

export const formations = [
  "4-3-3", "4-4-2", "4-2-3-1", "3-5-2", "3-4-3", "4-1-4-1", "4-5-1", "5-3-2", "5-4-1", "3-4-2-1"
];
