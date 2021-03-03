export class DragPosition {
    x: number;
    y: number;


    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    distance(pos: DragPosition){
        return Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
    }
}

export class DragPositionEvent {
    x: number;
    y: number;
    origin: DragPosition;
    deltaY: number;
    deltaX: number;
    

    constructor(position: DragPosition, origin: DragPosition){
        this.x = position.x;
        this.y = position.y;
        this.origin = origin;
        this.deltaX = position.x - origin.x;
        this.deltaY = position.y - origin.y;
    }

    distance(pos: DragPosition){
        return Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
    }
}