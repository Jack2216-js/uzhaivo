import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' } // Hide default tabs, we use custom
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}