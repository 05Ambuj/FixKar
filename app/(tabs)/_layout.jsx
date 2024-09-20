import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { StatusBar } from "expo-status-bar";

const TabIcon = ({ icon, color, name, focused }) => {
  const iconColor = focused ? "#00A8A6" : "#003B5C"; // Use teal for active and deep blue for inactive
  return (
    <View style={styles.tabIconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.tabIcon, { tintColor: iconColor }]}
      />
      <Text style={[styles.tabText, { color: iconColor }]}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#00A8A6", // Vibrant teal for active tab
            tabBarInactiveTintColor: "#003B5C", // Deep blue for inactive tab
            tabBarStyle: {
              backgroundColor: "#FAF8F7", // Light cream background
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0", // Soft gray border
              height: 84,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "dashboard",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.dashboard}
                  color={color}
                  name="DashBoard"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="services"
            options={{
              title: "services",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.service}
                  color={color}
                  name="Services"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: "chat",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.chat}
                  color={color}
                  name="Chat"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "profile",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.profile}
                  color={color}
                  name="Profile"
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
      <StatusBar backgroundColor="#FAF8F7" style="dark" />
    </SafeAreaProvider>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
  },
  tabIcon: {
    width: 24, // Adjusted to match the Dashboard icon sizes
    height: 24,
  },
  tabText: {
    fontSize: 12, // Adjusted font size for better consistency
    fontFamily: 'Poppins-SemiBold',
  },
});
