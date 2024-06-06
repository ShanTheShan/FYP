import { React, useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, SafeAreaView, Alert, TouchableOpacity } from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import * as ImagePicker from "expo-image-picker";

function RenderCamera({ navigation }) {
  //CAMERA
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  async function takePhoto() {
    const options = { quality: 1, base64: true, fixOrientation: true, exif: true };
    await this.camera.takePictureAsync(options).then((photo) => {
      photo.exif.Orientation = 1;
      console.log(photo);
    });
  }

  //select image state
  const [imagePath, setImagePath] = useState("");

  async function openGallery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImagePath(result.assets[0].uri);
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View>
          <TouchableOpacity title="Back" onPress={() => navigation.navigate("Project_Details")}>
            <Text style={{ fontSize: 30, padding: 30 }}>⬅️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={{ fontSize: 40 }}>🔘</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Text style={{ fontSize: 40 }}>🎞</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 30,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default RenderCamera;
