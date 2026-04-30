import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/Config";
import AnimatedBackground from "../../components/AnimatedBackground";

export default function TabLayout() {
  return (
    <AnimatedBackground>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: Platform.OS === "web" ? styles.tabBarWeb : styles.tabBar,
          tabBarActiveTintColor: THEME.accent,
          tabBarInactiveTintColor: THEME.textMuted,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
          animation: "shift",
          sceneStyle: { backgroundColor: "transparent" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Profil",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="education"
          options={{
            title: "Pendidikan",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="school" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: "Project",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="code" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(15, 12, 41, 0.95)",
    borderTopWidth: 1,
    borderTopColor: THEME.glassBorder,
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
  },
  tabBarWeb: {
    backgroundColor: "rgba(15, 12, 41, 0.85)",
    borderTopWidth: 1,
    borderTopColor: THEME.glassBorder,
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
    // @ts-ignore
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  } as any,
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
});
