import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import API from '../../services/api';

export default function HospitalConfig({ navigation }) {
  const [form, setForm] = useState({
    hospitalName: '',
    logoUrl: '',
    address: '',
    contactEmail: '',
    departments: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await API.get('/config');
        setForm({
          hospitalName: res.data?.hospitalName || '',
          logoUrl: res.data?.logoUrl || '',
          address: res.data?.address || '',
          contactEmail: res.data?.contactEmail || '',
          departments: (res.data?.departments || []).join(', ')
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to load hospital info');
      }
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.hospitalName || !form.address || !form.contactEmail) {
      Alert.alert('Validation', 'Hospital name, address, and contact email are required.');
      return;
    }
    setSaving(true);
    try {
      await API.put('/config', {
        hospitalName: form.hospitalName,
        logoUrl: form.logoUrl,
        address: form.address,
        contactEmail: form.contactEmail,
        departments: form.departments.split(',').map(d => d.trim()).filter(Boolean)
      });
      Alert.alert('Success', 'Hospital info updated.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update info');
    }
    setSaving(false);
  };

  if (loading) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Hospital Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Hospital Name"
        value={form.hospitalName}
        onChangeText={v => handleChange('hospitalName', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Logo URL"
        value={form.logoUrl}
        onChangeText={v => handleChange('logoUrl', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={v => handleChange('address', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Email"
        value={form.contactEmail}
        onChangeText={v => handleChange('contactEmail', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Departments (comma separated)"
        value={form.departments}
        onChangeText={v => handleChange('departments', v)}
      />
      <Button title={saving ? "Saving..." : "Save"} onPress={handleSave} disabled={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f9fa', flexGrow: 1 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#2a4d69' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
