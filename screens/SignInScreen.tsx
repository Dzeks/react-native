import { View } from 'react-native';
import { useAuthStore } from '~/store/auth';
import * as React from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { z } from 'zod';
import { Large } from '~/components/ui/typography';

const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function SignInScreen() {
    const { signIn } = useAuthStore(); // Updated to useAuthStore
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<{
        email?: string[];
        password?: string[];
    }>({});

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
    };

    return (
        <View className="flex-1 justify-center items-center p-6 flex-col">
            <Large>Sign In</Large>
            <View className="w-full pb-5">
                <Label nativeID="emailLabel">Email</Label>
                <Input
                    aria-labelledby="emailLabel"
                    placeholder="Email"
                    value={email}
                    onChangeText={text => {
                        setEmail(text);
                        if (errors.email) {
                            setErrors(prev => ({ ...prev, email: undefined }));
                        }
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {errors.email && (
                    <Text variant="destructive" className="text-sm mt-1">
                        {errors.email[0]}
                    </Text>
                )}
            </View>
            <View className="w-full pb-5">
                <Label nativeID="passwordLabel" className="mb-2">Password</Label>
                <Input
                    aria-labelledby="passwordLabel"
                    placeholder="Password"
                    value={password}
                    onChangeText={text => {
                        setPassword(text);
                        if (errors.password) {
                            setErrors(prev => ({
                                ...prev,
                                password: undefined,
                            }));
                        }
                    }}
                    secureTextEntry
                />
                {errors.password && (
                    <Text variant="destructive" className="text-sm mt-1">
                        {errors.password[0]}
                    </Text>
                )}
            </View>
            <Button className="w-full" onPress={handleSignIn}>
                <Text>Sign In</Text>
            </Button>
        </View>
    );
}