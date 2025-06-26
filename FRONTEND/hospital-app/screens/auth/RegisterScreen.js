import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '', // add this
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      const payload = { ...form };
      if (form.role !== 'doctor') delete payload.specialization;
      await API.post('/auth/register', payload);
      Alert.alert('Success', 'Registration complete. You can now log in.');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        value={form.name}
        onChangeText={(v) => handleChange('name', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => handleChange('email', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => handleChange('password', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.role}
          onValueChange={(value) => handleChange('role', value)}
        >
          <Picker.Item label="Patient" value="patient" />
          <Picker.Item label="Doctor" value="doctor" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      {/* Show specialization input if doctor */}
      {form.role === 'doctor' && (
        <TextInput
          placeholder="Specialization"
          value={form.specialization}
          onChangeText={(v) => handleChange('specialization', v)}
          style={styles.input}
        />
      )}

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
});
