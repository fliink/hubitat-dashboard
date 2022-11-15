export function mergeInto(target: any, ...args: any[]) {
    args.forEach((element: any) => {
        Object.entries(element).forEach(([key, value])=>{
            if(!target[key] || typeof target[key] !== 'object'){
                target[key] = value;
            }else if(typeof target[key] === 'object'){
                mergeInto(target[key], value);
            }
        });
    });
}