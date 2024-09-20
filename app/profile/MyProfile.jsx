import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { getItem } from '../../utils/AsyncStorage';

const MyProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    locality: '',
    city: '',
    state: '',
    country: ''
  });
  const [profileAvatar, setProfileAvatar] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileAvatar(result.assets[0].uri);
    }
  };

 // Assuming correct path

const handleSave = async () => {
  try {
    const token = await getItem('userToken'); // Fetch the token using your custom utility

    if (!token) {
      Alert.alert('Error', 'User token not found.');
      return;
    }

    const profileData = {
      name,
      email,
      phone: phoneNumber,
      address,
      profilePhoto: profileAvatar, // Modify as per backend requirements
    };

    const response = await axios.put('https://fixkar.onrender.com/updateProfile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      Alert.alert('Success', 'Profile updated successfully.');
    } else {
      Alert.alert('Error', 'Failed to update profile.');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    Alert.alert('Error', 'An error occurred while updating the profile.');
  }
};


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage}>
            {profileAvatar ? (
              <Image source={{ uri: profileAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>Pick Avatar</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Name"
          placeholderTextColor="#B0B0B0"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email (optional)"
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Phone Number"
          placeholderTextColor="#B0B0B0"
          value={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Locality"
          placeholderTextColor="#B0B0B0"
          value={address.locality}
          onChangeText={(text) => setAddress({ ...address, locality: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="City"
          placeholderTextColor="#B0B0B0"
          value={address.city}
          onChangeText={(text) => setAddress({ ...address, city: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="State"
          placeholderTextColor="#B0B0B0"
          value={address.state}
          onChangeText={(text) => setAddress({ ...address, state: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Country"
          placeholderTextColor="#B0B0B0"
          value={address.country}
          onChangeText={(text) => setAddress({ ...address, country: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7',
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#B0B0B0',
  },
  textInput: {
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  button: {
    backgroundColor: '#00A8A6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});

export default MyProfile;
