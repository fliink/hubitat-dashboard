import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent<T> implements OnInit, OnChanges {

  @Input() items: T[];
  @Input() template: TemplateRef<any>;
  @Input() selected: T[];
  @Output() onChange = new EventEmitter<T[]>();
  localItems: SelectWrapper<T>[] = [];



  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items?.currentValue) {
      this.localItems = changes.items.currentValue.map(x => {
        return { item: x, selected: false };
      });
    }

    if (changes.selected?.currentValue) {
      this.localItems.forEach(x=>x.selected = this.selected.indexOf(x.item) >= 0);
    }
  }

  selectItem(item: { item: T, selected: boolean }) {
    item.selected = !item.selected;
    this.onChange.emit(this.localItems.filter(x => x.selected).map(x => x.item));
  }


}

interface SelectWrapper<T> {
  selected: boolean,
  item: T
}
