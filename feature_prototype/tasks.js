import { React, useState, useEffect } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Calendar } from "react-native-calendars";
import moment from "moment";

function TaskScreen() {
  //states to determine date
  const today = moment().format("YYYY-MM-DD");
  const [dateSelected, setDateSelected] = useState(today);

  return (
    <SafeAreaView>
      <View>
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
      <TableView>
        <Section>
          <Cell title="Task 1" />
          <Cell title="Task 2" />
        </Section>
      </TableView>
    </SafeAreaView>
  );
}

export default TaskScreen;
