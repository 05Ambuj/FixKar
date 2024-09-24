import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { setItem } from '../../utils/AsyncStorage';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (notification) {
      setFadeInAnimation();

      const timer = setTimeout(() => {
        setFadeOutAnimation();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const setFadeInAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const setFadeOutAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setNotification(''));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(5, t('validation.nameMin')) // Translated warning
      .max(25, t('validation.nameMax')) // Translated warning
      .required(t('validation.nameRequired')), // Translated warning
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, t('validation.phoneNumberFormat')) // Translated warning
      .required(t('validation.phoneNumberRequired')), // Translated warning
  });

  const handleSubmit = async (values) => {
    values.phoneNumber = `+91${values.phoneNumber}`;
    try {
      const response = await axios.post('https://fixkar.onrender.com/sendOTP', {
        name: values.name,
        phone: values.phoneNumber,
      });

      if (response.data.message === 'This number is already registered with us') {
        setNotification(t('signUp.notificationAlreadyRegistered'));
      } else if (response.data.user) {
        const newUser = {
          from: 'signup',
          name: response.data.user.name,
          phone: response.data.user.phone,
        };
        await setItem('user', newUser);
        router.push('/OtpVerification');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error:', error.response.data);
        setError(error.response.data.message || t('signUp.errorGeneric'));
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError(t('signUp.errorNoResponse'));
      } else {
        console.error('Error setting up request:', error.message);
        setError(t('signUp.errorSetup'));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
        <Text style={styles.notificationText}>{notification}</Text>
      </Animated.View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>{t('signUp.title')}</Text>
            <Formik
              initialValues={{ name: '', phoneNumber: '' }}
              validationSchema={validationSchema} // Pass the validation schema
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
              }}
            >
              {({ handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                  <Text style={styles.label}>{t('signUp.nameLabel')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('signUp.namePlaceholder')}
                    placeholderTextColor="#B0B0B0"
                    onChangeText={(text) => setFieldValue('name', text)}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  <Text style={styles.label}>{t('signUp.phoneLabel')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('signUp.phonePlaceholder')}
                    placeholderTextColor="#B0B0B0"
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      if (text.length <= 10) {
                        setFieldValue('phoneNumber', text);
                      }
                    }}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}

                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>{t('signUp.submitButton')}</Text>
                  </TouchableOpacity>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <View style={styles.linkContainer}>
                    <Link href="/LogIn" style={styles.link}>{t('signUp.alreadyHaveAccount')}</Link>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF', // White background for form container
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003B5C', // Deep blue color for title
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003B5C', // Deep blue color for labels
    marginBottom: 5,
  },
  textInput: {
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF', // White background for input field
    marginBottom: 16,
    color: '#333333', // Darker text color for input
  },
  errorText: {
    color: '#FF6B6B', // Red color for error messages
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00A8A6', // Vibrant teal for button
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for button text
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: '#00A8A6', // Vibrant teal color for link
    textDecorationLine: 'underline',
  },
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B6B', // Red color for notification
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    zIndex: 1000, // Ensure it appears on top
  },
  notificationText: {
    color: '#FFFFFF', // White color for text
    fontWeight: 'bold',
  },
});
