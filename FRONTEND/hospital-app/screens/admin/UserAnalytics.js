import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../../services/api';

export default function UserAnalytics() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users/all'); // Backend should provide this endpoint for admins
      setUsers(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate stats
  const total = users.length;
  const byRole = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Analytics</Text>
      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{total}</Text>
          <Text style={styles.statsLabel}>Total Users</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byRole.admin || 0}</Text>
          <Text style={styles.statsLabel}>Admins</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byRole.doctor || 0}</Text>
          <Text style={styles.statsLabel}>Doctors</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{byRole.patient || 0}</Text>
          <Text style={styles.statsLabel}>Patients</Text>
        </View>
      </View>
      <Text style={styles.subHeader}>All Users</Text>
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Role: {item.role}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No users found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 16, fontWeight: 'bold', marginVertical: 10, color: '#3867d6' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statsValue: { fontSize: 18, fontWeight: 'bold', color: '#3867d6' },
  statsLabel: { fontSize: 13, color: '#8395a7', marginTop: 2 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
});
