import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "../constants/Config";

const NUM_ORBS = 5;

interface Orb {
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
}

export default function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, height } = Dimensions.get("window");
  const orbColors = [
    "rgba(124, 92, 252, 0.15)",
    "rgba(99, 102, 241, 0.12)",
    "rgba(139, 92, 246, 0.1)",
    "rgba(79, 70, 229, 0.08)",
    "rgba(167, 139, 250, 0.1)",
  ];

  const orbs = useRef<Orb[]>(
    Array.from({ length: NUM_ORBS }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      scale: new Animated.Value(0.6 + Math.random() * 0.6),
      opacity: new Animated.Value(0),
      color: orbColors[i % orbColors.length],
      size: 150 + Math.random() * 200,
    }))
  ).current;

  useEffect(() => {
    orbs.forEach((orb, i) => {

      Animated.timing(orb.opacity, {
        toValue: 1,
        duration: 1500,
        delay: i * 300,
        useNativeDriver: true,
      }).start();

      const animateOrb = () => {
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        const targetScale = 0.6 + Math.random() * 0.6;

        Animated.parallel([
          Animated.timing(orb.x, {
            toValue: targetX,
            duration: 8000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(orb.y, {
            toValue: targetY,
            duration: 8000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(orb.scale, {
            toValue: targetScale,
            duration: 8000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
        ]).start(() => animateOrb());
      };

      setTimeout(() => animateOrb(), i * 500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={THEME.primaryGradient as unknown as string[]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {}
      {orbs.map((orb, i) => (
        <Animated.View
          key={i}
          style={[
            styles.orb,
            {
              width: orb.size,
              height: orb.size,
              borderRadius: orb.size / 2,
              backgroundColor: orb.color,
              opacity: orb.opacity,
              transform: [
                { translateX: orb.x },
                { translateY: orb.y },
                { scale: orb.scale },
              ],
            },
            Platform.OS === "web" && {

              filter: `blur(60px)`,
            },
          ]}
        />
      ))}

      {}
      {Platform.OS === "web" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {

              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            } as any,
          ]}
        />
      )}

      {}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  orb: {
    position: "absolute",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
