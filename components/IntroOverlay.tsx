import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { PROFILE, THEME } from "../constants/Config";

// Tidak lagi menggunakan CurtainTexture yang kaku (garis hitam).
// Kita akan langsung menggunakan BlurView & Gradient di komponen utama.

export default function IntroOverlay() {
  const { width } = useWindowDimensions();
  const [isOpened, setIsOpened] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const breatheAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Animasi nafas (breathing) saat idle
  useEffect(() => {
    if (isOpened) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isOpened]);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);

    // Hentikan animasi nafas
    breatheAnim.stopAnimation();

    // Sequence Pembukaan Tirai
    Animated.sequence([
      // 1. Pop out avatar slightly
      Animated.timing(breatheAnim, {
        toValue: 1.15,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // 2. Shrink & fade avatar center
      Animated.parallel([
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // 3. Slide the theatrical curtains apart
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsFinished(true);
    });
  };

  if (isFinished) return null;

  const leftTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  const rightTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents={isOpened ? "none" : "auto"}
    >
      {/* KIRI: Tirai Setengah Kiri */}
      <Animated.View
        style={[
          styles.curtain,
          styles.curtainLeft,
          { transform: [{ translateX: leftTranslate }] },
        ]}
      >
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill}>
          {/* Tekstur Kaca Ungu Lentur */}
          <LinearGradient
            colors={["rgba(167, 139, 250, 0.15)", "rgba(255, 255, 255, 0.2)", "rgba(167, 139, 250, 0.3)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </BlurView>
        {/* Glow ungu menyala di belahan tengah */}
        <LinearGradient
          colors={["rgba(167, 139, 250, 0.7)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.9, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* KANAN: Tirai Setengah Kanan */}
      <Animated.View
        style={[
          styles.curtain,
          styles.curtainRight,
          { transform: [{ translateX: rightTranslate }] },
        ]}
      >
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={["rgba(167, 139, 250, 0.3)", "rgba(255, 255, 255, 0.2)", "rgba(167, 139, 250, 0.15)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </BlurView>
        {/* Glow ungu menyala di belahan tengah */}
        <LinearGradient
          colors={["rgba(167, 139, 250, 0.7)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* TENGAH: Tombol Avatar & Teks */}
      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: opacityAnim,
            transform: [{ scale: breatheAnim }],
          },
        ]}
        pointerEvents={isOpened ? "none" : "auto"}
      >
        <Pressable onPress={handleOpen} style={styles.pressable}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: PROFILE.avatarUrl }} style={styles.avatar} />
            <View style={styles.avatarRing} />
          </View>
          <Text style={styles.hintText}>Ketuk untuk Memulai Keajaiban</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 9999, // Memastikan selalu di atas semua konten
    justifyContent: "center",
    alignItems: "center",
  },
  curtain: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    overflow: "hidden",
  },
  curtainLeft: {
    left: 0,
  },
  curtainRight: {
    right: 0,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  pressable: {
    alignItems: "center",
    padding: 20,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web"
      ? ({
          boxShadow: `0 0 40px ${THEME.accent}88`,
        } as any)
      : {
          shadowColor: THEME.accent,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 20,
        }),
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarRing: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: THEME.accent,
  },
  hintText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    opacity: 0.9,
  },
});
