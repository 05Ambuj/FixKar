import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="SignUp"
        options={{
          headerShown: false, // Hide the header for the SignUp page
        }}
      />
      <Stack.Screen
        name="LogIn"
        options={{
          headerShown: false, // Hide the header for the LogIn page
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        options={{
          headerShown: false, // Hide the header for the OTP Verification page
        }}
      />
    </Stack>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});

// import { StyleSheet, Text, View } from 'react-native'
// import { Stack } from 'expo-router'
// import React from 'react'

// const AuthLayout = () => {
//   return (
//       <>
//           <Stack>
//               <Stack.Screen
//                   name="SignUp"
//                   options={{
//                     headerShown:false
//                   }}
//               />
//           </Stack>
//     </>
//   )
// }

// export default AuthLayout

// const styles = StyleSheet.create({})
