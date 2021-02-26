import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { element } from 'protractor';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { DragPosition } from '../models/position';
import { DragService } from './drag-start.service';

@Directive({
    selector: '[h-events]'
})
export class HighlightDirective implements OnDestroy {

    private origin: DragPosition;
    private element: Element;
    private timerSubscription: Subscription;

    @Output() hDragStart: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hDragMove: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hDragEnter: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hDragEnd: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hHold: EventEmitter<DragPosition> = new EventEmitter();

    constructor(el: ElementRef<Element>, private dragService: DragService) {
        el.nativeElement.addEventListener('mousedown', this.start.bind(this));
        el.nativeElement.addEventListener('touchstart', this.start.bind(this));
        el.nativeElement.addEventListener('mousemove', this.move.bind(this));
        el.nativeElement.addEventListener('touchmove', this.move.bind(this));
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
        this.element.removeEventListener('mouseup', this.end);
        this.element.removeEventListener('touchend', this.end);
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
        console.log('dragsyaty')
    }
        });
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

        if (this.dragService.isDragging) {
            const overElement = document.elementFromPoint(point.x, point.y);
            if (e instanceof TouchEvent) {
                const newEvent = new FauxTouchEvent('myly');
                newEvent.touches = e.touches;
                overElement.dispatchEvent(newEvent);
            } else if (e instanceof MouseEvent || e instanceof FauxTouchEvent) {
                if (!this.dragService.dragMove(overElement)) {
                    this.hDragEnter.next(point);
                }
            }
            this.hDragMove.next(point);
        } else if (this.origin) {
            const distance = this.origin.distance(point);
            if (distance > 2) {
                this.dragService.dragStart();
                this.hDragStart.next(point);
            }
        }
    }

    private end(e: MouseEvent | TouchEvent) {
        let point: DragPosition;
        if (e instanceof MouseEvent) {
            point = new DragPosition(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent) {
            point = new DragPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }

        if (this.dragService.isDragging) {
            this.dragService.dragEnd();
            this.hDragEnd.next(point);
        }

        this.origin = undefined;

        if (!this.timerSubscription.closed) {
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