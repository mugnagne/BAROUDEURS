export interface MatchHighlight {
  id: string;
  minute: string;
  player: string;
  assist?: string;
  description: string;
  type: 'goal' | 'redCard' | 'yellowCard' | 'substitution';
}

export interface TeamDetails {
  name: string;
  flagUrl: string;
  form: string; // e.g., "W-D-L-W-W"
  formation: string;
  color: string;
  lineup?: { name: string, number: number, pos: string, grid?: string }[];
}

export interface MatchDetails {
  team1: TeamDetails;
  team2: TeamDetails;
  score: string;
  highlights: MatchHighlight[];
  motm: {
    name: string;
    nickname: string;
    rating: string;
    description: string;
    imageUrl: string;
  };
}

export interface Joueur {
  id: string;
  name: string;
  avatarUrl: string;
  email?: string;
}

export interface MailingList {
  id: string;
  name: string;
  joueurIds: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  tags: string[];
  isMatchReport?: boolean;
  matchDetails?: MatchDetails;
  ownerId?: string;
  createdAt?: number;
  updatedAt?: number;
  joueurIds?: string[];
  mailingListId?: string;
  status?: 'published' | 'draft';
}
