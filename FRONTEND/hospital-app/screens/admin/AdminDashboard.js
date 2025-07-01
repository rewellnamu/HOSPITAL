import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import API, { setAuthToken } from '../../services/api';

export default function AdminDashboard({ navigation }) {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin info and dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get logged-in user info
        const userRes = await API.get('/users/me');
        setAdmin(userRes.data);

        // Fetch dashboard stats (implement this endpoint in your backend)
        const statsRes = await API.get('/config'); // Example: /api/config returns hospital info
        // Optionally, fetch more stats from other endpoints
        const usersRes = await API.get('/users/all');
        const doctorsRes = await API.get('/doctors');
        const patientsRes = await API.get('/patients');
        const appointmentsRes = await API.get('/appointments/doctor'); // or /appointments/all if exists
        // Add more as needed

        setStats({
          hospitalName: statsRes.data?.hospitalName || '',
          departments: statsRes.data?.departments?.length || 0,
          users: usersRes.data?.length || 0,
          doctors: doctorsRes.data?.length || 0,
          patients: patientsRes.data?.length || 0,
          appointments: appointmentsRes.data?.length || 0,
        });
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await setAuthToken(null);
    Alert.alert("Logout", "Logged out successfully");
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🏥 {stats?.hospitalName || 'Admin Dashboard'}</Text>
      <Text style={styles.subHeader}>Welcome, {admin?.name || 'Admin'}</Text>

      {/* Dashboard summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats?.users}</Text>
          <Text style={styles.summaryLabel}>Users</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats?.doctors}</Text>
          <Text style={styles.summaryLabel}>Doctors</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats?.patients}</Text>
          <Text style={styles.summaryLabel}>Patients</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats?.appointments}</Text>
          <Text style={styles.summaryLabel}>Appointments</Text>
        </View>
      </View>

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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3867d6',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8395a7',
    marginTop: 2,
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
