import { Platform, StyleSheet, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import { Fonts } from "@/constants/theme";

interface ProfileScreenProps {
  goToPage: (pageIndex: number) => void;
}

export default function ProfileScreen({ goToPage }: ProfileScreenProps) {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.crop.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Profile
        </ThemedText>
      </ThemedView>

      <ThemedText>Welcome to your profile! Swipe right to go back.</ThemedText>

      <Collapsible title="Account Info">
        <ThemedText>
          This section can display account info such as username, email, etc.
        </ThemedText>
      </Collapsible>
      <Button title="Go Home" onPress={() => goToPage(1)} />


      <Collapsible title="Settings">
        <ThemedText>
          You can link to settings pages or other profile-related options here.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/">
          <ThemedText type="link">Learn more about Expo Router</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
});
