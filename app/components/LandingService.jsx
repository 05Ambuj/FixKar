import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

const categories = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Cleaning',
  // Add more categories as needed
];

const AddService = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]); // Default to the first category
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !description || !price || !category || !location) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://fixkar-services-api-1.onrender.com/api/services/createService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
          location,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Service added successfully');
        router.back(); // Navigate back to the previous screen
      } else {
        Alert.alert('Error', 'Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      Alert.alert('Error', 'An error occurred while adding the service');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPress = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        console.error('Nominatim API response:', data);
        Alert.alert('Error', 'Unable to get address from location');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'An error occurred while fetching the address');
    }
  };

  const handleSkip = () => {
    router.push('../(tabs)/dashboard');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Add New Service</Text>
        <TextInput
          style={styles.input}
          placeholder="Service Name"
          placeholderTextColor="#B0B0B0" // Light gray placeholder color
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#B0B0B0"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            placeholder="Location"
            placeholderTextColor="#B0B0B0"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.locationIcon} onPress={handleLocationPress}>
            <Ionicons name="location-outline" size={24} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add Service</Text>
          <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  scrollContainer: {
    flexGrow: 1, // Ensure scroll view grows to fill container
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003B5C', // Deep blue color for text
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // White background for input field
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333333', // Darker text color for input
    fontFamily: 'Poppins-Regular',
  },
  pickerContainer: {
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    color: '#333333',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#00A8A6', // Vibrant teal for button
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#00A8A6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  submitText: {
    fontSize: 16,
    marginRight: 10,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
  skipButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: '#00A8A6', // Match button color
    fontFamily: 'Poppins-Medium',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationInput: {
    flex: 1,
  },
  locationIcon: {
    marginLeft: 10,
  },
});

export default AddService;
