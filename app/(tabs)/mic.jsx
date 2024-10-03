import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Audio } from "expo-av";
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';

const ChatTab = () => {
  const [recording, setRecording] = useState(false);
  const [animation] = useState(new Animated.Value(1)); // Scale animation
  const { t } = useTranslation();

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(true);
      console.log("Recording started...");

      // Start animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.1,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.in(Easing.exp),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate a recording duration
      setTimeout(async () => {
        await stopRecording(recording);
      }, 3000); // Stop after 3 seconds
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async (recording) => {
    setRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    // You can handle the recorded audio file here (e.g., upload it)
    Speech.speak("Voice message sent!"); // Example action on send
    animation.stop(); // Stop animation
  };

  return (
    <View style={styles.chatContainer}>
      <Text style={styles.chatTitle}>{t('chat.title')}</Text>
      <TouchableOpacity
        style={[styles.recordButton, recording && styles.recording]}
        onPress={recording ? null : startRecording} // Prevents starting a new recording if already recording
      >
        <Animated.View style={{ transform: [{ scale: animation }] }}>
          <Text style={styles.recordButtonText}>
            {recording ? "Recording..." : "Hold to Record"}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chatTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  recordButton: {
    padding: 20,
    backgroundColor: '#00A8A6',
    borderRadius: 50,
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#D9534F',
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ChatTab;
