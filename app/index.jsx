import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Landing from './components/Landing/Landing'
import { Link,Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const App = () => {
  return (
    <Landing/>
    // <SafeAreaView className='flex-1 justify-center items-center bg-blue'>
    //   <Link href='/dashboard' className='color'  >Go to Dashboard</Link>
    // </SafeAreaView> 
  )
}

export default App

const styles = StyleSheet.create({})
