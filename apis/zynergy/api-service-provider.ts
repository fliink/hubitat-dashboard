import { Express } from 'express';

export abstract class ApiServiceProvider {
    abstract register(app: Express): void;
}