import { ScrollView, Text, View } from "react-native";
import { Card, Badge } from "./components";
import styles from "../AppStyles";

export default (getBehaviorEmoji, currentBehavior, currentEmotion, predictions) => (
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
