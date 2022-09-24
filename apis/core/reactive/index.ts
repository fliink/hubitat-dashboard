
export class Ripple<T> {
    private _callback: (val: T) => any;
    private _next: Ripple<any>;

    constructor(value?: T) {

    }

    drop(value: T) {
        if (this._callback) {
            const v = this._callback(value);
            this._next?.drop(v);
        }
    }

    react<R>(callback: (val: T) => R): Ripple<R> {
        this._callback = callback;
        const ripple = new Ripple<R>();
        this._next = ripple;
        return ripple;
    }

    
}


