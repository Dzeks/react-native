import '~/global.css';

import {
    DarkTheme,
    DefaultTheme,
    Theme,
    ThemeProvider,
} from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Appearance, Platform, View } from 'react-native';

import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuthStore } from '~/store/auth'; // Import the Zustand store

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

const usePlatformSpecificSetup = Platform.select({
    web: useSetWebBackgroundClassName,
    android: useSetAndroidNavigationBar,
    default: noop,
});

function RootLayoutNav() {
    usePlatformSpecificSetup();
    const { isDarkColorScheme } = useColorScheme();
    const { isAuthenticated } = useAuthStore(); // Use the Zustand store

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            <Stack>
                <Stack.Protected guard={!isAuthenticated}>
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                </Stack.Protected>
                <Stack.Protected guard={isAuthenticated}>
                    <Stack.Screen
                        name="(app)"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Protected>
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return <RootLayoutNav />; // Removed AuthProvider as Zustand handles global state
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined'
        ? React.useEffect
        : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
    useIsomorphicLayoutEffect(() => {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
    }, []);
}

function useSetAndroidNavigationBar() {
    React.useLayoutEffect(() => {
        setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
    }, []);
}

function noop() {}
