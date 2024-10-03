// import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
// import React, { useState } from "react";
// import { Tabs } from "expo-router";
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { icons } from '../../constants';
// import { StatusBar } from "expo-status-bar";
// import { useTranslation } from 'react-i18next';
// import { Audio } from "expo-av"; // Import Audio for recording

// const TabIcon = ({ icon, focused, name, onPress }) => {
//   const iconColor = focused ? "#00A8A6" : "#003B5C"; // Teal for active, deep blue for inactive
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.tabIconContainer}>
//       <Image
//         source={icon}
//         resizeMode="contain"
//         style={[styles.tabIcon, { tintColor: iconColor }]}
//       />
//       <Text style={[styles.tabText, { color: iconColor }]}>
//         {name}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const TabsLayout = () => {
//   const { t } = useTranslation();
  
//   // State to manage recording
//   const [recording, setRecording] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard'); // Track the active tab

//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       );
//       setRecording(recording);
//       setIsListening(true); // Show overlay
//       console.log("Recording started...");
//     } catch (err) {
//       console.error("Failed to start recording", err);
//       Alert.alert("Error", "Failed to start recording. Please try again.");
//     }
//   };

//   const stopRecording = async () => {
//     if (!recording) return;

//     setIsListening(false); // Hide overlay
//     await recording.stopAndUnloadAsync();
//     setRecording(null); // Clear recording

//     const uri = recording.getURI();
//     console.log("Recording stopped and stored at", uri);
    
//     // Return to the last active tab
//     setActiveTab(activeTab);
//   };

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <Tabs
//           screenOptions={{
//             tabBarShowLabel: false,
//             tabBarActiveTintColor: "#00A8A6",
//             tabBarInactiveTintColor: "#003B5C",
//             tabBarStyle: {
//               backgroundColor: "#FAF8F7",
//               borderTopWidth: 1,
//               borderTopColor: "#E0E0E0",
//               height: 84,
//             },
//             headerShown: false,
//           }}
//         >
//           <Tabs.Screen
//             name="dashboard"
//             options={{
//               title: t('tabs.tabBar.dashboard'), // Use translation
//               tabBarIcon: ({ focused }) => (
//                 <TabIcon
//                   icon={icons.dashboard}
//                   name={t('common.dashboard')} // Use translation
//                   focused={focused}
//                   onPress={() => {
//                     setActiveTab('dashboard');
//                   }}
//                 />
//               ),
//             }}
//           />
//           <Tabs.Screen
//             name="services"
//             options={{
//               title: t('tabs.tabBar.services'), // Use translation
//               tabBarIcon: ({ focused }) => (
//                 <TabIcon
//                   icon={icons.service}
//                   name={t('common.services')} // Use translation
//                   focused={focused}
//                   onPress={() => {
//                     setActiveTab('services');
//                   }}
//                 />
//               ),
//             }}
//           />
//           <Tabs.Screen
//             name="chat"
//             options={{
//               title: t('tabs.tabBar.chat'), // Use translation
//               tabBarIcon: ({ focused }) => (
//                 <TabIcon
//                   icon={icons.chat}
//                   name={t('common.chat')} // Use translation
//                   focused={focused}
//                   onPress={() => {
//                     setActiveTab('chat');
//                   }}
//                 />
//               ),
//             }}
//           />
//           <Tabs.Screen
//             name="profile"
//             options={{
//               title: t('tabs.tabBar.profile'), // Use translation
//               tabBarIcon: ({ focused }) => (
//                 <TabIcon
//                   icon={icons.profile}
//                   name={t('common.profile')} // Use translation
//                   focused={focused}
//                   onPress={() => {
//                     setActiveTab('profile');
//                   }}
//                 />
//               ),
//             }}
//           />
//           <Tabs.Screen
//             name="mic"
//             options={{
//               title: t('tabs.tabBar.mic'), // Static title for mic tab
//               tabBarIcon: ({ focused }) => (
//                 <TabIcon
//                   icon={icons.mic}
//                   name="Mic" // Static name for Mic
//                   focused={focused}
//                   onPress={isListening ? stopRecording : startRecording} // Start/stop recording
//                 />
//               ),
//             }}
//           />
//         </Tabs>
//       </SafeAreaView>
//       <StatusBar backgroundColor="#FAF8F7" style="dark" />

//       {/* Overlay Modal */}
//       <Modal
//         transparent={true}
//         visible={isListening}
//         animationType="slide"
//       >
//         <View style={styles.overlay}>
//           <Text style={styles.overlayText}>Listening...</Text>
//           <ActivityIndicator size="large" color="#00A8A6" />
//           <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
//             <Text style={styles.stopButtonText}>Stop Recording</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </SafeAreaProvider>
//   );
// };

// export default TabsLayout;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   tabIconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 1.5,
//   },
//   tabIcon: {
//     width: 24,
//     height: 24,
//   },
//   tabText: {
//     fontSize: 12,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
//   },
//   overlayText: {
//     color: 'white',
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   stopButton: {
//     backgroundColor: '#00A8A6',
//     padding: 10,
//     borderRadius: 5,
//   },
//   stopButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import { Tabs, useRouter } from "expo-router"; 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { StatusBar } from "expo-status-bar";
import { useTranslation } from 'react-i18next';
import { Audio } from "expo-av"; 
import axios from 'axios'; 

const TabIcon = ({ icon, focused, name, onPress }) => {
  const iconColor = focused ? "#00A8A6" : "#003B5C";
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabIconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.tabIcon, { tintColor: iconColor }]}
      />
      <Text style={[styles.tabText, { color: iconColor }]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const TabsLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();  
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const backendUrl = "http://192.168.29.161:5000/upload"; 

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
      setRecording(recording);
      setIsListening(true); 
      console.log("Recording started...");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsListening(false); 
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    setLoading(true);
    uploadAudioForConversion(uri);
    setRecording(null); 
  };

  const uploadAudioForConversion = async (uri) => {
    try {
      const file = {
        uri: uri,
        type: "audio/m4a",
        name: "recording.m4a",
      };

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post(backendUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, 
      });

      const transcriptId = uploadResponse.data.transcript_id; 
      console.log("Transcript ID:", transcriptId);

      pollTranscript(transcriptId);
    } catch (error) {
      console.error("Error uploading audio for conversion:", error.response?.data || error);
      setLoading(false);
      Alert.alert("Error", "Failed to upload and convert audio. Please try again.");
    }
  };

  const pollTranscript = async (transcriptId) => {
    try {
      const interval = setInterval(async () => {
        console.log(`Checking status for transcript ID: ${transcriptId}`);

        const transcriptResult = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: "25e132d4976a476da12b619244155f22", 
            },
          }
        );

        const { status, text, error } = transcriptResult.data;
        console.log(`Transcription Status: ${status}`);

        if (status === "completed") {
          clearInterval(interval);
          setTranscript(text); 
          setLoading(false); 
          console.log("Transcription completed:", text);

          // Navigation based on the spoken text
          if (text.toLowerCase().includes("dashboard")) {
            router.push("/(tabs)/dashboard");
          }
          else if (text.toLowerCase().includes("chat")) {
            router.push("/(tabs)/chat");
          }
          else if (text.toLowerCase().includes("profile")) {
            router.push("/(tabs)/profile");
          }
          else if (text.toLowerCase().includes("services")) {
            router.push("/(tabs)/services");
          }
        } else if (status === "error") {
          clearInterval(interval);
          setLoading(false);
          console.error("Transcription failed:", error);
          Alert.alert("Error", `Transcription failed: ${error}`);
        }
      }, 5000); 
    } catch (error) {
      console.error("Error polling transcript:", error.response?.data || error);
      setLoading(false);
      Alert.alert("Error", "Failed to retrieve transcription status.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#00A8A6",
            tabBarInactiveTintColor: "#003B5C",
            tabBarStyle: {
              backgroundColor: "#FAF8F7",
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
              height: 84,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: t('tabs.tabBar.dashboard'),
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.dashboard}
                  name={t('common.dashboard')}
                  focused={focused}
                  onPress={() => {
                    router.push("/dashboard");
                  }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="services"
            options={{
              title: t('tabs.tabBar.services'),
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.service}
                  name={t('common.services')}
                  focused={focused}
                  onPress={() => {
                    router.push("/services");
                  }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: t('tabs.tabBar.chat'),
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.chat}
                  name={t('common.chat')}
                  focused={focused}
                  onPress={() => {
                    router.push("/chat");
                  }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: t('tabs.tabBar.profile'),
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.profile}
                  name={t('common.profile')}
                  focused={focused}
                  onPress={() => {
                    router.push("/profile");
                  }}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="mic"
            options={{
              title: t('tabs.tabBar.mic'),
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.mic}
                  name="Mic"
                  focused={focused}
                  onPress={isListening ? stopRecording : startRecording}
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
      <StatusBar backgroundColor="#FAF8F7" style="dark" />

      {/* Overlay Modal */}
      <Modal
        transparent={true}
        visible={isListening}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Listening...</Text>
          <ActivityIndicator size="large" color="#00A8A6" />
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Text style={styles.stopButtonText}>Stop Recording</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#00A8A6',
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
