import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native'; 

const ContactUs = () => {
  const { t } = useTranslation(); 
  const [message, setMessage] = useState('');
  const navigation = useNavigation(); 

  const handleSend = () => {
    console.log('Message sent:', message);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.contactUs')}</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={t('contactUs.placeholder')}
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>{t('contactUs.send')}</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#003B5C',
  },
  textInput: {
    height: 200,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    color: '#333333',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00A8A6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
});

export default ContactUs;
