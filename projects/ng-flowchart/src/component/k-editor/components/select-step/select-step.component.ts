import {Component} from '@angular/core';
import {NgFlowchartStepComponent} from '../../../../lib/ng-flowchart-step/ng-flowchart-step.component';
import {IDropdownOptions} from './model/dropdown-option.interface';

export interface IDropdownSettings {
    enableSearchFiltering?: boolean;
}

@Component({
    selector: 'lib-select-step',
    templateUrl: './select-step.component.html',
    styleUrls: ['./select-step.component.scss']
})
export class SelectStepComponent extends NgFlowchartStepComponent {
    dropdownOptions: IDropdownOptions[] = [{
        id: 1,
        name: 'opt 1',
        variables: [
            {
                id: 1,
                name: '23'
            },
            {
                id: 2,
                name: '555'
            }
        ]
    }];
    // Selected Elem ID
    selectedId = [];
    selectedOption = '';
    isInputEntered = false;
    filterInput = '';
    selectedListItem: IDropdownOptions[];
    showDropDown = false;
    filterData: any;
    private optionSettings: any;

    get settings(): IDropdownSettings {
        return this.optionSettings;
    }

    set settings(settings: IDropdownSettings) {
        this.optionSettings = settings || {
            enableSearchFiltering: false
        };
    }

    reset(event): void {
        this.selectedOption = '';
        this.showDropDown = false;
        this.filterInput = '';
        // event.stopPropagation();
    }

    enableSearchFilter() {
        return !this.settings.enableSearchFiltering || false;
    }

    isItemSelected(id: number): boolean {
        if (this.selectedListItem.length) {
            const selectedElem = this.selectedListItem.find((elem: IDropdownOptions) => elem.id === id);
            return selectedElem ? true : false;
        } else {
            return false;
        }

    }

    async displayCascader(item: IDropdownOptions, event) {
        const {variables, parentId} = item;
        if (!parentId) {
            this.selectedListItem = [];
            this._setCascaderSt(this.dropdownOptions);
        }
        if (variables && variables.length) {
            variables.showSubmenu = true;
        } else {
            this.selectedListItem.push({id: item.id, name: item.name});
            event.stopPropagation();
            this._setInputModel();
            this.showDropDown = false;
            // this.selectOption.emit(this.selectedListItem);
            return;
        }
        this.selectedListItem.push({id: item.id, name: item.name});
        event.stopPropagation();
    }

    displayDropdown(): void {
        this.showDropDown = !this.showDropDown;
        this.selectedListItem = [];
        this._setCascaderSt(this.dropdownOptions);
    }

    onBlur(event) {
        if (this.selectedListItem.length) {
            this.showDropDown = false;
        }
    }

    private _setInputModel() {
        const selectedListNames = this.selectedListItem.map((list: IDropdownOptions) => list.name);
        this.selectedOption = selectedListNames.toString().split(',').join('/');
    }

    private _setCascaderSt(data: Array<IDropdownOptions>): void {
        data.map((elem: IDropdownOptions) => {
            const {id, variables} = elem;
            if (variables && variables.length) {
                variables.showSubmenu = false;
                variables.map((innerChildElem: IDropdownOptions) => innerChildElem.parentId = id);
                this._setCascaderSt(variables);
            }
        });
    }
}
