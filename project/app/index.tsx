// app/index.tsx
import 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { account } from '../lib/appwrite';

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Ensure layout is mounted
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100); // 100ms delay

    return () => clearTimeout(timeout);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const init = async () => {
      try {
        const user = await account.get();
        if (user) {
          router.replace('/official/dashboard');
        } else {
          router.replace('/(auth)/login');
        }
      } catch {
        router.replace('/(auth)/login');
      }
    };

    if (isReady) {
      init();
    }
  }, [isReady]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}