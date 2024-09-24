import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { StatusBar } from "expo-status-bar";
import { useTranslation } from 'react-i18next';

const TabIcon = ({ icon, focused, name }) => {
  const iconColor = focused ? "#00A8A6" : "#003B5C"; // Teal for active, deep blue for inactive
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
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#00A8A6",
            tabBarInactiveTintColor: "#003B5C",
            tabBarStyle: {
              backgroundColor: "#FAF8F7",
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
              height: 84,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: t('tabs.tabBar.dashboard'), // Use translation
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.dashboard}
                  name={t('common.dashboard')} // Use translation
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="services"
            options={{
              title: t('tabs.tabBar.services'), // Use translation
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.service}
                  name={t('common.services')} // Use translation
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: t('tabs.tabBar.chat'), // Use translation
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.chat}
                  name={t('common.chat')} // Use translation
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: t('tabs.tabBar.profile'), // Use translation
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.profile}
                  name={t('common.profile')} // Use translation
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
    width: 24,
    height: 24,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
});
