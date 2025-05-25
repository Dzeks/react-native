import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useAuthStore } from '~/store/auth';

export default function AppLayout() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Starter Base',
                    headerRight: () => <ThemeToggle />,
                    headerShown: true,
                }}
            />
            {/* Add other screens within the (app) group here */}
            {/* e.g. <Stack.Screen name="profile" options={{ title: 'Profile' }} /> */}
        </Stack>
    );
} 