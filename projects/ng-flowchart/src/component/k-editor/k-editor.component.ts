import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgFlowchart } from '../../lib/model/flow.model';
import { NgFlowchartStepRegistry } from '../../lib/ng-flowchart-step-registry.service';
import { NgFlowchartCanvasDirective } from '../../lib/ng-flowchart-canvas.directive';
import { VariableGroup } from '../../models';
import { NumericStepComponent } from './components/numeric-step/numeric-step.component';
import { SelectStepComponent } from './components/select-step/select-step.component';
import { NestedFlowComponent } from './components/nested-flow/nested-flow.component';

@Component({
  selector: 'k-editor',
  templateUrl: './k-editor.component.html',
  styleUrls: ['./k-editor.component.scss']
})
export class KEditorComponent implements OnChanges, AfterViewInit {
  @Input() variables: VariableGroup[];

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
      type: 'plus',
      data: {
        name: 'Log',
        icon: { name: 'plus.svg', color: 'blue' },
        config: {
          message: null,
          severity: null
        }
      }
    },
    {
      name: 'Logger',
      type: 'minus',
      data: {
        name: 'Log',
        icon: { name: 'minus.svg', color: 'blue' },
        config: {
          message: null,
          severity: null
        }
      }
    },
    {
      name: 'Logger',
      type: 'cross',
      data: {
        name: 'Log',
        icon: { name: 'cross.svg', color: 'blue' },
        config: {
          message: null,
          severity: null
        }
      }
    },
    {
      name: 'Logger',
      type: 'divide',
      data: {
        name: 'Log',
        icon: { name: 'divide.svg', color: 'blue' },
        config: {
          message: null,
          severity: null
        }
      }
    }
  ];

  customOps;

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
    this.callbacks.onChangeStep = () => this.onChangeStep();
    this.callbacks.afterDeleteStep = () => this.onDeleteStep();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this._renderValue(changes.value.currentValue);
    }
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('plus', this.normalStepTemplate);
    this.stepRegistry.registerStep('minus', this.normalStepTemplate);
    this.stepRegistry.registerStep('cross', this.normalStepTemplate);
    this.stepRegistry.registerStep('divide', this.normalStepTemplate);
    this.stepRegistry.registerStep('numeric', NumericStepComponent);
    this.stepRegistry.registerStep('select', SelectStepComponent);
    this.stepRegistry.registerStep('nested', NestedFlowComponent);

    this._renderValue(this.value);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.customOps = [
      {
        paletteName: 'Numeric',
        step: {
          template: NumericStepComponent,
          type: 'numeric',
          data: null
        }
      },
      {
        paletteName: 'Select',
        step: {
          template: SelectStepComponent,
          type: 'select',
          data: {
            selectedOption: [],
            dropdownOptions: this.variables,
          }
        }
      },
      {
        paletteName: 'Group',
        step: {
          template: NestedFlowComponent,
          type: 'nested',
          data: {
            name: 'Nested Flow'
          }
        }
      },
    ];
  }

  onChangeStep() {
    this._emitValueChange();
  }

  onDropStep() {
    this._emitValueChange();
  }

  onDeleteStep() {
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
