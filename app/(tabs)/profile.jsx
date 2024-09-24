import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://fixkar.onrender.com/getProfile');
        setUserName(response.data.name || 'Nishant'); // Fallback name if API fails
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icons/profile/user.png')} style={styles.userImage} />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/MyProfile')}
          >
            <Image source={require('../../assets/icons/profile/group.png')} style={styles.icon} />
            <Text style={styles.menuText}>{t('profile.title')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/WorkReport')}
          >
            <Image source={require('../../assets/icons/profile/workreport1.png')} style={styles.icon} />
            <Text style={styles.menuText}>{t('profile.workReport')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/AboutUs')}
          >
            <Image source={require('../../assets/icons/profile/aboutus.png')} style={styles.icon} />
            <Text style={styles.menuText}>{t('profile.aboutUs')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/ContactUs')}
          >
            <Image source={require('../../assets/icons/profile/contactus.png')} style={styles.icon} />
            <Text style={styles.menuText}>{t('profile.contactUs')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/(auth)/LogIn')}
      >
        <Text style={styles.logoutText}>{t('common.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003B5C',
    fontFamily: 'Poppins-Bold',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuItem: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003B5C',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FFA01E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
});

export default Profile;
