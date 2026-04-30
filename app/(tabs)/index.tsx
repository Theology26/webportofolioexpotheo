import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Image,
  Animated,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import GlassCard from "../../components/GlassCard";
import LanguageBar from "../../components/LanguageBar";
import ScreenHeader from "../../components/ScreenHeader";
import HourglassCanvas from "../../components/HourglassCanvas";
import { PROFILE, THEME, GITHUB_HEADERS } from "../../constants/Config";

// ----- Types -----
interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

// ----- Main Component -----
export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const avatarScale = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  // Avatar entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch GitHub languages from all repos
  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Get all public repos
      const reposResponse = await fetch(
        `https://api.github.com/users/${PROFILE.githubUsername}/repos?per_page=100&sort=updated`,
        { headers: GITHUB_HEADERS }
      );

      if (!reposResponse.ok) {
        throw new Error(`GitHub API error: ${reposResponse.status}`);
      }

      const repos = await reposResponse.json();

      if (!Array.isArray(repos) || repos.length === 0) {
        setLanguages([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch language breakdown for each repo
      const languagePromises = repos.map(async (repo: any) => {
        try {
          const langResponse = await fetch(repo.languages_url, {
            headers: GITHUB_HEADERS,
          });
          if (langResponse.ok) {
            return await langResponse.json();
          }
          return {};
        } catch {
          return {};
        }
      });

      const allLanguages = await Promise.all(languagePromises);

      // Step 3: Aggregate language bytes
      const languageTotals: Record<string, number> = {};
      allLanguages.forEach((repoLangs: Record<string, number>) => {
        Object.entries(repoLangs).forEach(([lang, bytes]) => {
          languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
        });
      });

      // Step 4: Calculate percentages and sort
      const totalBytes = Object.values(languageTotals).reduce(
        (sum, b) => sum + b,
        0
      );

      if (totalBytes === 0) {
        setLanguages([]);
        setLoading(false);
        return;
      }

      const sorted = Object.entries(languageTotals)
        .map(([name, bytes]) => ({
          name,
          percentage: (bytes / totalBytes) * 100,
          color:
            THEME.langColors[name] ?? THEME.langColors.default,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10); // Top 10 languages

      setLanguages(sorted);
    } catch (err: any) {
      setError(err.message || "Failed to fetch language data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  // Social media link handler
  const openLink = (url: string) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <HourglassCanvas />
      <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        isDesktop && { maxWidth: 600, alignSelf: "flex-start", marginLeft: "10%" }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="Profil" subtitle="Tentang saya & skill saya" />

      {/* ===== PROFILE CARD ===== */}
      <GlassCard style={styles.profileCard} delay={100}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              transform: [{ scale: avatarScale }],
            },
            Platform.OS === "web" && {
              // @ts-ignore
              boxShadow: `0 0 30px ${THEME.accent}44`,
            },
          ]}
        >
          <Image
            source={{ uri: PROFILE.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
          {/* Avatar ring */}
          <View style={styles.avatarRing} />
        </Animated.View>

        <Animated.View style={{ opacity: fadeIn, alignItems: "center" }}>
          <Text style={styles.name}>{PROFILE.name}</Text>
          <Text style={styles.title}>{PROFILE.title}</Text>
          <Text style={styles.subtitle}>{PROFILE.subtitle}</Text>

          {/* Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{PROFILE.bio}</Text>
          </View>
        </Animated.View>
      </GlassCard>

      {/* ===== SOCIAL LINKS ===== */}
      <GlassCard style={styles.socialCard} delay={250}>
        <Text style={styles.sectionTitle}>Connect With Me</Text>
        <View style={styles.socialRow}>
          {/* Instagram */}
          <SocialButton
            icon="logo-instagram"
            label="Instagram"
            color="#E4405F"
            onPress={() => openLink(PROFILE.socialLinks.instagram)}
          />
          {/* LinkedIn */}
          <SocialButton
            icon="logo-linkedin"
            label="LinkedIn"
            color="#0A66C2"
            onPress={() => openLink(PROFILE.socialLinks.linkedin)}
          />
          {/* GitHub */}
          <SocialButton
            icon="logo-github"
            label="GitHub"
            color="#ffffff"
            onPress={() => openLink(PROFILE.socialLinks.github)}
          />
        </View>
      </GlassCard>

      {/* ===== LANGUAGE SKILLS ===== */}
      <GlassCard style={styles.langCard} delay={400}>
        <View style={styles.langHeader}>
          <View>
            <Text style={styles.sectionTitle}>Tech Stack</Text>
            <Text style={styles.sectionSubtitle}>
              Based on GitHub repository analysis
            </Text>
          </View>
          <Pressable
            onPress={fetchLanguages}
            style={({ hovered }) => [
              styles.refreshBtn,
              hovered && styles.refreshBtnHovered,
            ]}
          >
            <MaterialIcons
              name="refresh"
              size={18}
              color={THEME.textSecondary}
            />
          </Pressable>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME.accent} />
            <Text style={styles.loadingText}>Fetching from GitHub...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={fetchLanguages} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && languages.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="code-off" size={32} color={THEME.textMuted} />
            <Text style={styles.emptyText}>No language data available</Text>
          </View>
        )}

        {!loading &&
          !error &&
          languages.map((lang, idx) => (
            <LanguageBar
              key={lang.name}
              language={lang.name}
              percentage={lang.percentage}
              color={lang.color}
              delay={idx * 80}
            />
          ))}
      </GlassCard>

      {/* Bottom spacing for tab bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
    </View>
  );
}

// ----- Social Button Sub-component -----
function SocialButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      <Animated.View
        style={[
          styles.socialBtn,
          { transform: [{ scale: scaleAnim }] },
          isHovered && {
            backgroundColor: `${color}22`,
            borderColor: `${color}66`,
          },
          Platform.OS === "web" &&
            isHovered && {
              // @ts-ignore
              boxShadow: `0 0 20px ${color}33`,
            },
        ]}
      >
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={[styles.socialLabel, { color: THEME.textSecondary }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: THEME.textPrimary,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.accentLight,
    textAlign: "center",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  bioContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  bio: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  socialCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textPrimary,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
  },
  socialBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 88,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 8,
    ...(Platform.OS === "web"
      ? ({
          transition:
            "background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        } as any)
      : {}),
  },
  socialLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  langCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  langHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    ...(Platform.OS === "web"
      ? ({
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        } as any)
      : {}),
  },
  refreshBtnHovered: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: THEME.textMuted,
    fontSize: 13,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.accentSoft,
    borderWidth: 1,
    borderColor: `${THEME.accent}44`,
  },
  retryText: {
    color: THEME.accentLight,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: {
    color: THEME.textMuted,
    fontSize: 13,
  },
});
