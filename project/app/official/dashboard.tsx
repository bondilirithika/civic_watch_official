import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { databases, account } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
const DATABASE_ID = '67f40cd4001ef4cebb66';
const COMPLAINTS_COLLECTION_ID = '67f40def0016433c014e';

interface Complaint {
  $id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  submittedAt: string;
  assignedOfficial: string;
  mediaUrl?: string;
}

export default function OfficialHomeScreen() {
  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to fetch complaints from the database
  const fetchPendingComplaints = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COMPLAINTS_COLLECTION_ID, [
        Query.equal('status', 'pending'),
      ]);

      const complaints: Complaint[] = response.documents.map((doc) => ({
        $id: doc.$id,
        title: doc.title || '',
        description: doc.description || '',
        category: doc.category || '',
        location: doc.location || '',
        status: doc.status || 'pending',
        submittedAt: doc.submittedAt || '',
        assignedOfficial: doc.assignedOfficial || '',
        mediaUrl: doc.mediaUrl || '',
      }));

      setPendingComplaints(complaints);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of pending complaints
    fetchPendingComplaints();

    // Set up polling to fetch complaints every 10 seconds (10000ms)
    const intervalId = setInterval(fetchPendingComplaints, 60000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  const acceptComplaint = async (complaintId: string) => {
    try {
      const user = await account.get();
      const currentUserId = user.$id;

      await databases.updateDocument(
        DATABASE_ID,
        COMPLAINTS_COLLECTION_ID,
        complaintId,
        {
          status: 'in_progress',
          assignedOfficial: currentUserId,
        }
      );

      router.push({
        pathname: '/official/complaintId',
        params: { complaintId },
      });
    } catch (err) {
      console.error("Failed to accept complaint:", err);
      Alert.alert("Error", "Failed to accept the complaint. Please try again.");
    }
  };

  const renderItem = ({ item }: { item: Complaint }) => (
    <View style={styles.complaintCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.location}>Location: {item.location}</Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => acceptComplaint(item.$id)}
      >
        <Text style={styles.acceptButtonText}>Accept Complaint</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.heading}>Pending Complaints</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={pendingComplaints}
          renderItem={renderItem}
          keyExtractor={(item) => item.$id}
        />
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f7fc',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  complaintCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
