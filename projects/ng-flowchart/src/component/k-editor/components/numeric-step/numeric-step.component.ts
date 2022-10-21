import { Component } from '@angular/core';
import { NgFlowchartStepComponent } from 'projects/ng-flowchart/src/lib/ng-flowchart-step/ng-flowchart-step.component';

@Component({
  selector: 'lib-numeric-step',
  templateUrl: './numeric-step.component.html',
  styleUrls: ['./numeric-step.component.scss']
})
export class NumericStepComponent extends NgFlowchartStepComponent {

  delete(): void {
    this.destroy(true);
  }

  onChangeNumeric(event: any): void {
    const value = (event.target.value || '').trim();
    if (!Number(value)) {
      return;
    }
    this.data = value;
  }

  public inputValidator(event: any): void {
    const pattern = /^[+-]?([0-9]*[.])?[0-9]+$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^\d,.]*/g, '')
          .replace(/^[^\d]*(\d+([.,]\d{0,5})?).*$/g, '$1')
          .replace(/([,.])[,.]/g, '$1');
    }
  }

}
