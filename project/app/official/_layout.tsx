import { Tabs } from 'expo-router';
import { MapPin, List, Bell, CircleUser as UserCircle, CircleAlert  } from 'lucide-react-native';

// Define the types for tabBarIcon props
interface TabBarIconProps {
  color: string;  // color will be a string (e.g., hex color code or color name)
  size: number;   // size will be a number (e.g., icon size)
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Reports',
          headerShown: false,
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <List size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="complaintId"
        options={{
          title: 'Current',
          headerShown: false,
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <CircleAlert  size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <UserCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
