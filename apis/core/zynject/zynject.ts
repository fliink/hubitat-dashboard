import 'reflect-metadata';
import { ZynjectContainer } from './container';
import { Newable } from './types/newable';


export function Zynjectable() {
    return (origConstructor: Newable) =>{
        ZynjectContainer.register(origConstructor);
    };
}

export const zynjectKey = Symbol("Zynject");

export function Zynject<T>(c: T): any {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number)=>{
        const existingMetadata = Reflect.getOwnMetadata(zynjectKey, target) || [];
        existingMetadata.push({
                type: c,
                index: parameterIndex
        });
        Reflect.defineMetadata(zynjectKey, existingMetadata, target, propertyKey);
    };
}

export class Z{
    static get<T extends Newable>(constructor: T): InstanceType<T> {
        return ZynjectContainer.register(constructor);
    }

    static register<T extends Newable>(constructor: T | T[]) {
        
    }
}
