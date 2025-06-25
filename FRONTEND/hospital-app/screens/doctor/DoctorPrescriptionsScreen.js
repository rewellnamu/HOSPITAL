import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../../services/api';

export default function DoctorPrescriptionsScreen() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get('/prescriptions/doctor'); // You may need to implement this endpoint in your backend
        setPrescriptions(res.data);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Prescriptions</Text>
      <FlatList
        data={prescriptions}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>Patient: {item.patientId?.name || item.patientId}</Text>
            <Text>Date: {new Date(item.prescribedAt).toLocaleDateString()}</Text>
            <Text>Medications: {item.medications.map(m => m.name).join(', ')}</Text>
            <Text>Notes: {item.notes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No prescriptions found.</Text>}
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
