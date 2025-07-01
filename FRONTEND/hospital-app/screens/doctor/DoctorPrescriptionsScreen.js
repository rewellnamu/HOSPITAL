import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../../services/api';

export default function DoctorPrescriptionsScreen() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    appointmentId: '',
    medications: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await API.get('/prescriptions/doctor');
      setPrescriptions(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrescriptions();
    // Fetch patients for this doctor
    API.get('/appointments/doctor/patients').then(res => {
      setPatients(res.data);
    }).catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.patientId || !form.medications) {
      Alert.alert('Validation', 'Patient ID and medications are required.');
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/prescriptions', {
        patientId: form.patientId,
        appointmentId: form.appointmentId || undefined,
        medications: form.medications.split(',').map(m => ({ name: m.trim() })),
        notes: form.notes
      });
      setShowModal(false);
      setForm({ patientId: '', appointmentId: '', medications: '', notes: '' });
      fetchPrescriptions();
      Alert.alert('Success', 'Prescription submitted.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit prescription');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Prescriptions</Text>
      <Button title="Write Prescription" onPress={() => setShowModal(true)} />
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
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write Prescription</Text>
            {/* Patient Picker */}
            <Text style={{marginBottom: 4}}>Select Patient</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={form.patientId}
                onValueChange={v => handleChange('patientId', v)}
              >
                <Picker.Item label="Select patient..." value="" />
                {patients.map(p => (
                  <Picker.Item key={p._id} label={p.name} value={p._id} />
                ))}
              </Picker>
            </View>
            {/* Appointment Picker */}
            <Text style={{marginBottom: 4}}>Select Appointment (optional)</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={form.appointmentId}
                onValueChange={v => handleChange('appointmentId', v)}
                enabled={!!form.patientId}
              >
                <Picker.Item label="Select appointment..." value="" />
                {(patients.find(p => p._id === form.patientId)?.appointments || []).map(appt => (
                  <Picker.Item
                    key={appt._id}
                    label={`${new Date(appt.date).toLocaleDateString()} ${appt.time} (${appt.status})`}
                    value={appt._id}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              placeholder="Medications (comma separated)"
              value={form.medications}
              onChangeText={v => handleChange('medications', v)}
              style={styles.input}
            />
            <TextInput
              placeholder="Notes"
              value={form.notes}
              onChangeText={v => handleChange('notes', v)}
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancel" color="#888" onPress={() => setShowModal(false)} />
              <Button title={submitting ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={submitting} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%'
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10
  }
});
