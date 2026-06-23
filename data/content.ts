export type VideoSource = {
  name: string;
  url: string;
  type: "hls" | "mp4" | "embed";
};

export type Episode = {
  id: string;
  title: string;
  episode: number;
  runtime: number;
  synopsis: string;
  thumbnailUrl: string;
};

export type Season = {
  id: string;
  number: number;
  year: number;
  episodes: Episode[];
};

export type ContentItem = {
  id: string;
  title: string;
  type: "movie" | "series";
  // tmdbId + tmdbType drive real artwork; posterUrl/backdropUrl are CSS-gradient fallbacks only
  tmdbId: number;
  tmdbType: "movie" | "tv";
  backdropUrl: string;   // kept for SSR skeleton colour; real image comes from TMDB
  posterUrl: string;     // same — TMDB overrides this client-side
  logoUrl?: string;
  synopsis: string;
  year: number;
  maturityRating: string;
  genres: string[];
  matchPercent: number;
  trailerYouTubeId: string;
  sources?: VideoSource[];
  duration?: string;
  seasons?: Season[];
  featured?: boolean;
  tagline?: string;
  cast?: string[];
  creator?: string;
};

// gradient placeholder colours per genre (used server-side / before TMDB loads)
const G = {
  mystery:  "from-slate-900 via-purple-950 to-slate-950",
  horror:   "from-slate-950 via-red-950   to-slate-950",
  drama:    "from-slate-900 via-zinc-900   to-slate-950",
  scifi:    "from-slate-900 via-cyan-950   to-slate-950",
  crime:    "from-zinc-900  via-stone-900  to-slate-950",
  action:   "from-slate-900 via-orange-950 to-slate-950",
  comedy:   "from-slate-900 via-amber-950  to-slate-950",
  history:  "from-slate-900 via-yellow-950 to-slate-950",
  fantasy:  "from-slate-900 via-violet-950 to-slate-950",
};

const content: ContentItem[] = [
  // ─── HERO FEATURED ──────────────────────────────────────────────────────────
  {
    id: "from-mgm",
    title: "FROM",
    type: "series",
    tmdbId: 124364,
    tmdbType: "tv",
    backdropUrl: G.mystery,
    posterUrl: G.mystery,
    synopsis:
      "Unravel the terrifying mystery of a nightmarish town that traps all those who enter. As the unwilling residents fight to keep a sense of normalcy and search for a way out, they must also survive the threats of the surrounding forest — including the creatures that come out when the sun goes down.",
    tagline: "There's no way out.",
    year: 2022,
    maturityRating: "TV-MA",
    genres: ["Mystery", "Horror", "Sci-Fi", "Drama"],
    matchPercent: 98,
    trailerYouTubeId: "e-HBbz0mvlo",
    creator: "John Griffin",
    duration: "4 Seasons",
    cast: ["Harold Perrineau", "Catalina Sandino Moreno", "Eion Bailey", "Hannah Cheramy", "Ricky He"],
    featured: true,
    seasons: [
      {
        id: "from-s1",
        number: 1,
        year: 2022,
        episodes: (["Pilot","The Way Things Are Now","Choosing Day","Don't Say A Word","Tether","Book 27","Moving Day","Broken Windows, Open Doors","Ball and Chain","Masters of Death"] as const).map((title, i) => ({
          id: `from-s1e${i + 1}`,
          title,
          episode: i + 1,
          runtime: 52,
          synopsis: "Strange and terrifying events unfold in the mysterious town that no one can escape.",
          thumbnailUrl: `https://picsum.photos/seed/from-s1e${i + 1}/320/180`,
        })),
      },
      {
        id: "from-s2",
        number: 2,
        year: 2023,
        episodes: (["Strangers in a Strange Land","Revelations","The Way Back","Into the Woods","Pas De Deux","The Door","Silhouettes","Forest for the Trees","You Are Not Alone","Once Upon a Time"] as const).map((title, i) => ({
          id: `from-s2e${i + 1}`,
          title,
          episode: i + 1,
          runtime: 54,
          synopsis: "The town's dark secrets begin to unravel as survivors search desperately for answers.",
          thumbnailUrl: `https://picsum.photos/seed/from-s2e${i + 1}/320/180`,
        })),
      },
      {
        id: "from-s3",
        number: 3,
        year: 2024,
        episodes: (["The Kindred","The Way Out","Origins","The Ritual","Convergence","The Reckoning","Nightfall","Into the Dark","The Truth","Finale"] as const).map((title, i) => ({
          id: `from-s3e${i + 1}`,
          title,
          episode: i + 1,
          runtime: 56,
          synopsis: "The final mysteries of the town converge toward a shocking and terrifying conclusion.",
          thumbnailUrl: `https://picsum.photos/seed/from-s3e${i + 1}/320/180`,
        })),
      },
      {
        id: "from-s4",
        number: 4,
        year: 2025,
        episodes: (["Out of Nowhere","Deeper Down","No Way Back","The Hunger","Shadows & Light","Unraveling","The Crossing","What Was Lost","Blood and Soil","Into the Unknown"] as const).map((title, i) => ({
          id: `from-s4e${i + 1}`,
          title,
          episode: i + 1,
          runtime: 56,
          synopsis: "Survivors uncover a devastating truth about the town's origins as new arrivals shift the balance of power.",
          thumbnailUrl: `https://picsum.photos/seed/from-s4e${i + 1}/320/180`,
        })),
      },
    ],
  },

  // ─── HBO ORIGINALS ──────────────────────────────────────────────────────────
  {
    id: "succession",
    title: "Succession",
    type: "series",
    tmdbId: 63351,
    tmdbType: "tv",
    backdropUrl: G.drama,
    posterUrl: G.drama,
    synopsis:
      "The Roy family controls the biggest media and entertainment company in the world. But with the patriarch's health failing, each member of the family begins to make their move.",
    year: 2018,
    maturityRating: "TV-MA",
    genres: ["Drama", "Comedy"],
    matchPercent: 97,
    trailerYouTubeId: "OhKAn4I3Q-M",
    creator: "Jesse Armstrong",
    cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook", "Kieran Culkin", "Matthew Macfadyen"],
    seasons: [{ id: "succ-s1", number: 1, year: 2018, episodes: Array.from({ length: 10 }, (_, i) => ({ id: `succ-s1e${i+1}`, title: `Episode ${i+1}`, episode: i+1, runtime: 58, synopsis: "The Roy family fights for control of their media empire.", thumbnailUrl: `https://picsum.photos/seed/succ-s1e${i+1}/320/180` })) }],
  },
  {
    id: "the-wire",
    title: "The Wire",
    type: "series",
    tmdbId: 1438,
    tmdbType: "tv",
    backdropUrl: G.crime,
    posterUrl: G.crime,
    synopsis:
      "This Emmy-winning series looks at the Baltimore drug scene from the point of view of law enforcement as well as the drug dealers and users.",
    year: 2002,
    maturityRating: "TV-MA",
    genres: ["Crime", "Drama", "Thriller"],
    matchPercent: 99,
    trailerYouTubeId: "QJMDGJDEuDY",
    cast: ["Dominic West", "Lance Reddick", "Idris Elba"],
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    type: "series",
    tmdbId: 100088,
    tmdbType: "tv",
    backdropUrl: G.horror,
    posterUrl: G.horror,
    synopsis:
      "Twenty years after modern civilization has been destroyed, Joel smuggles Ellie out of an oppressive quarantine zone in what starts as a small job but becomes a brutal, heartbreaking journey.",
    year: 2023,
    maturityRating: "TV-MA",
    genres: ["Drama", "Horror", "Action"],
    matchPercent: 96,
    trailerYouTubeId: "uLtkt8BonwM",
    cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna"],
  },
  {
    id: "house-of-dragon",
    title: "House of the Dragon",
    type: "series",
    tmdbId: 94997,
    tmdbType: "tv",
    backdropUrl: G.fantasy,
    posterUrl: G.fantasy,
    synopsis:
      "The story of House Targaryen set 200 years before Game of Thrones — a civil war that nearly tore the Targaryens apart.",
    year: 2022,
    maturityRating: "TV-MA",
    genres: ["Fantasy", "Drama", "Action"],
    matchPercent: 94,
    trailerYouTubeId: "DotnJ7tTA34",
    cast: ["Paddy Considine", "Olivia Cooke", "Emma D'Arcy"],
  },
  {
    id: "euphoria",
    title: "Euphoria",
    type: "series",
    tmdbId: 85552,
    tmdbType: "tv",
    backdropUrl: G.drama,
    posterUrl: G.drama,
    synopsis:
      "A group of high school students navigate love and friendships in a world of drugs, sex, trauma, and social media.",
    year: 2019,
    maturityRating: "TV-MA",
    genres: ["Drama", "Teen"],
    matchPercent: 91,
    trailerYouTubeId: "wHHSMiMkF5k",
    cast: ["Zendaya", "Hunter Schafer", "Jacob Elordi"],
  },
  {
    id: "white-lotus",
    title: "The White Lotus",
    type: "series",
    tmdbId: 110316,
    tmdbType: "tv",
    backdropUrl: G.comedy,
    posterUrl: G.comedy,
    synopsis:
      "A social satire set at a tropical resort where the hotel staff and guests interact over the course of a week — slowly revealing dark undercurrents beneath paradise.",
    year: 2021,
    maturityRating: "TV-MA",
    genres: ["Comedy", "Drama", "Mystery"],
    matchPercent: 91,
    trailerYouTubeId: "OAfEJqZFcN0",
    cast: ["Murray Bartlett", "Connie Britton", "Jennifer Coolidge"],
  },

  // ─── NETFLIX ORIGINALS ──────────────────────────────────────────────────────
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "series",
    tmdbId: 66732,
    tmdbType: "tv",
    backdropUrl: G.scifi,
    posterUrl: G.scifi,
    synopsis:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces.",
    year: 2016,
    maturityRating: "TV-14",
    genres: ["Horror", "Sci-Fi", "Drama"],
    matchPercent: 95,
    trailerYouTubeId: "b9EkMc79ZSU",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
  },
  {
    id: "squid-game",
    title: "Squid Game",
    type: "series",
    tmdbId: 93405,
    tmdbType: "tv",
    backdropUrl: G.horror,
    posterUrl: G.horror,
    synopsis:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games with deadly high stakes.",
    year: 2021,
    maturityRating: "TV-MA",
    genres: ["Thriller", "Drama", "Action"],
    matchPercent: 98,
    trailerYouTubeId: "oqxAJKy0ii4",
    cast: ["Lee Jung-jae", "Park Hae-soo", "Jung Ho-yeon"],
  },
  {
    id: "wednesday",
    title: "Wednesday",
    type: "series",
    tmdbId: 119051,
    tmdbType: "tv",
    backdropUrl: G.mystery,
    posterUrl: G.mystery,
    synopsis:
      "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    year: 2022,
    maturityRating: "TV-14",
    genres: ["Mystery", "Comedy", "Horror"],
    matchPercent: 93,
    trailerYouTubeId: "Di310WS9zLQ",
    cast: ["Jenna Ortega", "Gwendoline Christie", "Christina Ricci"],
  },
  {
    id: "the-crown",
    title: "The Crown",
    type: "series",
    tmdbId: 65494,
    tmdbType: "tv",
    backdropUrl: G.history,
    posterUrl: G.history,
    synopsis:
      "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    year: 2016,
    maturityRating: "TV-MA",
    genres: ["Drama", "History"],
    matchPercent: 90,
    trailerYouTubeId: "JWtnJjn6ng0",
    cast: ["Claire Foy", "Olivia Colman", "Imelda Staunton"],
  },
  {
    id: "ozark",
    title: "Ozark",
    type: "series",
    tmdbId: 69050,
    tmdbType: "tv",
    backdropUrl: G.crime,
    posterUrl: G.crime,
    synopsis:
      "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
    year: 2017,
    maturityRating: "TV-MA",
    genres: ["Crime", "Drama", "Thriller"],
    matchPercent: 96,
    trailerYouTubeId: "5LOuMNTNpuY",
    cast: ["Jason Bateman", "Laura Linney", "Julia Garner"],
  },

  // ─── MYSTERY & HORROR ───────────────────────────────────────────────────────
  {
    id: "dark",
    title: "Dark",
    type: "series",
    tmdbId: 70523,
    tmdbType: "tv",
    backdropUrl: G.mystery,
    posterUrl: G.mystery,
    synopsis:
      "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families across multiple timelines.",
    year: 2017,
    maturityRating: "TV-MA",
    genres: ["Mystery", "Sci-Fi", "Thriller"],
    matchPercent: 97,
    trailerYouTubeId: "rrwycJ08PSA",
    cast: ["Louis Hofmann", "Oliver Masucci", "Karoline Eichhorn"],
  },
  {
    id: "yellowjackets",
    title: "Yellowjackets",
    type: "series",
    tmdbId: 113988,
    tmdbType: "tv",
    backdropUrl: G.horror,
    posterUrl: G.horror,
    synopsis:
      "A team of wildly talented high school soccer players survive a plane crash in the Ontario wilderness. What begins as survival slowly descends into something far darker.",
    year: 2021,
    maturityRating: "TV-MA",
    genres: ["Mystery", "Horror", "Drama"],
    matchPercent: 95,
    trailerYouTubeId: "P2ZkHFNkiAk",
    cast: ["Melanie Lynskey", "Tawny Cypress", "Christina Ricci", "Juliette Lewis"],
  },
  {
    id: "midsommar",
    title: "Midsommar",
    type: "movie",
    tmdbId: 530385,
    tmdbType: "movie",
    backdropUrl: G.horror,
    posterUrl: G.horror,
    synopsis:
      "A couple travels to Sweden for a midsummer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent pagan ritual.",
    year: 2019,
    maturityRating: "R",
    genres: ["Horror", "Mystery", "Drama"],
    matchPercent: 88,
    trailerYouTubeId: "1Vnghdsjmd0",
    duration: "2h 28m",
    cast: ["Florence Pugh", "Jack Reynor", "William Jackson Harper"],
  },
  {
    id: "us",
    title: "Us",
    type: "movie",
    tmdbId: 458156,
    tmdbType: "movie",
    backdropUrl: G.horror,
    posterUrl: G.horror,
    synopsis:
      "A family's serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them.",
    year: 2019,
    maturityRating: "R",
    genres: ["Horror", "Thriller"],
    matchPercent: 89,
    trailerYouTubeId: "hNCmb-4oXJA",
    duration: "1h 56m",
    cast: ["Lupita Nyong'o", "Winston Duke", "Elisabeth Moss"],
  },
  {
    id: "true-detective",
    title: "True Detective: Night Country",
    type: "series",
    tmdbId: 46648,
    tmdbType: "tv",
    backdropUrl: G.mystery,
    posterUrl: G.mystery,
    synopsis:
      "When eight scientists vanish without a trace, detectives Liz Danvers and Evangeline Navarro must confront the darkness lurking at the end of the world.",
    year: 2024,
    maturityRating: "TV-MA",
    genres: ["Crime", "Mystery", "Drama"],
    matchPercent: 93,
    trailerYouTubeId: "4Mx2MEWoHM4",
    cast: ["Jodie Foster", "Kali Reis", "John Hawkes"],
  },

  // ─── AWARD-WINNING DRAMAS ───────────────────────────────────────────────────
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    type: "series",
    tmdbId: 1396,
    tmdbType: "tv",
    backdropUrl: G.crime,
    posterUrl: G.crime,
    synopsis:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine to secure his family's financial future.",
    year: 2008,
    maturityRating: "TV-MA",
    genres: ["Crime", "Drama", "Thriller"],
    matchPercent: 99,
    trailerYouTubeId: "HhesaQXLuRY",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
  },
  {
    id: "chernobyl",
    title: "Chernobyl",
    type: "series",
    tmdbId: 87108,
    tmdbType: "tv",
    backdropUrl: G.history,
    posterUrl: G.history,
    synopsis:
      "In April 1986, an explosion at the Chernobyl nuclear power plant becomes one of the world's worst man-made catastrophes. The true story, dramatised.",
    year: 2019,
    maturityRating: "TV-MA",
    genres: ["Drama", "History", "Thriller"],
    matchPercent: 98,
    trailerYouTubeId: "s9APLXM9Ei8",
    cast: ["Jared Harris", "Stellan Skarsgård", "Emily Watson"],
  },
  {
    id: "shogun",
    title: "Shōgun",
    type: "series",
    tmdbId: 126308,
    tmdbType: "tv",
    backdropUrl: G.history,
    posterUrl: G.history,
    synopsis:
      "In feudal Japan, a shipwrecked English navigator finds himself under the control of a mysterious Japanese lord and embroiled in a dangerous power struggle.",
    year: 2024,
    maturityRating: "TV-MA",
    genres: ["History", "Drama", "Action"],
    matchPercent: 97,
    trailerYouTubeId: "1tVnLIZCVf0",
    cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"],
  },

  // ─── NEW RELEASES ───────────────────────────────────────────────────────────
  {
    id: "the-bear",
    title: "The Bear",
    type: "series",
    tmdbId: 136315,
    tmdbType: "tv",
    backdropUrl: G.drama,
    posterUrl: G.drama,
    synopsis:
      "A young chef from the fine dining world returns to Chicago to run his family's chaotic sandwich shop.",
    year: 2022,
    maturityRating: "TV-MA",
    genres: ["Drama", "Comedy"],
    matchPercent: 97,
    trailerYouTubeId: "Ni9Y_STjMZo",
    cast: ["Jeremy Allen White", "Ebon Moss-Bachrach", "Ayo Edebiri"],
  },
  {
    id: "silo",
    title: "Silo",
    type: "series",
    tmdbId: 125988,
    tmdbType: "tv",
    backdropUrl: G.scifi,
    posterUrl: G.scifi,
    synopsis:
      "In a ruined and toxic future, thousands of people live in a giant silo underground. Engineer Juliette starts to uncover shocking secrets about the world outside.",
    year: 2023,
    maturityRating: "TV-MA",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    matchPercent: 94,
    trailerYouTubeId: "8ZuTJhGVVc0",
    cast: ["Rebecca Ferguson", "Common", "Harriet Walter"],
  },
  {
    id: "fallout",
    title: "Fallout",
    type: "series",
    tmdbId: 106379,
    tmdbType: "tv",
    backdropUrl: G.scifi,
    posterUrl: G.scifi,
    synopsis:
      "Two centuries after nuclear war, a young woman leaves Vault 33 on a dangerous mission through the post-apocalyptic wasteland.",
    year: 2024,
    maturityRating: "TV-MA",
    genres: ["Sci-Fi", "Action", "Comedy"],
    matchPercent: 96,
    trailerYouTubeId: "xYVXSFPNHos",
    cast: ["Ella Purnell", "Aaron Moten", "Walton Goggins"],
  },
  {
    id: "severance",
    title: "Severance",
    type: "series",
    tmdbId: 95396,
    tmdbType: "tv",
    backdropUrl: G.scifi,
    posterUrl: G.scifi,
    synopsis:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    year: 2022,
    maturityRating: "TV-MA",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    matchPercent: 95,
    trailerYouTubeId: "xEQP4VVuyrY",
    cast: ["Adam Scott", "Patricia Arquette", "John Turturro", "Britt Lower"],
  },
  {
    id: "andor",
    title: "Andor",
    type: "series",
    tmdbId: 83867,
    tmdbType: "tv",
    backdropUrl: G.scifi,
    posterUrl: G.scifi,
    synopsis:
      "A prequel series following rebel spy Cassian Andor during the formative years of the Rebellion against the Empire.",
    year: 2022,
    maturityRating: "TV-14",
    genres: ["Sci-Fi", "Action", "Drama"],
    matchPercent: 92,
    trailerYouTubeId: "cKOegEuCcfw",
    cast: ["Diego Luna", "Stellan Skarsgård", "Genevieve O'Reilly"],
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    type: "movie",
    tmdbId: 872585,
    tmdbType: "movie",
    backdropUrl: G.history,
    posterUrl: G.history,
    synopsis:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    year: 2023,
    maturityRating: "R",
    genres: ["History", "Drama", "Thriller"],
    matchPercent: 97,
    trailerYouTubeId: "uYPbbksJxIg",
    duration: "3h",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
  },
  {
    id: "dune-two",
    title: "Dune: Part Two",
    type: "movie",
    tmdbId: 693134,
    tmdbType: "movie",
    backdropUrl: G.scifi,
    posterUrl: G.scifi,
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    year: 2024,
    maturityRating: "PG-13",
    genres: ["Sci-Fi", "Action", "Drama"],
    matchPercent: 95,
    trailerYouTubeId: "Way9Dexny3w",
    duration: "2h 46m",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
  },
];


export const featuredContent = content.filter((c) => c.featured);
export const allContent = content;
export const getById = (id: string) => content.find((c) => c.id === id);

export const rows = [
  {
    id: "trending",
    label: "Trending Now",
    items: ["squid-game","silo","fallout","shogun","severance","the-bear","true-detective","andor"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
  {
    id: "hbo-originals",
    label: "HBO Originals",
    items: ["succession","the-wire","the-last-of-us","house-of-dragon","euphoria","true-detective","white-lotus","chernobyl"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
  {
    id: "netflix-originals",
    label: "Netflix Originals",
    items: ["stranger-things","squid-game","wednesday","the-crown","ozark","dark","the-bear","severance"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
  {
    id: "mystery-horror",
    label: "Mystery & Horror",
    items: ["from-mgm","yellowjackets","dark","wednesday","midsommar","us","true-detective","stranger-things"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
  {
    id: "continue-watching",
    label: "Continue Watching",
    items: ["from-mgm","severance","the-last-of-us","fallout","succession","breaking-bad"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
  {
    id: "new-releases",
    label: "New Releases",
    items: ["fallout","shogun","silo","dune-two","true-detective","the-bear","oppenheimer"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
  {
    id: "award-dramas",
    label: "Award-Winning Dramas",
    items: ["succession","chernobyl","breaking-bad","ozark","the-crown","severance","shogun","oppenheimer"].map(id => content.find(c => c.id === id)!).filter(Boolean),
  },
];

export const allGenres = [
  "All","Drama","Mystery","Horror","Sci-Fi","Action","Comedy","Crime","Thriller","History","Fantasy","Teen",
];

export default content;
