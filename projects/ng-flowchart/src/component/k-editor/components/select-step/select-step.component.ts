import {Component, HostListener, OnInit} from '@angular/core';
import { NgFlowchartStepComponent } from '../../../../lib/ng-flowchart-step/ng-flowchart-step.component';
import { IDropdownOptions } from './model/dropdown-option.interface';

@Component({
    selector: 'lib-select-step',
    templateUrl: './select-step.component.html',
    styleUrls: ['./select-step.component.scss']
})
export class SelectStepComponent extends NgFlowchartStepComponent implements OnInit {
    dropdownOptions: IDropdownOptions[];
    selectedOption: string;
    selectedListItem: IDropdownOptions[];
    showDropDown = false;

    ngOnInit(): void {
        this.dropdownOptions = this.data.dropdownOptions;
        this._selectFilteredData(this.data.selectedOption);
    }

    reset(event): void {
        this.selectedOption = '';
        this.showDropDown = false;
        event.stopPropagation();
    }

    isItemSelected(id: string): boolean {
        if (this.selectedListItem.length) {
            const selectedElem = this.selectedListItem.find((elem: IDropdownOptions) => elem.id === id);
            return !!selectedElem;
        } else {
            return false;
        }

    }

    async displayCascade(item: IDropdownOptions, event) {
        const {variables, parentId} = item;
        if (!parentId) {
            this.selectedListItem = [];
            this._setCascadeSt(this.dropdownOptions);
        }
        if (variables && variables.length) {
            item.showSubmenu = true;
        } else {
            this.selectedListItem.push({id: item.id, name: item.name});
            event.stopPropagation();
            this._setInputModel();
            this.showDropDown = false;
            return;
        }
        this.selectedListItem.push({id: item.id, name: item.name});
        event.stopPropagation();
    }

    displayDropdown(event): void {
        this.showDropDown = !this.showDropDown;
        this.selectedListItem = [];
        this._setCascadeSt(this.dropdownOptions);
        event.stopPropagation();
    }

    private _setInputModel(): void {
        const selectedListNames = this.selectedListItem.map((list: IDropdownOptions) => list.name);
        this.selectedOption = selectedListNames.toString().split(',').join('/');
        this.data.selectedOption = this.selectedListItem;
    }

    private _setCascadeSt(data: Array<IDropdownOptions>): void {
        data.map((elem: IDropdownOptions) => {
            const {id, variables} = elem;
            if (variables && variables.length) {
                elem.showSubmenu = false;
                variables.map((innerChildElem: IDropdownOptions) => innerChildElem.parentId = id);
                this._setCascadeSt(variables);
            }
        });
    }

    private _selectFilteredData(data): void {
        if (data) {
            this.selectedListItem = data;
            this._setInputModel();
        }
    }
}
