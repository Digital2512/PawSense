import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "./components";
import styles from "../AppStyles";

export default (clientData, locations) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card>
      <Text style={styles.cardTitle}>Live Location</Text>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="location" size={48} color="#EF4444" />
        <Text style={styles.mapLocationName}>{clientData.context}</Text>
        <Text style={styles.mapLocationCoords}>
          {clientData.latitude}, {clientData.longitude}
        </Text>
        <Badge
          text="In Safe Zone"
          style={[styles.mapBadge, { backgroundColor: '#DCFCE7' }]}
          textStyle={{ color: '#16A34A' }}
        />
      </View>
      <View style={styles.locationDetails}>
        <View style={styles.locationDetailRow}>
          <Text style={styles.locationDetailLabel}>Distance from Home</Text>
          <Text style={styles.locationDetailValue}>0.3 miles</Text>
        </View>
        <View style={styles.locationDetailRow}>
          <Text style={styles.locationDetailLabel}>Last Movement</Text>
          <Text style={styles.locationDetailValue}>2 minutes ago</Text>
        </View>
      </View>
    </Card>

    <Card>
      <Text style={styles.cardTitle}>Recent Locations</Text>
      {locations.map((location, index) => (
        <View key={index} style={styles.locationHistoryItem}>
          <View style={styles.locationHistoryInfo}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <View style={styles.locationHistoryText}>
              <Text style={styles.locationHistoryName}>{location.name}</Text>
              <Text style={styles.locationHistoryTime}>
                {Math.floor(Math.random() * 60)} min ago
              </Text>
            </View>
          </View>
          <Badge
            text={`${Math.floor(Math.random() * 30) + 5} min`}
            style={styles.durationBadge}
          />
        </View>
      ))}
    </Card>
  </ScrollView>
);
