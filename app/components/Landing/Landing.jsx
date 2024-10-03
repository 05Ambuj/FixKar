// import { useRef, useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import {
//   Text,
//   View,
//   StyleSheet,
//   useWindowDimensions,
//   PixelRatio,
//   SafeAreaView,
// } from "react-native";
// import data from "../../../assets/data/data";
// import { router,Redirect } from "expo-router";
// import RenderItem from "./RenderItem";
// import CustomButton from "./CustomButton";
// import { useSharedValue, withTiming } from "react-native-reanimated";
// import Pagination from "./Pagination";
// import {
//   Canvas,
//   Circle,
//   Group,
//   SkImage,
//   makeImageFromView,
//     Mask,
//   Image
// } from "@shopify/react-native-skia";


// export default Landing = () => {
//   const pd = PixelRatio.get();
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [Active, setActive] = useState(false);
//   const [overlay, setOverlay] = useState(null);

//   const ref = useRef(null);
//   const buttonVal = useSharedValue(0);

//   const mask = useSharedValue(0);
//   const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handlerPress = async () => {
//     if (currentIndex === data.length - 1 && !Active) {
//       router.replace('/SignUp')
//     }
//     if (!Active) {
//       setActive(true);
//       const snapshot = await makeImageFromView(ref);
//       setOverlay(snapshot);
//       await wait(60);
//       setCurrentIndex((prev) => prev + 1);
//       mask.value = withTiming(SCREEN_HEIGHT, { duration: 1000 });
//       buttonVal.value = withTiming(buttonVal.value + SCREEN_HEIGHT);
//       await wait(1000);
//       setOverlay(null);
//       mask.value = 0;
//       setActive(false);
//     }
//   };
//   return (
//     <SafeAreaView style={[styles.container]}>
//       <View ref={ref} collapsable={false}>
//         {data.map((item, index) => {
//           return (
//             currentIndex === index && <RenderItem item={item} key={index} />
//           );
//         })}
//       </View>
//       {overlay && (
//         <Canvas style={StyleSheet.absoluteFillObject} pointerEvents="none">
//           <Mask
//             mode="luminance"
//             mask={
//               <Group>
//                 <Circle
//                   cx={SCREEN_WIDTH / 2}
//                   cy={SCREEN_HEIGHT - 160}
//                   r={SCREEN_HEIGHT}
//                   color="white"
//                 />
//                 <Circle
//                   cx={SCREEN_WIDTH / 2}
//                   cy={SCREEN_HEIGHT - 160}
//                   r={mask}
//                   color="black"
//                 />
//               </Group>
//             }
//           >
//             <Image
//               image={overlay}
//               x={0}
//               y={0}
//               width={overlay.width() / pd}
//               height={overlay.height() / pd}
//             />
//           </Mask>
//         </Canvas>
//       )}

//       <CustomButton handlerPress={handlerPress} buttonVal={buttonVal} />
//       <Pagination data={data} buttonVal={buttonVal} />
//       </SafeAreaView>
      
//   )
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//   },
// });

import React, { useState } from "react";
import { Text, View, Button, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { useRouter } from "expo-router";

export default Landing = () => {
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://192.168.29.161:5000/upload";  // Your backend URL for converting and uploading MP3 files
  const router = useRouter();
  const startRecording = async () => {
    try {
      // Request audio permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started...");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    // Get the URI of the recorded file
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    // Upload the audio file to your backend for conversion and further processing
    setLoading(true);
    uploadAudioForConversion(uri);
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
        timeout: 10000, // Set timeout to 10 seconds (10000 milliseconds)
      });

      const transcriptId = uploadResponse.data.transcript_id; // Get the transcript ID
      console.log("Transcript ID:", transcriptId);

      // Proceed with polling for transcription results
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
              authorization: "25e132d4976a476da12b619244155f22", // Replace with your AssemblyAI API key
            },
          }
        );

        const { status, text, error } = transcriptResult.data;
        console.log(`Transcription Status: ${status}`);

        if (status === "completed") {
          clearInterval(interval);
          setTranscript(text); // Set the final transcript
          setLoading(false); // Stop the loader
          console.log("Transcription completed:", text);
          if (text.toLowerCase().includes("login")) {
            router.push("/(auth)/LogIn");
        }
          // Log the final text
        } else if (status === "error") {
          clearInterval(interval);
          setLoading(false);
          console.error("Transcription failed:", error);
          Alert.alert("Error", `Transcription failed: ${error}`);
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error("Error polling transcript:", error.response?.data || error);
      setLoading(false);
      Alert.alert("Error", "Failed to retrieve transcription status.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Speech to Text</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>{transcript ? `Transcript: ${transcript}` : "Press Record to Start"}</Text>
      )}
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
        disabled={loading} // Disable the button while loading
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
