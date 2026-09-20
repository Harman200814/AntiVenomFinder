// icons.js — shared SVG illustration library.
//
// Why illustrations instead of real photographs: this app has no server-side
// image storage or licensed photo source, and reusing scraped internet photos
// of snakes without clear licensing/attribution isn't something this project
// can safely redistribute. These are original stylized illustrations designed
// to highlight each species' most recognizable features (color, banding,
// hood shape) so they're still useful for visual confirmation. If you have
// rights to real reference photographs, see the README for how to drop them
// in — SNAKE_OPTIONS already has a `photo` field ready to use.

const ICONS = {
  Cobra: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="78" rx="34" ry="10" fill="#3d5a3d" opacity="0.25"/>
      <path d="M20 85 Q20 55 45 55 Q70 55 70 75" stroke="#2f5233" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M45 20 C25 20 20 35 30 45 C36 51 50 52 56 46 C64 38 58 20 45 20 Z" fill="#3a6b3f"/>
      <path d="M45 22 C30 22 26 34 34 42 C39 47 50 47 55 42 C61 36 56 22 45 22 Z" fill="#4d8a52"/>
      <circle cx="40" cy="34" r="9" fill="#f2e2b6" opacity="0.85"/>
      <circle cx="40" cy="34" r="4" fill="#2f5233"/>
      <ellipse cx="52" cy="44" rx="6" ry="9" fill="#1f1f1f"/>
      <circle cx="50" cy="41" r="2" fill="white"/>
      <path d="M58 46 l7 3 l-7 2 l3 4" stroke="#c0392b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`,

  KingCobra: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="80" rx="36" ry="9" fill="#403520" opacity="0.2"/>
      <path d="M18 86 Q18 50 46 50 Q74 50 74 72" stroke="#5a6b3a" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M22 60 l4 8 M30 58 l4 8 M38 57 l4 8 M46 57 l4 8" stroke="#3d4a26" stroke-width="2" stroke-linecap="round"/>
      <path d="M46 16 C24 16 18 33 29 44 C36 51 52 52 58 45 C67 36 60 16 46 16 Z" fill="#5a6b3a"/>
      <path d="M46 18 C29 18 25 32 33 41 C39 47 51 47 57 41 C63 34 58 18 46 18 Z" fill="#6f8248"/>
      <ellipse cx="53" cy="42" rx="6.5" ry="9.5" fill="#1a1a1a"/>
      <circle cx="51" cy="39" r="2" fill="white"/>
      <path d="M59 44 l8 3 l-8 3" stroke="#c0392b" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <text x="60" y="96" font-size="7" text-anchor="middle" fill="#8a6300">special antivenom needed</text>
    </svg>`,

  Krait: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="82" rx="36" ry="9" fill="#333" opacity="0.15"/>
      <path d="M15 60 Q15 30 45 30 Q75 30 75 55 Q75 78 50 78 Q30 78 30 62" stroke="#161616" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M15 60 Q15 30 45 30 Q75 30 75 55 Q75 78 50 78 Q30 78 30 62" stroke="#f4f1e6" stroke-width="13" fill="none" stroke-linecap="round" stroke-dasharray="4 10"/>
      <ellipse cx="18" cy="58" rx="8" ry="6" fill="#161616"/>
      <circle cx="15" cy="56" r="1.6" fill="white"/>
      <path d="M10 55 l-6 -2 M10 60 l-6 3" stroke="#c0392b" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    </svg>`,

  BandedKrait: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="82" rx="36" ry="9" fill="#8a6300" opacity="0.15"/>
      <path d="M15 62 Q15 32 45 32 Q75 32 75 56 Q75 78 50 78" stroke="#161616" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M15 62 Q15 32 45 32 Q75 32 75 56 Q75 78 50 78" stroke="#f0c419" stroke-width="15" fill="none" stroke-linecap="round" stroke-dasharray="9 9"/>
      <ellipse cx="18" cy="60" rx="9" ry="7" fill="#161616"/>
      <circle cx="15" cy="58" r="1.8" fill="white"/>
      <path d="M9 57 l-6 -2 M9 62 l-6 3" stroke="#c0392b" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    </svg>`,

  Viper: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="82" rx="36" ry="9" fill="#5a4222" opacity="0.2"/>
      <path d="M18 65 Q18 35 48 35 Q78 35 78 58 Q78 78 55 78" stroke="#8a5a2b" stroke-width="16" fill="none" stroke-linecap="round"/>
      <ellipse cx="35" cy="50" rx="7" ry="5" fill="#4a2e12" opacity="0.8"/>
      <ellipse cx="50" cy="42" rx="7" ry="5" fill="#4a2e12" opacity="0.8"/>
      <ellipse cx="65" cy="48" rx="7" ry="5" fill="#4a2e12" opacity="0.8"/>
      <ellipse cx="70" cy="65" rx="7" ry="5" fill="#4a2e12" opacity="0.8"/>
      <path d="M18 65 C10 65 8 55 15 50 C22 46 34 48 34 58 C34 66 24 68 18 65 Z" fill="#a06a34"/>
      <circle cx="17" cy="56" r="2" fill="#1a1a1a"/>
      <path d="M8 62 l-6 -1 M8 66 l-6 2" stroke="#c0392b" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    </svg>`,

  SawScaledViper: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="82" rx="32" ry="8" fill="#c9a45c" opacity="0.2"/>
      <path d="M22 68 Q22 42 50 42 Q76 42 72 62" stroke="#d9b878" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M25 62 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8" stroke="#7a5a28" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 68 C14 68 12 58 19 53 C25 49 36 51 36 60 C36 67 27 70 22 68 Z" fill="#e0c286"/>
      <circle cx="20" cy="59" r="1.8" fill="#1a1a1a"/>
      <path d="M12 65 l-6 -1 M12 68 l-6 2" stroke="#c0392b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>`,

  BambooPitViper: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="82" rx="34" ry="8" fill="#2f6b3a" opacity="0.15"/>
      <path d="M18 68 Q18 40 48 40 Q76 40 74 62" stroke="#3f9e4d" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M18 68 Q18 40 48 40 Q76 40 74 62" stroke="#6fc47c" stroke-width="15" fill="none" stroke-linecap="round" stroke-dasharray="1 14" opacity="0.6"/>
      <path d="M18 68 C10 68 8 58 15 53 C22 49 33 51 33 60 C33 67 24 70 18 68 Z" fill="#4bab5a"/>
      <circle cx="16" cy="59" r="2.2" fill="#a01818"/>
      <circle cx="16" cy="59" r="1" fill="#1a1a1a"/>
      <path d="M8 65 l-6 -1 M8 68 l-6 2" stroke="#c0392b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>`,

  HumpNosedPitViper: `
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="82" rx="32" ry="8" fill="#5a4a3a" opacity="0.2"/>
      <path d="M20 68 Q20 44 48 44 Q74 44 70 63" stroke="#9c8a6e" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse cx="34" cy="55" rx="6" ry="4" fill="#6b5a42" opacity="0.8"/>
      <ellipse cx="48" cy="49" rx="6" ry="4" fill="#6b5a42" opacity="0.8"/>
      <ellipse cx="62" cy="53" rx="6" ry="4" fill="#6b5a42" opacity="0.8"/>
      <path d="M20 68 C12 68 10 58 17 53 C22 50 30 50 31 57 C32 65 26 70 20 68 Z" fill="#b3a380"/>
      <path d="M19 53 q3 -5 7 -3" stroke="#6b5a42" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <circle cx="17" cy="58" r="1.8" fill="#1a1a1a"/>
      <path d="M9 64 l-6 -1 M9 67 l-6 2" stroke="#c0392b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>`,

  hospital: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M4 21V9l8-5 8 5v12" stroke-linejoin="round"/>
      <path d="M9 21v-6h6v6" />
      <path d="M12 6v5M9.5 8.5h5" stroke-linecap="round"/>
    </svg>`,

  vial: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M9 2h6M10 2v6l-4.5 8A3 3 0 008 21h8a3 3 0 002.5-5l-4.5-8V2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.5 15h9" stroke-linecap="round"/>
    </svg>`,

  pin: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="10" r="2.5"/>
    </svg>`,

  check: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
      <path d="M4 12l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

  cross: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 2h4v7h7v6h-7v7h-4v-7H3V9h7z"/>
    </svg>`,

  phone: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8 9.7a16 16 0 006.3 6.3l1.2-1.2a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2.1z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

  shield: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
};

// SNAKE_OPTIONS drives the manual-selection cards. These 8 are among India's
// most medically important / most frequently encountered venomous snakes.
// `category` maps to the app's antivenom categories (Cobra / Krait / Viper —
// the standard Indian polyvalent antivenom groups). `note` flags where real
// treatment differs from the simple 3-category model, most importantly King
// Cobra (needs specific monovalent antivenom, not the standard polyvalent).
// Real photographs from Wikimedia Commons (CC / public domain). Loaded from
// Wikimedia CDN so the project redistributes only URLs + attribution, not the
// binary files. Attribution is shown under each card.
const SNAKE_OPTIONS = [
  {
    key: "cobra", species: "Indian Cobra", category: "Cobra", icon: "Cobra",
    photo: "images/snakes/cobra.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Highly venomous — medical emergency",
    note: "Covered by standard polyvalent antivenom (Cobra / ASV).",
  },
  {
    key: "krait", species: "Common Krait", category: "Krait", icon: "Krait",
    photo: "images/snakes/krait.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Highly venomous — medical emergency",
    note: "Bites often painless at first — polyvalent ASV (Krait).",
  },
  {
    key: "russell", species: "Russell's Viper", category: "Viper", icon: "Viper",
    photo: "images/snakes/russell.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Highly venomous — medical emergency",
    note: "Largest share of serious bites — polyvalent ASV (Viper).",
  },
  {
    key: "sawscaled", species: "Saw-scaled Viper", category: "Viper", icon: "SawScaledViper",
    photo: "images/snakes/sawscaled.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Highly venomous — medical emergency",
    note: "One of the Big Four — polyvalent ASV (Viper).",
  },
  {
    key: "kingcobra", species: "King Cobra", category: "KingCobra", icon: "KingCobra",
    photo: "images/snakes/kingcobra.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Highly venomous — needs specialized antivenom",
    note: "Standard polyvalent is less effective — King Cobra monovalent ASV preferred.",
  },
  {
    key: "bandedkrait", species: "Banded Krait", category: "Krait", icon: "BandedKrait",
    photo: "images/snakes/bandedkrait.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Highly venomous — medical emergency",
    note: "Black-and-yellow bands — polyvalent ASV (Krait).",
  },
  {
    key: "bamboopitviper", species: "Bamboo Pit Viper", category: "PitViper", icon: "BambooPitViper",
    photo: "images/snakes/bamboopitviper.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Venomous — seek care promptly",
    note: "Local swelling common — polyvalent / supportive care; stock under Pit Viper ASV.",
  },
  {
    key: "humpnosed", species: "Hump-nosed Pit Viper", category: "PitViper", icon: "HumpNosedPitViper",
    photo: "images/snakes/humpnosed.jpg",
    photoCredit: "iNaturalist (research-grade photo)",
    danger: "Venomous — seek care promptly",
    note: "May affect clotting — polyvalent / supportive; stock under Pit Viper ASV.",
  },
];

