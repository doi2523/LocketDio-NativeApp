import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import PagerView from "react-native-pager-view";
import ProfileScreen from "./ProfileTab";
import TabTwoScreen from "./MessageTab";
import HomePage from "./HomeTab";

const { width, height } = Dimensions.get("window");

// HomeScreen với horizontal PagerView
export default function HomeScreen() {
  const pagerRef = useRef<PagerView>(null);
  const goToPage = (pageIndex: number) => {
    pagerRef.current?.setPage(pageIndex);
  };

  return (
    <PagerView style={styles.horizontalPager} initialPage={1} ref={pagerRef}>
      <View key="1">
        <ProfileScreen goToPage={goToPage} />
      </View>
      <View key="2">
        <HomePage goToPage={goToPage} />
      </View>
      <View key="3">
        <TabTwoScreen />
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  horizontalPager: { flex: 1 },
  homeContainer: { flex: 1 },
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
