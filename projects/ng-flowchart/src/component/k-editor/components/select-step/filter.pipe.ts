import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(list: any[], filterText: string): any {
        let result: any;
        if (list.length) {
            if (filterText) {
                result = list.filter(item => item.search(new RegExp(filterText, 'i')) > -1);
            } else {
                result = list;
            }
        } else {
            return;
        }

        return result.length ? result : [-1];
    }

}
