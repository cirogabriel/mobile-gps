import { Tabs } from "expo-router";
import { House, Map, User } from 'lucide-react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function TabsContent() {
    const insets = useSafeAreaInsets();

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
                    height: 85 + insets.bottom, // Altura dinámica basada en safe area
                    paddingBottom: Math.max(insets.bottom, 25), // Padding dinámico
                    paddingTop: 8,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
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

export default function TabsLayout() {
    return (
        <SafeAreaProvider>
            <TabsContent />
        </SafeAreaProvider>
    );
}
