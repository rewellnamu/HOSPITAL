import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import API, { setAuthToken } from '../../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', {
        email,
        password,
      });

      // Save token for future requests
      await setAuthToken(res.data.token);

      console.log('✅ Login Success:', res.data);
      Alert.alert('Success', `Welcome ${res.data.name}`);
      // Navigate to dashboard based on role
      if (res.data.role === 'patient') {
        navigation.replace('PatientDashboard');
      } else if (res.data.role === 'doctor') {
        navigation.replace('DoctorDashboard');
      } else if (res.data.role === 'admin') {
        navigation.replace('AdminDashboard');
      }
    } catch (err) {
      console.log('❌ Login Error:', err.response?.data || err.message);
      Alert.alert('Login Failed', err.response?.data?.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
      <Text onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}
