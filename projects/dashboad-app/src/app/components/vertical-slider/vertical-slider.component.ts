import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-vertical-slider',
  templateUrl: './vertical-slider.component.html',
  styleUrls: ['./vertical-slider.component.scss']
})
export class VerticalSliderComponent implements OnInit {

  @ViewChild('slidertrack') slidertrack: ElementRef<HTMLDivElement>;
  @ViewChild('sliderhandle') sliderhandle: ElementRef<HTMLDivElement>;
  @Input() value: number = 0;
  private dragStartY: number;


  private debouncer: Subject<number> = new Subject<number>();
  @Output() changed: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(200)).subscribe(x => this.changed.next(x));
  }

  handleDragging(e: DragEvent | TouchEvent) {
    const trackRect = this.slidertrack.nativeElement.getBoundingClientRect();
    const position = this.getPosition(e);
    let y = position.y;
    if (y < trackRect.top) {
      y = trackRect.top;
    } else if (y > trackRect.bottom) {
      y = trackRect.bottom;
    }
    const fromTop = y - trackRect.top;
    const percent = (trackRect.height - fromTop) / trackRect.height;
    this.value = 100 * percent;

    this.debouncer.next(this.value);
  }

  private getPosition(mouseEvent: DragEvent | TouchEvent) {
    let x: number, y: number;
    if (mouseEvent instanceof DragEvent) {
      x = mouseEvent.clientX;
      y = mouseEvent.clientY;
    } else if (mouseEvent instanceof TouchEvent) {
      if (mouseEvent.touches.length) {
        x = mouseEvent.touches[0].clientX;
        y = mouseEvent.touches[0].clientY;
      }
    }
    return { x, y };
  }

  handleDragEnd(e: DragEvent | TouchEvent) {
    const position = this.getPosition(e);
    const trackRect = this.slidertrack.nativeElement.getBoundingClientRect();
    let y = position.y;
    if (y < trackRect.top + 5) {
      y = trackRect.top + 5;
    } else if (y > trackRect.bottom - 5) {
      y = trackRect.bottom - 5;
    }
    const fromTop = y - trackRect.top;
    const percent = (trackRect.height - fromTop) / trackRect.height;
    this.value = 100 * percent;
    this.debouncer.next(this.value);
  }

  handleDragStart(e: DragEvent | TouchEvent) {
    const position = this.getPosition(e);
    this.dragStartY = position.y;
    if (e instanceof DragEvent) {
      e.dataTransfer.setDragImage(new Image(), 0, 0);
    }
  }

}
