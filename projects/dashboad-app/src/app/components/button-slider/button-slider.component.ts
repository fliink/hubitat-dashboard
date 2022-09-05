import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DragPosition, DragPositionEvent } from '../../models/position';

@Component({
  selector: 'app-button-slider',
  templateUrl: './button-slider.component.html',
  styleUrls: ['./button-slider.component.scss']
})
export class ButtonSliderComponent implements OnInit {

  active: boolean = false;
  private debouncer: Subject<number> = new Subject<number>();


  @ViewChild('thing') thing: ElementRef<HTMLDivElement>;
  @ViewChild('track') track: ElementRef<HTMLDivElement>;

  @Input() minimum: number = 50;
  @Input() maximum: number = 100;
  @Input() value: number = 60;
  @Input() on: boolean = false;
  @Output() changed: EventEmitter<number> = new EventEmitter();
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  position: string;
  trackAnchor: string;

  constructor() { }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(200)).subscribe(x => {
      this.changed.next(x);
    });
  }

  handleDragStart($event: DragPosition) {
    this.active = true;
  }

  handleClick($event){
    this.on = !this.on;
    this.toggle.next(!this.on);
  }

  handleDragEnd($event: DragPosition) {
    this.active = false;
    this.position = undefined;
    this.trackAnchor = undefined;
  }

  handleDragMove($event: DragPositionEvent) {
    const rect = this.track.nativeElement.getBoundingClientRect();
    let newValue = 0;
    if (!this.trackAnchor) {
      const val = (rect.height - rect.height * (this.value - this.minimum) / (this.maximum - this.minimum))
      this.trackAnchor = `${$event.y - val}px`;
    }


    if ($event.y >= rect.bottom) {
      newValue = this.minimum;
      this.position = `0px`;
    } else if ($event.y <= rect.top) {
      newValue = this.maximum;
      this.position = `${rect.height}px`;
    } else {
      newValue = ((rect.bottom - $event.y) / rect.height) * (this.maximum - this.minimum) + this.minimum;
      this.position = `${rect.bottom - $event.y}px`;
    }
    if (this.value !== newValue) {
      this.value = newValue;
      this.debouncer.next(this.value);
    }

  }

}
