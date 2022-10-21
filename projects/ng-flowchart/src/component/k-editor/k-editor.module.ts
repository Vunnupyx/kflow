import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KEditorComponent } from './k-editor.component';
import { NgFlowchartModule } from '../../lib/ng-flowchart.module';
import { FormsModule } from '@angular/forms';
import { NumericStepComponent } from './components/numeric-step/numeric-step.component';
import { SelectStepModule } from './components/select-step/select-step.module';



@NgModule({
  declarations: [
    KEditorComponent,
    NumericStepComponent,
  ],
  imports: [
    CommonModule,
    NgFlowchartModule,
    FormsModule,
    SelectStepModule
  ],
  exports: [KEditorComponent]
})
export class KEditorModule { }
