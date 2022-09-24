import { type } from "os";
import { Newable } from "./types/newable";
import { zynjectKey } from "./zynject";


export class ZynjectContainer {
    private static _mapping: Map<Newable, RegistryEntry<Newable>> = new Map();
    private static _baseClasses: Map<any, any[]> = new Map();

    public static get mapping() {
        return this._mapping;
    }
    public static register<T extends Newable>(ctor: T): void {
        if (this.mapping.has(ctor)) {
            return;
        }

        var proto = Reflect.getPrototypeOf(ctor);
        const baseClass = Reflect.has(proto, 'prototype') ? proto as T : undefined;
        const definition: RegistryEntry<T> = new RegistryEntry<T>(ctor, ctor, baseClass);

        //  Register type with base class
        var existingBaseClasses = this._baseClasses.get(baseClass) || [];
        existingBaseClasses.push(ctor);
        this._baseClasses.set(baseClass, existingBaseClasses);

        
        this._mapping.set(definition.id, definition);

        return;
    }

    /**
     * Get an instance object from the request type
     * @param ctor Constructor of the type to get
     * @returns The existing instance of the requested type
     * @throws Will throw an error when requested type could not be found
     */
    public static get<T extends Newable>(ctor: T): InstanceType<T> {
        if (this.mapping.has(ctor)) {
            return this.mapping.get(ctor)?.singleton;
        } else {
            throw new Error(`${ctor} could not be found in the container.`);
        }
    }

    /**
     * Construct a new object using the provided Newable type 
     * @param ctor Constructor of the type to create
     * @returns New instance of requested Newable type
     */
    public static new<T extends Newable>(ctor: T): InstanceType<T> {
        const paramsTypeMetadata = Reflect.getMetadata('design:paramtypes', ctor);
        let zynjectedParameters: { type: Newable, index: number }[] = Reflect.getOwnMetadata(zynjectKey, ctor) || [];
        let singleton;

        if (Array.isArray(paramsTypeMetadata)) {
            const params = paramsTypeMetadata.map((param, index) => {
                const zynjectedParam = zynjectedParameters.find(injected => injected.index == index);
                if (zynjectedParam && this._baseClasses.get(zynjectedParam.type)) {
                    return this._baseClasses.get(zynjectedParam.type)?.map(extender => {
                        return this.mapping.get(extender)?.singleton;
                    });
                }
                return this.get(param);
            });
            singleton = new ctor(...params);
        } else {
            singleton = new ctor();
        }

        return singleton;
    }
}

class RegistryEntry<T extends Newable> {

    constructor(id: T, type: T, base?: T) {
        this.id = id;
        this.type = type;
        this.extends = base;
    }

    id: T;
    type: T;
    extends?: T;

    get singleton(): InstanceType<T> {
        return this._value || (this._value = ZynjectContainer.new(this.type))
    };

    private _value: InstanceType<T>;
}

