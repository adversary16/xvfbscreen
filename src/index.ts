import { execSync, spawn } from "child_process";
import { rmSync } from "fs";
import { platform, tmpdir } from "os";
import { join } from "path";

const SUPPORTED_PLATFORMS = ["linux", "darwin"];

const log = (...data: any[]) => {
    if (process.env.LOGLEVEL === 'debug') {
        console.log(...data)
    }
}

if (!SUPPORTED_PLATFORMS.includes(platform())) {
  console.error(
    "Only these platforms are currently supported:",
    SUPPORTED_PLATFORMS.join(", "),
  );
  process.exit(1);
}

const SCREEN_PROCESS_PATTERN = RegExp(/Xvfb.*:(?<screenNumber>\d{0,4})/);

interface IXVFBScreen {
  pid: number;
  id: number;
}

export class XVFB {
  static startFrom: number = 99;
  readonly id: number;
  readonly pid: number;
  constructor(screenId?: number) {
    const {id, pid } = XVFB.create(screenId);
    this.id = id;
    this.pid = pid;
  }

  /**
   * @returns {[number]}
   *  ids of active XVFB screens
   */
  static get DISPLAYS() {
    const cliOutput = execSync('ps -ao "cmd,pid" | grep Xvfb')
      .toString("utf-8")
      .split("\n");
    return cliOutput.reduce((acc, outputString) => {
      const [cmd, pid] = outputString.split("    ").filter(Boolean);
      if (cmd && cmd.trim().startsWith("Xvfb")) {
        const { screenNumber } = SCREEN_PROCESS_PATTERN.exec(cmd)?.groups as {
          screenNumber?: string;
        };
        if (screenNumber) {
          acc.push({ id: Number(screenNumber), pid: Number(pid.trim()) });
        }
      }
      return acc;
    }, new Array<IXVFBScreen>());
  }

  /**
   * @param  {number} screenId number of the screen you want to delete. If screen does not exist, will log an error.
   */
  static kill(screenId: number | IXVFBScreen) {
    const sid = typeof screenId == 'number' ? screenId : screenId.id;
    const pid = typeof screenId == 'number' 
        ? XVFB.DISPLAYS.find(({ id }) => id === sid)?.pid
        : screenId.pid
    if (!pid) {
      console.error("Screen id", sid ,"does not exist");
    } else {
      execSync(`kill -9 ${pid}`).toString("utf-8");
      rmSync(join(tmpdir(), `X${sid}-lock`), { force: true });
    }
  }

  kill() {
    XVFB.kill(this.id);
  }

  static create(screenId?: number): IXVFBScreen {
    const usedScreens = XVFB.DISPLAYS.map(({ id }) => id);
    if (screenId && usedScreens.includes(screenId)) throw new Error(`Screen ${screenId} is already created`);
    const id = screenId ?? Math.max(...usedScreens, XVFB.startFrom) + 1;
    log(`Screen with id ${id} will be created`);
    const { stdout, stderr, pid } = spawn("Xvfb", [`:${id}`]);
    stderr.on("data", (d) => console.log(d.toString("utf-8")));
    stdout.on("data", (c) => console.log(c.toString("utf-8")));
    if (!pid) throw new Error('failed to create');
    log(`Screen with id ${id} runs in process ${pid}`);
    return { id, pid };
  }
}