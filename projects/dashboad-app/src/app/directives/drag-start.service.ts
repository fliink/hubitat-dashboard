import { Injectable } from '@angular/core';

@Injectable()
export class DragService {  
    private _isDragging: boolean = false;
    private _element: Element;

    get isDragging(): boolean {
        return this._isDragging;
    }
    dragStart(){
        this._isDragging = true;
    }

    dragEnd(){
        this._isDragging = false;
        this._element = undefined;
    }

    dragMove(el: Element){
        if(this._element === el){
            return true;
        }else{
            this._element =  el;
            return false;
        }
    }

}