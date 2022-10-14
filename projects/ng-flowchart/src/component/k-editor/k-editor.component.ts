import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CustomStepComponent } from './components/custom-step/custom-step.component';
import { NestedFlowComponent } from './components/nested-flow/nested-flow.component';
import { FormStepComponent } from './components/form-step/form-step.component';
import { RouteStepComponent } from './components/custom-step/route-step/route-step.component';
import { NgFlowchart } from '../../lib/model/flow.model';
import { NgFlowchartStepRegistry } from '../../lib/ng-flowchart-step-registry.service';
import { NgFlowchartCanvasDirective } from '../../lib/ng-flowchart-canvas.directive';
import { Variables } from '../../models';

@Component({
  selector: 'k-editor',
  templateUrl: './k-editor.component.html',
  styleUrls: ['./k-editor.component.scss']
})
export class KEditorComponent {
  @Input() value: any;
  @Input() variables: Variables;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'DISABLED'
    }
  };

  @ViewChild('normalStep')
  normalStepTemplate: TemplateRef<any>;

  items = [
    {
      name: 'Logger',
      type: 'log',
      data: {
        name: 'Log',
        icon: { name: 'log-icon', color: 'blue' },
        config: {
          message: null,
          severity: null
        }
      }
    }
  ];

  customOps = [
    {
      paletteName: 'Router',
      step: {
        template: CustomStepComponent,
        type: 'router',
        data: {
          name: 'Routing Block'
        }
      }
    },
    {
      paletteName: 'Form Step',
      step: {
        template: FormStepComponent,
        type: 'form-step',
        data: '123'
      }
    },
    {
      paletteName: 'Nested Flow',
      step: {
        template: NestedFlowComponent,
        type: 'nested-flow',
        data: {
          name: 'Nested Flow'
        }
      }

    }
  ];

  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective;

  disabled = false;

  constructor(private stepRegistry: NgFlowchartStepRegistry) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
    this.callbacks.afterDeleteStep = this.afterDeleteStep;
    this.callbacks.beforeDeleteStep = this.beforeDeleteStep;
  }

  ngAfterViewInit() {
    // this.stepRegistry.registerStep('rest-get', this.normalStepTemplate);
    this.stepRegistry.registerStep('log', this.normalStepTemplate);
    this.stepRegistry.registerStep('router', CustomStepComponent);
    this.stepRegistry.registerStep('nested-flow', NestedFlowComponent);
    this.stepRegistry.registerStep('form-step', FormStepComponent);
    this.stepRegistry.registerStep('route-step', RouteStepComponent);
    setTimeout(() => {
      this.showUpload();
    }, 0);
    //this.showUpload();

  }

  onDropError(error: NgFlowchart.DropError) {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log(error);
  }

  beforeDeleteStep(step) {
    console.log(JSON.stringify(step.children));
  }

  afterDeleteStep(step) {
    console.log(JSON.stringify(step.children));
  }

  showUpload() {
    this.canvas.getFlow().upload(this.value);
  }

  showFlowData() {
    const json = this.canvas.getFlow().toJSON(4);
    this.valueChange.emit(json);
  }

  clearData() {
    this.canvas.getFlow().clear();
  }

  onGapChanged(event) {

    this.options = {
      ...this.options,
      stepGap: parseInt(event.target.value)
    };
  }

  onMultipleChildNodesChange(event) {
    this.options = {
      ...this.options,
      allowMultipleChildNodes: event.target.checked
    };
  }

  onDelete(id) {
    this.canvas.getFlow().getStep(id).destroy(true);
  }

}
