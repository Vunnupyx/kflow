import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { NgFlowchart } from './model/flow.model';
import { NgFlowchartStepComponent } from './ng-flowchart-step/ng-flowchart-step.component';
import { CanvasRendererService } from './services/canvas-renderer.service';
import { DropDataService as DragService } from './services/dropdata.service';
import { OptionsService } from './services/options.service';
import { StepManagerService } from './services/step-manager.service';

type DropResponse = {
  added: boolean;
  prettyRender: boolean;
};

export class CanvasFlow {
  rootStep: NgFlowchartStepComponent;

  // steps from this canvas only
  private _steps: NgFlowchartStepComponent[] = [];

  hasRoot() {
    return !!this.rootStep;
  }

  addStep(step: NgFlowchartStepComponent) {
    this._steps.push(step);
  }

  removeStep(step: NgFlowchartStepComponent) {
    let index = this._steps.findIndex((ele) => ele.id == step.id);
    if (index >= 0) {
      this._steps.splice(index, 1);
    }
  }

  get steps(): ReadonlyArray<NgFlowchartStepComponent> {
    return this._steps;
  }

  constructor() {}
}

@Injectable()
export class NgFlowchartCanvasService {
  viewContainer: ViewContainerRef;
  isDragging: boolean = false;

  currentDropTarget: NgFlowchart.DropTarget;

  flow: CanvasFlow = new CanvasFlow();

  _disabled: boolean = false;

  get disabled() {
    return this._disabled;
  }

  noParentError = {
    code: 'NO_PARENT',
    message: 'Step was not dropped under a parent and is not the root node',
  };

  constructor(
    private drag: DragService,
    public options: OptionsService,
    private renderer: CanvasRendererService,
    private stepmanager: StepManagerService
  ) {}

  public init(view: ViewContainerRef) {
    this.viewContainer = view;
    this.renderer.init(view);
    this.stepmanager.init(view);

    //hack to load the css
    let ref = this.stepmanager.create(
      {
        template: NgFlowchartStepComponent,
        type: '',
        data: null,
      },
      this
    );
    const i = this.viewContainer.indexOf(ref.hostView);
    this.viewContainer.remove(i);
  }

  public moveStep(drag: DragEvent, id: any) {
    this.renderer.clearAllSnapIndicators(this.flow.steps);

    let step: NgFlowchartStepComponent = this.flow.steps.find(
      (step) => step.nativeElement.id === id
    );
    if (!step) {
      // step cannot be moved if not in this canvas
      return;
    }
    if (step.isRootElement()) {
      this.renderer.updatePosition(step, drag);
      this.renderer.render(this.flow);
    } else if (this.currentDropTarget) {
      const response = this.addStepToFlow(step, this.currentDropTarget, true);
      this.renderer.render(this.flow, response.prettyRender);
    } else {
      this.moveError(step, this.noParentError);
    }
    if (
        this.options.callbacks?.onDropStep &&
        (this.currentDropTarget || step.isRootElement())
    ) {
      this.options.callbacks.onDropStep({
        isMove: true,
        step: step,
        parent: step.parent,
      });
    }
  }

  public async onDrop(drag: DragEvent) {
    this.renderer.clearAllSnapIndicators(this.flow.steps);

    if (this.flow.hasRoot() && !this.currentDropTarget) {
      this.dropError(this.noParentError);
      return;
    }

    //TODO just pass dragStep here, but come up with a better name and move the type to flow.model
    let componentRef = await this.createStep(
        this.drag.dragStep as NgFlowchart.PendingStep
    );

    const dropTarget = this.currentDropTarget || null;
    if (!this.flow.hasRoot()) {
      this.renderer.renderRoot(componentRef, drag);
      this.setRoot(componentRef.instance);
    } else {
      // if root is replaced by another step, rerender root to proper position
      if (
          dropTarget.step.isRootElement() &&
          dropTarget.position === 'ABOVE'
      ) {
        this.renderer.renderRoot(componentRef, drag);
      }
      this.addChildStep(componentRef, dropTarget);
    }

    if (this.options.callbacks?.onDropStep) {
      this.options.callbacks.onDropStep({
        step: componentRef.instance,
        isMove: false,
        parent: componentRef.instance.parent,
      });
    }
  }

  public onDragStart(drag: DragEvent) {
    this.isDragging = true;

    this.currentDropTarget = this.renderer.findAndShowClosestDrop(
      this.drag.dragStep,
      drag,
      this.flow.steps
    );
  }

  public createStepFromType(
    id: string,
    type: string,
    data: any
  ): Promise<ComponentRef<NgFlowchartStepComponent>> {
    let compRef = this.stepmanager.createFromRegistry(id, type, data, this);
    return new Promise((resolve) => {
      let sub = compRef.instance.viewInit.subscribe(async () => {
        sub.unsubscribe();
        setTimeout(() => {
          compRef.instance.onUpload(data);
        });
        resolve(compRef);
      });
    });
  }

  public createStep(
    pending: NgFlowchart.PendingStep
  ): Promise<ComponentRef<NgFlowchartStepComponent>> {
    let componentRef: ComponentRef<NgFlowchartStepComponent>;

    componentRef = this.stepmanager.create(pending, this);

    return new Promise((resolve) => {
      let sub = componentRef.instance.viewInit.subscribe(
        () => {
          sub.unsubscribe();
          resolve(componentRef);
        },
        (error) => console.error(error)
      );
    });
  }

  public resetScale() {
    if (this.options.options.zoom.mode === 'DISABLED') {
      return;
    }
    this.renderer.resetScale(this.flow);
  }

  public scaleUp(step?: number) {
    if (this.options.options.zoom.mode === 'DISABLED') {
      return;
    }
    this.renderer.scaleUp(this.flow, step);
  }

  public scaleDown(step?: number) {
    if (this.options.options.zoom.mode === 'DISABLED') {
      return;
    }
    this.renderer.scaleDown(this.flow, step);
  }

  public setScale(scaleValue: number) {
    if (this.options.options.zoom.mode === 'DISABLED') {
      return;
    }
    this.renderer.setScale(this.flow, scaleValue);
  }

  addChildStep(
    componentRef: ComponentRef<NgFlowchartStepComponent>,
    dropTarget: NgFlowchart.DropTarget
  ) {
    this.addToCanvas(componentRef);
    const response = this.addStepToFlow(componentRef.instance, dropTarget);
    this.renderer.render(this.flow, response.prettyRender);
  }

  addToCanvas(componentRef: ComponentRef<NgFlowchartStepComponent>) {
    this.renderer.renderNonRoot(componentRef);
  }

  reRender(pretty?: boolean) {
    this.renderer.render(this.flow, pretty);
  }

  async upload(root: any) {
    await this.uploadNode(root);
    this.reRender(true);
  }

  private async uploadNode(
    node: any,
    parentNode?: NgFlowchartStepComponent
  ): Promise<NgFlowchartStepComponent> {
    if (!node) {
      // no node to upload when uploading empty nested flow
      return;
    }

    let comp = await this.createStepFromType(node.id, node.type, node.data);
    if (!parentNode) {
      this.setRoot(comp.instance);
      this.renderer.renderRoot(comp, null);
    } else {
      this.renderer.renderNonRoot(comp);
      this.flow.addStep(comp.instance);
    }

    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      let childComp = await this.uploadNode(child, comp.instance);
      comp.instance.children.push(childComp);
      childComp.setParent(comp.instance, true);
    }

    return comp.instance;
  }

  private setRoot(step: NgFlowchartStepComponent, force: boolean = true) {
    if (this.flow.hasRoot()) {
      if (!force) {
        console.warn('Already have a root and force is false');
        return;
      }

      //reparent root
      let oldRoot = this.flow.rootStep;
      this.flow.rootStep = step;
      step.zaddChild0(oldRoot);
    } else {
      this.flow.rootStep = step;
    }

    this.flow.addStep(step);
  }

  private addStepToFlow(
    step: NgFlowchartStepComponent,
    dropTarget: NgFlowchart.DropTarget,
    isMove = false
  ): DropResponse {
    let response = {
      added: false,
      prettyRender: false,
    };

    switch (dropTarget.position) {
      case 'ABOVE':
        response = this.placeStepAdjacent(step, dropTarget.step, true);
        break;
      case 'BELOW':
        response = this.placeStepAdjacent(step, dropTarget.step, false);
        break;
      case 'LEFT':
        response = this.placeStepLeft(step, dropTarget.step);
        break;
      case 'RIGHT':
        response = this.placeStepRight(step, dropTarget.step);
        break;
      case 'CENTER':
        response = this.placeStepReplace(step, dropTarget.step);
        break;
      default:
        break;
    }

    if (!isMove && response.added) {
      this.flow.addStep(step);
    }
    return response;
  }

  private placeStepReplace(
      newStep: NgFlowchartStepComponent,
      lostStep: NgFlowchartStepComponent
  ): DropResponse {
    let newParent = lostStep.parent;
    if (newParent) {
      newParent.removeChild(lostStep);
      newParent.zaddChild0(newStep);
    } else {
      newStep.parent?.removeChild(newStep);
      newStep.setParent(null, true);
      lostStep.removeChild(newStep);
      this.setRoot(newStep);
    }
    lostStep.children?.map(item => newStep.zaddChild0(item));
    lostStep.destroy();
    return {
      added: true,
      prettyRender: false,
    };
  }

  private placeStepRight(
    newStep: NgFlowchartStepComponent,
    parentStep: NgFlowchartStepComponent
  ): DropResponse {
    return {
      added: parentStep.zaddChild0(newStep),
      prettyRender: false,
    };
  }

  private placeStepAdjacent(
    newStep: NgFlowchartStepComponent,
    siblingStep: NgFlowchartStepComponent,
    isBelow: boolean = true
  ): DropResponse {
    if (siblingStep.parent) {
      //find the adjacent steps index in the parents child array
      const adjacentIndex = siblingStep.parent.children.findIndex(
        (child) => child.nativeElement.id == siblingStep.nativeElement.id
      );
      siblingStep.parent.zaddChildSibling0(
        newStep,
        adjacentIndex + (isBelow ? 0 : 1)
      );
    } else {
      console.warn('Parallel actions must have a common parent');
      return {
        added: false,
        prettyRender: false,
      };
    }
    return {
      added: true,
      prettyRender: false,
    };
  }

  private placeStepLeft(
    newStep: NgFlowchartStepComponent,
    childStep: NgFlowchartStepComponent
  ): DropResponse {
    let prettyRender = false;
    let newParent = childStep.parent;
    if (newParent) {
      //we want to remove child and insert our newStep at the same index
      let index = newParent.removeChild(childStep);
      newParent.zaddChild0(newStep);
      newStep.zaddChild0(childStep);
    } else {
      // new root node
      newStep.parent?.removeChild(newStep);
      newStep.setParent(null, true);

      //if the new step was a direct child of the root step, we need to break that connection
      childStep.removeChild(newStep);
      this.setRoot(newStep);

      prettyRender = true;
    }
    return {
      added: true,
      prettyRender,
    };
  }

  private dropError(error: NgFlowchart.ErrorMessage) {
    if (this.options.callbacks?.onDropError) {
      let parent =
        this.currentDropTarget?.position !== 'BELOW'
          ? this.currentDropTarget?.step.parent
          : this.currentDropTarget?.step;
      this.options.callbacks.onDropError({
        step: this.drag.dragStep as NgFlowchart.PendingStep,
        parent: parent || null,
        error: error,
      });
    }
  }

  private moveError(step: NgFlowchartStepComponent, error) {
    if (this.options.callbacks?.onMoveError) {
      let parent =
        this.currentDropTarget?.position !== 'BELOW'
          ? this.currentDropTarget?.step.parent
          : this.currentDropTarget?.step;
      this.options.callbacks.onMoveError({
        step: {
          instance: step,
          type: step.type,
          data: step.data,
        },
        parent: parent,
        error: error,
      });
    }
  }
}
