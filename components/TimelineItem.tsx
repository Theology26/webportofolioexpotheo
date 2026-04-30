import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GlassCard from "./GlassCard";
import { THEME } from "../constants/Config";

interface TimelineItemProps {
  school: string;
  degree: string;
  year: string;
  description: string;
  icon: "school" | "computer";
  index: number;
  isLast: boolean;
}

export default function TimelineItem({
  school,
  degree,
  year,
  description,
  icon,
  index,
  isLast,
}: TimelineItemProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 300),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index]);

  return (
    <View style={styles.container}>
      {}
      <View style={styles.timelineColumn}>
        <Animated.View
          style={[
            styles.iconCircle,
            {
              transform: [{ scale: scaleAnim }],
            },
            Platform.OS === "web" && {

              boxShadow: `0 0 20px ${THEME.accent}66`,
            },
          ]}
        >
          <MaterialIcons
            name={icon}
            size={22}
            color={THEME.textPrimary}
          />
        </Animated.View>
        {!isLast && (
          <Animated.View
            style={[
              styles.connector,
              {
                opacity: fadeAnim,
              },
            ]}
          />
        )}
      </View>

      {}
      <View style={styles.contentColumn}>
        <GlassCard delay={index * 300 + 150} style={styles.card}>
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{year}</Text>
          </View>
          <Text style={styles.school}>{school}</Text>
          <Text style={styles.degree}>{degree}</Text>
          <Text style={styles.description}>{description}</Text>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 4,
  },
  timelineColumn: {
    width: 56,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: THEME.accentLight,
    zIndex: 1,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: THEME.glassBorder,
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24,
  },
  card: {
    padding: 20,
  },
  yearBadge: {
    alignSelf: "flex-start",
    backgroundColor: THEME.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${THEME.accent}44`,
    marginBottom: 12,
  },
  yearText: {
    color: THEME.accentLight,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  school: {
    color: THEME.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  degree: {
    color: THEME.accentLight,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
