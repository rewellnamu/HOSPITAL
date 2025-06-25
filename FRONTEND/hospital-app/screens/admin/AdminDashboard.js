import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';

export default function AdminDashboard({ navigation }) {
  const adminName = "Admin"; // Replace with real data if available

  const handleLogout = () => {
    // Clear storage if needed
    Alert.alert("Logout", "Logged out successfully");
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🏥 Admin Dashboard</Text>
      <Text style={styles.subHeader}>Welcome, {adminName}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ManageUsers')}>
          <Text style={styles.actionText}>👥 Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddUser')}>
          <Text style={styles.actionText}>➕ Add New User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hospital Configuration</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('HospitalConfig')}>
          <Text style={styles.actionText}>⚙️ Edit Hospital Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Departments')}>
          <Text style={styles.actionText}>🏨 Manage Departments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointments</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AllAppointments')}>
          <Text style={styles.actionText}>📅 View All Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AppointmentAnalytics')}>
          <Text style={styles.actionText}>📊 Appointment Analytics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analytics & Reports</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('UserAnalytics')}>
          <Text style={styles.actionText}>📈 User Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('RevenueReports')}>
          <Text style={styles.actionText}>💰 Revenue Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Button title="Logout" color="#d9534f" onPress={handleLogout} />
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
