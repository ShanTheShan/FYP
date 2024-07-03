import { React, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { AddButton } from "../components/customButtons";

import { db } from "../constants/database";

import { themeContext } from "../context/themeContext";

//custom cell for project board page
const NoteCell = (props) => (
  <Cell
    onPress={props.action}
    {...props}
    cellContentView={
      <View>
        <Text style={{ fontSize: 20 }}>{props.title}</Text>
      </View>
    }
  />
);

export default function NotesScreen({ navigation }) {
  //global theme state
  const { currentTheme } = useContext(themeContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={currentTheme === "dark" ? styles.scrollViewDark : styles.scrollViewLight}>
        <TableView>
          <Section>
            <Cell title={"Note 1"} />
          </Section>
        </TableView>
      </ScrollView>
      <AddButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  safeArea: {
    height: "100%",
  },
  scrollViewLight: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  scrollViewDark: {
    height: "100%",
    backgroundColor: "#1C1C1C",
  },
});
