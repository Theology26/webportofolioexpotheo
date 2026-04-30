import React from "react";
import { View, ScrollView, StyleSheet, Text, useWindowDimensions } from "react-native";
import TimelineItem from "../../components/TimelineItem";
import ScreenHeader from "../../components/ScreenHeader";
import GlassCard from "../../components/GlassCard";
import ScalesCanvas from "../../components/ScalesCanvas";
import { EDUCATION, THEME } from "../../constants/Config";
import { MaterialIcons } from "@expo/vector-icons";

export default function EducationScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;

  return (
    <View style={styles.container}>
      <ScalesCanvas />
      <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        isDesktop && { maxWidth: 600, alignSelf: "flex-start", marginLeft: "10%" }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Pendidikan"
        subtitle="Riwayat pendidikan & perjalanan akademik"
      />

      {/* Intro card */}
      <GlassCard style={styles.introCard} delay={100}>
        <View style={styles.introRow}>
          <View style={styles.introIconWrap}>
            <MaterialIcons name="auto-stories" size={28} color={THEME.accent} />
          </View>
          <View style={styles.introTextWrap}>
            <Text style={styles.introTitle}>Perjalanan Akademik</Text>
            <Text style={styles.introSubtitle}>
              Dari bangku SMA hingga perguruan tinggi, setiap langkah membentuk
              fondasi pengetahuan dan keterampilan saya.
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Timeline */}
      <View style={styles.timelineContainer}>
        {EDUCATION.map((item, index) => (
          <TimelineItem
            key={item.id}
            school={item.school}
            degree={item.degree}
            year={item.year}
            description={item.description}
            icon={item.icon}
            index={index}
            isLast={index === EDUCATION.length - 1}
          />
        ))}
      </View>

      {/* Stats summary */}
      <GlassCard style={styles.statsCard} delay={600}>
        <Text style={styles.statsTitle}>Ringkasan</Text>
        <View style={styles.statsRow}>
          <StatItem
            icon="location-city"
            value="Malang"
            label="Kota Pendidikan"
          />
          <View style={styles.statsDivider} />
          <StatItem
            icon="timeline"
            value={`${EDUCATION.length}`}
            label="Institusi"
          />
          <View style={styles.statsDivider} />
          <StatItem
            icon="computer"
            value="CS"
            label="Jurusan"
          />
        </View>
      </GlassCard>

      {/* Bottom spacing for tab bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
    </View>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statItem}>
      <MaterialIcons name={icon as any} size={20} color={THEME.accent} />
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
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  introCard: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 24,
  },
  introRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  introIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: THEME.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${THEME.accent}33`,
  },
  introTextWrap: {
    flex: 1,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  timelineContainer: {
    paddingHorizontal: 20,
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "500",
    textAlign: "center",
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: THEME.glassBorder,
  },
});
