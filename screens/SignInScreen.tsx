import { View } from 'react-native'; // Removed StyleSheet, Text and Pressable
// import { Link } from 'expo-router'; // No longer needed for navigation here
import { useAuthStore } from '~/store/auth'; // Updated import
import * as React from 'react'; // Added import for React
import { Input } from '~/components/ui/input'; // Adjusted import path
import { Button } from '~/components/ui/button'; // Adjusted import path
import { Label } from '~/components/ui/label'; // Added for form labels
import { Text } from '~/components/ui/text'; // Import Text from new path
import { z } from 'zod'; // Import Zod

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignInScreen() {
    const { signIn } = useAuthStore(); // Updated to useAuthStore
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<{ email?: string[]; password?: string[] }>({});

    const handleSignIn = () => {
        setErrors({}); // Clear previous errors
        const result = signInSchema.safeParse({ email, password });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            console.log('Validation errors:', fieldErrors);
            return;
        }

        // Here you would typically use the email and password
        // For now, we'll just log them and call the mock signIn
        console.log('Email:', email);
        console.log('Password:', password);
        signIn();
        // Navigation will be handled by the useEffect in _layout.tsx
    };

    return (
        <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
            <Text>
                Sign In
            </Text>
            <View className="w-full mb-4">
                <Label
                    nativeID="emailLabel">
                    Email
                </Label>
                <Input
                    aria-labelledby="emailLabel"
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (errors.email) {
                            setErrors(prev => ({ ...prev, email: undefined }));
                        }
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {errors.email && <Text className="text-destructive text-sm mt-1">{errors.email[0]}</Text>}
            </View>
            <View className="w-full mb-6">
                <Label
                    nativeID="passwordLabel">
                    Password
                </Label>
                <Input
                    aria-labelledby="passwordLabel"
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) {
                            setErrors(prev => ({ ...prev, password: undefined }));
                        }
                    }}
                    secureTextEntry
                />
                {errors.password && <Text className="text-destructive text-sm mt-1">{errors.password[0]}</Text>}
            </View>
            <Button
                onPress={handleSignIn}>
                <Text>Sign In</Text>
            </Button>
        </View>
    );
}

// Removed StyleSheet.create as styles are now handled by NativeWind
