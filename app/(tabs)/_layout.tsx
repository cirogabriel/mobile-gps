import { Tabs } from "expo-router";
import { House, Map, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#F8F8F8",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E7",
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <House size={size || 24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <Map size={size || 24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="author"
        options={{
          title: "Autor",
          tabBarIcon: ({ color, size }) => (
            <User size={size || 24} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
