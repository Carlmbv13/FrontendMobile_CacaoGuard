// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/api';
import colors from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ username, password });
      const { access, refresh } = response.data;
      
      // Check if user is verified
      // Assuming your backend returns is_verified in the response
      if (response.data.user && !response.data.user.is_verified) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email address before logging in. Check your inbox for the verification code.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Register') },
            {
              text: 'Resend Code',
              onPress: () => navigation.navigate('EmailVerification', {
                email: response.data.user.email || username,
                username: username,
                password: password,
              })
            }
          ]
        );
        setLoading(false);
        return;
      }
      
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('username', username);
      
      navigation.replace('Main');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid credentials or email not verified';
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>CacaoGuard</Text>
        <Text style={styles.subtitle}>Farm Disease Monitor</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  logo: { fontSize: 60, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: colors.primary, marginBottom: 5 },
  subtitle: { fontSize: 16, textAlign: 'center', color: colors.gray, marginBottom: 40 },
  input: { backgroundColor: colors.white, borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: colors.border, fontSize: 16 },
  button: { backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 20, color: colors.primary, fontSize: 14 },
});