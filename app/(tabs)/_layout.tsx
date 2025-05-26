import { Tabs } from 'expo-router';
import React from 'react';
import { Home, List } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
    </Tabs>
  );
} 