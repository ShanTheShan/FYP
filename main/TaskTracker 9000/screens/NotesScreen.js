import { React, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { AddButton } from "../components/customButtons";

import { db } from "../constants/database";

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
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
  scrollView: {
    height: "100%",
  },
});
