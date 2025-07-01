import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../../services/api';

export default function DoctorMessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [patients, setPatients] = useState([]);

  // Fetch all messages for the doctor (sent and received)
  const fetchMessages = async () => {
    try {
      const res = await API.get('/messages/user');
      setMessages(res.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // Fetch patients for this doctor
    API.get('/appointments/doctor/patients').then(res => {
      setPatients(res.data);
    }).catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!receiverId || !message) {
      Alert.alert('Validation', 'Please select a patient and enter a message.');
      return;
    }
    setSending(true);
    try {
      await API.post('/messages', { receiverId, message });
      setMessage('');
      await fetchMessages(); // Refresh messages after sending
      Alert.alert('Success', 'Message sent.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send message');
    }
    setSending(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {/* Message sending UI */}
      <View style={{ marginBottom: 16 }}>
        {/* Patient Picker */}
        <View style={styles.input}>
          <Picker
            selectedValue={receiverId}
            onValueChange={setReceiverId}
          >
            <Picker.Item label="Select patient..." value="" />
            {patients.map(p => (
              <Picker.Item key={p._id} label={p.name} value={typeof p.userId === 'string' ? p.userId : p.userId?._id} />
            ))}
          </Picker>
        </View>
        <TextInput
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <Button title={sending ? "Sending..." : "Send Message"} onPress={handleSend} disabled={sending} />
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bold}>From: {item.senderId?.name || item.senderId}</Text>
            <Text>To: {item.receiverId?.name || item.receiverId}</Text>
            <Text>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No messages found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  date: { color: '#8395a7', fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8
  },
});
 