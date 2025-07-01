import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../../services/api';

export default function RevenueReports() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/payments/all'); // Backend should provide this endpoint for admins
      setPayments(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Group payments by date
  const grouped = payments.reduce((acc, p) => {
    const date = p.paidAt ? p.paidAt.slice(0, 10) : 'Unknown';
    if (!acc[date]) acc[date] = [];
    acc[date].push(p);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const renderGroup = ({ item: date }) => {
    const group = grouped[date];
    const total = group.reduce((sum, p) => sum + (p.amount || 0), 0);
    return (
      <View style={styles.groupCard}>
        <Text style={styles.groupDate}>{date}</Text>
        <Text style={styles.groupTotal}>Total: KES {total.toLocaleString()}</Text>
        {group.map(p => (
          <View key={p._id} style={styles.paymentRow}>
            <Text>Patient: {p.patientId?.userId?.name || p.patientId?.userId || p.patientId}</Text>
            <Text>Amount: KES {p.amount}</Text>
            <Text>Method: {p.paymentMethod}</Text>
            <Text>Status: {p.status}</Text>
            <Text>Time: {p.paidAt ? new Date(p.paidAt).toLocaleTimeString() : ''}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Revenue Reports</Text>
      <FlatList
        data={dates}
        keyExtractor={d => d}
        renderItem={renderGroup}
        ListEmptyComponent={<Text>No revenue records found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  groupCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  groupDate: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#3867d6' },
  groupTotal: { fontWeight: 'bold', color: '#27ae60', marginBottom: 8 },
  paymentRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 6, marginTop: 6 }
});
