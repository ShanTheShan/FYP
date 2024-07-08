import { React, useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { CameraView, Camera } from "expo-camera";
import { SmallButton } from "../components/customButtons";

import * as ImagePicker from "expo-image-picker";

function RenderCamera({ navigation, route }) {
  //the camera screen is being shared by both projects and notes stack screen, so we need to know which stack we are coming from, to handle the relevant component UI

  let id = null;

  let navState = navigation.getState();
  navState = navState.routeNames;
  navState = navState.join(",").replace(/,+/g, "/");
  console.log(navState);

  switch (navState) {
    case "My Notes/Create Note/Camera Note":
      ({ id } = "empty");
      break;
    case "Projects Overview/Project Details/Camera/Create Task":
      //the project id we a creating a image for
      ({ id } = route.params);
    default:
      break;
  }

  //camera ref
  let cameraRef = useRef();

  //camera front back, persmissionmstate
  const [facing, setFacing] = useState("back");
  const [permission, setPermission] = useState(false);

  //show capture image preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const [picturePreview, setPreview] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      try {
        //set the permission granted by the user to state
        await Camera.requestCameraPermissionsAsync().then((value) => {
          setPermission(value.granted);
        });
      } catch (err) {
        console.log("Try catch error:", err);
      }
    };
    getPermission();
  }, []);

  //switch front back camera
  const switchCamera = () => {
    if (facing === "back") {
      setFacing("front");
    } else {
      setFacing("back");
    }
  };

  //open device gallery
  const openGallery = async () => {
    try {
      let photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      setPreviewVisible(true);
      setPreview(photo.assets[0]);
    } catch (error) {
      console.log("openGallery() error: ", error);
    }
  };

  //take a photo
  const takePhoto = async () => {
    const options = {
      quality: 1,
      exif: false,
    };
    try {
      const photo = await cameraRef.current.takePictureAsync(options);
      setPreviewVisible(true);
      setPreview(photo);
    } catch (err) {
      console.log("Try catch error: ", err);
    }
  };

  //retake photo after one was taken
  const retakePhoto = () => {
    setPreviewVisible(false);
    setPreview(null);
  };

  const savePhoto = () => {
    if (navState === "My Notes/Create Note/Camera Note") {
      const photoUri = picturePreview;
      navigation.navigate("Create Note", { id: id, photoUri: photoUri });
    }
    if (navState == "Projects Overview/Project Details/Camera/Create Task") {
      const photoUri = picturePreview;
      navigation.navigate("Create Task", { id: id, photoUri: photoUri });
    }
  };

  return (
    <View style={styles.container}>
      {permission ? (
        <View style={{ flex: 1, width: "100%" }}>
          {previewVisible && picturePreview ? (
            <CapturedImage
              photo={picturePreview}
              navigation={navigation}
              retakePhoto={retakePhoto}
              savePhoto={savePhoto}
            />
          ) : (
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
              <View>
                {navState === "My Notes/Create Note/Camera Note" ? (
                  <TouchableOpacity onPress={() => navigation.navigate("Create Note", { id: id })}>
                    <Text style={{ fontSize: 30, padding: 30 }}>⬅️</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => navigation.navigate("Create Task", { id: id })}>
                    <Text style={{ fontSize: 30, padding: 30 }}>⬅️</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={switchCamera}>
                  <Text style={{ fontSize: 30 }}>🔁</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                  <Text style={{ fontSize: 40 }}>🔘</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={openGallery}>
                  <Text style={{ fontSize: 40 }}>🎞</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          )}
        </View>
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Create Task", { id: id })}>
              <Text style={{ fontSize: 30, padding: 30 }}>⬅️</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>Camera permission denied. Allow camera permission in application Settings</Text>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const CapturedImage = ({ photo, navigation, retakePhoto, savePhoto, id, navState }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: photo && photo.uri }} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.buttonContainer}>
            <SmallButton
              title={"Use Photo"}
              color={"darkgreen"}
              press={() => {
                savePhoto(navigation, id, navState);
              }}
            />

            <SmallButton title={"Retake Photo"} color={"darkgreen"} press={retakePhoto} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    height: "100%",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    margin: 30,
  },
});

export default RenderCamera;
