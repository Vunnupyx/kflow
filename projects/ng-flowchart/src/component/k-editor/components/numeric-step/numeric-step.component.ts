import { Component } from '@angular/core';
import { NgFlowchartStepComponent } from 'projects/ng-flowchart/src/lib/ng-flowchart-step/ng-flowchart-step.component';
import {NgFlowchart} from '../../../../lib/model/flow.model';

@Component({
  selector: 'lib-numeric-step',
  templateUrl: './numeric-step.component.html',
  styleUrls: ['./numeric-step.component.scss']
})
export class NumericStepComponent extends NgFlowchartStepComponent {

  routes = [];

  ngOnInit(): void {
  }

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  canDeleteStep(): boolean {
    return true;
  }

  getDropPositionsForStep(pendingStep: NgFlowchart.PendingStep): NgFlowchart.DropPosition[] {
    if (pendingStep.template !== NumericStepComponent) {
      return ['ABOVE', 'LEFT', 'RIGHT'];
    }
    else {
      return ['BELOW'];
    }
  }

  delete() {
    //recursively delete
    this.destroy(true);
  }
  onChangeNumeric(event: any): void {
    const value = (event.target.value || '').trim();
    if (!Number(value)) {
      return;
    }
    console.log(this.data);
    this.data = value;
  }

  public inputValidator(event: any): void {
    const pattern = /^[+-]?([0-9]*[.])?[0-9]+$/;
    // ^[+-]?([0-9]*[.])?[0-9]+$  [^+-]?([0-9]*[.])?[0-9]+$
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[+-]?([^0-9]*[.])?[^0-9]/g, "");

    }
  }

}
