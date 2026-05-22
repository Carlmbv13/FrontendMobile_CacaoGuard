// screens/RegisterScreen.js - Updated with debug logs
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { register } from '../services/api';
import colors from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Farmer');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log('Register button clicked'); // Debug log
    
    // Validation
    if (!username || !password || !password2) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (password !== password2) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (email && !isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    const userData = {
      username,
      password,
      password2,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
    };
    
    console.log('Attempting to register with:', userData);
    
    try {
      const response = await register(userData);
      console.log('Registration response:', response.data);
      
      // Registration successful, navigate to verification screen
      Alert.alert(
        'Verification Required',
        'Please verify your email address to complete registration',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EmailVerification', {
              email: email || username,
              username: username,
              password: password,
            })
          }
        ]
      );
    } catch (error) {
      console.log('Registration error:', error);
      console.log('Error response:', error.response);
      
      const errorData = error.response?.data;
      let errorMsg = 'Registration failed';
      
      if (errorData?.username) {
        errorMsg = errorData.username[0];
      } else if (errorData?.email) {
        errorMsg = errorData.email[0];
      } else if (errorData?.password) {
        errorMsg = errorData.password[0];
      } else if (errorData?.non_field_errors) {
        errorMsg = errorData.non_field_errors[0];
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      Alert.alert('Registration Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join CacaoGuard</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Username *" 
          value={username} 
          onChangeText={setUsername} 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Email *" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="First Name" 
          value={firstName} 
          onChangeText={setFirstName} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Last Name" 
          value={lastName} 
          onChangeText={setLastName} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Password * (min. 8 characters)" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Confirm Password *" 
          value={password2} 
          onChangeText={setPassword2} 
          secureTextEntry 
        />

        <Text style={styles.label}>Select Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'Farmer' && styles.roleButtonActive]} 
            onPress={() => setRole('Farmer')}
          >
            <Text style={[styles.roleText, role === 'Farmer' && styles.roleTextActive]}>Farmer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'Technician' && styles.roleButtonActive]} 
            onPress={() => setRole('Technician')}
          >
            <Text style={[styles.roleText, role === 'Technician' && styles.roleTextActive]}>Technician</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Note: You'll need to verify your email address before logging in
        </Text>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  content: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: colors.primary, marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', color: colors.gray, marginBottom: 30 },
  input: { backgroundColor: colors.white, borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: colors.border, fontSize: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: colors.black },
  roleContainer: { flexDirection: 'row', marginBottom: 20 },
  roleButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  roleButtonActive: { backgroundColor: colors.primary },
  roleText: { color: colors.primary, fontWeight: 'bold' },
  roleTextActive: { color: colors.white },
  note: { fontSize: 12, color: colors.gray, textAlign: 'center', marginBottom: 15, fontStyle: 'italic' },
  registerButton: { backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 20, color: colors.primary, fontSize: 14 },
});