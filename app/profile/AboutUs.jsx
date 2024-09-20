import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/icons/profile/aboutus.png")}
        style={styles.image}
      />
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.description}>
        We are a company dedicated to providing exceptional services and
        products. Our mission is to make a positive impact in the world through
        our work. We strive to exceed customer expectations by delivering
        innovative solutions and maintaining the highest standards of quality.
        Our team of experts is passionate about what they do, and we believe in
        the power of collaboration and creativity to drive success. Join us on
        our journey as we continue to grow and make a meaningful difference.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7', // Light cream background to match the dashboard
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60, // Rounded image for a polished look
    borderWidth: 3,
    borderColor: '#00A8A6', // Vibrant teal border for consistency
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#003B5C', // Deep blue for the title
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333333', // Charcoal text color for better readability
    textAlign: 'center',
    lineHeight: 24, // Increased line height for better readability
    paddingHorizontal: 20, // Added padding to avoid text touching edges
  },
});

export default AboutUs;
