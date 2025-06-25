import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import API from '../../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get('/payments/my');
        setPayments(res.data);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Payment History</Text>
      <FlatList
        data={payments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#f1f1f1', marginBottom: 8, borderRadius: 6 }}>
            <Text>Amount: {item.amount}</Text>
            <Text>Method: {item.paymentMethod}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Date: {item.paidAt?.slice(0,10)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No payments found.</Text>}
      />
    </View>
  );
}
