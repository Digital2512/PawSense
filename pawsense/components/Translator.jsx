import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../AppStyles";
import { Card, Badge } from "./components";

export default (translatorInput, setTranslatorInput, handleTranslate, translatorOutput, recentBarks) => (
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
