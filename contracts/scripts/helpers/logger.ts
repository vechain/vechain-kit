export class Logger {
    log: typeof console.log;
    error: typeof console.error;
    warn: typeof console.warn;
    info: typeof console.info;

    constructor(isEnabled: boolean) {
        const noop = () => {};

        this.log = isEnabled ? console.log.bind(console) : noop;
        this.error = isEnabled ? console.error.bind(console) : noop;
        this.warn = isEnabled ? console.warn.bind(console) : noop;
        this.info = isEnabled ? console.info.bind(console) : noop;
    }
}
