import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { databases } from '../../lib/appwrite';
import { Query } from 'appwrite';
import * as Location from 'expo-location';

// Define the type for the complaint object
interface Complaint {
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  sosAlertSent: boolean;
}

export default function ComplaintDetailsScreen() {
  const { complaintId } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [timerStatus, setTimerStatus] = useState<string>('Inactive');
  const [sosAlertSent, setSosAlertSent] = useState<boolean>(false);
  const [noComplaintsInProgress, setNoComplaintsInProgress] = useState<boolean>(false);
  const [sosInAction, setSosInAction] = useState<boolean>(false); // Track if SOS is in action
  const [isResolved, setIsResolved] = useState<boolean>(false); // Track if the complaint is resolved
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Location state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (complaintId) {
          const response = await databases.getDocument(
            '67f40cd4001ef4cebb66',
            '67f40def0016433c014e',
            complaintId as string
          );
          const complaintData: Complaint = {
            title: response.title,
            description: response.description,
            category: response.category,
            location: response.location,
            status: response.status,
            sosAlertSent: response.sosAlertSent || false,
          };

          setComplaint(complaintData);
          console.log(complaint)

          if (response.status === 'in_progress') {
            startTimer();
            setTimerStatus('Active');
          }
          if (response.sosAlertSent) {
            setSosAlertSent(true);
          }
        } else {
          setNoComplaintsInProgress(true);
        }
      } catch (err) {
        console.error("Failed to fetch complaint details:", err);
      }
    };

    fetchData();

    // Automatically fetch user location when the screen is loaded
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        console.log("User Location:", location);
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to send SOS.');
      }
    };

    fetchUserLocation();

    // Clear timers when the component unmounts
    return () => clearTimers();
  }, [complaintId]);

  const startTimer = () => {
    clearTimers();
    intervalRef.current = setInterval(() => {
      sendSOSAlert();
    }, 30000); // 30 seconds for SOS alert

    timeoutRef.current = setTimeout(async () => {
      if (!(await requestLocationPermission()) && !userLocation) {
        return; // If location is unavailable or permission is denied, exit
      }
  
      console.log("User Location:", userLocation); // Check if location is available
      sendSOSMessage();
    }, 60000); // 1 minute before sending SOS message
  };

  const sendSOSAlert = () => {
    Alert.alert("SOS Alert", "Please respond to this complaint. Timer will reset when you respond.");
    setSosAlertSent(true);
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      console.log("Location fetched:", location);
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      return true;
    } else {
      Alert.alert('Permission Denied', 'Location permission is required to send SOS.');
      return false;
    }
  };

  const sendSOSMessage = async () => {
    try {
      if (!userLocation) {
        Alert.alert('Location Error', 'Unable to fetch user location');
        return;
      }

      const googleMapsLink = `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
      const phoneNumbers = ["+919490223242"];
      const complaintLocation = complaint?.location || 'Unknown location';
      const message = `Please respond to this urgent SOS request. Immediate help is needed! 
      User Location: ${googleMapsLink} 
      Complaint Location: ${complaintLocation}`;

      const response = await fetch('http://192.168.50.75:5000/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumbers: phoneNumbers,
          message: message,
          location: complaintLocation,
        }),
      });

      if (response.ok) {
        console.log('SOS messages sent successfully!');

        await databases.updateDocument(
          '67f40cd4001ef4cebb66',
          '67f40def0016433c014e',
          complaintId as string,
          { status: 'pending' }
        );

        setSosInAction(true);
        clearTimers();
      } else {
        throw new Error('Failed to send SOS messages');
      }
    } catch (err) {
      console.error("Failed to send SOS message:", err);
    }
  };

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleResponse = async () => {
    try {
      await databases.updateDocument(
        '67f40cd4001ef4cebb66',
        '67f40def0016433c014e',
        complaintId as string,
        { status: 'in_progress' }
      );

      Alert.alert('Response Recorded', 'Your response has been noted. Timer reset.');
      setTimerStatus('Active');
      setSosAlertSent(false);
      startTimer();
    } catch (err) {
      console.error('Failed to respond:', err);
    }
  };

  const handleResolve = async () => {
    try {
      await databases.updateDocument(
        '67f40cd4001ef4cebb66',
        '67f40def0016433c014e',
        complaintId as string,
        { status: 'resolved' }
      );

      Alert.alert('Complaint Resolved', 'The complaint has been marked as resolved.');

      setIsResolved(true);
      clearTimers();

      setComplaint((prevComplaint: Complaint | null) => {
        if (prevComplaint) {
          return {
            ...prevComplaint,
            status: 'resolved',
          };
        }
        return prevComplaint;
      });

      setTimerStatus('Inactive');
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaint Details</Text>
      {complaint ? (
        <>
          <Text style={styles.text}>Title: {complaint.title}</Text>
          <Text style={styles.text}>Description: {complaint.description}</Text>
          <Text style={styles.text}>Category: {complaint.category}</Text>
          <Text style={styles.text}>Location: {complaint.location}</Text>
          <Text style={styles.text}>Status: {sosInAction ? 'Pending' : complaint.status}</Text>
          <Text style={styles.text}>Timer Status: {sosInAction ? 'Inactive' : timerStatus}</Text>

          {sosInAction && (
            <Text style={styles.sosInAction}>SOS in Action...</Text>
          )}

          {isResolved && (
            <Text style={styles.congratulations}>🎉 Complaint Resolved Successfully! 🎉</Text>
          )}

          {!sosInAction && !isResolved && (
            <>
              <TouchableOpacity 
                style={[styles.button, sosInAction && styles.buttonDisabled]} 
                onPress={handleResponse} 
                disabled={sosInAction} 
              >
                <Text style={styles.buttonText}>Respond to SOS</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.resolveButton, sosInAction && styles.buttonDisabled]} 
                onPress={handleResolve} 
                disabled={sosInAction} 
              >
                <Text style={styles.buttonText}>Mark as Resolved</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, sosInAction && styles.buttonDisabled]} 
                onPress={sendSOSMessage} 
                disabled={sosInAction} 
              >
                <Text style={styles.buttonText}>Send SOS</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <Text>{noComplaintsInProgress ? "No Complaints in Progress." : "Loading..."}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f7fc' },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 20 },
  text: { fontSize: 18, marginVertical: 8, color: '#333' },
  sosInAction: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#d9534f', 
    marginVertical: 20, 
    textAlign: 'center' 
  },
  congratulations: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: { 
    backgroundColor: '#007bff', 
    paddingVertical: 12, 
    borderRadius: 8, 
    marginTop: 10, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resolveButton: { 
    backgroundColor: '#dc3545', 
    paddingVertical: 12, 
    borderRadius: 8, 
    marginTop: 10, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
