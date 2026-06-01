import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { generateWorldCupMatches } from '../../data/worldCupMatches';

export interface CalendarMatch {
  id: string; // "match-1"
  matchNumber: number;
  date: string; // ISO date string
  homeTeam: string;
  awayTeam: string;
  stage: string;
  stadium: string;
  reservedBy: string | null;
  reservedByName: string | null;
}

const COLLECTION_NAME = 'calendarMatches';

export const getCalendarMatches = async (): Promise<CalendarMatch[]> => {
  const staticMatches = generateWorldCupMatches();
  
  const q = query(collection(db, COLLECTION_NAME));
  const snapshot = await getDocs(q);
  
  const reservationsMap: Record<string, { reservedBy: string, reservedByName: string }> = {};
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.reservedBy) {
      reservationsMap[doc.id] = { reservedBy: data.reservedBy, reservedByName: data.reservedByName };
    }
  });

  return staticMatches.map(sm => {
    const res = reservationsMap[sm.id];
    if (res) {
      return { ...sm, reservedBy: res.reservedBy, reservedByName: res.reservedByName };
    }
    return sm;
  });
};

export const reserveMatch = async (matchId: string, userId: string, userName: string) => {
  const matchRef = doc(db, COLLECTION_NAME, matchId);
  await setDoc(matchRef, {
    reservedBy: userId,
    reservedByName: userName
  }, { merge: true });
};

export const cancelMatchReservation = async (matchId: string) => {
  const matchRef = doc(db, COLLECTION_NAME, matchId);
  await deleteDoc(matchRef);
};
