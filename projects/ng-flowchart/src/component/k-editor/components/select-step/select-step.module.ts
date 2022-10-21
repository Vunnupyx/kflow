import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectStepComponent } from './select-step.component';

@NgModule({
    declarations: [SelectStepComponent],
    imports: [
        CommonModule,
    ],
    exports: [SelectStepComponent]
})
export class SelectStepModule {
}
