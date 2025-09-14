import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  Octicons,
} from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

interface ProfileScreenProps {
  goToPage: (pageKey: string) => void;
}

export default function MainHomeTab({ goToPage }: ProfileScreenProps) {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  // Kiểm tra quyền camera
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>
            Ứng dụng cần quyền truy cập camera để chụp ảnh
          </Text>
          <Pressable
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Cấp quyền Camera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleFlipCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1, // giảm xuống để tăng tốc
        skipProcessing: true, // bỏ hậu kỳ → nhanh hơn nhiều
        base64: false,
        shutterSound: false,
        mirror: facing === "front",
      });

      if (photo?.uri) {
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleOpenGallery = async () => {
    try {
      // Yêu cầu quyền truy cập thư viện ảnh
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Tỷ lệ vuông
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Lỗi khi mở thư viện:", error);
      Alert.alert("Lỗi", "Không thể mở thư viện ảnh");
    }
  };

  const handleCancelPhoto = () => {
    setPhotoUri(null);
  };

  const handleSendPhoto = () => {
    if (photoUri) {
      Alert.alert("Gửi ảnh", `Đang gửi ảnh: ${photoUri.split("/").pop()}`, [
        { text: "Hủy", style: "cancel" },
        {
          text: "Gửi",
          onPress: () => {
            // Thực hiện logic gửi ảnh ở đây
            console.log("Gửi ảnh:", photoUri);
            setPhotoUri(null); // Reset sau khi gửi
          },
        },
      ]);
    }
  };

  const handleCustomAction = () => {
    Alert.alert("Tùy chỉnh", "Chức năng chỉnh sửa ảnh", [
      { text: "Hủy", style: "cancel" },
      { text: "Chỉnh sửa", onPress: () => console.log("Mở editor") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Camera hoặc ảnh đã chụp */}
      <View style={styles.cameraContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.cameraBox} />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.cameraBox}
            facing={facing}
            mirror={facing === "front"} // Chỉ mirror camera trước
            autofocus="on"
          />
        )}

        {/* Overlay loading khi đang chụp */}
        {isCapturing && (
          <View style={styles.capturingOverlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.capturingText}>Đang chụp...</Text>
          </View>
        )}
      </View>

      {/* Nút điều khiển */}
      <View style={styles.buttonRow}>
        {photoUri ? (
          // Chế độ xem ảnh đã chụp
          <>
            <Pressable
              style={styles.buttonArea}
              onPress={handleCancelPhoto}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            >
              <View style={styles.actionButton}>
                <Entypo name="cross" size={30} color="white" />
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleSendPhoto}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            >
              <View style={[styles.captureButton, styles.sendButton]}>
                <MaterialIcons name="send" size={28} color="white" />
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleCustomAction}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            >
              <View style={styles.actionButton}>
                <FontAwesome name="edit" size={24} color="white" />
              </View>
            </Pressable>
          </>
        ) : (
          // Chế độ chụp ảnh
          <>
            <Pressable
              style={styles.buttonArea}
              onPress={handleOpenGallery}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            >
              <View style={styles.actionButton}>
                <FontAwesome name="photo" size={28} color="white" />
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleTakePhoto}
              disabled={isCapturing}
              android_ripple={{ color: "rgba(255,255,255,0.3)" }}
            >
              <View
                style={[
                  styles.captureButton,
                  isCapturing && styles.capturingButton,
                ]}
              >
                {isCapturing ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : null}
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleFlipCamera}
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            >
              <View style={styles.actionButton}>
                <MaterialIcons name="flip-camera-ios" size={30} color="white" />
              </View>
            </Pressable>
          </>
        )}
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: -50,
        }}
      >
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center", // căn ngang
            flexDirection: "column",
          }}
          onPress={() => goToPage("history")}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "600",
              // khoảng cách giữa chữ và icon
            }}
          >
            Lịch sử
          </Text>
          <Octicons name="chevron-down" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    position: "relative",
  },
  cameraBox: {
    width: width,
    aspectRatio: 1,
    borderRadius: 64,
    overflow: "hidden",
    backgroundColor: "black",
  },
  permissionBox: {
    width: width * 0.8,
    padding: 24,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  capturingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 64,
  },
  capturingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    width: width,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 8,
    height: 140,
  },
  buttonArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  capturingButton: {
    backgroundColor: "#f0f0f0",
  },
  sendButton: {
    backgroundColor: "#34C759",
    borderColor: "#28A745",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
