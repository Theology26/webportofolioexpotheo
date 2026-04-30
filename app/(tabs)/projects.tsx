import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RepoCard from "../../components/RepoCard";
import ScreenHeader from "../../components/ScreenHeader";
import GlassCard from "../../components/GlassCard";
import PyramidsCanvas from "../../components/PyramidsCanvas";
import { PROFILE, THEME, GITHUB_HEADERS } from "../../constants/Config";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  topics?: string[];
}

export default function ProjectsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchRepos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.github.com/users/${PROFILE.githubUsername}/repos?per_page=100&sort=updated&direction=desc`,
        { headers: GITHUB_HEADERS }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: Repo[] = await response.json();

      const ownRepos = data.filter((repo) => !repo.fork);
      setRepos(ownRepos);
    } catch (err: any) {
      setError(err.message || "Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const languages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  ) as string[];

  const filteredRepos =
    filter === "all"
      ? repos
      : repos.filter((r) => r.language === filter);

  return (
    <View style={styles.container}>
      <PyramidsCanvas />
      <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        isDesktop && { maxWidth: 800, alignSelf: "flex-start", marginLeft: "10%" }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Projects"
        subtitle={`Repository dari GitHub @${PROFILE.githubUsername}`}
      />

      {}
      {!loading && !error && repos.length > 0 && (
        <GlassCard style={styles.statsCard} delay={100}>
          <View style={styles.statsRow}>
            <StatBadge
              icon="folder"
              value={repos.length.toString()}
              label="Repos"
            />
            <StatBadge
              icon="star-outline"
              value={repos
                .reduce((sum, r) => sum + r.stargazers_count, 0)
                .toString()}
              label="Stars"
            />
            <StatBadge
              icon="code"
              value={languages.length.toString()}
              label="Languages"
            />
          </View>
        </GlassCard>
      )}

      {}
      {!loading && !error && languages.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          <FilterChip
            label="All"
            isActive={filter === "all"}
            onPress={() => setFilter("all")}
          />
          {languages.map((lang) => (
            <FilterChip
              key={lang}
              label={lang}
              isActive={filter === lang}
              onPress={() => setFilter(lang)}
              color={
                THEME.langColors[lang] ?? THEME.langColors.default
              }
            />
          ))}
        </ScrollView>
      )}

      {}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.accent} />
          <Text style={styles.loadingText}>
            Fetching repositories from GitHub...
          </Text>
        </View>
      )}

      {}
      {error && (
        <GlassCard style={styles.errorCard}>
          <View style={styles.errorContent}>
            <MaterialIcons name="error-outline" size={32} color="#ff6b6b" />
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={fetchRepos} style={styles.retryBtn}>
              <MaterialIcons name="refresh" size={16} color={THEME.accentLight} />
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        </GlassCard>
      )}

      {}
      {!loading && !error && repos.length === 0 && (
        <GlassCard style={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <MaterialIcons name="inbox" size={48} color={THEME.textMuted} />
            <Text style={styles.emptyTitle}>No Repositories</Text>
            <Text style={styles.emptyText}>
              No public repositories found for this GitHub account.
            </Text>
          </View>
        </GlassCard>
      )}

      {}
      {!loading && !error && filteredRepos.length > 0 && (
        <View style={[styles.grid, isDesktop && { justifyContent: "flex-start" }]}>
          {filteredRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </View>
      )}

      {}
      {!loading && !error && repos.length > 0 && filteredRepos.length === 0 && (
        <View style={styles.filterEmpty}>
          <Text style={styles.filterEmptyText}>
            No repos with language "{filter}"
          </Text>
        </View>
      )}

      {}
      <View style={{ height: 100 }} />
    </ScrollView>
    </View>
  );
}

function FilterChip({
  label,
  isActive,
  onPress,
  color,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        isActive && styles.chipActive,
        Platform.OS === "web" && styles.chipWeb,
      ]}
    >
      {color && (
        <View style={[styles.chipDot, { backgroundColor: color }]} />
      )}
      <Text
        style={[styles.chipText, isActive && styles.chipTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StatBadge({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statBadge}>
      <MaterialIcons name={icon as any} size={18} color={THEME.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    maxWidth: 880,
    width: "100%",
    alignSelf: "center",
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBadge: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "500",
  },
  filterScroll: {
    marginTop: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  chipWeb: {

    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  } as any,
  chipActive: {
    backgroundColor: THEME.accentSoft,
    borderColor: `${THEME.accent}66`,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.textSecondary,
  },
  chipTextActive: {
    color: THEME.accentLight,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 20,
    gap: 16,
  },
  centerContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    color: THEME.textMuted,
    fontSize: 14,
  },
  errorCard: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  errorContent: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textPrimary,
  },
  errorText: {
    fontSize: 13,
    color: "#ff6b6b",
    textAlign: "center",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  emptyContent: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: "center",
  },
  filterEmpty: {
    alignItems: "center",
    paddingVertical: 40,
  },
  filterEmptyText: {
    color: THEME.textMuted,
    fontSize: 13,
  },
});
