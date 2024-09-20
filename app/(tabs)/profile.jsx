import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter(); // Use the router hook for navigation
  const [userName, setUserName] = useState(''); // State to store the username

  useEffect(() => {
    // Fetch the user profile from the API
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://fixkar.onrender.com/getProfile');
        setUserName(response.data.name); // Assuming the response has a 'name' field
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
        <Text style={styles.userName}>{userName || 'Nishant'}</Text>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/MyProfile')} // Navigate to ProfileDetails screen
          >
            <Image source={require('../../assets/icons/profile/group.png')} style={styles.icon} />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/WorkReport')} // Navigate to WorkReport screen
          >
            <Image source={require('../../assets/icons/profile/workreport1.png')} style={styles.icon} />
            <Text style={styles.menuText}>Work Report</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/AboutUs')} // Navigate to AboutUs screen
          >
            <Image source={require('../../assets/icons/profile/aboutus.png')} style={styles.icon} />
            <Text style={styles.menuText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/ContactUs')} // Navigate to ContactUs screen
          >
            <Image source={require('../../assets/icons/profile/contactus.png')} style={styles.icon} />
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          console.log('Navigating to: /(auth)/Login');
          router.replace('/(auth)/LogIn')
        }} // Corrected path to the Login screen
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7', // Light cream background to match dashboard
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8, // Reduce the margin to bring the menu closer to the avatar
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8, // Reduce the margin to bring the user name closer to the image
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003B5C', // Deep blue to match dashboard
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
    width: (width - 48) / 2, // Adjusted for padding and spacing
    backgroundColor: '#FFFFFF', // White background to match dashboard
    borderRadius: 12,
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    borderColor: '#E0E0E0', // Soft gray border to match dashboard
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
    color: '#003B5C', // Deep blue to match dashboard
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FFA01E', // Vibrant teal for logout button
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for logout button
    fontFamily: 'Poppins-Bold',
  },
});

export default Profile;
