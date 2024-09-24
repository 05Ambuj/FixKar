import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation(); 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/icons/profile/aboutus.png")}
        style={styles.image}
      />
      <Text style={styles.title}>{t('profile.aboutUs')}</Text> 
      <Text style={styles.description}>
        {t('aboutUs.description')}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#00A8A6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#003B5C',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default AboutUs;
