import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function PatientDashboard({ navigation }) {
  const patientName = "John Doe"; // Replace with real data if fetched

  const handleLogout = () => {
    // You can clear AsyncStorage here
    Alert.alert("Logout", "Logged out successfully");
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome, {patientName}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookAppointment')}>
          <Text style={styles.buttonText}>📅 Book Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyAppointments')}>
          <Text style={styles.buttonText}>📖 My Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Prescriptions')}>
          <Text style={styles.buttonText}>💊 My Prescriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LabResults')}>
          <Text style={styles.buttonText}>🧪 Lab Results</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payments')}>
          <Text style={styles.buttonText}>💳 Payment History</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600'
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
