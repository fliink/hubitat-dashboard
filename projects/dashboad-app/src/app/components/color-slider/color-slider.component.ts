import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HSVtoRGB } from 'apis/core/color/color-converter';
import { RGB } from 'apis/core/color/rgb';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DragPosition, DragPositionEvent } from '../../models/position';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnInit, OnChanges {

  active: boolean = false;
  private debouncer: Subject<RGB> = new Subject<RGB>();


  @ViewChild('thing') thing: ElementRef<HTMLDivElement>;
  @ViewChild('track') track: ElementRef<HTMLDivElement>;

  @Input() on: boolean = false;
  @Input() minimum: number = 50;
  @Input() maximum: number = 100;
  @Input() value: RGB = {
    r: 0,
    g: 0,
    b: 0,
  };

  workingValue: RGB = {
    r: 0,
    g: 0,
    b: 0,
  };

  @Input() cssValue: string = '#000';
  @Output() changed: EventEmitter<RGB> = new EventEmitter();
  @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  position: {
    left?: string;
    bottom?: string;
  } = {};
  trackAnchor: string;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value?.currentValue) {
      if (!this.active) {
        const rgb = changes.value?.currentValue;
        this.workingValue = rgb;
        this.updateCssValue(rgb);
      }
    }
  }

  private updateCssValue(rgb: RGB) {
    this.cssValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(200)).subscribe(x => {
      this.changed.next(x);
    });
  }

  handleClick($event) {
    this.on = !this.on;
    this.toggled.next(this.on);
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
    // if (!this.trackAnchor) {
    //   const bottom = (rect.height - rect.height * (this.value.lightness - this.minimum) / (this.maximum - this.minimum))
    //   const left = (rect.width - rect.width * (this.value.hue - this.minimum) / (this.maximum - this.minimum))
    //   this.trackAnchor = `${$event.y - bottom}px`;
    // }


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




    const hue = newX * 3.6 % 360;
    const rgb = this.toRgb(hue);

    if (this.value.r !== rgb.r || this.value.g !== rgb.g || this.value.b !== rgb.b) {
      this.workingValue = rgb;
      this.updateCssValue(rgb);
      this.debouncer.next(rgb);
    }

  }

  private toRgb(hue: number): RGB {
    let r = 0, g = 0, b = 0;
    if (240 < hue || hue < 120) {
      r = Math.min(255 * (1 - Math.abs((((hue + 120) % 360) - 120) / 120)) * 2, 255);
    }

    if (0 < hue && hue < 240) {
      g = Math.min(255 * (1 - Math.abs(hue - 120) / 120) * 2, 255);
    }

    if (120 < hue) {
      b = Math.min(255 * (1 - Math.abs(hue - 240) / 120) * 2, 255);
    }

    return {
      r,
      g,
      b
    };
  }

}
