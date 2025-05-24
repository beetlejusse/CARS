import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {

  return (
    <>
    <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          // tabBarIcon: ({ focused }) => (
          //   <TabIcon source={icons.home} focused={focused} />
          // ),
        }}
      />
    </>
  );
}
