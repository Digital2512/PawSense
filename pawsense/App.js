// App.js
import React, { useState, useEffect, use } from 'react';
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
import styles from './AppStyles';

const { width } = Dimensions.get('window');

// Mock data generators
const generateHealthData = () => ({
  heartRate: Math.floor(Math.random() * 40) + 80, // 80-120 BPM for dogs
  temperature: (Math.random() * 2 + 101).toFixed(1), // 101-103°F normal for dogs
  activity: 82,
  steps: Math.floor(Math.random() * 5000) + 8000,
  calories: Math.floor(Math.random() * 200) + 300
});

const behaviors = ['Walking', 'Running', 'Sleeping', 'Playing', 'Eating', 'Sitting'];
const emotions = ['Happy', 'Excited', 'Calm', 'Anxious', 'Playful', 'Tired'];
const locations = [
  { name: 'Home', lat: 40.7128, lng: -74.0060, mins: 11 },
  { name: 'Dog Park', lat: 40.7589, lng: -73.9851, mins: 30 },
  { name: 'Vet Clinic', lat: 40.7505, lng: -73.9934, mins: 54 }
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
    { time: '5 min ago', translation: 'I want to go outside!', confidence: 92 },
    { time: '12 min ago', translation: 'Someone is at the door', confidence: 88 },
    { time: '15 min ago', translation: 'I am happy to see you!', confidence: 95 }
  ]);
  const [predictions, setPredictions] = useState([]);
  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(generateHealthData());
      setCurrentBehavior(behaviors[Math.floor(Math.random() * behaviors.length)]);
      setCurrentLocation(locations[Math.floor(Math.random() * locations.length)]);
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 

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
      'Feeding': '🍽️',
      'Sitting': '🐕'
    };
    return emojiMap[behavior] || '🐕';
  };

  useEffect(() => {
    async function fetchEmotion() {
      try {
        const response = await fetch('http://127.0.1:5000//data', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCurrentEmotion(data.predicted_emotion);
        setClientData(data.clientData);
        setRecentBarks(prevBarks => [
          { 
            time:"2 mins ago", 
            translation: data.bark_translation, 
            confidence: Math.floor(Math.random() * 100) + 1 
          },
          ...prevBarks.slice(0, 2) // Keep only the last 3 barks
        ]);
        
      } catch (error) {
        console.error('Error fetching emotion:', error);
      }
    }
    fetchEmotion();
  }, []);
  
  useEffect(() => {
    async function fetchPrediction() {
      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const formattedPredictions = data.predictionList.map(item => {
          const now = new Date();
          const [h, m, s] = item.average_start_time.split(':').map(Number);
          let predictedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);

          if (predictedDate < now) {
            predictedDate.setDate(predictedDate.getDate() + 1);
          }

          const diffMinutes = Math.round((predictedDate - now) / 60000);

          return {
            label: item.activity,
            time: item.average_start_time,
            timeInfo: `in ${diffMinutes} minutes`
          };
        });

        setPredictions(formattedPredictions);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      }
    }
    
    fetchPrediction();
  }, []);

  

  // console.log('Predictions: ', predictions)
  // console.log('Predictions: ', clientData)

  const renderDashboard = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.statusCard}>
        <Text style={styles.cardTitle}>Current Status</Text>
        <View style={styles.statusGrid}>
          <View style={[styles.statusItem, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statusValue, { color: '#2563EB' }]}>{clientData.heart_rate}</Text>
            <Text style={[styles.statusLabel, { color: '#2563EB' }]}>BPM</Text>
          </View>
          <View style={[styles.statusItem, { backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.statusValue, { color: '#16A34A' }]}>{clientData.temperature}°C</Text>
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
            <Text style={styles.locationName}>Home</Text>
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
            <Text style={[styles.vitalSignValue, { color: '#EF4444' }]}>{clientData.heart_rate}</Text>
            <Text style={[styles.vitalSignUnit, { color: '#EF4444' }]}>BPM (Normal)</Text>
          </View>
          <View style={[styles.vitalSignCard, { backgroundColor: '#FFF7ED' }]}>
            <View style={styles.vitalSignHeader}>
              <Ionicons name="thermometer" size={16} color="#F97316" />
              <Text style={styles.vitalSignLabel}>Temperature</Text>
            </View>
            <Text style={[styles.vitalSignValue, { color: '#F97316' }]}>{clientData.temperature}°C</Text>
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
          <Text style={styles.mapLocationName}>Home</Text>
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
              text={`${location.mins} min`}
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
          <Text style={styles.behaviorEmoji}>{getBehaviorEmoji(clientData.activity)}</Text>
          <Text style={styles.behaviorName}>{clientData.activity}</Text>
          <Text style={styles.behaviorConfidence}>Confidence: 94%</Text>
          <Badge 
            text={currentEmotion}
            style={[styles.currentEmotionBadge, { backgroundColor: '#F3E8FF' }]}
            textStyle={{ color: '#7C3AED' }}
          />
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Activity Predictions
        </Text>
        {predictions.length > 0 ? (
          [...predictions]  // create a shallow copy to avoid mutating state directly
            .sort((a, b) => {
              // extract minutes from timeInfo like "in 123 minutes"
              const aMinutes = parseInt(a.timeInfo.match(/in (\d+) minutes/)[1], 10);
              const bMinutes = parseInt(b.timeInfo.match(/in (\d+) minutes/)[1], 10);
              return aMinutes - bMinutes;
            })
            .map((pred, idx) => {
              const [hour, minute] = pred.time.split(':');

              const minutesMatch = pred.timeInfo.match(/in (\d+) minutes/);
              let timeInfoFormatted = pred.timeInfo;
              if (minutesMatch) {
                const totalMinutes = parseInt(minutesMatch[1], 10);
                if (totalMinutes >= 60) {
                  const hrs = Math.floor(totalMinutes / 60);
                  const mins = totalMinutes % 60;
                  timeInfoFormatted = `in ${hrs} hour${hrs > 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
                }
              }

              return (
                <View
                  key={idx}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                >
                  <Text style={{ flex: 1, fontWeight: '600' }}>{pred.label}</Text>
                  <Badge text={`${hour}:${minute} (${timeInfoFormatted})`} />
                </View>
              );
            })
        ) : (
          <Text>Loading predictions...</Text>
        )}
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