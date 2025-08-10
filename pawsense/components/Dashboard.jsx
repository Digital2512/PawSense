import { ScrollView, Text, View } from "react-native";
import styles from "../AppStyles.js";
import { Card, Badge, ProgressBar } from "./components.jsx";

export default (healthData, clientData, currentEmotion) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card style={styles.statusCard}>
      <Text style={styles.cardTitle}>Current Status</Text>
      <View style={styles.statusGrid}>
        <View style={[styles.statusItem, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.statusValue, { color: '#2563EB' }]}>{clientData.heart_rate}</Text>
          <Text style={[styles.statusLabel, { color: '#2563EB' }]}>BPM</Text>
        </View>
        <View style={[styles.statusItem, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.statusValue, { color: '#16A34A' }]}>{clientData.temperature}°F</Text>
          <Text style={[styles.statusLabel, { color: '#16A34A' }]}>Temperature</Text>
        </View>
      </View>
      <View style={styles.activityContainer}>
        <Text style={styles.activityLabel}>Activity Level</Text>
        <Badge text={`${healthData.activity}%`} style={styles.activityBadge} />
      </View>
      <ProgressBar progress={healthData.activity} color="#3B82F6" />
    </Card>

    <Card style={styles.behaviorCard}>
      <Text style={styles.cardTitle}>Behavior & Emotion</Text>
      <View style={styles.behaviorContent}>
        <View style={styles.behaviorInfo}>
          <Text style={styles.behaviorText}>{clientData.activity}</Text>
          <Text style={styles.behaviorSubtext}>Current Activity</Text>
        </View>
        <Badge
          text={currentEmotion}
          style={[styles.emotionBadge, { backgroundColor: '#F3E8FF' }]}
          textStyle={{ color: '#7C3AED' }}
        />
      </View>
      <Text style={styles.timestamp}>
        Last updated: {new Date().toLocaleTimeString()}
      </Text>
    </Card>

    <Card style={styles.locationCard}>
      <Text style={styles.cardTitle}>Location</Text>
      <View style={styles.locationContent}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{clientData.context}</Text>
          <Text style={styles.locationCoords}>
            {clientData.latitude}, {clientData.longitude}
          </Text>
        </View>
        <Badge
          text="Safe Zone"
          style={[styles.safeBadge, { backgroundColor: '#DCFCE7', borderColor: '#16A34A' }]}
          textStyle={{ color: '#16A34A' }}
        />
      </View>
    </Card>
  </ScrollView>
);
