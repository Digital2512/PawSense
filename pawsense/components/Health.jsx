// @ts-check
import { ScrollView, Text, View } from "react-native";
import { Card, ProgressBar } from "./components";
import styles from "../AppStyles";
import { Ionicons } from "@expo/vector-icons";

export default (clientData) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card>
      <Text style={styles.cardTitle}>Vital Signs</Text>
      <View style={styles.vitalSignsGrid}>
        <View style={[styles.vitalSignCard, { backgroundColor: '#FEF2F2' }]}>
          <View style={styles.vitalSignHeader}>
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text style={styles.vitalSignLabel}>Heart Rate</Text>
          </View>
          <Text style={[styles.vitalSignValue, { color: '#EF4444' }]}>{clientData.heart_rate}</Text>
          <Text style={[styles.vitalSignUnit, { color: '#EF4444' }]}>BPM (Normal)</Text>
        </View>
        <View style={[styles.vitalSignCard, { backgroundColor: '#FFF7ED' }]}>
          <View style={styles.vitalSignHeader}>
            <Ionicons name="thermometer" size={16} color="#F97316" />
            <Text style={styles.vitalSignLabel}>Temperature</Text>
          </View>
          <Text style={[styles.vitalSignValue, { color: '#F97316' }]}>{clientData.temperature}°F</Text>
          <Text style={[styles.vitalSignUnit, { color: '#F97316' }]}>Normal Range</Text>
        </View>
      </View>
    </Card>

    <Card>
      <Text style={styles.cardTitle}>Daily Activity</Text>
      <View style={styles.activityMetric}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricLabel}>Steps Today</Text>
          <Text style={styles.metricValue}>{clientData.steps}</Text>
        </View>
        <ProgressBar progress={(clientData.steps / 15000) * 100} color="#10B981" />
        <Text style={styles.metricGoal}>Goal: 15,000 steps</Text>
      </View>
      <View style={styles.activityMetric}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricLabel}>Calories Burned</Text>
          <Text style={styles.metricValue}>{clientData.calories}</Text>
        </View>
        <ProgressBar progress={(clientData.calories / 600) * 100} color="#F59E0B" />
        <Text style={styles.metricGoal}>Goal: 600 calories</Text>
      </View>
    </Card>

    <Card>
      <Text style={styles.cardTitle}>Health Alerts</Text>
      <View style={styles.healthAlert}>
        <Text style={[styles.healthAlertTitle, { color: 'red', fontWeight: 'bold' }]}>
          ⚠️ Health Alert!
        </Text>
        <Text style={styles.healthAlertText}>
          Max has missed his medicine dose today.
        </Text>
      </View>
    </Card>
  </ScrollView>
);
