import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KEditorComponent } from './k-editor.component';
import { NgFlowchartModule } from '../../lib/ng-flowchart.module';
import { CustomStepComponent } from './components/custom-step/custom-step.component';
import { RouteStepComponent } from './components/custom-step/route-step/route-step.component';
import { NestedFlowComponent } from './components/nested-flow/nested-flow.component';
import { FormStepComponent } from './components/form-step/form-step.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    KEditorComponent,
    CustomStepComponent,
    RouteStepComponent,
    NestedFlowComponent,
    FormStepComponent
  ],
  imports: [
    CommonModule,
    NgFlowchartModule,
    FormsModule
  ],
  exports: [KEditorComponent]
})
export class KEditorModule { }
