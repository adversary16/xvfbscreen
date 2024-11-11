interface IXVFBScreen {
    pid: number;
    id: number;
}
export declare class XVFB {
    static startFrom: number;
    readonly id: number;
    readonly pid: number;
    constructor(screenId?: number);
    /**
     * @returns {[number]}
     *  ids of active XVFB screens
     */
    static get DISPLAYS(): IXVFBScreen[];
    /**
     * @param  {number} screenId number of the screen you want to delete. If screen does not exist, will log an error.
     */
    static kill(screenId: number | IXVFBScreen): void;
    kill(): void;
    static create(screenId?: number): IXVFBScreen;
}
export {};
