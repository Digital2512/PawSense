// styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dogAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dogInfo: {
    flex: 1,
  },
  dogName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dogDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statusItem: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  activityBadge: {
    backgroundColor: '#F3F4F6',
  },
  behaviorCard: {
    marginBottom: 16,
  },
  behaviorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  behaviorInfo: {
    flex: 1,
  },
  behaviorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  behaviorSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  emotionBadge: {
    backgroundColor: '#F3E8FF',
  },
  timestamp: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  locationCard: {
    marginBottom: 16,
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationCoords: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  safeBadge: {
    borderWidth: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  progressContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
  vitalSignsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  vitalSignCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  vitalSignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalSignLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  vitalSignValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  vitalSignUnit: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  activityMetric: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#374151',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  metricGoal: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  healthAlert: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  healthAlertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 4,
  },
  healthAlertText: {
    fontSize: 14,
    color: '#6B7280',
  },
  mapPlaceholder: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 192,
    justifyContent: 'center',
  },
  mapLocationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  mapLocationCoords: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  mapBadge: {
    marginTop: 8,
  },
  locationDetails: {
    gap: 8,
  },
  locationDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationDetailLabel: {
    fontSize: 14,
    color: '#374151',
  },
  locationDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  locationHistoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationHistoryText: {
    marginLeft: 12,
  },
  locationHistoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  locationHistoryTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  durationBadge: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  behaviorDisplay: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  behaviorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  behaviorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  behaviorConfidence: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  currentEmotionBadge: {
    marginTop: 8,
  },
  predictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionLabel: {
    fontSize: 14,
    color: '#374151',
  },
  predictionBadge: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  patternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patternLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  patternProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    marginLeft: 16,
  },
  patternPercentage: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 8,
    width: 32,
  },
  translatorInput: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translatorResponse: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: '#1F2937',
  },
  barkTranslation: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  barkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  barkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  confidenceBadge: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  barkTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  quickCommands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  commandButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: (width - 64) / 2 - 4,
    alignItems: 'center',
  },
  commandButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});

export default styles;
