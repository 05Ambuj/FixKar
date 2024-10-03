import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Landing from './components/Landing/Landing'
import { Link,Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import LanguageSelection from './components/LanguageSelection'; // Adjust path if needed

const App = () => {
  return (
    // <Landing/>
    // <LanguageSelection/>
    <SafeAreaView className='flex-1 justify-center items-center bg-blue'>
      <Link href='/dashboard' className='color'  >Go to Dashboard</Link>
    </SafeAreaView> 
  )
}

export default App

const styles = StyleSheet.create({})
