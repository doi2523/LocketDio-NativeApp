import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeHeader from "@/components/ui/headerhome";
import HistoryTab from "./HistoryTab";
import MainHomeTab from "./MainHomeTab";

export default function HomePage({
  goToPage,
}: {
  goToPage: (pageIndex: number) => void;
}) {
  const verticalPagerRef = useRef<PagerView>(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.homeContainer}>
      {/* Header cố định */}
      <HomeHeader goToPage={goToPage} />

      {/* Vertical PagerView chiếm phần còn lại */}
      <PagerView
        style={[styles.verticalPager]} // header cao ~60
        initialPage={0}
        orientation="vertical"
        ref={verticalPagerRef}
      >
        {/* Page 1 */}
        <View key="1" style={styles.page}>
          <MainHomeTab />
        </View>

        {/* Page 2 */}
        <View key="2" style={styles.page}>
          <HistoryTab goToPage={goToPage} />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalPager: { flex: 1 },
  homeContainer: { flex: 1, backgroundColor: "#000000ff" },
  verticalPager: { flex: 1 },
  page: { flex: 1, zIndex: 5 },
  pageContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
});
