import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DoctorDashboard({ navigation }) {
  // Dummy data for demonstration
  const appointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', reason: 'Checkup' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', reason: 'Consultation' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👨‍⚕️ Doctor Dashboard</Text>
      <Text style={styles.subHeader}>Good morning, Dr. [Your Name]</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Appointments</Text>
        {appointments.length === 0 ? (
          <Text style={styles.noData}>No appointments for today.</Text>
        ) : (
          appointments.map((appt) => (
            <View key={appt.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentText}>
                <Text style={styles.bold}>{appt.time}</Text> - {appt.patient}
              </Text>
              <Text style={styles.appointmentReason}>{appt.reason}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DoctorAppointmentsScreen')}>
          <Text style={styles.actionText}>View All Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DoctorPrescriptionsScreen')}>
          <Text style={styles.actionText}>Write Prescription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DoctorPatientRecordsScreen')}>
          <Text style={styles.actionText}>Patient Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DoctorMessagesScreen')}>
          <Text style={styles.actionText}>Messages</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Button title="Logout" color="#d9534f" onPress={() => navigation.replace('Login')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f7f9fa',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2a4d69',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#4b6584',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#3867d6',
  },
  noData: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  appointmentCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eaf0fb',
    borderRadius: 6,
  },
  appointmentText: {
    fontSize: 16,
    color: '#222f3e',
  },
  appointmentReason: {
    fontSize: 14,
    color: '#8395a7',
  },
  bold: {
    fontWeight: 'bold',
  },
  actionBtn: {
    backgroundColor: '#3867d6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
