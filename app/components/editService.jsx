import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Assuming you want to use this for category selection
import * as Location from 'expo-location';

const categories = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Cleaning',
  // Add more categories as needed
];

const EditService = () => {
  const router = useRouter();
  const { service } = useLocalSearchParams(); // Get the selected service from params

  const [name, setName] = useState(service?.name || '');
  const [description, setDescription] = useState(service?.description || '');
  const [price, setPrice] = useState(service?.price || '');
  const [category, setCategory] = useState(service?.category || categories[0]); // Default to service category or first category
  const [location, setLocation] = useState(service?.location || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateService = async () => {
    if (!name || !description || !price || !category || !location) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      await fetch(`https://fixkar-services-api-1.onrender.com/api/services/updateService/${service._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, price, category, location }),
      });
      router.back(); // Navigate back to the services list
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Error', 'An error occurred while updating the service');
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

      // Construct the URL for Nominatim API
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Edit Service</Text>
      <TextInput
        style={styles.input}
        placeholder="Service Name"
        placeholderTextColor="#B0B0B0"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#B0B0B0"
        value={description}
        onChangeText={setDescription}
        multiline
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
      <TouchableOpacity style={styles.submitButton} onPress={handleUpdateService}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003B5C', // Deep blue color for header text
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF', // White background for input
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333333', // Darker text color
    fontFamily: 'Poppins-Regular',
  },
  pickerContainer: {
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF', // White background for picker container
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    color: '#333333', // Darker text color for picker
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
    color: '#FFFFFF', // White color for button text
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

export default EditService;
