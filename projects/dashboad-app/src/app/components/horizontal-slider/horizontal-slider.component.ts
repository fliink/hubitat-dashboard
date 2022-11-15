import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DragPosition, DragPositionEvent } from '../../models/position';

@Component({
  selector: 'app-horizontal-slider',
  templateUrl: './horizontal-slider.component.html',
  styleUrls: ['./horizontal-slider.component.scss']
})
export class HorizontalSliderComponent implements OnInit {

  @ViewChild('slidertrack') slidertrack: ElementRef<HTMLDivElement>;
  @ViewChild('sliderhandle') sliderhandle: ElementRef<HTMLDivElement>;
  @Input() value: number = 0;
  private dragStartX: number;


  private debouncer: Subject<number> = new Subject<number>();
  @Output() changed: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(200)).subscribe(x => this.changed.next(x));
  }

  handleDragMove($event: DragPositionEvent) {
    const trackRect = this.slidertrack.nativeElement.getBoundingClientRect();
    let x = $event.x;
    if (x < trackRect.left) {
      x = trackRect.left;
    } else if (x > trackRect.right) {
      x = trackRect.right;
    }
    const fromLeft = x - trackRect.left;
    const percent = (fromLeft) / trackRect.width;
    this.value = 100 * percent;

    this.debouncer.next(this.value);
  }

  handleDragEnd($event: DragPosition) {
    const trackRect = this.slidertrack.nativeElement.getBoundingClientRect();
    let x = $event.x;
    if (x < trackRect.left + 5) {
      x = trackRect.left + 5;
    } else if (x > trackRect.right - 5) {
      x = trackRect.right - 5;
    }
    const fromLeft = x - trackRect.left;
    const percent = (trackRect.width - fromLeft) / trackRect.width;

    this.value = 100 - 100 * percent;
    console.log('value', $event);
    this.debouncer.next(this.value);
  }

  handleDragStart($event: DragPosition) {
    this.dragStartX = $event.x;
  }

}
