import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
} from "react-native";
import { THEME } from "../constants/Config";

interface LanguageBarProps {
  language: string;
  percentage: number;
  color: string;
  delay?: number;
}

export default function LanguageBar({
  language,
  percentage,
  color,
  delay = 0,
}: LanguageBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(widthAnim, {
        toValue: percentage,
        duration: 1000,
        delay: 0,
        useNativeDriver: false,
      }),
    ]).start();
  }, [percentage, delay]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[styles.pressable, isHovered && styles.pressableHovered]}
      >
        <View style={styles.labelRow}>
          <View style={styles.labelLeft}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={styles.language}>{language}</Text>
          </View>
          <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
        </View>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: barWidth,
                backgroundColor: color,
              },
              Platform.OS === "web" && {
                // @ts-ignore
                boxShadow: `0 0 12px ${color}55`,
              },
            ]}
          >
            <View
              style={[styles.barShine, { backgroundColor: `${color}55` }]}
            />
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  pressable: {
    borderRadius: 12,
    padding: 12,
    ...(Platform.OS === "web"
      ? ({
          transition: "background-color 0.2s ease, transform 0.2s ease",
        } as any)
      : {}),
  },
  pressableHovered: {
    backgroundColor: "rgba(255,255,255,0.05)",
    ...(Platform.OS === "web"
      ? ({
          transform: [{ scale: 1.02 }],
        } as any)
      : {}),
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  language: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  percentage: {
    color: THEME.textSecondary,
    fontSize: 13,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
  },
  barShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderRadius: 4,
  },
});
