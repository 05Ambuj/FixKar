import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next'; // Import useTranslation for localization
import { getItem } from '../../utils/AsyncStorage';

const ProfileDetails = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      locality: '',
      city: '',
      state: '',
      country: '',
    },
    profileAvatar: null,
  });

  const fetchProfileData = async () => {
    try {
      const token = await getItem('token');
      if (token) {
        // Fetch profile data logic
      }
      const savedProfile = await getItem('profile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        {profileData.profileAvatar ? (
          <Image source={{ uri: profileData.profileAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{t('myProfile.noAvatar')}</Text>
          </View>
        )}
        <Text style={styles.name}>{profileData.name || t('myProfile.noName')}</Text>
        {profileData.email ? <Text style={styles.email}>{profileData.email}</Text> : null}
        <Text style={styles.phone}>{t('myProfile.phone')}: {profileData.phone || t('myProfile.noPhone')}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.addressTitle}>{t('myProfile.address')}</Text>
        <Text style={styles.addressText}>{t('myProfile.locality')}: {profileData.address.locality || t('myProfile.notAvailable')}</Text>
        <Text style={styles.addressText}>{t('myProfile.city')}: {profileData.address.city || t('myProfile.notAvailable')}</Text>
        <Text style={styles.addressText}>{t('myProfile.state')}: {profileData.address.state || t('myProfile.notAvailable')}</Text>
        <Text style={styles.addressText}>{t('myProfile.country')}: {profileData.address.country || t('myProfile.notAvailable')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FAF8F7',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#B0B0B0',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: '#555555',
  },
  addressSection: {
    paddingHorizontal: 16,
  },
  addressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
});

export default ProfileDetails;
