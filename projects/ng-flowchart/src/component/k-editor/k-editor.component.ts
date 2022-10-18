import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CustomStepComponent } from './components/custom-step/custom-step.component';
import { NestedFlowComponent } from './components/nested-flow/nested-flow.component';
import { FormStepComponent } from './components/form-step/form-step.component';
import { RouteStepComponent } from './components/custom-step/route-step/route-step.component';
import { NgFlowchart } from '../../lib/model/flow.model';
import { NgFlowchartStepRegistry } from '../../lib/ng-flowchart-step-registry.service';
import { NgFlowchartCanvasDirective } from '../../lib/ng-flowchart-canvas.directive';
import { VariableGroup } from '../../models';

@Component({
  selector: 'k-editor',
  templateUrl: './k-editor.component.html',
  styleUrls: ['./k-editor.component.scss']
})
export class KEditorComponent implements OnChanges, AfterViewInit {
  @Input() variables: VariableGroup;
  
  @Input() value: object;
  @Output() valueChange: EventEmitter<object> = new EventEmitter<object>();

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

  constructor(
    private stepRegistry: NgFlowchartStepRegistry,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.callbacks.onDropError = (x) => this.onDropError(x);
    this.callbacks.onMoveError = (x) => this.onMoveError(x);
    this.callbacks.onDropStep = () => this.onDropStep();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this._renderValue(changes.value.currentValue);
    }
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('log', this.normalStepTemplate);
    this.stepRegistry.registerStep('router', CustomStepComponent);
    this.stepRegistry.registerStep('nested-flow', NestedFlowComponent);
    this.stepRegistry.registerStep('form-step', FormStepComponent);
    this.stepRegistry.registerStep('route-step', RouteStepComponent);

    this._renderValue(this.value);
    this.changeDetectorRef.detectChanges();
  }

  onDropStep() {
    this._emitValueChange();
  }

  onDropError(error: NgFlowchart.DropError) {
    console.error(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.error(error);
  }

  clearData() {
    this.canvas.getFlow().clear();
    this._emitValueChange();
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
    this._emitValueChange();
  }

  private async _renderValue(value: object) {
    if (!this.canvas) { 
      return;
    }
    await this.canvas.getFlow().upload(value);
  }

  private _emitValueChange() {
    this.valueChange.emit(this.canvas.getFlow().toObject());
  }

}
