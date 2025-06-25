import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import API from '../../services/api';

export default function LabResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Lab Results</Text>
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
        ListEmptyComponent={<Text>No lab results found.</Text>}
      />
    </View>
  );
}
