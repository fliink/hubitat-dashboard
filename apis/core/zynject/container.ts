import { type } from "os";
import { Newable } from "./types/newable";
import { zynjectKey } from "./zynject";


export class ZynjectContainer {
    private static _mapping: Map<any, any> = new Map();
    private static _baseClasses: Map<any, any[]> = new Map();

    public static get mapping() {
        return this._mapping;
    }
    public static register<T extends Newable>(ctor: T): InstanceType<T> {

        if (this.mapping.has(ctor)) {
            return this.mapping.get(ctor).singleton;
        }

        const paramsTypeMetadata = Reflect.getMetadata('design:paramtypes', ctor);
        let zynjectedParameters: { type: Newable, index: number }[] = Reflect.getOwnMetadata(zynjectKey, ctor) || [];
        let singleton;

        var proto = Reflect.getPrototypeOf(ctor);
        const baseClass = Reflect.has(proto, 'prototype') ? proto as T : undefined;
        if (Array.isArray(paramsTypeMetadata)) {

            const params = paramsTypeMetadata.map((x, index) => {
                const zynjectedParam = zynjectedParameters.find(x => x.index == index);
                if(zynjectedParam && this._baseClasses.get(zynjectedParam.type)){
                    return this._baseClasses.get(zynjectedParam.type)?.map(x=>{
                        return this.mapping.get(x).singleton;
                    });
                }
                return this.register(x);
            });
            singleton = new ctor(...params);
        } else {
            singleton = new ctor();
        }

        const definition: {
            id: T,
            type: T,
            singleton: InstanceType<T>,
            extends?: T
        } = {
            id: ctor,
            type: ctor,
            singleton,
            extends: baseClass
        };
        var existingBaseClasses = this._baseClasses.get(baseClass) || [];
        existingBaseClasses.push(ctor);
        this._baseClasses.set(baseClass, existingBaseClasses);
        this._mapping.set(definition.id, definition);

        return definition.singleton;
    }
}

