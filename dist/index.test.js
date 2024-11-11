"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const _1 = require(".");
(0, vitest_1.test)("static:create:sync:autoid", () => {
    const initialDisplayListLength = _1.XVFB.DISPLAYS.length;
    const newScreen = _1.XVFB.create();
    (0, vitest_1.expect)(newScreen.id).toBeGreaterThanOrEqual(_1.XVFB.startFrom);
    (0, vitest_1.expect)(_1.XVFB.DISPLAYS.length).toBeGreaterThan(initialDisplayListLength);
    _1.XVFB.kill(newScreen);
    (0, vitest_1.expect)(_1.XVFB.DISPLAYS.length).toEqual(initialDisplayListLength);
});
(0, vitest_1.test)("static:create:sync:manualid", () => {
    const screenId = 128;
    const initialDisplayListLength = _1.XVFB.DISPLAYS.length;
    const newScreen = _1.XVFB.create(screenId);
    (0, vitest_1.expect)(newScreen.id).toEqual(screenId);
    (0, vitest_1.expect)(_1.XVFB.DISPLAYS.length).toBeGreaterThan(initialDisplayListLength);
    _1.XVFB.kill(screenId);
    (0, vitest_1.expect)(_1.XVFB.DISPLAYS.length).toEqual(initialDisplayListLength);
});
