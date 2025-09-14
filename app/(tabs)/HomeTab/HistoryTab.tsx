import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

export default function HistoryTab({
  goToPage,
}: {
  goToPage: (pageIndex: number) => void;
}) {
  return (
    <ThemedView style={styles.pageContent}>
      <ThemedText type="title">More Content</ThemedText>
      <ThemedText>Đây là phần nội dung thứ hai.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000000ff",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
});
