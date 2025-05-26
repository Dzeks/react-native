import * as React from 'react';
import { View } from 'react-native';

import { ThemeToggle } from '~/components/ThemeToggle';

export default function ProfileScreen() {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <View className="w-12 h-12">
        <ThemeToggle />
      </View>
    </View>
  );
} 