export interface ReelEpisode {
  number: number;
  title: string;
  youtubeId: string;
  duration: string;
  synopsis?: string;
}

export interface ReelSeries {
  id: string;
  title: string;
  synopsis: string;
  posterGradient: string;
  accentColor: string;
  genre: string;
  episodes: ReelEpisode[];
}

export const reelSeries: ReelSeries[] = [
  {
    id: "lycan-queen",
    title: "The Rise of the Lycan Queen",
    synopsis:
      "A cursed omega wolf discovers her true heritage as the prophesied Lycan Queen and must claim her throne before a rival alpha destroys everything she loves.",
    posterGradient: "from-purple-950 via-violet-900 to-slate-950",
    accentColor: "#a78bfa",
    genre: "Fantasy Romance",
    episodes: [
      {
        number: 1,
        title: "The Mark Awakens",
        youtubeId: "dQw4w9WgXcQ",
        duration: "8:42",
        synopsis:
          "Lyra discovers the silver mark on her wrist and is summoned to the Black Moon Pack by its alpha.",
      },
      {
        number: 2,
        title: "Alpha's Command",
        youtubeId: "dQw4w9WgXcQ",
        duration: "9:15",
        synopsis:
          "The Alpha of the Black Moon Pack refuses to believe Lyra is the prophesied queen — until the moon herself intervenes.",
      },
      {
        number: 3,
        title: "Blood of the Ancient",
        youtubeId: "dQw4w9WgXcQ",
        duration: "10:02",
        synopsis: "Lyra's powers begin to manifest during the full moon ritual, terrifying both friend and foe.",
      },
      {
        number: 4,
        title: "The Rival's Gambit",
        youtubeId: "dQw4w9WgXcQ",
        duration: "9:48",
        synopsis: "A rival alpha pack arrives with a marriage proposal — and a hidden ultimatum.",
      },
      {
        number: 5,
        title: "Forbidden Bond",
        youtubeId: "dQw4w9WgXcQ",
        duration: "11:03",
        synopsis: "Lyra and the Black Moon Alpha share a secret moment that changes everything between them.",
      },
    ],
  },
  {
    id: "billionaire-husband",
    title: "My Billionaire Husband",
    synopsis:
      "A contract marriage between a broke florist and a cold-hearted CEO spirals into something neither of them planned — love.",
    posterGradient: "from-yellow-950 via-amber-900 to-zinc-950",
    accentColor: "#f59e0b",
    genre: "Romance Drama",
    episodes: [
      {
        number: 1,
        title: "Sign on the Dotted Line",
        youtubeId: "dQw4w9WgXcQ",
        duration: "7:55",
        synopsis:
          "Mia needs money to save her family's flower shop; Damien needs a wife for six months to secure his inheritance.",
      },
      {
        number: 2,
        title: "The Penthouse Rules",
        youtubeId: "dQw4w9WgXcQ",
        duration: "8:30",
        synopsis:
          "Moving into Damien's penthouse, Mia discovers he has seventeen house rules — and she breaks four by lunch.",
      },
      {
        number: 3,
        title: "Office Games",
        youtubeId: "dQw4w9WgXcQ",
        duration: "9:12",
        synopsis: "Mia accompanies Damien to his boardroom and accidentally saves a multimillion-dollar deal.",
      },
      {
        number: 4,
        title: "The Ex Returns",
        youtubeId: "dQw4w9WgXcQ",
        duration: "8:47",
        synopsis: "Damien's ex-girlfriend reappears at the charity gala, determined to expose their arrangement.",
      },
    ],
  },
  {
    id: "betrayed-luna",
    title: "Revenge of the Betrayed Luna",
    synopsis:
      "Rejected and left for dead by her mate on their wedding night, Luna Sera rises from the ashes with newfound power — and a list.",
    posterGradient: "from-red-950 via-rose-900 to-slate-950",
    accentColor: "#e31c25",
    genre: "Werewolf Romance",
    episodes: [
      {
        number: 1,
        title: "The Rejection",
        youtubeId: "dQw4w9WgXcQ",
        duration: "9:05",
        synopsis:
          "On the night Sera is meant to become Luna, her mate publicly rejects her for another woman and banishes her from the pack.",
      },
      {
        number: 2,
        title: "Ashes to Power",
        youtubeId: "dQw4w9WgXcQ",
        duration: "8:22",
        synopsis:
          "Discovered half-dead by a rogue wolf, Sera awakens three months later with abilities no luna has ever possessed.",
      },
      {
        number: 3,
        title: "A Different Alpha",
        youtubeId: "dQw4w9WgXcQ",
        duration: "10:14",
        synopsis:
          "The mysterious Alpha Caine offers Sera sanctuary and an alliance — but his motives are unclear.",
      },
      {
        number: 4,
        title: "The Reckoning Begins",
        youtubeId: "dQw4w9WgXcQ",
        duration: "9:58",
        synopsis: "Sera returns to her former pack — not as prey, but as a predator with a plan.",
      },
    ],
  },
];
