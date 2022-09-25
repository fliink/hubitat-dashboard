import { Zynjectable } from "./zynject/zynject";

@Zynjectable()
export class ConfigurationService {

    private _settings: { [key: string]: string } = {};

    constructor() {

    }

    get(key: string): string {
        return this._settings[key];
    }

    set(key: string, value: string) {
        return this._settings[key] = value;
    }
}