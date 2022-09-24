
export class Ripple<T> {
    private _callback: (val: T) => any;
    private _next: Ripple<any>;
    private _value?: T;

    constructor(value?: T) {
        this._value = value;
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

    static all<T>(ripples: Array<Ripple<T>>): Ripple<Array<T | undefined>>{
        const combined = new Ripple<Array<T | undefined>>
        for(var ripple of ripples){
            ripple.react(x=>{
                const values = ripples.map(y=>y._value);
                combined.drop(values);
            });
        }
        return combined;
    }

    
}


