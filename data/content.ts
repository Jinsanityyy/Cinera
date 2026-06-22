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
  backdropUrl: string;
  posterUrl: string;
  logoUrl?: string;
  synopsis: string;
  year: number;
  maturityRating: string;
  genres: string[];
  matchPercent: number;
  trailerYouTubeId: string;
  duration?: string;
  seasons?: Season[];
  featured?: boolean;
  tagline?: string;
  cast?: string[];
  creator?: string;
};

const content: ContentItem[] = [
  // ─── FEATURED / HERO ───────────────────────────────────────
  {
    id: "from-mgm",
    title: "FROM",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    synopsis:
      "Unravel the terrifying mystery of a nightmarish town that traps all those who enter. As the unwilling residents fight to keep a sense of normalcy and search for a way out, they must also survive the threats of the surrounding forest — including the creatures that come out when the sun goes down.",
    tagline: "There's no way out.",
    year: 2022,
    maturityRating: "TV-MA",
    genres: ["Mystery", "Horror", "Sci-Fi", "Drama"],
    matchPercent: 98,
    trailerYouTubeId: "e-HBbz0mvlo",
    creator: "John Griffin",
    cast: ["Harold Perrineau", "Catalina Sandino Moreno", "Eion Bailey", "Hannah Cheramy", "Ricky He"],
    featured: true,
    seasons: [
      {
        id: "from-s1",
        number: 1,
        year: 2022,
        episodes: Array.from({ length: 10 }, (_, i) => ({
          id: `from-s1e${i + 1}`,
          title: ["Pilot", "The Way Things Are Now", "Choosing Day", "Don't Say A Word", "Tether", "Book 27", "Moving Day", "Broken Windows, Open Doors", "Ball and Chain", "Masters of Death"][i],
          episode: i + 1,
          runtime: 52,
          synopsis: "Strange and terrifying events unfold in the mysterious town.",
          thumbnailUrl: `https://picsum.photos/seed/from-s1e${i + 1}/320/180`,
        })),
      },
      {
        id: "from-s2",
        number: 2,
        year: 2023,
        episodes: Array.from({ length: 10 }, (_, i) => ({
          id: `from-s2e${i + 1}`,
          title: ["Strangers in a Strange Land", "Revelations", "The Way Back", "Into the Woods", "Pas De Deux", "The Door", "Silhouettes", "Forest for the Trees", "You Are Not Alone", "Once Upon a Time"][i],
          episode: i + 1,
          runtime: 54,
          synopsis: "The town's dark secrets begin to unravel as survivors search for answers.",
          thumbnailUrl: `https://picsum.photos/seed/from-s2e${i + 1}/320/180`,
        })),
      },
      {
        id: "from-s3",
        number: 3,
        year: 2024,
        episodes: Array.from({ length: 10 }, (_, i) => ({
          id: `from-s3e${i + 1}`,
          title: [`Episode ${i + 1}`, "The Truth Revealed", "Beyond the Forest", "Origins", "The Ritual", "Convergence", "The Reckoning", "Nightfall", "The Way Out", "Finale"][i],
          episode: i + 1,
          runtime: 56,
          synopsis: "The final mysteries of the town come to a head in a shocking conclusion.",
          thumbnailUrl: `https://picsum.photos/seed/from-s3e${i + 1}/320/180`,
        })),
      },
    ],
  },

  // ─── HBO ORIGINALS ─────────────────────────────────────────
  {
    id: "succession",
    title: "Succession",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
    synopsis:
      "The Roy family is known for controlling the biggest media and entertainment company in the world. But the patriarch's health is starting to fail, and, with future control of the empire at stake, each member of the family begins to make their move.",
    year: 2018,
    maturityRating: "TV-MA",
    genres: ["Drama", "Comedy"],
    matchPercent: 97,
    trailerYouTubeId: "OhKAn4I3Q-M",
    creator: "Jesse Armstrong",
    cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook", "Kieran Culkin", "Matthew Macfadyen"],
    seasons: [
      {
        id: "succ-s1",
        number: 1,
        year: 2018,
        episodes: Array.from({ length: 10 }, (_, i) => ({
          id: `succ-s1e${i + 1}`,
          title: `Episode ${i + 1}`,
          episode: i + 1,
          runtime: 58,
          synopsis: "The Roy family fights for control of their media empire.",
          thumbnailUrl: `https://picsum.photos/seed/succ-s1e${i + 1}/320/180`,
        })),
      },
    ],
  },
  {
    id: "the-wire",
    title: "The Wire",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
    synopsis:
      "This Emmy-winning series looks at the Baltimore drug scene from the point of view of law enforcement as well as the drug dealers and users. Each season explores another facet of Baltimore, including its seaport, school system and newspaper.",
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
    backdropUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80",
    synopsis:
      "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.",
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
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    synopsis:
      "The story of House Targaryen set 200 years before the events of Game of Thrones. The prequel series explores the civil war that nearly tore the Targaryens apart, a conflict that became known as the Dance of the Dragons.",
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
    backdropUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80",
    synopsis:
      "A group of high school students navigate love and friendships in a world of drugs, sex, trauma, and social media.",
    year: 2019,
    maturityRating: "TV-MA",
    genres: ["Drama", "Teen"],
    matchPercent: 91,
    trailerYouTubeId: "wHHSMiMkF5k",
    cast: ["Zendaya", "Hunter Schafer", "Jacob Elordi"],
  },

  // ─── NETFLIX ORIGINALS ─────────────────────────────────────
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
    synopsis:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
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
    backdropUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&q=80",
    synopsis:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
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
    backdropUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&q=80",
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
    backdropUrl: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=400&q=80",
    synopsis:
      "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    year: 2016,
    maturityRating: "TV-MA",
    genres: ["Drama", "History"],
    matchPercent: 90,
    trailerYouTubeId: "JWtnJjn6ng0",
    cast: ["Claire Foy", "Olivia Colman", "Imelda Staunton"],
  },

  // ─── MYSTERY & HORROR ──────────────────────────────────────
  {
    id: "dark",
    title: "Dark",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    synopsis:
      "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
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
    backdropUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
    synopsis:
      "A team of wildly talented high school girls soccer players who become the survivors of a plane crash deep in the Ontario wilderness. What began as a struggle to survive slowly descends into something much darker.",
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
    backdropUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    synopsis:
      "A couple travels to Northern Europe to visit a pastoral community's fabled Swedish midsummer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult.",
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
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
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

  // ─── AWARD-WINNING DRAMAS ──────────────────────────────────
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80",
    synopsis:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's financial future.",
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
    backdropUrl: "https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&q=80",
    synopsis:
      "In April 1986, an explosion at the Chernobyl nuclear power plant in the USSR becomes one of the world's worst man-made catastrophes. The limited series dramatizes the true story of the nuclear disaster.",
    year: 2019,
    maturityRating: "TV-MA",
    genres: ["Drama", "History", "Thriller"],
    matchPercent: 98,
    trailerYouTubeId: "s9APLXM9Ei8",
    cast: ["Jared Harris", "Stellan Skarsgård", "Emily Watson"],
  },
  {
    id: "ozark",
    title: "Ozark",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80",
    synopsis:
      "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
    year: 2017,
    maturityRating: "TV-MA",
    genres: ["Crime", "Drama", "Thriller"],
    matchPercent: 96,
    trailerYouTubeId: "5LOuMNTNpuY",
    cast: ["Jason Bateman", "Laura Linney", "Julia Garner"],
  },

  // ─── NEW RELEASES ──────────────────────────────────────────
  {
    id: "the-bear",
    title: "The Bear",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    synopsis:
      "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
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
    backdropUrl: "https://images.unsplash.com/photo-1586374579358-9d19d632b6df?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1586374579358-9d19d632b6df?w=400&q=80",
    synopsis:
      "In a ruined and toxic future, thousands of people live in a giant silo underground. After its sheriff breaks a cardinal rule and residents die, engineer Juliette starts to uncover shocking secrets.",
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
    backdropUrl: "https://images.unsplash.com/photo-1493528347786-83f6d5877d4c?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1493528347786-83f6d5877d4c?w=400&q=80",
    synopsis:
      "Two centuries after an atomic bomb sends humanity underground, a young woman named Lucy MacLean leaves Vault 33 on a dangerous mission in the post-apocalyptic wasteland above.",
    year: 2024,
    maturityRating: "TV-MA",
    genres: ["Sci-Fi", "Action", "Comedy"],
    matchPercent: 96,
    trailerYouTubeId: "xYVXSFPNHos",
    cast: ["Ella Purnell", "Aaron Moten", "Walton Goggins"],
  },
  {
    id: "shōgun",
    title: "Shōgun",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80",
    synopsis:
      "In feudal Japan, a shipwrecked English navigator finds himself under the control of a mysterious Japanese lord and embroiled in a dangerous power struggle.",
    year: 2024,
    maturityRating: "TV-MA",
    genres: ["History", "Drama", "Action"],
    matchPercent: 97,
    trailerYouTubeId: "1tVnLIZCVf0",
    cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"],
  },

  // ─── TRENDING ──────────────────────────────────────────────
  {
    id: "true-detective",
    title: "True Detective: Night Country",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
    synopsis:
      "When eight scientists working at the Tsalal Arctic Research Station vanish without a trace, detectives Liz Danvers and Evangeline Navarro must confront the darkness lurking at the end of the world.",
    year: 2024,
    maturityRating: "TV-MA",
    genres: ["Crime", "Mystery", "Drama"],
    matchPercent: 93,
    trailerYouTubeId: "4Mx2MEWoHM4",
    cast: ["Jodie Foster", "Kali Reis", "John Hawkes"],
  },
  {
    id: "severance",
    title: "Severance",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    synopsis:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, the line between both worlds gets blurred.",
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
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    synopsis:
      "A prequel series following the life of rebel spy Cassian Andor during the formative years of the Rebellion.",
    year: 2022,
    maturityRating: "TV-14",
    genres: ["Sci-Fi", "Action", "Drama"],
    matchPercent: 92,
    trailerYouTubeId: "cKOegEuCcfw",
    cast: ["Diego Luna", "Stellan Skarsgård", "Genevieve O'Reilly"],
  },
  {
    id: "the-white-lotus",
    title: "The White Lotus",
    type: "series",
    backdropUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80",
    synopsis:
      "A social satire set at a tropical resort, where the hotel staff and guests interact over the course of a week.",
    year: 2021,
    maturityRating: "TV-MA",
    genres: ["Comedy", "Drama", "Mystery"],
    matchPercent: 91,
    trailerYouTubeId: "OAfEJqZFcN0",
    cast: ["Murray Bartlett", "Connie Britton", "Jennifer Coolidge"],
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    type: "movie",
    backdropUrl: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400&q=80",
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
    id: "dune",
    title: "Dune: Part Two",
    type: "movie",
    backdropUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80",
    posterUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80",
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

export const getByGenre = (genre: string) =>
  content.filter((c) => c.genres.includes(genre));

export const rows = [
  {
    id: "trending",
    label: "Trending Now",
    items: ["squid-game", "silo", "fallout", "shōgun", "severance", "the-bear", "true-detective", "andor"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
  {
    id: "hbo-originals",
    label: "HBO Originals",
    items: ["succession", "the-wire", "the-last-of-us", "house-of-dragon", "euphoria", "true-detective", "the-white-lotus", "chernobyl"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
  {
    id: "netflix-originals",
    label: "Netflix Originals",
    items: ["stranger-things", "squid-game", "wednesday", "the-crown", "ozark", "dark", "the-bear", "severance"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
  {
    id: "mystery-horror",
    label: "Mystery & Horror",
    items: ["from-mgm", "yellowjackets", "dark", "wednesday", "midsommar", "us", "true-detective", "stranger-things"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
  {
    id: "continue-watching",
    label: "Continue Watching",
    items: ["from-mgm", "severance", "the-last-of-us", "fallout", "succession", "breaking-bad"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
  {
    id: "new-releases",
    label: "New Releases",
    items: ["fallout", "shōgun", "silo", "dune", "true-detective", "the-bear", "oppenheimer"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
  {
    id: "award-dramas",
    label: "Award-Winning Dramas",
    items: ["succession", "chernobyl", "breaking-bad", "ozark", "the-crown", "severance", "shōgun", "oppenheimer"].map((id) => content.find((c) => c.id === id)!).filter(Boolean),
  },
];

export const allGenres = [
  "All",
  "Drama",
  "Mystery",
  "Horror",
  "Sci-Fi",
  "Action",
  "Comedy",
  "Crime",
  "Thriller",
  "History",
  "Fantasy",
  "Teen",
];

export default content;
