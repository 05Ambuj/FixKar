import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import { getItem } from '../../utils/AsyncStorage';

const MyProfile = () => {
  const { t } = useTranslation(); // Initialize the translation hook
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

  const handleSave = async () => {
    try {
      const token = await getItem('userToken');
      if (!token) {
        Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorToken'));
        return;
      }

      const profileData = {
        name,
        email,
        phone: phoneNumber,
        address,
        profilePhoto: profileAvatar,
      };

      const response = await axios.put('https://fixkar.onrender.com/updateProfile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Alert.alert(t('myProfile.successTitle'), t('myProfile.successMessage'));
      } else {
        Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorUpdate'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorUpdate'));
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
                <Text style={styles.avatarText}>{t('myProfile.pickAvatar')}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.namePlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.emailPlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.phonePlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.localityPlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={address.locality}
          onChangeText={(text) => setAddress({ ...address, locality: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.cityPlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={address.city}
          onChangeText={(text) => setAddress({ ...address, city: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.statePlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={address.state}
          onChangeText={(text) => setAddress({ ...address, state: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.countryPlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={address.country}
          onChangeText={(text) => setAddress({ ...address, country: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{t('myProfile.saveProfile')}</Text>
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
