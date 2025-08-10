import { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './AppStyles.js';
import { TabButton } from './components/components.jsx';
import Dashboard from "./components/Dashboard.jsx";
import Health from "./components/Health.jsx";
import Location from "./components/Location.jsx";
import Behavior from "./components/Behavior.jsx";
import Translator from "./components/Translator.jsx";

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
  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(generateHealthData());
      setCurrentBehavior(behaviors[Math.floor(Math.random() * behaviors.length)]);
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
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
      'Eating': '🍽️',
      'Sitting': '🐕'
    };
    return emojiMap[behavior] || '🐕';
  };


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

  useEffect(() => {
    async function fetchClientData() {
      try {
        const response = await fetch('http://127.0.0.1:5000/data', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setClientData(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    }

    fetchClientData();
  }, []);

  // console.log('Predictions: ', predictions)
  // console.log('Predictions: ', clientData)

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

      {(() => {
        const DashboardBound = Dashboard.bind(this, healthData, clientData, currentEmotion)
        switch (currentTab) {
          case 'dashboard':
            return DashboardBound();
          case 'health':
            return Health(clientData);
          case 'location':
            return Location(clientData, locations);
          case 'behavior':
            return Behavior(getBehaviorEmoji, currentBehavior, currentEmotion, predictions);
          case 'translator':
            return Translator(translatorInput, setTranslatorInput, handleTranslate, translatorOutput, recentBarks);
          default:
            return DashboardBound();
        }
      })()}
    </SafeAreaView>
  );
}
