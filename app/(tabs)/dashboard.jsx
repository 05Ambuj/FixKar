/*
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Assigned');
  const [tabAnimation] = useState(new Animated.Value(0));

  const animateTabTransition = () => {
    Animated.timing(tabAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => tabAnimation.setValue(0));
  };

  React.useEffect(() => {
    animateTabTransition();
  }, [activeTab]);

  const tabAnimationStyle = {
    transform: [{
      translateX: tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width], // Adjust this for sliding effect
      }),
    }],
    opacity: tabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#F5A623" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-circle-outline" size={30} color="#F5A623" />
          </TouchableOpacity>
          <Link href="../profile/WorkReport" style={styles.iconButton}>
            <FontAwesome5 name="money-bill-wave" size={30} color="#F5A623" />
          </Link>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {['Assigned', 'Accepted', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={[styles.bodyContainer, tabAnimationStyle]}>
        <ScrollView contentContainerStyle={styles.bodyScrollView}>
          {activeTab === 'Assigned' && (
            <View style={[styles.body, styles.assignedBody]}>
              <Text style={styles.sectionHeader}>Assigned Tasks</Text>
              <Text style={styles.bodyText}>Here you will see the tasks that are assigned to you.</Text>
            </View>
          )}
          {activeTab === 'Accepted' && (
            <View style={[styles.body, styles.acceptedBody]}>
              <Text style={styles.sectionHeader}>Accepted Tasks</Text>
              <Text style={styles.bodyText}>Here you will see the tasks that you have accepted.</Text>
            </View>
          )}
          {activeTab === 'Completed' && (
            <View style={[styles.body, styles.completedBody]}>
              <Text style={styles.sectionHeader}>Completed Tasks</Text>
              <Text style={styles.bodyText}>Here you will see the tasks that you have completed.</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1F',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2C2C2E',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#3A3A3C',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4A4A4D',
    marginRight: 10,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2C2C2E',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4A4A4D',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    flexGrow: 1,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#3A3A3C',
    borderWidth: 1,
    borderColor: '#4A4A4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bodyScrollView: {
    paddingVertical: 10,
  },
  body: {
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#2C2C2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  assignedBody: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF5733',
  },
  acceptedBody: {
    borderLeftWidth: 5,
    borderLeftColor: '#50E3C2',
  },
  completedBody: {
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  bodyText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
});

*/








import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Assigned');
  const [tabAnimation] = useState(new Animated.Value(0));

  const animateTabTransition = () => {
    Animated.timing(tabAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => tabAnimation.setValue(0));
  };

  React.useEffect(() => {
    animateTabTransition();
  }, [activeTab]);

  const tabAnimationStyle = {
    transform: [{
      translateX: tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width],
      }),
    }],
    opacity: tabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
  };

  return (
    <View style={styles.container}>
      {/* Top Section with Search, Mic, and Rupee Icon */}
      <View style={styles.topSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#003B5C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-outline" size={24} color="#003B5C" />
          </TouchableOpacity>
          <Link href="../profile/WorkReport" style={styles.iconButton}>
            <FontAwesome name="rupee" size={24} color="#003B5C" />
          </Link>
        </View>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        {['Assigned', 'Accepted', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Rendering of Body Content Based on Active Tab */}
      <Animated.View style={[styles.bodyContainer, tabAnimationStyle]}>
        <ScrollView contentContainerStyle={styles.bodyScrollView}>
          {activeTab === 'Assigned' && (
            <View style={[styles.body, styles.assignedBody]}>
              <Text style={styles.sectionHeader}>Assigned Tasks</Text>
              <Text style={styles.bodyText}>Here you will see the tasks that are assigned to you.</Text>
            </View>
          )}
          {activeTab === 'Accepted' && (
            <View style={[styles.body, styles.acceptedBody]}>
              <Text style={styles.sectionHeader}>Accepted Tasks</Text>
              <Text style={styles.bodyText}>Here you will see the tasks that you have accepted.</Text>
            </View>
          )}
          {activeTab === 'Completed' && (
            <View style={[styles.body, styles.completedBody]}>
              <Text style={styles.sectionHeader}>Completed Tasks</Text>
              <Text style={styles.bodyText}>Here you will see the tasks that you have completed.</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF', // White background
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F0F0F0', // Soft gray
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Poppins-Regular',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    flexGrow: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor:'#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#00A8A6', // Vibrant teal for active tab
    borderColor: '#00A8A6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003B5C', // Deep blue for tab text
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bodyScrollView: {
    paddingVertical: 10,
  },
  body: {
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFFFFF', // White background for body
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assignedBody: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B6B', // Warm coral for assigned tasks
  },
  acceptedBody: {
    borderLeftWidth: 5,
    borderLeftColor: '#00A8A6', // Vibrant teal for accepted tasks
  },
  completedBody: {
    borderLeftWidth: 5,
    borderLeftColor: '#003B5C', // Deep blue for completed tasks
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003B5C', // Deep blue
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  bodyText: {
    fontSize: 16,
    color: '#333333', // Charcoal text color
    fontFamily: 'Poppins-Regular',
  },
});

export default Dashboard;
