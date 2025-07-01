import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../../services/api';

export default function AppointmentAnalytics() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments/all'); // Backend should provide this endpoint for admins
      setAppointments(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Analytics calculations
  const total = appointments.length;
  const byStatus = appointments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const byDoctor = appointments.reduce((acc, a) => {
    const doc = a.doctorId?.userId?.name || a.doctorId?.userId || a.doctorId;
    acc[doc] = (acc[doc] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Appointment Analytics</Text>
      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{total}</Text>
          <Text style={styles.statsLabel}>Total</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byStatus.pending || 0}</Text>
          <Text style={styles.statsLabel}>Pending</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byStatus.confirmed || 0}</Text>
          <Text style={styles.statsLabel}>Confirmed</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byStatus.completed || 0}</Text>
          <Text style={styles.statsLabel}>Completed</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byStatus.cancelled || 0}</Text>
          <Text style={styles.statsLabel}>Cancelled</Text>
        </View>
      </View>
      <Text style={styles.subHeader}>Appointments by Doctor</Text>
      <FlatList
        data={Object.keys(byDoctor)}
        keyExtractor={d => d}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>{item}</Text>
            <Text>Total: {byDoctor[item]}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No appointment data found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 16, fontWeight: 'bold', marginVertical: 10, color: '#3867d6' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 },
  statsCard: {
    width: '20%',
    minWidth: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statsValue: { fontSize: 18, fontWeight: 'bold', color: '#3867d6' },
  statsLabel: { fontSize: 13, color: '#8395a7', marginTop: 2 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
});
