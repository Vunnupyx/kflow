import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KEditorComponent } from './k-editor.component';
import { NgFlowchartModule } from '../../lib/ng-flowchart.module';
import { FormsModule } from '@angular/forms';
import { NumericStepComponent } from './components/numeric-step/numeric-step.component';
import { SelectStepModule } from './components/select-step/select-step.module';
import {NestedFlowComponent} from './components/nested-flow/nested-flow.component';
import { SerializerModule } from './service/serializer.module';



@NgModule({
  declarations: [
    KEditorComponent,
    NumericStepComponent,
    NestedFlowComponent,
  ],
  imports: [
    CommonModule,
    NgFlowchartModule,
    FormsModule,
    SelectStepModule,

    SerializerModule
  ],
  exports: [KEditorComponent]
})
export class KEditorModule { }
