import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import API from '../../services/api';

export default function DoctorAppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments/doctor');
      setAppointments(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const markStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await API.patch(`/appointments/${id}/status`, { status });
      await fetchAppointments();
      Alert.alert('Success', `Appointment marked as ${status}.`);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
    }
    setUpdating(null);
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>
              {item.date ? new Date(item.date).toLocaleDateString() : ''} {item.time}
            </Text>
            <Text>
              Patient: {item.patientId?.userId?.name || item.patientId?.userId || item.patientId}
            </Text>
            <Text>Status: {item.status}</Text>
            <Text>Reason: {item.reason}</Text>
            {item.status !== 'completed' && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {item.status !== 'confirmed' && (
                  <Button
                    title={updating === item._id + 'confirmed' ? "Updating..." : "Mark as Confirmed"}
                    onPress={() => markStatus(item._id, 'confirmed')}
                    disabled={updating === item._id + 'confirmed'}
                  />
                )}
                {item.status !== 'cancelled' && (
                  <Button
                    title={updating === item._id + 'cancelled' ? "Updating..." : "Mark as Cancelled"}
                    onPress={() => markStatus(item._id, 'cancelled')}
                    color="#e67e22"
                    disabled={updating === item._id + 'cancelled'}
                  />
                )}
                <Button
                  title={updating === item._id + 'completed' ? "Updating..." : "Mark as Completed"}
                  onPress={() => markStatus(item._id, 'completed')}
                  color="#27ae60"
                  disabled={updating === item._id + 'completed'}
                />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>No appointments found.</Text>}
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
