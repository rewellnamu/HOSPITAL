import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import API from '../../services/api';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Replace 'me' with the actual patient id if needed
        const res = await API.get('/prescriptions/patient/me');
        setPrescriptions(res.data);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchPrescriptions();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>My Prescriptions</Text>
      <FlatList
        data={prescriptions}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#f1f1f1', marginBottom: 8, borderRadius: 6 }}>
            <Text>Date: {item.prescribedAt?.slice(0,10)}</Text>
            <Text>
              Doctor: {
                item.doctorId?.userId?.name // doctorId populated with userId populated with name
                || item.doctorId?.userId    // doctorId populated with userId as string
                || item.doctorId?.name      // fallback if doctorId has name directly
                || (typeof item.doctorId === 'string' ? item.doctorId : '')
                || 'Unknown'
              }
            </Text>
            <Text>Medications: {item.medications.map(m => m.name).join(', ')}</Text>
            <Text>Notes: {item.notes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No prescriptions found.</Text>}
      />
    </View>
  );
}
