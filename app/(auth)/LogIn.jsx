import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { setItem } from '../../utils/AsyncStorage';
import { useTranslation } from 'react-i18next';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'login.phoneNumberError')
    .required('login.phoneNumberError'),
});

const { width } = Dimensions.get('window');

const LogIn = ({ navigation }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity is 0

  // Animation setup
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // 1 second
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubmit = async (values) => {
    setLoading(true); // Set loading to true when submitting
    values.phoneNumber = `+91${values.phoneNumber}`;
    console.log('values', values);
    const { phoneNumber } = values;
    try {
      // Sending phone number to check if the user exists
      const response = await axios.post('https://fixkar.onrender.com/sendOTPLogin', { phone: phoneNumber });
      console.log('response', response.data);
      if (response.data) {
        const newUser = {
          from: "login",
          phone: response.data.user.phone
        };
        await setItem('user', newUser);
        router.push({ pathname: "/OtpVerification" }); // Redirect to OTP Verification page
      } else {
        router.push({ pathname: "/userRegistered" }); // Redirect to User Registered page if not found
      }
    } catch (err) {
      console.log(err);
      setError(t('login.error'));
    } finally {
      setLoading(false); // Stop loading after response is received
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003B5C" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Formik
          initialValues={{ phoneNumber: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
          }}
        >
          {({ handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              {/* Phone Number Field with Label */}
              <Text style={styles.label}>{t('login.phoneNumberLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('login.phoneNumberPlaceholder')}
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0" // Light gray placeholder color
                onChangeText={(text) => {
                  // Allow only up to 10 digits
                  if (text.length <= 10) {
                    setFieldValue('phoneNumber', text);
                  }
                }}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
              />
              {/* Show error below the input */}
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={styles.errorText}>{t('login.phoneNumberError')}</Text>
              )}

              {/* Submit Button or Loading Spinner */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" /> // Show spinner if loading
                ) : (
                  <Text style={styles.buttonText}>{t('login.loginButton')}</Text>
                )}
              </TouchableOpacity>

              {/* Show API error */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Links for Sign Up */}
              <View style={styles.linkContainer}>
                <TouchableOpacity>
                  <Link href={'/SignUp'} style={styles.link}>{t('login.alreadyHaveAccount')}</Link>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1, // Ensure scroll view grows to fill container
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  formContainer: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF', // White background for form container
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B5C', // Deep blue color for text
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF', // White background for input field
    marginBottom: 10,
    color: '#333333', // Darker text color for input
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00A8A6', // Vibrant teal for button
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for button text
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#00A8A6', // Vibrant teal for link
    textDecorationLine: 'underline',
  },
});

export default LogIn;
