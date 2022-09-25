import { resolve } from "path";

export class Ripple<T> {
    private _value?: T;
    private _downstream: Ripple<any>[] = [];
    private _promiseHandlers: {
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: string) => void
    }[] = [];

    private _closed: boolean;
    get closed() {
        return this._closed;
    }

    constructor(value?: T) {
        this._value = value;
    }

    drop(value: T) {
        this._drop(value);
    }

    protected _drop(value: any) {
        if (this._closed) throw Error('Ripple is closed');
        this._value = value;
        this._downstream.forEach(ds => ds.drop(value));

        // Removed closed downstream ripples
        this._downstream = this._downstream.filter(x=>!x._closed);
    }

    react<R>(callback: (val: T) => R): Ripple<T> {
        if (this._closed) throw Error('Ripple is closed');

        const ripple = new RippleReact<T, R>(callback);
        this._downstream.push(ripple);
        return ripple;
    }

    take(howMany: number) {
        const ripple = new RippleTake<T>(howMany);
        this._downstream.push(ripple);
        return ripple;
    }

    promise(): Promise<T> {
        const promise = new Promise<T>((resolve, reject) => {
            this._promiseHandlers.push({ resolve, reject });
        });
        return promise;
    }


    close() {
        this._closed = true;
        this._promiseHandlers = [];
    }

    protected resolve(value: T) {
        this._promiseHandlers.forEach(handler => handler.resolve(value));
        this.close();
    }

    protected error(reason?: string) {
        this._promiseHandlers.forEach(handler => handler.reject(reason));
        this.close();
    }

    static all<T>(ripples: Array<Ripple<T>>): Ripple<Array<T | undefined>> {
        const combined = new Ripple<Array<T | undefined>>();
        for (var ripple of ripples) {
            ripple.take(1).react(x => {
                const values = ripples.map(y => y._value);
                combined.drop(values);
            });
        }
        return combined;
    }

    static joinAll<T>(ripples: Array<Ripple<T[]>>): Ripple<T[]> {
        const combined = new Ripple<T[]>();
        let values: T[] = []
        let count = 0;
        for (var ripple of ripples) {
            ripple.take(1).react(x => {
                values.push(...x);
                if(++count === ripples.length){
                    combined.drop(values);
                }
            });
        }
        return combined;
    }

}

class RippleTake<T> extends Ripple<T>{
    private _dropCount: number = 0;
    private _maxcount: number;
    constructor(count: number) {
        super();
        this._maxcount = count;
    }

    drop(value: T) {
        super.drop(value);
        if (++this._dropCount === this._maxcount) {
            super.resolve(value);
        }
    }
}

class RippleReact<T, R> extends Ripple<T>{

    private _callback: (val: T) => R;
    constructor(callback: (value: T) => R) {
        super();
        this._callback = callback;
    }

    drop(value: T): void {
        const newValue = this._callback(value);
        this._drop(newValue);
    }

    close() {
        super.close();
        this._callback = () => <any>undefined;
    }
}


