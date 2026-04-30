import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
} from "react-native";
import { THEME } from "../constants/Config";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  intensity?: "low" | "medium" | "high";
}

export default function GlassCard({
  children,
  style,
  delay = 0,
  intensity = "medium",
}: GlassCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  const bgOpacity =
    intensity === "low" ? 0.05 : intensity === "high" ? 0.15 : 0.08;
  const borderOpacity =
    intensity === "low" ? 0.08 : intensity === "high" ? 0.25 : 0.15;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        Platform.OS === "web" && styles.cardWeb,
        style,
      ]}
    >
      {}
      <View style={styles.highlight} />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    overflow: "hidden",
    position: "relative",
  },
  cardWeb: {

    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  } as any,
  highlight: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: THEME.glassHighlight,
    borderRadius: 1,
  },
});
