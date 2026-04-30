import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "../constants/Config";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

interface RepoCardProps {
  repo: Repo;
  index: number;
}

export default function RepoCard({ repo, index }: RepoCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const langColor =
    THEME.langColors[repo.language ?? ""] ?? THEME.langColors.default;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePress = () => {
    if (Platform.OS === "web") {
      window.open(repo.html_url, "_blank", "noopener,noreferrer");
    } else {
      Linking.openURL(repo.html_url);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          styles.card,
          Platform.OS === "web" && styles.cardWeb,
          isHovered && styles.cardHovered,
        ]}
      >
        {/* Top highlight */}
        <View style={styles.highlight} />

        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons
            name="folder"
            size={20}
            color={THEME.accentLight}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.repoName} numberOfLines={1}>
              {repo.name}
            </Text>
          </View>
          <MaterialIcons
            name="open-in-new"
            size={16}
            color={THEME.textMuted}
          />
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {repo.description || "No description provided."}
        </Text>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <View style={styles.topicsRow}>
            {repo.topics.slice(0, 3).map((topic) => (
              <View key={topic} style={styles.topicBadge}>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {repo.language && (
            <View style={styles.footerItem}>
              <View style={[styles.langDot, { backgroundColor: langColor }]} />
              <Text style={styles.footerText}>{repo.language}</Text>
            </View>
          )}
          <View style={styles.footerItem}>
            <MaterialIcons name="star-outline" size={14} color={THEME.textMuted} />
            <Text style={styles.footerText}>{repo.stargazers_count}</Text>
          </View>
          <View style={styles.footerItem}>
            <MaterialIcons
              name="call-split"
              size={14}
              color={THEME.textMuted}
            />
            <Text style={styles.footerText}>{repo.forks_count}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <Text style={styles.dateText}>{formatDate(repo.updated_at)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 16,
  },
  card: {
    backgroundColor: THEME.glassBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    padding: 22,
    overflow: "hidden",
    position: "relative",
  },
  cardWeb: {
    // @ts-ignore
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition:
      "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease, border-color 0.3s ease",
    cursor: "pointer",
  } as any,
  cardHovered: {
    ...(Platform.OS === "web"
      ? ({
          transform: [{ translateY: -6 }, { scale: 1.02 }],
          borderColor: `${THEME.accent}66`,
          // @ts-ignore
          boxShadow: `0 12px 40px rgba(124, 92, 252, 0.2), 0 0 0 1px ${THEME.accent}33`,
        } as any)
      : {}),
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: THEME.glassHighlight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  repoName: {
    color: THEME.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  description: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  topicsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  topicBadge: {
    backgroundColor: THEME.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${THEME.accent}33`,
  },
  topicText: {
    color: THEME.accentLight,
    fontSize: 11,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footerText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "500",
  },
  dateText: {
    color: THEME.textMuted,
    fontSize: 11,
  },
});
