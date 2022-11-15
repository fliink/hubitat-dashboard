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

    get value() {
        return this._value;
    }
    constructor(value?: T | Promise<T>) {
        if (value !== undefined && value instanceof Promise) {
            value.then(x => {
                this.drop(x);
                this.resolve(x);
            });
        } else {
            this._value = value;
        }
    }

    drop(value: T) {
        this._drop(value);
    }

    protected _drop(value: any) {
        this._value = value;
        this._downstream.forEach(ds => ds.drop(value));

        // Removed closed downstream ripples
        this._downstream = this._downstream.filter(x => !x._closed);
    }

    react<R>(callback: (val: T) => R): Ripple<R> {
        const ripple = new RippleReact<T, R>(callback);
        this._downstream.push(ripple);
        if (this._value) {
            ripple._drop(this._value);
        }
        return ripple;
    }

    chain<R extends Ripple<any | void>, U extends ValueType<R>>(callback: (val: T) => R): Ripple<U> {
        const ripple = new RippleChain<T, R, U>(callback);

        this._downstream.push(ripple);
        if (this._value) {
            ripple._drop(this._value);
        }
        return ripple;
    }

    take(howMany: number) {
        const ripple = new RippleTake<T>(howMany);
        this._downstream.push(ripple);
        if (this._value) {
            ripple.drop(this._value);
        }
        return ripple;
    }

    promise(): Promise<T> {
        const promise = new Promise<T>((resolve, reject) => {
            this._promiseHandlers.push({ resolve, reject });
        });
        if (this._value) { this.resolve(this._value); }
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

    static all<T extends Ripple<any>>(ripples: T[]): Ripple<ValueType<T>[]> {
        const combined = new Ripple<ValueType<T>[]>();
        let count = 0;
        const result: unknown[] = [];
        for (var ripple of ripples) {
            ripple.take(1).react(x => {
                if (++count === ripples.length) {
                    combined.drop(ripples.map(y => y._value));
                }
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
                if (++count === ripples.length) {
                    combined.drop(values);
                }
            });
        }
        return combined;
    }

    static latest<T extends Ripple<any>>(ripples: T[]): Ripple<ValueType<T>[]> {
        const combined = new Ripple<ValueType<T>[]>();
        let dropped = false;
        for (var ripple of ripples) {
            ripple.react(x => {
                if (dropped || ripples.every(r => !!r._value)) {
                    dropped = true;
                    combined.drop(ripples.map(y => y._value));
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

class RippleReact<Source, Target> extends Ripple<Target>{

    private _callback: (value: Source) => Target;
    constructor(callback: (value: Source) => Target) {
        super();
        this._callback = callback;
    }

    _drop(value: Source): void {
        const newValue = this._callback(value);
        super._drop(newValue);
    }

    close() {
        super.close();
        this._callback = () => <any>undefined;
    }
}

class RippleChain<Source, Target extends Ripple<unknown> | void, A extends ValueType<Target>> extends Ripple<A>{

    private _callback: (value: Source) => Target | void;
    constructor(callback: (value: Source) => Target | void) {
        super();
        this._callback = callback;
    }

    _drop(value: Source): void {

        const newValue = this._callback(value);

        if (newValue) {
            newValue.react(x => {
                super._drop(x);
            });
        }
    }

    close() {
        super.close();
        this._callback = () => <any>undefined;
    }
}

type ValueType<T> = T extends Ripple<infer U> ? U : never;






