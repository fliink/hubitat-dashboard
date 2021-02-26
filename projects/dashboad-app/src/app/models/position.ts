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