import { View, StyleSheet } from "react-native";
import { WorkUruApp } from "@/lib/workuru-app";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <WorkUruApp />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
});
