import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectStepComponent} from './select-step.component';
import {FilterPipe} from './filter.pipe';
import {FormsModule} from '@angular/forms';
import {ListFilterComponent} from './list-filter/list-filter.component';


@NgModule({
    declarations: [SelectStepComponent, FilterPipe, ListFilterComponent],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [SelectStepComponent, FilterPipe, ListFilterComponent]
})
export class SelectStepModule {
}
