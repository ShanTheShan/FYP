import { React, useState, useEffect, useContext } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Calendar } from "react-native-calendars";

import moment from "moment";

import { themeContext } from "../context/themeContext";

export default function TodoScreen() {
  //global theme state
  const { currentTheme } = useContext(themeContext);

  //states to determine date
  const today = moment().format("YYYY-MM-DD");
  const [dateSelected, setDateSelected] = useState(today);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={currentTheme === "dark" ? styles.todoViewDark : styles.todoViewLight}>
        <Calendar
          onDayPress={(day) => {
            setDateSelected(day.dateString);
          }}
          markedDates={{
            [dateSelected]: { selected: true },
          }}
        />
        <Text style={{ fontSize: 20 }}>{dateSelected}</Text>
      </View>
      <ScrollView style={currentTheme === "dark" ? styles.scrollViewDark : styles.scrollViewLight}>
        <TableView>
          <Section>
            <Cell title="Task 1" />
            <Cell title="Task 2" />
          </Section>
        </TableView>
      </ScrollView>
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
