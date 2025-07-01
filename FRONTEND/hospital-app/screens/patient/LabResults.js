import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import API from '../../services/api';

export default function LabResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Replace 'me' with the actual patient id if needed
        const res = await API.get('/labs/patient/me');
        setResults(res.data);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchResults();

    // Fetch messages sent to this patient
    const fetchMessages = async () => {
      try {
        // Get all messages for this user
        const res = await API.get('/messages/user');
        // Only show messages where current user is the receiver
        setMessages(res.data.filter(m => m.receiverId && m.receiverId._id));
      } catch (err) {
        // Handle error
      }
      setMessagesLoading(false);
    };
    fetchMessages();
  }, []);

  if (loading || messagesLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Doctor Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#e3f0fc', marginBottom: 8, borderRadius: 6 }}>
            <Text style={{ fontWeight: 'bold' }}>From: {item.senderId?.name || item.senderId}</Text>
            <Text>{item.message}</Text>
            <Text style={{ color: '#8395a7', fontSize: 12 }}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No messages from your doctor.</Text>}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginTop: 20 }}>Lab Results</Text>
      <FlatList
        data={results}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#f1f1f1', marginBottom: 8, borderRadius: 6 }}>
            <Text>Test: {item.testName}</Text>
            <Text>Result: {item.result}</Text>
            <Text>Date: {item.uploadedAt?.slice(0,10)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>KERUGOYA MEDICAL CENTER</Text>}
      />
    </View>
  );
}
