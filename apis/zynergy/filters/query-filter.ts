export abstract class DataFilter {
    abstract filter(data: any, ...args: any[]): any;
}

export class QueryFilter extends DataFilter {

    private _query: {[key: string]: string};

    constructor(query: {[key: string]: string}) {
        super();
        this._query = query;
    }
    filter(data: any[]): any[] {
       const filter = this._query['filter'];
       if(filter){
            const fns = this.parseFilterString(filter);
            return data.filter(d=>fns.every(x=>x(d)));
       }
       return data;
    }

    private parseFilterString(filter: string): ((data: any)=>any)[] {
        const andEpxressions = filter.split(' and ');
        const expressions = andEpxressions.map(x=>{
            const inExpression = ['in'].concat(x.split(' in '));
            const isExpression = ['is'].concat(x.split(' is '));
            const hasOneExpression = ['hasone'].concat(x.split(' hasone '));
            const hasAllExpression = ['hasall'].concat(x.split(' hasall '));
            const hasExpression = ['has'].concat(x.split(' has '));

            return {
                inExpression,
                isExpression,
                hasOneExpression,
                hasAllExpression,
                hasExpression
            }
        });

        const compiled = this.compileExpressions(expressions);

        return compiled;
    }
    compileExpressions(expressions: { inExpression: string[]; isExpression: string[]; hasOneExpression: string[]; hasAllExpression: string[]; hasExpression: string[]; }[]) {
        var fns = expressions.map((x)=>{
            if((x.hasAllExpression.length === 3)){
                const propertyName = x.hasAllExpression[1];
                const values = x.hasAllExpression[2]!.match(/^\[([a-zA-Z0-9,]+)\]$/)![1].split(',');
                return (data: any) => data[propertyName]?.every((y: string) => values.includes(y));
            }
            if((x.hasOneExpression.length === 3)){
                const propertyName = x.hasOneExpression[1];
                const values = x.hasOneExpression[2]!.match(/^\[([a-zA-Z0-9,]+)\]$/)![1].split(',');
                return (data: any) => data[propertyName]?.some((y: string) => values.includes(y));
            }

            if((x.isExpression.length === 3)){
                const propertyName = x.isExpression[1];
                const value = x.isExpression[2];
                return (data: any) => this.getPropertyValue(data, propertyName) === this.getFilterValue(value);
            }

            if((x.inExpression.length === 3)){
                const propertyName = x.inExpression[1]!;
                const values = x.inExpression[2]!.match(/^\[([a-zA-Z0-9,]+)\]$/)![1].split(',');
                return (data: any) => values.includes(data[propertyName]);
            }

            if((x.hasExpression.length === 3)){
                const propertyName = x.hasExpression[1]!;
                const value = this.getFilterValue(x.hasExpression[2])
                return (data: any) => this.getPropertyValue(data, propertyName).toLowerCase().indexOf(value.toLowerCase()) >= 0;
            }
            return (data: any) => true;
        });

        return fns;
    }
    getFilterValue(value: string): any {
        if(value[0] === "'") return value.slice(1, value.length - 2);
        if(!Number.isNaN(Number(value))) return Number(value);
        if(value === 'true' || value === 'false') return value === 'true';
        return value;
    }

    getPropertyValue(data: any, propertyName: string): any {
        return propertyName.split('.').reduce((a, b)=>{
            return a[b];
        }, data);
    }
}


