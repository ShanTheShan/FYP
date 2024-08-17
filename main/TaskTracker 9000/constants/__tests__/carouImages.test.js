import { tutorialImages } from "../carouImages";

describe("tutorialImages array checks", () => {
  it("should be an array", () => {
    expect(Array.isArray(tutorialImages)).toBe(true);
  });

  it("should contain objects", () => {
    tutorialImages.forEach((item) => {
      expect(typeof item).toBe("object");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("img");
    });
  });

  it("should have valid image paths", () => {
    tutorialImages.forEach((item) => {
      expect(item.img).toBeDefined();
    });
  });

  it("should contain the correct number of tutorial items", () => {
    expect(tutorialImages.length).toBe(8);
  });
});
