import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../../services/api';

export default function AddUser({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '',
    licenseNumber: '',
    qualifications: '',
    availableDays: '',
    availableTimeSlots: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required.';
    if (!form.password || form.password.length < 6) return 'Password (min 6 chars) is required.';
    if (!form.role) return 'Role is required.';
    if (form.role === 'doctor') {
      if (!form.specialization.trim()) return 'Specialization is required for doctors.';
      if (!form.licenseNumber.trim()) return 'License Number is required for doctors.';
    }
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role
      };
      if (form.role === 'doctor') {
        payload.specialization = form.specialization.trim();
        payload.licenseNumber = form.licenseNumber.trim();
        payload.qualifications = form.qualifications
          ? form.qualifications.split(',').map(q => q.trim()).filter(Boolean)
          : [];
        payload.availableDays = form.availableDays
          ? form.availableDays.split(',').map(d => d.trim()).filter(Boolean)
          : [];
        payload.availableTimeSlots = form.availableTimeSlots
          ? form.availableTimeSlots.split(',').map(t => t.trim()).filter(Boolean)
          : [];
        payload.bio = form.bio.trim();
      }
      await API.post('/auth/register', payload);
      Alert.alert('Success', 'User registered successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        specialization: '',
        licenseNumber: '',
        qualifications: '',
        availableDays: '',
        availableTimeSlots: '',
        bio: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register user');
    }
    setSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Add New User</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChangeText={v => handleChange('name', v)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={v => handleChange('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={v => handleChange('password', v)}
        secureTextEntry
      />
      <View style={styles.input}>
        <Picker
          selectedValue={form.role}
          onValueChange={v => handleChange('role', v)}
        >
          <Picker.Item label="Patient" value="patient" />
          <Picker.Item label="Doctor" value="doctor" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>
      {form.role === 'doctor' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Specialization (e.g. Cardiologist)"
            value={form.specialization}
            onChangeText={v => handleChange('specialization', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="License Number"
            value={form.licenseNumber}
            onChangeText={v => handleChange('licenseNumber', v)}
          />
          <Text style={styles.helper}>Separate multiple qualifications with commas.</Text>
          <TextInput
            style={styles.input}
            placeholder="Qualifications (e.g. MBBS, MD)"
            value={form.qualifications}
            onChangeText={v => handleChange('qualifications', v)}
          />
          <Text style={styles.helper}>Separate days with commas (e.g. Monday,Tuesday).</Text>
          <TextInput
            style={styles.input}
            placeholder="Available Days"
            value={form.availableDays}
            onChangeText={v => handleChange('availableDays', v)}
          />
          <Text style={styles.helper}>Separate time slots with commas (e.g. 09:00,10:30).</Text>
          <TextInput
            style={styles.input}
            placeholder="Available Time Slots"
            value={form.availableTimeSlots}
            onChangeText={v => handleChange('availableTimeSlots', v)}
          />
          <TextInput
            style={[styles.input, { minHeight: 60 }]}
            placeholder="Bio"
            value={form.bio}
            onChangeText={v => handleChange('bio', v)}
            multiline
          />
        </>
      )}
      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Register User'}</Text>
      </TouchableOpacity>
      {submitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3867d6" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f9fa',
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#3867d6',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8
  },
  buttonDisabled: {
    backgroundColor: '#b2bec3'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  error: {
    color: '#d9534f',
    marginBottom: 12,
    textAlign: 'center'
  },
  helper: {
    color: '#8395a7',
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 2
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
