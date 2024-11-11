import { expect, test } from "vitest";
import { XVFB } from ".";

test("static:create:sync:autoid", () => {
  const initialDisplayListLength = XVFB.DISPLAYS.length;
  const newScreen = XVFB.create();
  expect(newScreen.id).toBeGreaterThanOrEqual(XVFB.startFrom);
  expect(XVFB.DISPLAYS.length).toBeGreaterThan(initialDisplayListLength);
  XVFB.kill(newScreen);
  expect(XVFB.DISPLAYS.length).toEqual(initialDisplayListLength);
});

test("static:create:sync:manualid", () => {
  const screenId = 128;
  const initialDisplayListLength = XVFB.DISPLAYS.length;
  const newScreen = XVFB.create(screenId);
  expect(newScreen.id).toEqual(screenId);
  expect(XVFB.DISPLAYS.length).toBeGreaterThan(initialDisplayListLength);
  XVFB.kill(screenId);
  expect(XVFB.DISPLAYS.length).toEqual(initialDisplayListLength);
});