import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import API from '../../services/api';

export default function Departments({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/config');
      setDepartments(res.data?.departments || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load departments');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async () => {
    if (!newDept.trim()) {
      Alert.alert('Validation', 'Department name cannot be empty.');
      return;
    }
    if (departments.includes(newDept.trim())) {
      Alert.alert('Validation', 'Department already exists.');
      return;
    }
    setSaving(true);
    try {
      const updated = [...departments, newDept.trim()];
      await API.put('/config', { departments: updated });
      setDepartments(updated);
      setNewDept('');
      Alert.alert('Success', 'Department added.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add department');
    }
    setSaving(false);
  };

  const handleDelete = async (dept) => {
    Alert.alert('Confirm', `Remove "${dept}" department?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: async () => {
          setSaving(true);
          try {
            const updated = departments.filter(d => d !== dept);
            await API.put('/config', { departments: updated });
            setDepartments(updated);
            Alert.alert('Success', 'Department removed.');
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to remove department');
          }
          setSaving(false);
        }
      }
    ]);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Departments</Text>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="New Department"
          value={newDept}
          onChangeText={setNewDept}
        />
        <Button title={saving ? "Adding..." : "Add"} onPress={handleAdd} disabled={saving} />
      </View>
      <FlatList
        data={departments}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.deptRow}>
            <Text style={styles.deptText}>{item}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)} disabled={saving}>
              <Text style={styles.deleteBtn}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No departments found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#2a4d69' },
  addRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  deptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  deptText: { fontSize: 16, color: '#222' },
  deleteBtn: { color: '#d9534f', fontWeight: 'bold', fontSize: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
