export default class GameEngine {

    private absoluteStartTime: number; // timestamp of game start
    private lastFrame: number; // timestamp of the last frame
    private keysToListenOn: Array<string|number> = []; // list of keys to use
    private currentKeyState: Array<boolean> = [];
    private keyDownListeners: Array<Function> = [];
    private keyUpListeners: Array<Function> = [];
    private keyChangeListeners: Array<Function> = [];
    
    public time: number;

    constructor(isDevmode: boolean = true) {

        // Assign variables
        this.absoluteStartTime = Date.now();
        this.lastFrame = this.absoluteStartTime;

        // Add events
        window.addEventListener('keydown', e=>{this._onKeyDown(e);});
        window.addEventListener('keyup', e=>{this._onKeyUp(e)});

        if(isDevmode) {
            console.log("[GameEngine] Initialized");
        }

    }

    /** Defines on which keys the engine should listen on */
    public setKeysToListenOn(keys: Array<string|number>): void {
        this.keysToListenOn = [];
        for(let key of keys) {
            if(typeof key === "string") {
                this.keysToListenOn.push(key.toLowerCase());
            } else if(typeof key === "number") {
                this.keysToListenOn.push(key);
            }
        }
        this._updateKeyListeners();
    }
    /** Updates the key listeners after changing keys to listen on
     * Caution: Also clears the current keyup/down state to none pressed
     */
    private _updateKeyListeners(): void {
        this.currentKeyState = [];
        for(let key of this.keysToListenOn) {
            this.currentKeyState[key] = false;
        }
    }

    /** Adds a new onkeydown event and returns it's identifier */
    public onKeyDown(callback: Function): Number {
        this.keyDownListeners.push(callback);
        return this.keyDownListeners.length-1;
    }
    /** Adds a new onkeyup event and returns it's identifier */
    public onKeyUp(callback: Function): Number {
        this.keyUpListeners.push(callback);
        return this.keyUpListeners.length-1;
    }
    /** Adds a new onkeychange event and returns it's identifier */
    public onKeyChange(callback: Function): Number {
        this.keyChangeListeners.push(callback);
        return this.keyChangeListeners.length-1;
    }

    /** Called when a key state is changed (only the ones the engine is listening on) */
    private _onKeyChange(): void {
        for(let listener of this.keyChangeListeners) {
            listener(this.currentKeyState);
        }
    }

    /** Called whenever any keys(regardless of listeners) is pressed down */
    private _onKeyDown(event): void {
        const key = event.key.toLowerCase();
        const keyCode = event.keyCode;
        // string
        if(this.keysToListenOn.includes(key)) {
            this.currentKeyState[key] = true;
        }
        // code/number
        if(this.keysToListenOn.includes(keyCode)) {
            this.currentKeyState[keyCode] = true;
        }
        this._onKeyChange();
    }

    /** Called whenever any keys(regardless of listeners) is released */
    private _onKeyUp(event): void {
        const key = event.key.toLowerCase();
        const keyCode = event.keyCode;
        // string
        if(this.keysToListenOn.includes(key)) {
            this.currentKeyState[key] = false;
        }
        // code/number
        if(this.keysToListenOn.includes(keyCode)) {
            this.currentKeyState[keyCode] = false;
        }
        this._onKeyChange();
    }
}