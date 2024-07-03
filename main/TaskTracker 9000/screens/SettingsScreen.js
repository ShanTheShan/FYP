import { React, useState, useEffect, useMemo, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";

import { Cell, Section, TableView } from "react-native-tableview-simple";
import RadioGroup from "react-native-radio-buttons-group";
import { themeContext } from "../context/themeContext";

const handleTurnNotificationsOn = async () => {
  await Linking.openSettings();
};

export default function SettingsScreen() {
  //retrieve global theme state
  const { currentTheme, setCurrentTheme } = useContext(themeContext);

  //create a project state modal
  const [themeModal, toggleThemeModal] = useState(false);

  //for radio buttons selection
  const [selectedId, setSelectedId] = useState();

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "Dark",
        value: "Dark",
      },
      {
        id: "2",
        label: "Light",
        value: "Light",
      },
    ],
    []
  );

  //handle theme saving when "Done" is pressed in modal
  const handleTheme = () => {
    if (selectedId == "1") {
      setCurrentTheme("dark");
      toggleThemeModal(false);
    }
    if (selectedId == "2") {
      setCurrentTheme("light");
      toggleThemeModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navigationView}>
        <Text style={styles.PageTitle}>Settings</Text>
      </View>
      <View style={styles.settingsContainer}>
        <TableView>
          {/* if theme pressed, launch modal */}
          {themeModal ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={themeModal}
              statusBarTranslucent={true}
            >
              <View style={styles.themeModalView}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={{ fontSize: 25 }}>Select Theme</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                    containerStyle={styles.radioGroup}
                  />
                  <TouchableOpacity
                    style={{ backgroundColor: "green", borderRadius: 10, margin: 10 }}
                    onPress={handleTheme}
                  >
                    <Text style={{ fontSize: 15, padding: 10 }}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            <Section>
              <Cell
                contentContainerStyle={{ height: 70 }}
                onPress={handleTurnNotificationsOn}
                cellContentView={<Text style={{ fontSize: 17 }}>Notifications</Text>}
              />
              <Cell
                contentContainerStyle={{ height: 70 }}
                onPress={() => {
                  toggleThemeModal(true);
                }}
                cellContentView={<Text style={{ fontSize: 17 }}>Theme</Text>}
              />
            </Section>
          )}
        </TableView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: "100%",
  },
  navigationView: {
    flex: 1,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    flex: 5,
    margin: 20,
  },
  PageTitle: {
    fontSize: 30,
    color: "black",
    paddingTop: "10%",
  },
  themeModalView: {
    flex: 1,
    marginVertical: "70%",
    marginHorizontal: "10%",
    backgroundColor: "grey",
    borderRadius: 20,
  },
  radioGroup: {
    flex: 1,
    marginVertical: "10%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
