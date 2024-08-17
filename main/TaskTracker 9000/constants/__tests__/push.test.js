import * as Notifications from "expo-notifications";
import { createNotification } from "../push";

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

function formatDateTimeToISO(dateString, timeString) {
  const [day, month, year] = dateString.split("/");
  let date = `${year}-${month}-${day}`;

  return date + "T" + timeString;
}

describe("formatDateTimeToISO() check in push.js", () => {
  it("should correctly format the date and time to ISO string", () => {
    const dateString = "02/08/2024";
    const timeString = "14:30:00";

    const result = formatDateTimeToISO(dateString, timeString);

    expect(result).toBe("2024-08-02T14:30:00");
  });
});

describe("createNotification() test", () => {
  it("should call scheduleNotificationAsync() correctly", async () => {
    const mockDate = "15/08/2024";
    const mockTime = "14:30:00";
    const mockTask = "Dummy Task";

    const expectedDate = new Date("2024-08-15T14:30:00");

    await createNotification(mockDate, mockTime, mockTask);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: mockTask,
        body: "You have a task to complete, get to it!",
      },
      trigger: expectedDate,
    });
  });
});
