import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import API from '../../services/api';

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | patient | doctor

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

  const filteredAppointments = () => {
    if (filter === 'all') return appointments;
    if (filter === 'patient') {
      // Group by patient name
      const map = {};
      appointments.forEach(a => {
        const name = a.patientId?.userId?.name || a.patientId?.userId || a.patientId;
        if (!map[name]) map[name] = [];
        map[name].push(a);
      });
      // Flatten to [{ group: name, data: [...] }]
      return Object.entries(map).map(([group, data]) => ({ group, data }));
    }
    if (filter === 'doctor') {
      const map = {};
      appointments.forEach(a => {
        const name = a.doctorId?.userId?.name || a.doctorId?.userId || a.doctorId;
        if (!map[name]) map[name] = [];
        map[name].push(a);
      });
      return Object.entries(map).map(([group, data]) => ({ group, data }));
    }
    return appointments;
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Appointments</Text>
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterBtn, filter === 'all' && styles.activeBtn]} onPress={() => setFilter('all')}>
          <Text style={filter === 'all' ? styles.activeText : styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'patient' && styles.activeBtn]} onPress={() => setFilter('patient')}>
          <Text style={filter === 'patient' ? styles.activeText : styles.filterText}>By Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'doctor' && styles.activeBtn]} onPress={() => setFilter('doctor')}>
          <Text style={filter === 'doctor' ? styles.activeText : styles.filterText}>By Doctor</Text>
        </TouchableOpacity>
      </View>
      {filter === 'all' ? (
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
              <Text>
                Doctor: {item.doctorId?.userId?.name || item.doctorId?.userId || item.doctorId}
              </Text>
              <Text>Status: {item.status}</Text>
              <Text>Reason: {item.reason}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No appointments found.</Text>}
        />
      ) : (
        <FlatList
          data={filteredAppointments()}
          keyExtractor={item => item.group}
          renderItem={({ item }) => (
            <View style={styles.groupSection}>
              <Text style={styles.groupHeader}>{filter === 'patient' ? 'Patient' : 'Doctor'}: {item.group}</Text>
              {item.data.map(appt => (
                <View key={appt._id} style={styles.card}>
                  <Text style={styles.bold}>
                    {appt.date ? new Date(appt.date).toLocaleDateString() : ''} {appt.time}
                  </Text>
                  <Text>
                    Patient: {appt.patientId?.userId?.name || appt.patientId?.userId || appt.patientId}
                  </Text>
                  <Text>
                    Doctor: {appt.doctorId?.userId?.name || appt.doctorId?.userId || appt.doctorId}
                  </Text>
                  <Text>Status: {appt.status}</Text>
                  <Text>Reason: {appt.reason}</Text>
                </View>
              ))}
            </View>
          )}
          ListEmptyComponent={<Text>No appointments found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', marginBottom: 12, justifyContent: 'center' },
  filterBtn: { padding: 8, marginHorizontal: 6, borderRadius: 6, backgroundColor: '#e3eafc' },
  activeBtn: { backgroundColor: '#3867d6' },
  filterText: { color: '#3867d6', fontWeight: '600' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  groupSection: { marginBottom: 18 },
  groupHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: '#3867d6' }
});
