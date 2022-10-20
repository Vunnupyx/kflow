import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownOptions } from '../model/dropdown-option.interface';

@Component({
  selector: 'ngx-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})

export class ListFilterComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  _filterData: any;
  @Input() searchInput: string;
  @Input()
  set filterData(filterData: any) {
    this._filterData = filterData || [];
  }

  get filterData(): any { return this._filterData; }
  constructor() { }
  // Output event that emit the selected list items
  @Output() selectOption = new EventEmitter<IDropdownOptions[]>();
  ngOnInit(): void {
  }

  selectItem(item: string) {
    const selectedListName = item.split('/');
    if (selectedListName.length) {
     if (this.filterData.options.hasOwnProperty(selectedListName[0])) {
      this.selectOption.emit(this.filterData.options[selectedListName[0]]);
     }
    }

  }

}
