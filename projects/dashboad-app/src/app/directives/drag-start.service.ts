import { Injectable } from '@angular/core';
import { DragPosition, DragPositionEvent } from '../models/position';

@Injectable()
export class DragService {
    private _isDragging: boolean = false;
    private _isTracking: boolean = false;
    private _clicks: DragPosition[] = [];
    private _element: Element;

    get isDragging(): boolean {
        return this._isDragging;
    }

    get isTracking(): boolean {
        return this._isTracking;
    }

    dragStart() {
        this._isDragging = true;
    }

    dragEnd() {
        this._isDragging = false;
        this._element = undefined;
    }

    dragMove(el: Element) {
        if (this._element === el) {
            return true;
        } else {
            this._element = el;
            return false;
        }
    }

    startTracking() {
        this._isTracking = true;
    }

    stopTracking() {
        this._isTracking = false;
        const clicks = [...this._clicks];
        this._clicks = [];
        return clicks;
    }

    trackClick(click: DragPosition) {
        this._clicks.push(click);
        return this._clicks;
    }

}