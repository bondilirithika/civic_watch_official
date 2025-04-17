// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { account, databases } from '../../lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = '67f40cd4001ef4cebb66';
const USERS_COLLECTION_ID = '67f40d02002b7e87af4f';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = await account.get();

        const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
          Query.equal('userId', user.$id),
        ]);

        const userDoc = res.documents[0];
        if (userDoc?.role === 'official') {
          router.replace('/official/dashboard');
        }
      } catch {
        // No session or error — stay on login screen
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await account.deleteSession('current').catch(() => {});

      const session = await account.createEmailPasswordSession(email.trim(), password.trim());
      const user = await account.get();

      const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        Query.equal('userId', user.$id),
      ]);

      const userDoc = res.documents[0];

      if (!userDoc || userDoc.role !== 'official') {
        await account.deleteSession('current');
        throw new Error('Access denied. This portal is for officials only.');
      }

      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/official/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Official Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Login" onPress={handleLogin} color="#007bff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});