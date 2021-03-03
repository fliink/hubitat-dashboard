import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { element } from 'protractor';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { DragPosition, DragPositionEvent } from '../models/position';
import { DragService } from './drag-start.service';

@Directive({
    selector: '[h-events]'
})
export class HighlightDirective implements OnDestroy {

    private origin: DragPosition;
    private element: Element;
    private timerSubscription: Subscription;

    @Output() hDragStart: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hDragMove: EventEmitter<DragPositionEvent> = new EventEmitter();
    @Output() hDragEnter: EventEmitter<DragPositionEvent> = new EventEmitter();
    @Output() hDragEnd: EventEmitter<DragPositionEvent> = new EventEmitter();
    @Output() hHold: EventEmitter<DragPosition> = new EventEmitter();

    constructor(el: ElementRef<Element>, private dragService: DragService) {
        el.nativeElement.addEventListener('mousedown', this.start.bind(this));
        el.nativeElement.addEventListener('touchstart', this.start.bind(this));
        //el.nativeElement.addEventListener('mousemove', this.move.bind(this));
        //el.nativeElement.addEventListener('touchmove', this.move.bind(this));
        el.nativeElement.addEventListener('mouseup', this.end.bind(this));
        el.nativeElement.addEventListener('touchend', this.end.bind(this));
        el.nativeElement.addEventListener('myly', this.move.bind(this));

        this.element = el.nativeElement;
    }
    ngOnDestroy(): void {
        this.element.removeEventListener('mousedown', this.start);
        this.element.removeEventListener('touchstart', this.start);
        this.element.removeEventListener('mousemove', this.move);
        this.element.removeEventListener('touchmove', this.move);
    }

    private start(e: MouseEvent | TouchEvent) {

        if (e instanceof MouseEvent) {
            this.origin = new DragPosition(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent) {
            this.origin = new DragPosition(e.touches[0].clientX, e.touches[0].clientY);
        }

        this.timerSubscription = timer(1000, 1000).pipe(take(1)).subscribe(x => {
            if (!this.dragService.isDragging) {
                this.hHold.next(this.origin);
            }
        });

        document.addEventListener('mousemove', this.move.bind(this));
        document.addEventListener('touchmove', this.move.bind(this));
        document.addEventListener('touchend', this.end.bind(this));
        document.addEventListener('mouseup', this.end.bind(this));
    }

    private move(e: MouseEvent | TouchEvent | FauxTouchEvent) {
        let point: DragPosition;
        if (e instanceof MouseEvent) {
            point = new DragPosition(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent) {
            point = new DragPosition(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e instanceof FauxTouchEvent) {
            point = new DragPosition(e.touches[0].clientX, e.touches[0].clientY);
        }

        const dragEvent = new DragPositionEvent(point, this.origin);
        if (this.dragService.isDragging) {
            const overElement = document.elementFromPoint(point.x, point.y);
            if (e instanceof TouchEvent) {
                const newEvent = new FauxTouchEvent('myly');
                newEvent.touches = e.touches;
                overElement.dispatchEvent(newEvent);
            } else if (e instanceof MouseEvent || e instanceof FauxTouchEvent) {
                if (!this.dragService.dragMove(overElement)) {
                    this.hDragEnter.next(dragEvent);
                }
            }
            this.hDragMove.next(dragEvent);
        } else if (this.origin) {
            const distance = this.origin.distance(point);
            if (distance > 2) {
                this.dragService.dragStart();
                this.hDragStart.next(dragEvent);
            }
        }
    }

    private end(e: MouseEvent | TouchEvent) {
        document.removeEventListener('mousemove', this.move);
        document.removeEventListener('touchmove', this.move);
        document.removeEventListener('touchend', this.end);
        document.removeEventListener('mouseup', this.end);
        let point: DragPosition;
        if (e instanceof MouseEvent) {
            point = new DragPosition(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent) {
            point = new DragPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }

        if (this.dragService.isDragging) {
            this.dragService.dragEnd();
            const dragEvent = new DragPositionEvent(point, this.origin);
            this.hDragEnd.next(dragEvent);
        }

        this.origin = undefined;

        if (!this.timerSubscription?.closed === false) {
            this.timerSubscription.unsubscribe();
        }
    }



    //     input.component=lang&1
    //     mastering.looney<717> engine_rna *moonlight18 (lightpost    cancelled
    //         minnesota-runtime=null
    //         snowboard routing)
    // clinetfugly clientfugly


}

export class FauxTouchEvent extends Event {
    touches: TouchList
}