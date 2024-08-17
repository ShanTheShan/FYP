import { times } from "../timePreset";

describe("timePreset array checks", () => {
  it("should be an array", () => {
    expect(Array.isArray(times)).toBe(true);
  });
  it("should be of length 9", () => {
    expect(times.length).toBe(9);
  });
});
