import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../../services/api';

export default function BookAppointment({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);

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
      const res = await API.post('/appointments', {
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
      setLastAppointment(res.data); // Save appointment for payment
      setShowPaymentModal(true); // Show payment modal
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

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Validation', 'Enter a valid amount.');
      return;
    }
    setPaying(true);
    try {
      await API.post('/payments', {
        appointmentId: lastAppointment._id,
        amount,
        paymentMethod,
      });
      setShowPaymentModal(false);
      setAmount('');
      setPaymentMethod('mpesa');
      Alert.alert('Payment Success', 'Payment completed successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Payments'),
        },
      ]);
    } catch (err) {
      Alert.alert('Payment Error', err.response?.data?.message || 'Payment failed');
    }
    setPaying(false);
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
      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Make Payment</Text>
            <Text>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Text>Payment Method</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <Picker.Item label="Mpesa" value="mpesa" />
                <Picker.Item label="Card" value="card" />
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Insurance" value="insurance" />
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Button title="Cancel" color="#888" onPress={() => setShowPaymentModal(false)} />
              <Button title={paying ? "Paying..." : "Pay Now"} onPress={handlePayment} disabled={paying} />
            </View>
          </View>
        </View>
      </Modal>
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
