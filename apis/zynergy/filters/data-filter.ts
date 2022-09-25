export abstract class DataFilter {
    abstract apply(data: any, ...args: any[]): any;
}