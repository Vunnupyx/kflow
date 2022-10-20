import {Injectable} from '@angular/core';
import {IDropdownOptions} from './model/dropdown-option.interface';

interface IFilterData {
    displayNames: string[];
    options: IDropdownOptions;
}

@Injectable({
    providedIn: 'root'
})
export class AngularCasacaderService {
    filterList: IFilterData = {
        displayNames: [],
        options: {}
    };
    tempArr: any[] = [];
    displayNamesList: string[] = [];

    constructor() {
    }

    /**
     * Used to create the filter list dataset when user search
     * @param dropdownOptions  - Corresponds to the master data set
     */
    generateFilterList(dropdownOptions: IDropdownOptions[]): IFilterData {
        this._recursiveFn(dropdownOptions);
        this.filterList.displayNames = [...this.displayNamesList];
        return this.filterList;
    }

    /**
     * Internal function that recurssively loops through items to create the filtered dataset
     * @param dropdownOptions - Corresponds to the master data set
     */
    private _recursiveFn(dropdownOptions) {
        return dropdownOptions.map((option: IDropdownOptions) => {
            const {id, name, variables, parentId} = option;
            this.tempArr.push({id, name});
            if (variables && variables.length) {
                this._recursiveFn(variables);
            } else {
                const namesList = this.tempArr.map(eachElem => eachElem.name);
                this.displayNamesList.push(namesList.toString().split(',').join('/'));
                const elemName = namesList[0];
                this.filterList.options[elemName] = [...this.tempArr];
                this.tempArr = [];
            }

        });
    }
}
