// src/data/groups.ts

export type Vansh = "Agnivanshi" | "Chandravanshi" | "Suryavanshi";

export interface Clan {
  id: string;
  name: string;
  altName: string;
  vansh: Vansh;
  origin: string;
  kuldevi: string;
  description: string;
  subclans: string[];      // notable branches within this clan
  accent: string;          // unique color per clan card
}

export interface Group {
  id: string;
  name: string;
  nameHindi: string;
  tagline: string;
  description: string;
  clans: Clan[];
}

// ─── Vansh badge colors ───────────────────────────────────────────────────────

export const VANSH_COLOR: Record<Vansh, { bg: string; text: string; border: string }> = {
  Agnivanshi: { bg: "rgba(200,80,50,0.1)", text: "#9b3a20", border: "rgba(200,80,50,0.3)" },
  Chandravanshi: { bg: "rgba(60,100,160,0.1)", text: "#1e4a80", border: "rgba(60,100,160,0.3)" },
  Suryavanshi: { bg: "rgba(190,140,30,0.1)", text: "#7a5a00", border: "rgba(190,140,30,0.3)" },
};

// ─── Groups ───────────────────────────────────────────────────────────────────

export const GROUPS: Group[] = [
  {
    id: "rajputana",
    name: "Rajputana",
    nameHindi: "राजपूताना",
    tagline: "36 Royal Clans of the Warrior Dynasty",
    description:
      "The Rajputs (राजपूत) are the Kshatriya warrior clans of North and Central India, tracing their lineage through three sacred Vanshas — Suryavanshi (Solar), Chandravanshi (Lunar), and Agnivanshi (Fire). Select your clan below.",
    clans: [
      {
        id: "jadon",
        name: "Jadon",
        altName: "Jadaun · जादों",
        vansh: "Chandravanshi",
        origin: "Karauli, Rajasthan",
        kuldevi: "Kaila Devi",
        description:
          "Descendants of Yadu — the lineage of Lord Krishna. Among the 36 royal clans, they ruled the fort-cities of Bayana and Karauli.",
        subclans: ["Jadeja", "Bhatti"],
        accent: "#1e4a7a",
      },
      {
        id: "chouhan",
        name: "Chouhan",
        altName: "Chahamana · चौहान",
        vansh: "Agnivanshi",
        origin: "Sambhar & Ajmer, Rajasthan",
        kuldevi: "Ashapura Mata",
        description:
          "Founded by Manik Rao Chauhan in 685 AD. Rulers of Ajmer and Delhi, their greatest king Prithviraj Chauhan was the last Hindu Emperor of Delhi.",
        subclans: ["Hada", "Songara", "Bhadauriya", "Khichi", "Nirban", "Dhanetiya", "Devda"],
        accent: "#8c3a1a",
      },

      {
        id: "bhadauriya",
        name: "Bhadauriya",
        altName: "Bhadoria · भदौरिया",
        vansh: "Agnivanshi",
        origin: "Bhind, Madhya Pradesh",
        kuldevi: "Vindhyavasini Mata",
        description:
          "A proud branch of the Chauhan lineage, descendants of Manik Rao Chauhan, dominant in the Chambal belt of Madhya Pradesh.",
        subclans: [],
        accent: "#5a3e2b",
      },
      {
        id: "rathore",
        name: "Rathore",
        altName: "Rashtrakuta · राठौड़",
        vansh: "Suryavanshi",
        origin: "Jodhpur, Rajasthan",
        kuldevi: "Nagnechi Mata",
        description:
          "The most numerous Rajput clan. Rulers of Marwar (Jodhpur), they trace descent from Ram through Ikshvaku. Maharaja Jaswant Singh was their great ruler.",
        subclans: ["Champawat", "Pokarna", "Kumpawat", "Jodha"],
        accent: "#a0522d",
      },
      {
        id: "sisodia",
        name: "Sisodia",
        altName: "Guhilot · सिसोदिया",
        vansh: "Suryavanshi",
        origin: "Mewar (Udaipur), Rajasthan",
        kuldevi: "Baan Mata",
        description:
          "Rulers of Mewar and the most celebrated Rajput clan. Maharana Pratap's clan, who never bowed to the Mughal empire. The royal house of Udaipur continues today.",
        subclans: ["Ahari", "Sarwariya", "Shaktawat"],
        accent: "#6b3d1e",
      },
      {
        id: "kachwaha",
        name: "Kachwaha",
        altName: "Kachchwāha · कछवाहा",
        vansh: "Suryavanshi",
        origin: "Amber (Jaipur), Rajasthan",
        kuldevi: "Shila Mata",
        description:
          "Rulers of Amber and later Jaipur. They claim descent from Kusha, son of Lord Rama. The Maharaja of Jaipur leads this clan with ~71 sub-clans.",
        subclans: ["Shekhawat", "Rajawat", "Naruka", "Nathawat"],
        accent: "#2e5e3e",
      },
      {
        id: "parmar",
        name: "Parmar",
        altName: "Paramara · परमार",
        vansh: "Agnivanshi",
        origin: "Malwa, Madhya Pradesh",
        kuldevi: "Hinglaj Mata",
        description:
          "The fire-born clan who ruled Malwa. King Bhoja of Parmar dynasty was one of India's greatest scholar-kings and patron of arts and architecture.",
        subclans: ["Sodhaa", "Umat", "Sumra"],
        accent: "#4a3070",
      },
      {
        id: "tomar",
        name: "Tomar",
        altName: "Tanwar · तोमर",
        vansh: "Chandravanshi",
        origin: "Delhi & Gwalior",
        kuldevi: "Yogmaya Devi",
        description:
          "Founders of Delhi. The Tomars ruled Gwalior Fort until 1516 and are credited with building Delhi's first formal city Dhillika (modern Delhi).",
        subclans: ["Janwar", "Pundir"],
        accent: "#3a2a5e",
      },
      {
        id: "solanki",
        name: "Solanki",
        altName: "Chaulukya · सोलंकी",
        vansh: "Agnivanshi",
        origin: "Anhilwara (Gujarat)",
        kuldevi: "Khodiyar Mata",
        description:
          "Rulers of Gujarat for 300 years. Built the Somnath Temple. King Kumarapala was their greatest ruler under whom Gujarat flourished.",
        subclans: ["Bargujar", "Chudasama"],
        accent: "#b06020",
      },
      {
        id: "bhatti",
        name: "Bhatti",
        altName: "Bhati · भाटी",
        vansh: "Chandravanshi",
        origin: "Jaisalmer, Rajasthan",
        kuldevi: "Swangiya Mata",
        description:
          "Rulers of Jaisalmer. One of the oldest Rajput clans, they built the golden Jaisalmer Fort and ruled the Thar Desert for centuries.",
        subclans: [],
        accent: "#7a6020",
      },
    ],
  },
];