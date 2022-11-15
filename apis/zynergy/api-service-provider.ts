import { Express } from 'express';

export abstract class ApiServiceProvider {
    abstract register(app: Express, io: {emit: (name: string, data: any)=>void}): void;
}