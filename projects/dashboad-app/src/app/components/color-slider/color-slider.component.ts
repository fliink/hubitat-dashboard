import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DragPosition, DragPositionEvent } from '../../models/position';

export interface Hsl {
  hue: number;
  saturation: number;
  lightness: number;
}

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnInit, OnChanges {

  active: boolean = false;
  private debouncer: Subject<Hsl> = new Subject<Hsl>();


  @ViewChild('thing') thing: ElementRef<HTMLDivElement>;
  @ViewChild('track') track: ElementRef<HTMLDivElement>;

  @Input() minimum: number = 50;
  @Input() maximum: number = 100;
  @Input() value: Hsl = {
    hue: 0,
    lightness: 0,
    saturation: 0
  };

  @Input() cssValue: string = '#000';
  @Output() changed: EventEmitter<Hsl> = new EventEmitter();

  position: {
    left?: string;
    bottom?: string;
  } = {};
  trackAnchor: string;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value?.currentValue) {
      const cssValue = {
        hue: (this.value.hue / 100) * 360,
        saturation: this.value.saturation,
        lightness: 100
      };
      this.cssValue = `hsl(${cssValue.hue},100%,${100 - cssValue.saturation / 2}%)`;
    }
  }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(200)).subscribe(x => {
      this.changed.next(x);
    });
  }

  handleDragStart($event: DragPosition) {
    this.active = true;
  }

  handleDragEnd($event: DragPosition) {
    this.active = false;
    this.position = {};
    this.trackAnchor = undefined;
  }

  handleDragMove($event: DragPositionEvent) {
    const rect = this.track.nativeElement.getBoundingClientRect();
    let newY = 0;
    let newX = 0;
    if (!this.trackAnchor) {
      const bottom = (rect.height - rect.height * (this.value.lightness - this.minimum) / (this.maximum - this.minimum))
      const left = (rect.width - rect.width * (this.value.hue - this.minimum) / (this.maximum - this.minimum))
      this.trackAnchor = `${$event.y - bottom}px`;
    }


    if ($event.y >= rect.bottom) {
      newY = this.minimum;
      this.position.bottom = `0px`;
    } else if ($event.y <= rect.top) {
      newY = this.maximum;
      this.position.bottom = `${rect.height}px`;
    } else {
      newY = ((rect.bottom - $event.y) / rect.height) * (this.maximum - this.minimum) + this.minimum;
      newX = -1 * ((rect.left - $event.x) / rect.width) * (this.maximum - this.minimum) + this.minimum;
      this.position.bottom = `${rect.bottom - $event.y}px`;
    }

    if ($event.x >= rect.right) {
      newX = this.maximum;
      this.position.left = `${rect.width}px`;
    } else if ($event.x <= rect.left) {
      newX = this.minimum;
      this.position.left = `0px`;
    } else {
      newX = -1 * ((rect.left - $event.x) / rect.width) * (this.maximum - this.minimum) + this.minimum;
      this.position.left = `${rect.left + $event.x}px`;
    }

    if (this.value.saturation !== newY || this.value.hue !== newX) {
      this.value.saturation = newY;
      this.value.hue = newX;
      this.debouncer.next(this.value);
    }

  }

}
