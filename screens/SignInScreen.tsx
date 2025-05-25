import { View, Text, Pressable, StyleSheet } from 'react-native';
// import { Link } from 'expo-router'; // No longer needed for navigation here
import { useAuthStore } from '~/store/auth'; // Updated import
import * as React from 'react'; // Added import for React
import { Input } from '~/components/ui/input'; // Adjusted import path
import { Button } from '~/components/ui/button'; // Adjusted import path

export default function SignInScreen() {
  const { signIn } = useAuthStore(); // Updated to useAuthStore
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignIn = () => {
    // Here you would typically use the email and password
    // For now, we'll just log them and call the mock signIn
    console.log('Email:', email);
    console.log('Password:', password);
    signIn();
    // Navigation will be handled by the useEffect in _layout.tsx
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20, // Added padding for better spacing
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: { // Added styles for Input
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%', // Make input take full width
    backgroundColor: '#fff', // Added background color
    borderRadius: 5, // Added border radius
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%', // Make button take full width
    alignItems: 'center', // Center text in button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 