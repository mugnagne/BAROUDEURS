// MOCK World Cup 2026 Response
export const mockWc2026Fixtures = {
  get: "fixtures",
  response: [
    {
      fixture: {
        id: 999991,
        date: "2026-06-11T15:00:00+00:00",
        status: { short: "FT" }
      },
      league: { name: "World Cup", season: 2026 },
      teams: {
        home: { id: 1001, name: "Mexique", winner: true },
        away: { id: 1002, name: "Afrique du Sud", winner: false }
      },
      goals: { home: 2, away: 1 },
      events: [
        { type: "Goal", time: { elapsed: 14 }, player: { name: "S. Giménez" } },
        { type: "Goal", time: { elapsed: 35 }, player: { name: "L. Foster" } },
        { type: "Goal", time: { elapsed: 78 }, player: { name: "H. Lozano" } }
      ]
    }
  ]
};
