import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
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

    private startEventFn: any;
    private enterEventFn: any;
    private moveEventFn: any;
    private endEventFn: any;
    private clickEventFn: any;
    

    @Input() hId: string = '';

    @Output() hDragStart: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hDragMove: EventEmitter<DragPositionEvent> = new EventEmitter();
    @Output() hDragEnter: EventEmitter<DragPositionEvent> = new EventEmitter();
    @Output() hDragEnd: EventEmitter<DragPositionEvent> = new EventEmitter();
    @Output() hHold: EventEmitter<DragPosition> = new EventEmitter();
    @Output() hNewPoint: EventEmitter<DragPosition[]> = new EventEmitter();
    @Output() hClick: EventEmitter<MouseEvent | TouchEvent> = new EventEmitter();

    constructor(el: ElementRef<Element>, private dragService: DragService) {
        this.startEventFn = this.start.bind(this);
        this.clickEventFn = this.click.bind(this);
        this.enterEventFn = this.enter.bind(this);
        this.moveEventFn = this.move.bind(this);
        this.endEventFn = this.end.bind(this);

        el.nativeElement.addEventListener('mousedown', this.startEventFn);
        el.nativeElement.addEventListener('touchstart', this.startEventFn);
        // el.nativeElement.addEventListener('mousemove', this.move.bind(this));
        // el.nativeElement.addEventListener('touchmove', this.move.bind(this));
        // el.nativeElement.addEventListener('mouseup', this.end.bind(this));
        // el.nativeElement.addEventListener('touchend', this.end.bind(this));

        el.nativeElement.addEventListener('hEnter', this.enterEventFn);
        el.nativeElement.addEventListener('click', this.clickEventFn);

        this.element = el.nativeElement;
    }
    ngOnDestroy(): void {
        this.element.removeEventListener('mousedown', this.startEventFn);
        this.element.removeEventListener('touchstart', this.startEventFn);
        // this.element.removeEventListener('mousemove', this.move);
        // this.element.removeEventListener('touchmove', this.move);
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

        document.addEventListener('mousemove', this.moveEventFn);
        document.addEventListener('touchmove', this.moveEventFn);

        document.addEventListener('touchend', this.endEventFn);
        document.addEventListener('mouseup', this.endEventFn);
    }

    private move(e: MouseEvent | TouchEvent | FauxTouchEvent) {
        let point: DragPosition;
        if (e instanceof MouseEvent) {
            point = new DragPosition(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent) {
            point = new DragPosition(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e instanceof FauxTouchEvent) {
            point = new DragPosition(e.fauxX, e.fauxY);
        }

        const dragEvent = new DragPositionEvent(point, this.origin);
        if (this.dragService.isDragging) {
            const overElement = document.elementFromPoint(point.x, point.y);
            const newEvent = new FauxTouchEvent('hEnter');

            if (e instanceof TouchEvent) {
                newEvent.fauxX = e.touches[0].clientX;
                newEvent.fauxY = e.touches[0].clientY;
            } else if (e instanceof MouseEvent) {
                newEvent.fauxX = e.clientX;
                newEvent.fauxY = e.clientY;
            }
            overElement.dispatchEvent(newEvent);
            this.hDragMove.next(dragEvent);

        } else if (this.origin) {
            const distance = this.origin.distance(point);
            if (distance > 2) {
                this.dragService.dragStart();
                this.hDragStart.next(dragEvent);
            }
        }
    }

    private enter(e: FauxTouchEvent) {
        const dragEvent = new DragPositionEvent(new DragPosition(e.fauxX, e.fauxY), undefined);
        if (!this.dragService.dragMove(<Element>e.target)) {
            this.hDragEnter.next(dragEvent);
        }
    }


    private click(e: MouseEvent | TouchEvent) {
        if (this.dragService.isTracking) {
            let point: DragPosition;
            if (e instanceof MouseEvent) {
                point = new DragPosition(e.clientX, e.clientY);
            } else if (e instanceof TouchEvent) {
                point = new DragPosition(e.touches[0].clientX, e.touches[0].clientY);
            }

            const clicks = this.dragService.trackClick(point);
            this.hNewPoint.next(clicks);
        }else{
            this.hClick.next(e);
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
            const dragEvent = new DragPositionEvent(point, this.origin);
            this.hDragEnd.next(dragEvent);
        }

        this.origin = undefined;

        if (!this.timerSubscription?.closed === false) {
            this.timerSubscription.unsubscribe();
        }

        document.removeEventListener('mousemove', this.moveEventFn);
        document.removeEventListener('touchmove', this.moveEventFn);
        document.removeEventListener('touchend', this.endEventFn);
        document.removeEventListener('mouseup', this.endEventFn);
    }



    //     input.component=lang&1
    //     mastering.looney<717> engine_rna *moonlight18 (lightpost    cancelled
    //         minnesota-runtime=null
    //         snowboard routing)
    // clinetfugly clientfugly


}

export class FauxTouchEvent extends Event {
    fauxX: number;
    fauxY: number;
}