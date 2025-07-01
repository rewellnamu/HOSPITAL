import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import API from '../../services/api';

export default function MyAppointments() {
  console.log('MyAppointments screen rendered');

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const isFocused = useIsFocused();
  const route = useRoute();

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching appointments...');
      const res = await API.get('/appointments/my');
      console.log('Appointments API response:', res.data); // Add this line
      setAppointments(res.data);
      console.log('Appointments fetched:', res.data);
    } catch (err) {
      setError('Failed to load appointments.');
      console.error('API error:', err?.response?.data || err.message || err);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('MyAppointments mounted or focused, refresh param:', route.params?.refresh);
    fetchAppointments();
  }, [isFocused, route.params?.refresh]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <Text onPress={fetchAppointments} style={{ color: 'blue' }}>Retry</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>
              Date: <Text style={styles.value}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</Text>
            </Text>
            <Text style={styles.label}>
              Time: <Text style={styles.value}>{item.time}</Text>
            </Text>
            <Text style={styles.label}>
              Status: <Text style={[styles.value, item.status === 'Pending' ? styles.pending : styles.completed]}>{item.status}</Text>
            </Text>
            <Text style={styles.label}>
              Doctor: <Text style={styles.value}>{item.doctorId?.userId?.name || item.doctorId}</Text>
            </Text>
            <Text style={styles.label}>
              Reason: <Text style={styles.value}>{item.reason || 'N/A'}</Text>
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments found.</Text>
          </View>
        }
        contentContainerStyle={appointments.length === 0 && { flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
    color: '#2d2d2d'
  },
  card: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 4
  },
  value: {
    fontWeight: '400',
    color: '#222'
  },
  pending: {
    color: '#e67e22'
  },
  completed: {
    color: '#27ae60'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  emptyText: {
    color: '#888',
    fontSize: 16
  }
});
