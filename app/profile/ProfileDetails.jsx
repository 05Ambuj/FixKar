import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { getItem } from '../../utils/AsyncStorage';

const ProfileDetails = () => {
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
      const token = await getItem('token'); // Fetch token if required
      if (token) {
        // Optionally, you could fetch the profile data from the server using the token
        // const response = await axios.get('https://fixkar.onrender.com/getProfile', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setProfileData(response.data);
      }
      const savedProfile = await getItem('profile'); // Fetch profile data from AsyncStorage
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
            <Text style={styles.avatarText}>No Avatar</Text>
          </View>
        )}
        <Text style={styles.name}>{profileData.name || 'N/A'}</Text>
        {profileData.email ? <Text style={styles.email}>{profileData.email}</Text> : null}
        <Text style={styles.phone}>Phone: {profileData.phone || 'N/A'}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.addressTitle}>Address</Text>
        <Text style={styles.addressText}>Locality: {profileData.address.locality || 'N/A'}</Text>
        <Text style={styles.addressText}>City: {profileData.address.city || 'N/A'}</Text>
        <Text style={styles.addressText}>State: {profileData.address.state || 'N/A'}</Text>
        <Text style={styles.addressText}>Country: {profileData.address.country || 'N/A'}</Text>
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
