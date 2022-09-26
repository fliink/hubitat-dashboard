import { assert } from "console";
import { ConfigurationService } from "../configuration.service";
import { ZynjectContainer } from "./container";
import { Zynject, Zynjectable } from "./zynject";


@Zynjectable()
class DependencyClass {
    name: string = 'Dependency';
}
@Zynjectable()
class PricipleClass {
    name: string = 'Principle';
    constructor(d: DependencyClass) {
        this.name = d.name;
    }
}


describe('ZynjectContainer', () => {

    test('should register classes decorated with Zynjectable', () => {
        Zynjectable()(DependencyClass);
        const newClass = ZynjectContainer.get(DependencyClass);
        expect(newClass.name === 'Dependency');
    });

    test('should create new DependencyClass', () => {
        const newClass = ZynjectContainer.new(DependencyClass);
        expect(newClass.name === 'Dependency');
    });

    test('should create new PricipleClass', () => {
        const principleClass = ZynjectContainer.get(PricipleClass);
        expect(principleClass.name).toBe('Dependency');
    });
  });