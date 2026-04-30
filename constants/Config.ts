// ============================================================
// 🔧 KONFIGURASI UTAMA PORTFOLIO
// Ubah data di bawah ini sesuai kebutuhanmu!
// ============================================================

export const PROFILE = {
  name: "Yosia Gracetheo Boimau",
  title: "Computer Science Student",
  subtitle: "Bina Nusantara University Malang",
  bio: "Passionate about building elegant software solutions. Currently pursuing Computer Science degree with focus on modern web and mobile development.",

  // Ganti URL foto profil di bawah ini
  avatarUrl: "https://github.com/Theology26.png",

  // Username GitHub (untuk fetch API)
  githubUsername: "Theology26",

  // GitHub Personal Access Token (sebaiknya gunakan file .env dengan EXPO_PUBLIC_GITHUB_TOKEN)
  githubToken: process.env.EXPO_PUBLIC_GITHUB_TOKEN || "",

  // Link Social Media
  socialLinks: {
    instagram: "https://www.instagram.com/theoxcyro",
    linkedin: "www.linkedin.com/in/yosia-gracetheo-boimau-919340211",
    github: "https://github.com/Theology26",
  },
};

export const EDUCATION = [
  {
    id: "1",
    school: "SMA Kalam Kudus Malang",
    degree: "Sekolah Menengah Atas",
    year: "2021 - 2024", // Sesuaikan tahun kelulusan
    description:
      "Menempuh pendidikan menengah atas dengan fokus pada bidang IPA dan pengembangan soft skill kepemimpinan.",
    icon: "school" as const,
  },
  {
    id: "2",
    school: "Bina Nusantara (BINUS) University Malang",
    degree: "S1 - Computer Science",
    year: "2024 - 2028", // Sesuaikan tahun kelulusan
    description:
      "Mendalami ilmu komputer dengan fokus pada software engineering, data structures, algorithms, dan modern web/mobile development.",
    icon: "computer" as const,
  },
];

// Helper: GitHub API headers dengan autentikasi
export const GITHUB_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  ...(PROFILE.githubToken
    ? { Authorization: `Bearer ${PROFILE.githubToken}` }
    : {}),
};

// Warna tema untuk glassmorphism
export const THEME = {
  // Font family
  fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  // Gradient utama
  primaryGradient: ["#0f0c29", "#302b63", "#24243e"] as const,
  // Accent colors
  accent: "#7c5cfc",
  accentLight: "#a78bfa",
  accentSoft: "rgba(124, 92, 252, 0.15)",
  // Glass
  glassBg: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
  glassHighlight: "rgba(255, 255, 255, 0.25)",
  // Text
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.45)",
  // Status colors for language bars
  langColors: {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    Java: "#ed8b00",
    "C#": "#239120",
    "C++": "#00599C",
    C: "#555555",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#CC342D",
    PHP: "#777BB4",
    Swift: "#FA7343",
    Kotlin: "#7F52FF",
    Dart: "#0175C2",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Dockerfile: "#384d54",
    Vue: "#4FC08D",
    SCSS: "#c6538c",
    default: "#8b8b8b",
  } as Record<string, string>,
};
