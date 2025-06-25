import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../../services/api';

export default function DoctorPatientRecordsScreen() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/patients'); // You may need to implement this endpoint in your backend
        setPatients(res.data);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchPatients();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Records</Text>
      <FlatList
        data={patients}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>{item.userId?.name || item.userId}</Text>
            <Text>Gender: {item.gender}</Text>
            <Text>DOB: {item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString() : ''}</Text>
            <Text>Blood Type: {item.bloodType}</Text>
            <Text>Allergies: {item.allergies?.join(', ')}</Text>
            <Text>Medical History: {item.medicalHistory}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No patient records found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
});
