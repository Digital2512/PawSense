// App.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data generators
const generateHealthData = () => ({
  heartRate: Math.floor(Math.random() * 40) + 80, // 80-120 BPM for dogs
  temperature: (Math.random() * 2 + 101).toFixed(1), // 101-103°F normal for dogs
  activity: Math.floor(Math.random() * 100),
  steps: Math.floor(Math.random() * 5000) + 8000,
  calories: Math.floor(Math.random() * 200) + 300
});

const behaviors = ['Walking', 'Running', 'Sleeping', 'Playing', 'Eating', 'Sitting'];
const emotions = ['Happy', 'Excited', 'Calm', 'Anxious', 'Playful', 'Tired'];
const locations = [
  { name: 'Home', lat: 40.7128, lng: -74.0060 },
  { name: 'Dog Park', lat: 40.7589, lng: -73.9851 },
  { name: 'Vet Clinic', lat: 40.7505, lng: -73.9934 }
];

// Reusable Components
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const Badge = ({ text, style, textStyle }) => (
  <View style={[styles.badge, style]}>
    <Text style={[styles.badgeText, textStyle]}>{text}</Text>
  </View>
);

const ProgressBar = ({ progress, color = '#3B82F6', height = 8 }) => (
  <View style={[styles.progressContainer, { height }]}>
    <View 
      style={[
        styles.progressBar, 
        { width: `${progress}%`, backgroundColor: color, height }
      ]} 
    />
  </View>
);

const TabButton = ({ icon, isActive, onPress, label }) => (
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

export default function SmartDogCollarApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [healthData, setHealthData] = useState(generateHealthData());
  const [currentBehavior, setCurrentBehavior] = useState(behaviors[0]);
  const [currentEmotion, setCurrentEmotion] = useState(emotions[0]);
  const [currentLocation, setCurrentLocation] = useState(locations[0]);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isConnected, setIsConnected] = useState(true);
  const [translatorInput, setTranslatorInput] = useState('');
  const [translatorOutput, setTranslatorOutput] = useState('');
  const [recentBarks, setRecentBarks] = useState([
    { time: '2 min ago', translation: 'I want to go outside!', confidence: 92 },
    { time: '5 min ago', translation: 'Someone is at the door', confidence: 88 },
    { time: '12 min ago', translation: 'I am happy to see you!', confidence: 95 }
  ]);
  const [predictions, setPredictions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(generateHealthData());
      setCurrentBehavior(behaviors[Math.floor(Math.random() * behaviors.length)]);
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
      setCurrentLocation(locations[Math.floor(Math.random() * locations.length)]);
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
      
      // Update current time for real-time calculations
      setCurrentTime(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Real-time clock update every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
      (async () => {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
          alert('Enable notifications to get activity reminders!');
        }
      })();
    }, []);

    async function scheduleNextActivityNotification(activityName, startTime) {
        const triggerTime = new Date(startTime.getTime() - 15 * 60 * 1000); // 15 mins before

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Upcoming Pet Activity 🐾',
            body: `Your pet’s next activity is ${activityName} in 15 minutes!`,
            sound: 'default',
          },
          trigger: triggerTime, // Date object for absolute time
        });
      }


  // Fetch chain predictions from API
  useEffect(() => {
    const currentActivity = 'Feeding';
    const currentActivityTimeStart = '2025-08-09 15:53:00';

    async function fetchChainPredictions(activity) {
      setIsLoadingPredictions(true);
      try {
        const response = await fetch('https://pawsense-ifaz.onrender.com/predict_chain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            current_activity: currentActivity, 
            last_activity_time: currentActivityTimeStart,
            max_depth: 6 // Get up to 6 future activities
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        const activityName = data.activity;
        const startTime = new Date(data.start_time);
        scheduleNextActivityNotification(activityName, startTime);
        
        // Process chain predictions
        if (data.chain_predictions && Array.isArray(data.chain_predictions)) {
          const activityStartTime = new Date(currentActivityTimeStart);
          
          const formattedPredictions = data.chain_predictions.map((pred, index) => {
            // Calculate predicted time based on cumulative duration
            const predictedTime = new Date(pred.predicted_start_time);
            
            return {
              id: `pred-${index}`, // Add unique ID for React keys
              label: pred.activity,
              predictedTime: predictedTime,
              probability: pred.probability || 0,
              depth: index + 1, // Track depth in the chain
              minutesFromStart: pred.minutes_from_start || 0
            };
          });

          // Sort by predicted time (closest first)
          const sortedPredictions = formattedPredictions.sort(
            (a, b) => a.predictedTime.getTime() - b.predictedTime.getTime()
          );

          setPredictions(sortedPredictions);
          
        } else {
          // Fallback to mock data if API doesn't return chain predictions
          console.warn('Chain predictions not found in API response, using fallback data');
          generateFallbackChainPredictions();
        }
      } catch (error) {
        console.error('Error fetching chain predictions:', error);
        generateFallbackChainPredictions();
      } finally {
        setIsLoadingPredictions(false);
      }
    }
    
    // Fallback function to generate mock chain predictions
    function generateFallbackChainPredictions() {
      const activities = ['Walking', 'Playing', 'Sleeping', 'Eating', 'Running', 'Sitting'];
      const startTime = new Date(currentActivityTimeStart);
      let cumulativeTime = 0;
      
      const chainPredictions = activities.slice(0, 6).map((activity, index) => {
        // Generate realistic durations (15-120 minutes)
        const duration = Math.floor(Math.random() * 105) + 15;
        cumulativeTime += duration;
        
        const predictedTime = new Date(startTime.getTime() + cumulativeTime * 60 * 1000);
        
        return {
          id: `fallback-${index}`,
          label: activity,
          predictedTime: predictedTime,
          probability: Math.max(0.4, Math.random() * 0.6), // 40-100% probability
          depth: index + 1,
          minutesFromStart: cumulativeTime
        };
      });

      setPredictions(chainPredictions);
    }

    fetchChainPredictions(currentActivity);
  }, []);

  const handleTranslate = () => {
    if (!translatorInput.trim()) {
      Alert.alert('Please enter a message');
      return;
    }
    
    const responses = [
      'Woof woof! (Time for a walk!)',
      'Bark bark woof! (I love you too!)',
      'Woof woof bark! (Let\'s play fetch!)',
      'Gentle woof (I understand, good human)'
    ];
    setTranslatorOutput(responses[Math.floor(Math.random() * responses.length)]);
  };

  const getBehaviorEmoji = (behavior) => {
    const emojiMap = {
      'Sleeping': '😴',
      'Playing': '🎾',
      'Walking': '🚶',
      'Running': '🏃',
      'Eating': '🍽️',
      'Sitting': '🐕',
      'Feeding': '🍽️'
    };
    return emojiMap[behavior] || '🐕';
  };

  // Helper function to calculate minutes until predicted time
  const calculateMinutesUntil = (predictedTime) => {
    const diffInMs = predictedTime.getTime() - currentTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes;
  };

  // Helper function to format time remaining
  const formatTimeRemaining = (minutes) => {
    if (minutes < 0) {
      return `${Math.abs(minutes)} min ago`;
    } else if (minutes === 0) {
      return 'Now';
    } else if (minutes < 60) {
      return `in ${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `in ${hours}h ${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
    }
  };

  // Helper function to get priority color based on time until activity
  const getPriorityColor = (minutesUntil) => {
    if (minutesUntil < 0) return { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' }; // Past - Red
    if (minutesUntil <= 30) return { bg: '#EFF6FF', text: '#2563EB', border: '#DBEAFE' }; // Soon - Blue
    if (minutesUntil <= 120) return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' }; // Medium - Amber
    return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' }; // Later - Green
  };

  const renderDashboard = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.statusCard}>
        <Text style={styles.cardTitle}>Current Status</Text>
        <View style={styles.statusGrid}>
          <View style={[styles.statusItem, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statusValue, { color: '#2563EB' }]}>{healthData.heartRate}</Text>
            <Text style={[styles.statusLabel, { color: '#2563EB' }]}>BPM</Text>
          </View>
          <View style={[styles.statusItem, { backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.statusValue, { color: '#16A34A' }]}>{healthData.temperature}°F</Text>
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
            <Text style={styles.behaviorText}>{currentBehavior}</Text>
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
            <Text style={styles.locationName}>{currentLocation.name}</Text>
            <Text style={styles.locationCoords}>
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
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

  const renderHealth = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Vital Signs</Text>
        <View style={styles.vitalSignsGrid}>
          <View style={[styles.vitalSignCard, { backgroundColor: '#FEF2F2' }]}>
            <View style={styles.vitalSignHeader}>
              <Ionicons name="heart" size={16} color="#EF4444" />
              <Text style={styles.vitalSignLabel}>Heart Rate</Text>
            </View>
            <Text style={[styles.vitalSignValue, { color: '#EF4444' }]}>{healthData.heartRate}</Text>
            <Text style={[styles.vitalSignUnit, { color: '#EF4444' }]}>BPM (Normal)</Text>
          </View>
          <View style={[styles.vitalSignCard, { backgroundColor: '#FFF7ED' }]}>
            <View style={styles.vitalSignHeader}>
              <Ionicons name="thermometer" size={16} color="#F97316" />
              <Text style={styles.vitalSignLabel}>Temperature</Text>
            </View>
            <Text style={[styles.vitalSignValue, { color: '#F97316' }]}>{healthData.temperature}°F</Text>
            <Text style={[styles.vitalSignUnit, { color: '#F97316' }]}>Normal Range</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Daily Activity</Text>
        <View style={styles.activityMetric}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Steps Today</Text>
            <Text style={styles.metricValue}>{healthData.steps.toLocaleString()}</Text>
          </View>
          <ProgressBar progress={(healthData.steps / 15000) * 100} color="#10B981" />
          <Text style={styles.metricGoal}>Goal: 15,000 steps</Text>
        </View>
        <View style={styles.activityMetric}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Calories Burned</Text>
            <Text style={styles.metricValue}>{healthData.calories}</Text>
          </View>
          <ProgressBar progress={(healthData.calories / 600) * 100} color="#F59E0B" />
          <Text style={styles.metricGoal}>Goal: 600 calories</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Health Alerts</Text>
        <View style={styles.healthAlert}>
          <Text style={styles.healthAlertTitle}>All Good! 🎉</Text>
          <Text style={styles.healthAlertText}>No health alerts at this time</Text>
        </View>
      </Card>
    </ScrollView>
  );

  const renderLocation = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Live Location</Text>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="location" size={48} color="#EF4444" />
          <Text style={styles.mapLocationName}>{currentLocation.name}</Text>
          <Text style={styles.mapLocationCoords}>
            {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
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

  const renderBehavior = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Current Behavior</Text>
        <View style={styles.behaviorDisplay}>
          <Text style={styles.behaviorEmoji}>{getBehaviorEmoji(currentBehavior)}</Text>
          <Text style={styles.behaviorName}>{currentBehavior}</Text>
          <Text style={styles.behaviorConfidence}>Confidence: 94%</Text>
          <Badge 
            text={currentEmotion}
            style={[styles.currentEmotionBadge, { backgroundColor: '#F3E8FF' }]}
            textStyle={{ color: '#7C3AED' }}
          />
        </View>
      </Card>

      {/* Enhanced Activity Predictions with Chain */}
      <Card>
        <View style={styles.predictionHeader}>
          <Text style={styles.cardTitle}>Activity Chain Predictions</Text>
          <Text style={styles.predictionSubtitle}>
            Current time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.predictionDescription}>
            Showing predicted activity sequence based on behavioral patterns
          </Text>
        </View>
        
        {isLoadingPredictions ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="time-outline" size={24} color="#6B7280" />
            <Text style={styles.loadingText}>Loading chain predictions...</Text>
          </View>
        ) : predictions.length > 0 ? (
          <View style={styles.chainContainer}>
            {predictions.map((pred, idx) => {
              const minutesUntil = calculateMinutesUntil(pred.predictedTime);
              const timeString = pred.predictedTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const colors = getPriorityColor(minutesUntil);

              return (
                <View key={pred.id} style={styles.chainItem}>
                  <View style={styles.chainItemContent}>
                    <View style={styles.chainLeft}>
                      <View style={[styles.chainNumber, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                        <Text style={[styles.chainNumberText, { color: colors.text }]}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.predictionEmoji}>{getBehaviorEmoji(pred.label)}</Text>
                      <View style={styles.predictionInfo}>
                        <Text style={styles.predictionActivity}>{pred.label}</Text>
                        <Text style={styles.predictionTime}>Expected: {timeString}</Text>
                        <Text style={styles.predictionDepth}>Chain depth: {pred.depth}</Text>
                      </View>
                    </View>
                    <View style={styles.predictionRight}>
                      <Badge 
                        text={formatTimeRemaining(minutesUntil)}
                        style={[styles.timeBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}
                        textStyle={{ color: colors.text }}
                      />
                      {pred.probability && (
                        <Text style={styles.probabilityText}>
                          {Math.round(pred.probability * 100)}% confident
                        </Text>
                      )}
                    </View>
                  </View>
                  {/* Chain connector line */}
                  {idx < predictions.length - 1 && (
                    <View style={styles.chainConnector}>
                      <View style={styles.chainLine} />
                      <Ionicons name="arrow-down" size={12} color="#D1D5DB" />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.noPredictionsContainer}>
            <Ionicons name="help-circle-outline" size={32} color="#9CA3AF" />
            <Text style={styles.noPredictionsText}>No predictions available</Text>
            <Text style={styles.noPredictionsSubtext}>
              Chain predictions will appear once activity patterns are established
            </Text>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Behavior Patterns</Text>
        {behaviors.slice(0, 4).map((behavior, index) => (
          <View key={index} style={styles.patternItem}>
            <Text style={styles.patternLabel}>{behavior}</Text>
            <View style={styles.patternProgress}>
              <ProgressBar progress={Math.random() * 100} color="#8B5CF6" height={6} />
              <Text style={styles.patternPercentage}>{Math.floor(Math.random() * 100)}%</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  const renderTranslator = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Two-Way Translator</Text>
        <View style={styles.translatorInput}>
          <Text style={styles.inputLabel}>Speak to Max:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={translatorInput}
              onChangeText={setTranslatorInput}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleTranslate}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        {translatorOutput && (
          <View style={styles.translatorResponse}>
            <Text style={styles.responseLabel}>Max's Response:</Text>
            <Text style={styles.responseText}>{translatorOutput}</Text>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Recent Bark Translations</Text>
        {recentBarks.map((bark, index) => (
          <View key={index} style={styles.barkTranslation}>
            <View style={styles.barkHeader}>
              <Text style={styles.barkText}>{bark.translation}</Text>
              <Badge 
                text={`${bark.confidence}%`}
                style={styles.confidenceBadge}
              />
            </View>
            <Text style={styles.barkTime}>{bark.time}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Quick Commands</Text>
        <View style={styles.quickCommands}>
          {['Sit', 'Stay', 'Come', 'Good Boy'].map((command) => (
            <TouchableOpacity
              key={command}
              style={styles.commandButton}
              onPress={() => {
                setTranslatorInput(command);
                handleTranslate();
              }}
            >
              <Text style={styles.commandButtonText}>{command}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return renderDashboard();
      case 'health':
        return renderHealth();
      case 'location':
        return renderLocation();
      case 'behavior':
        return renderBehavior();
      case 'translator':
        return renderTranslator();
      default:
        return renderDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.dogAvatar}>
              <Ionicons name="heart" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.dogInfo}>
              <Text style={styles.dogName}>Max's Collar</Text>
              <Text style={styles.dogDetails}>Golden Retriever • 3 years</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.statusIndicators}>
              <Ionicons 
                name={isConnected ? "wifi" : "wifi-outline"} 
                size={16} 
                color={isConnected ? "#10B981" : "#EF4444"} 
              />
              <Ionicons name="battery-half" size={16} color="#FFFFFF" />
              <Text style={styles.batteryText}>{Math.floor(batteryLevel)}%</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton 
          icon="grid-outline" 
          isActive={currentTab === 'dashboard'}
          onPress={() => setCurrentTab('dashboard')}
        />
        <TabButton 
          icon="heart-outline" 
          isActive={currentTab === 'health'}
          onPress={() => setCurrentTab('health')}
        />
        <TabButton 
          icon="location-outline" 
          isActive={currentTab === 'location'}
          onPress={() => setCurrentTab('location')}
        />
        <TabButton 
          icon="body-outline" 
          isActive={currentTab === 'behavior'}
          onPress={() => setCurrentTab('behavior')}
        />
        <TabButton 
          icon="chatbubble-outline" 
          isActive={currentTab === 'translator'}
          onPress={() => setCurrentTab('translator')}
        />
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </SafeAreaView>
  );
}

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
  // Enhanced styles for chain predictions
  predictionHeader: {
    marginBottom: 16,
  },
  predictionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  predictionDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontStyle: 'italic',
  },
  chainContainer: {
    marginTop: 8,
  },
  chainItem: {
    marginBottom: 12,
  },
  chainItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chainLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chainNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  chainNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  predictionEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  predictionInfo: {
    flex: 1,
  },
  predictionActivity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  predictionTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  predictionDepth: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  predictionRight: {
    alignItems: 'flex-end',
  },
  timeBadge: {
    marginBottom: 4,
    borderWidth: 1,
  },
  probabilityText: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chainConnector: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  chainLine: {
    width: 1,
    height: 8,
    backgroundColor: '#D1D5DB',
    marginBottom: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  noPredictionsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noPredictionsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '500',
  },
  noPredictionsSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
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