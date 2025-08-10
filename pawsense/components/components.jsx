import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../AppStyles";

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const Badge = ({ text, style, textStyle }) => (
  <View style={[styles.badge, style]}>
    <Text style={[styles.badgeText, textStyle]}>{text}</Text>
  </View>
);

export const ProgressBar = ({ progress, color = '#3B82F6', height = 8 }) => (
  <View style={[styles.progressContainer, { height }]}>
    <View
      style={[
        styles.progressBar,
        { width: `${progress}%`, backgroundColor: color, height }
      ]}
    />
  </View>
);

export const TabButton = ({ icon, isActive, onPress, label }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={20}
      color={isActive ? '#FFFFFF' : '#6B7280'}
    />
    {label && <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>}
  </TouchableOpacity>
);
