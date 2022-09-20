import 'reflect-metadata';
import { ZynjectContainer } from './container';
import { Newable } from './types/newable';


export function Zynjectable() {
    return (origConstructor: Newable) =>{
        ZynjectContainer.register(origConstructor);
    };
}

export function Zynject<T extends Newable>(constructor: T): InstanceType<T> {
    return ZynjectContainer.register(constructor);
}
