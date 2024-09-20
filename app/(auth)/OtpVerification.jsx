import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView } from 'react-native';
import axios from 'axios';
import { getItem, removeItem, setItem } from '../../utils/AsyncStorage';
import { useRouter } from 'expo-router';

const OtpVerification = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [resendEnabled, setResendEnabled] = useState(false);
    const inputs = useRef([]);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();

        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            } else {
                setResendEnabled(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        const checkUser = async () => {
            const user = await getItem('user');
            if (user && user.verified) {
                router.replace('/Dashboard');
            }
        };
        checkUser();
    }, []);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }

        setOtp(newOtp);
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0) {
            if (otp[index] === '') {
                inputs.current[index - 1].focus();
            }
        }
    };

    const verifyOtp = async () => {
        const fullOtp = otp.join('');
        console.log("fullOtp:", fullOtp);

        if (fullOtp.length === 6) {
            try {
                const user = await getItem('user');
                console.log("user:", user);

                let response = "";

                if (user?.from === "signup") {
                    response = await axios.post('https://fixkar.onrender.com/verifyOTP', { 
                        name: user.name,
                        phone: user.phone,
                        code: fullOtp 
                    });
                } else if (user?.from === "login") {
                    response = await axios.post('https://fixkar.onrender.com/verifyLogin', { 
                        phone: user.phone,
                        code: fullOtp 
                    });
                }

                if (response.data?.token) {
                    console.log('User verified. Navigating to Dashboard.');

                    await setItem('token', response.data.token);
                    const token =await getItem('token', response.data.token);
                    console.log("token",token);
                    
                    await removeItem('user');
                    
                    if (user?.from === "login") {
                        router.replace('../(tabs)/dashboard');
                    } else {
                        router.replace('../components/LandingService');
                    }
                } else {
                    setError('Incorrect OTP');
                }
            } catch (error) {
                setError('Verification failed. Please try again.');
                console.error('Verification error:', error);
            }
        } else {
            setError('Please enter a 6-digit OTP');
        }
    };

    const resendOtp = async () => {
        try {
            await axios.post('https://fixkar.onrender.com/resend');
            setTimer(60);
            setResendEnabled(false);
            setError('');
        } catch (error) {
            setError('Failed to resend OTP');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>Enter OTP</Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={el => (inputs.current[index] = el)}
                                value={digit}
                                onChangeText={text => handleChange(text, index)}
                                onKeyPress={e => handleKeyPress(e, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                style={styles.otpBox}
                            />
                        ))}
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={verifyOtp}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={resendEnabled ? resendOtp : null}
                        disabled={!resendEnabled}
                    >
                        <Text style={resendEnabled ? styles.resendEnabled : styles.resendDisabled}>
                            {`Resend OTP ${timer > 0 ? `in ${timer}s` : ''}`}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
      container: {
    flex: 1,
    backgroundColor: '#FAF8F7',
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#003B5C',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%', // Full width to contain inputs
    },
    otpBox: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        textAlign: 'center',
        fontSize: 24,
        borderRadius: 12,
        color: '#333333',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4, // Space between inputs
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#00A8A6',
        paddingVertical: 15,
        borderRadius: 12,
        paddingHorizontal:50,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
    },
    resendEnabled: {
        color: '#00A8A6',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    resendDisabled: {
        color: 'gray',
        textAlign: 'center',
    },
});

export default OtpVerification;
