import { Newable } from "./types/newable";


export class ZynjectContainer {
    private static mapping: Map<any, any> = new Map();

    public static register<T extends Newable>(ctor: T): InstanceType<T> {

        if (this.mapping.has(ctor)) {
            return this.mapping.get(ctor).singleton;
        }


        const paramsTypeMetadata = Reflect.getMetadata('design:paramtypes', ctor);
        let singleton;
        if (Array.isArray(paramsTypeMetadata)) {
            const params = paramsTypeMetadata.map(x => this.register(x));

            singleton = new ctor(...params);
        } else {
            singleton = new ctor();
        }

        const definition : {
            id: T,
            type: T,
            singleton: InstanceType<T>
        } = {
            id: ctor,
            type: ctor,
            singleton
        };
        this.mapping.set(definition.id, definition);

        return definition.singleton;
    }
}

