import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button, Alert, StyleSheet } from 'react-native';
import API from '../../services/api';

export default function BookAppointment({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get('/doctors');
        setDoctors(res.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch doctors');
      }
      setLoadingDoctors(false);
    };
    fetchDoctors();
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !date || !time) {
      Alert.alert('Validation', 'Please select doctor, date, and time.');
      return;
    }
    // Backend expects date as YYYY-MM-DD and time as HH:MM
    // Validate date and time formats
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Validation', 'Date must be in YYYY-MM-DD format.');
      return;
    }
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
      Alert.alert('Validation', 'Time must be in HH:MM (24hr) format.');
      return;
    }
    setBooking(true);
    try {
      await API.post('/appointments', {
        doctorId: selectedDoctor._id,
        date,
        time,
        reason,
      });
      Alert.alert('Success', 'Appointment booked successfully!');
      setSelectedDoctor(null);
      setDate('');
      setTime('');
      setReason('');
      // Navigate to MyAppointments and trigger refresh
      navigation.navigate('MyAppointments', { refresh: Date.now() });
    } catch (err) {
      let msg = 'Booking failed';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      Alert.alert('Error', msg);
    }
    setBooking(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>

      <Text style={styles.label}>Select Doctor:</Text>
      {loadingDoctors ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedDoctor && selectedDoctor._id === item._id;
            return (
              <TouchableOpacity
                style={[
                  styles.doctorCard,
                  isSelected && styles.selectedDoctorCard,
                ]}
                onPress={() =>
                  isSelected ? setSelectedDoctor(null) : setSelectedDoctor(item)
                }
              >
                <Text style={styles.doctorName}>
                  {item.userId?.name || 'Doctor'}
                  {isSelected ? ' ✅' : ''}
                </Text>
                <Text style={styles.doctorSpec}>{item.specialization}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text>
              {doctors.length === 0
                ? 'No doctors available. Please contact admin.'
                : ''}
            </Text>
          }
        />
      )}

      <Text style={styles.label}>Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2024-06-30"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Time (HH:MM):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 14:30"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Reason (optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Reason for appointment"
        value={reason}
        onChangeText={setReason}
      />

      <Button
        title={booking ? 'Booking...' : 'Book Appointment'}
        onPress={handleBook}
        disabled={booking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: '600', marginTop: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  doctorCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDoctorCard: {
    backgroundColor: '#3867d6',
    borderColor: '#3867d6',
  },
  doctorName: {
    fontWeight: 'bold',
    color: '#222f3e',
  },
  doctorSpec: {
    color: '#8395a7',
    fontSize: 13,
  },
});
