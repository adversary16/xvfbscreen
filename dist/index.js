"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XVFB = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const SUPPORTED_PLATFORMS = ["linux", "darwin"];
if (!SUPPORTED_PLATFORMS.includes((0, os_1.platform)())) {
    console.error("Only these platforms are currently supported:", SUPPORTED_PLATFORMS.join(", "));
    process.exit(1);
}
const SCREEN_PROCESS_PATTERN = RegExp(/Xvfb.*:(?<screenNumber>\d{0,4})/);
class XVFB {
    constructor(screenId) {
        const { id, pid } = XVFB.create(screenId);
        this.id = id;
        this.pid = pid;
    }
    /**
     * @returns {[number]}
     *  ids of active XVFB screens
     */
    static get DISPLAYS() {
        const cliOutput = (0, child_process_1.execSync)('ps -ao "cmd,pid" | grep Xvfb')
            .toString("utf-8")
            .split("\n");
        return cliOutput.reduce((acc, outputString) => {
            const [cmd, pid] = outputString.split("    ").filter(Boolean);
            if (cmd && cmd.trim().startsWith("Xvfb")) {
                const { screenNumber } = SCREEN_PROCESS_PATTERN.exec(cmd)?.groups;
                if (screenNumber) {
                    acc.push({ id: Number(screenNumber), pid: Number(pid.trim()) });
                }
            }
            return acc;
        }, new Array());
    }
    /**
     * @param  {number} screenId number of the screen you want to delete. If screen does not exist, will log an error.
     */
    static kill(screenId) {
        const sid = typeof screenId == 'number' ? screenId : screenId.id;
        const pid = typeof screenId == 'number'
            ? XVFB.DISPLAYS.find(({ id }) => id === sid)?.pid
            : screenId.pid;
        if (!pid) {
            console.error("Screen id", sid, "does not exist");
        }
        else {
            (0, child_process_1.execSync)(`kill -9 ${pid}`).toString("utf-8");
            (0, fs_1.rmSync)((0, path_1.join)((0, os_1.tmpdir)(), `X${sid}-lock`), { force: true });
        }
    }
    kill() {
        XVFB.kill(this.id);
    }
    static create(screenId) {
        const usedScreens = XVFB.DISPLAYS.map(({ id }) => id);
        if (screenId && usedScreens.includes(screenId))
            throw new Error(`Screen ${screenId} is already created`);
        const id = screenId ?? Math.max(...usedScreens, XVFB.startFrom) + 1;
        const { stdout, stderr, pid } = (0, child_process_1.spawn)("Xvfb", [`:${id}`]);
        stderr.on("data", (d) => console.log(d.toString("utf-8")));
        stdout.on("data", (c) => console.log(c.toString("utf-8")));
        if (!pid)
            throw new Error('failed to create');
        return { id, pid };
    }
}
exports.XVFB = XVFB;
XVFB.startFrom = 99;
