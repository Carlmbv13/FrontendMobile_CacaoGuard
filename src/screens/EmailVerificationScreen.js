// screens/EmailVerificationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyEmail, resendVerificationEmail } from '../services/api';
import colors from '../theme/colors';

export default function EmailVerificationScreen({ navigation, route }) {
  const { email, username, password } = route.params || {};
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyEmail(verificationCode);
      
      // After verification, login the user
      const loginResponse = await login({ username, password });
      const { access, refresh } = loginResponse.data;
      
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('username', username);
      
      Alert.alert('Success', 'Email verified! Logging you in...');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Verification Failed', error.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      Alert.alert('Please wait', `Wait ${countdown} seconds before requesting another code`);
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email address not found');
      return;
    }

    setResendLoading(true);
    try {
      await resendVerificationEmail({ email });
      Alert.alert('Success', 'Verification code resent to your email');
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✉️</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to{'\n'}
          <Text style={styles.email}>{email || 'your email'}</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Verify Email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resendLoading || countdown > 0}
          >
            <Text
              style={[
                styles.resendLink,
                (resendLoading || countdown > 0) && styles.resendLinkDisabled,
              ]}
            >
              {resendLoading
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  icon: { fontSize: 60, textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', color: colors.gray, marginBottom: 30, lineHeight: 20 },
  email: { fontWeight: 'bold', color: colors.primary },
  input: { backgroundColor: colors.white, borderRadius: 10, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: colors.border, fontSize: 16, textAlign: 'center' },
  verifyButton: { backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center' },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  resendText: { color: colors.gray, fontSize: 14 },
  resendLink: { color: colors.primary, fontSize: 14, fontWeight: 'bold' },
  resendLinkDisabled: { color: colors.lightGray, opacity: 0.5 },
});