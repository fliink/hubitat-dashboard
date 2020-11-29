import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Component({
  selector: 'app-light-tile',
  templateUrl: './light-tile.component.html',
  styleUrls: ['./light-tile.component.scss']
})
export class LightTileComponent implements OnInit, OnChanges {

  @Input() device!: HubitatDevice;
  rgb: any;
  selectedEffect: { key: number, value: string };

  constructor(private hubitatService: MakerApiService) {
    console.log('dd', this.device);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.device?.currentValue) {
      if (this.device.capabilityLookup.ColorControl) {
        const rgb = this.hslToRgb();
        this.rgb = `rgb(${rgb?.r},${rgb?.g},${rgb?.b})`
      }
      if (this.device.capabilityLookup.LightEffects) {
        const selectedEffect = Object.entries(this.device.attributes.lightEffects).find(x => {
          return x[1] === this.device.attributes.effectName;
        });
        this.selectedEffect = { key: <number>selectedEffect[1], value: <string>selectedEffect[1] };
      }
    }
  }

  ngOnInit(): void {
  }

  hslToRgb() {
    return;
    const h = this.device.attributes?.hue! / 360 * 100;
    const s = Number(this.device.attributes?.saturation) * .01;
    const l = this.device.attributes?.level! * .01;
    console.log({
      h, s, l
    })
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  setEffect(id: number): void {
    this.hubitatService.sendCommand(this.device.id, { on: '', setEffect: id }).subscribe();
  }

  setLevel(value: number): void {
    this.hubitatService.sendCommand(this.device.id, { setLevel: Math.round(value) }).subscribe();
  }

}
