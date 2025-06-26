import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import API from '../../services/api';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const route = useRoute();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [isFocused, route.params?.refresh]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>My Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#f1f1f1', marginBottom: 8, borderRadius: 6 }}>
            <Text>Date: {item.date ? new Date(item.date).toLocaleDateString() : ''}</Text>
            <Text>Time: {item.time}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Doctor: {item.doctorId?.userId?.name || item.doctorId}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No appointments found.</Text>}
      />
    </View>
  );
}
