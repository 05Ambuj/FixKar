import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation functionality

const ContactUs = () => {
  const [message, setMessage] = useState('');
  const navigation = useNavigation(); // Access navigation prop

  const handleSend = () => {
    // Handle send message logic
    console.log('Message sent:', message);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Contact Us</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Your message"
          placeholderTextColor="#B0B0B0" // Light gray placeholder color
          multiline
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1, // Ensure scroll view grows to fill container
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold', // Using the bold font weight
    color: '#003B5C', // Deep blue color for text
  },
  textInput: {
    height: 200,
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF', // White background for input field
    marginBottom: 16,
    color: '#333333', // Darker text color for input
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00A8A6', // Vibrant teal for button
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold', // Using the bold font weight
    color: '#FFFFFF', // White color for button text
  },
});

export default ContactUs;
