import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Button, FlatList, SafeAreaView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const paddingHorizontal = width * 0.05; // 5% of the screen width

const languages = [
  { code: 'en', name: 'English', symbol: 'EN' },
  { code: 'hi', name: 'हिन्दी', symbol: 'हिं' },
  { code: 'bn', name: 'বাংলা', symbol: 'বা' },
  { code: 'gu', name: 'ગુજરાતી', symbol: 'ગુ' },
  { code: 'ta', name: 'தமிழ்', symbol: 'த' },
  { code: 'te', name: 'తెలుగు', symbol: 'త' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', symbol: 'ਪਾ' },
  { code: 'bp', name: 'भोजपुरी', symbol: 'भ' },
  { code: 'kn', name: 'ಕನ್ನಡ', symbol: 'ಕ' },
  { code: 'ur', name: 'اردو', symbol: 'م' },
  { code: 'rj', name: 'राजस्थानी', symbol: 'रा' },
  { code: 'mr', name: 'मराठी', symbol: 'म' },
  { code: 'as', name: 'অসমীয়া', symbol: 'অ' },
  { code: 'od', name: 'ଓଡିଆ', symbol: 'ଓ' }, // Added Odia
];

const LanguageSelection = () => {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
  };

  const confirmLanguageChange = async () => {
    await AsyncStorage.setItem('user-language', selectedLanguage);
    setLanguage(selectedLanguage);
    router.replace('/components/Landing/Landing');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleLanguageChange(item.code)}
      style={[styles.card, selectedLanguage === item.code && styles.selectedCard]}
    >
      <Text style={styles.languageLetter}>{item.symbol}</Text>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Language</Text>
        <FlatList
          data={languages}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          numColumns={2}
          contentContainerStyle={styles.cardContainer}
          showsVerticalScrollIndicator={false}
        />
        {selectedLanguage && (
          <TouchableOpacity
            style={[styles.confirmButtonContainer, styles.confirmButton]}
            onPress={confirmLanguageChange}
          >
            <Text style={styles.confirmButtonText}>Confirm Language</Text>
          </TouchableOpacity>
        )}
        {!selectedLanguage && (
          <View style={styles.confirmButtonContainer}>
            <Button title="Select a Language" disabled />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 40, // Increased top margin for more space from the top
  },
  cardContainer: {
    paddingHorizontal,
  },
  card: {
    width: '45%',
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    borderColor: 'blue',
    borderWidth: 2,
    shadowOpacity: 0.5,
  },
  languageLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default LanguageSelection;
