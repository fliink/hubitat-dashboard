import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-drop-list',
  templateUrl: './drop-list.component.html',
  styleUrls: ['./drop-list.component.scss']
})
export class DropListComponent implements OnInit {

  @Input() items: any[];
  @Input() selectedItem: any;
  @ContentChild('itemTemplate') itemTemplate: TemplateRef<ElementRef>;
  @Output() changed: EventEmitter<any> = new EventEmitter();
  showOptions: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log('items', this.items);
  }

  selectItem(item: any){
    this.selectedItem = item;
    this.showOptions = false;
    this.changed.next(item);
  }

}
