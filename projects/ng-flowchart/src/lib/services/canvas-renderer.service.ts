import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { NgFlowchart } from '../model/flow.model';
import { CONSTANTS } from '../model/flowchart.constants';
import { CanvasFlow } from '../ng-flowchart-canvas.service';
import { NgFlowchartStepComponent } from '../ng-flowchart-step/ng-flowchart-step.component';
import { OptionsService } from './options.service';

export type DropProximity = {
    step: NgFlowchartStepComponent,
    position: NgFlowchart.DropPosition,
    proximity: number
};

@Injectable()
export class CanvasRendererService {
    private viewContainer: ViewContainerRef;

    private scale: number = 1;
    private scaleDebounceTimer = null

    constructor(
        private options: OptionsService
    ) {

    }

    public init(viewContainer: ViewContainerRef) {
        this.viewContainer = viewContainer;
    }

    public renderRoot(step: ComponentRef<NgFlowchartStepComponent>, dragEvent?: DragEvent) {
        this.getCanvasContentElement().appendChild((step.location.nativeElement));
        this.setRootPosition(step.instance, dragEvent);
    }

    public renderNonRoot(step: ComponentRef<NgFlowchartStepComponent>, dragEvent?: DragEvent) {
        this.getCanvasContentElement().appendChild((step.location.nativeElement));
    }

    public updatePosition(step: NgFlowchartStepComponent, dragEvent: DragEvent) {
        let relativeXY = this.getRelativeXY(dragEvent);

        relativeXY = relativeXY.map(coord => coord / this.scale)
        step.zsetPosition(relativeXY, true);
    }

    private getStepGap() {
        return this.options.options.stepGap;
    }

    private renderChildTree(rootNode: NgFlowchartStepComponent, rootRect: Partial<DOMRect>, canvasRect: DOMRect) {
        //the rootNode passed in is already rendered. just need to render its children /subtree
        if (!rootNode.hasChildren()) {
            return;
        }

        const rootRight = rootRect.right - canvasRect.left * this.scale;
        const childLeft = rootRight + this.getStepGap();
  
        const rootHeight = rootRect.height / this.scale

        const rootCenter = (rootRect.top - canvasRect.top) + (rootHeight / 2);

        let childTreeHeights = {};
        let totalTreeHeight = 0;

        rootNode.children.forEach(child => {
            let totalChildHeight = child.getNodeTreeHeight(this.getStepGap());
            totalChildHeight = totalChildHeight / this.scale
            childTreeHeights[child.nativeElement.id] = totalChildHeight;

            totalTreeHeight += totalChildHeight;
        });

        totalTreeHeight += (rootNode.children.length - 1) * this.getStepGap();

        let leftYTree = rootCenter - (totalTreeHeight / 2);
        
        leftYTree = Math.max(0, leftYTree)

        rootNode.children.forEach(child => {

            let childExtent = childTreeHeights[child.nativeElement.id];

            let childTop = leftYTree + (childExtent / 2) - (child.nativeElement.offsetHeight / 2);


            child.zsetPosition([childLeft, childTop]);

            const currentChildRect = child.getCurrentRect(canvasRect);

            const childHeight = currentChildRect.height / this.scale
           
            child.zdrawArrow(
                [rootRight, rootCenter],
                [currentChildRect.left - canvasRect.left, currentChildRect.top + childHeight / 2 - canvasRect.top]
            );

            this.renderChildTree(child, currentChildRect, canvasRect);
            leftYTree += childExtent + this.getStepGap();
        })

    }


    public render(flow: CanvasFlow, pretty?: boolean, skipAdjustDimensions = false) {
        if (!flow.hasRoot()) {
            if (this.options.options.zoom.mode === 'DISABLED') {
                this.resetAdjustDimensions();
                // Trigger afterRender to allow nested canvas to redraw parent canvas.
                // Not sure if this scenario should also trigger beforeRender.
                if (this.options.callbacks?.afterRender) {
                    this.options.callbacks.afterRender()
                }
            }
            return;
        }

        if (this.options.callbacks?.beforeRender) {
            this.options.callbacks.beforeRender()
        }

        const canvasRect = this.getCanvasContentElement().getBoundingClientRect();
        if (pretty) {
            //this will place the root at the top center of the canvas and render from there
            this.setRootPosition(flow.rootStep, null);
        }
        this.renderChildTree(flow.rootStep, flow.rootStep.getCurrentRect(canvasRect), canvasRect);
        
        if (!skipAdjustDimensions && this.options.options.zoom.mode === 'DISABLED') {
            this.adjustDimensions(flow, canvasRect);
        }

        if (this.options.callbacks?.afterRender) {
            this.options.callbacks.afterRender()
        }
    }

    private resetAdjustDimensions(): void {
        // reset canvas auto sizing to original size if empty
        if (this.viewContainer) {
            const canvasWrapper = this.getCanvasContentElement();
            canvasWrapper.style.minWidth = null;
            canvasWrapper.style.minHeight = null;
        }
    }
           

    private findDropLocationForHover(absMouseXY: number[], targetStep: NgFlowchartStepComponent, stepToDrop: NgFlowchart.Step): DropProximity | 'deadzone' | null {

        if (!targetStep.shouldEvalDropHover(absMouseXY, stepToDrop)) {
            return 'deadzone'
        }

        const stepRect = targetStep.nativeElement.getBoundingClientRect();

        const yStepCenter = stepRect.bottom - stepRect.height / 2;
        const xStepCenter = stepRect.left + stepRect.width / 2;

        const yDiff = absMouseXY[1] - yStepCenter;
        const xDiff = absMouseXY[0] - xStepCenter;

        const absYDistance = Math.abs(yDiff);
        const absXDistance = Math.abs(xDiff);

        //#math class #Pythagoras
        const distance = Math.sqrt(absYDistance * absYDistance + absXDistance * absXDistance);
        const accuracyRadius = (stepRect.height + stepRect.width) / 2;

        let result: DropProximity | 'deadzone' | null = null;

        if (distance < accuracyRadius) {
            if (distance < this.options.options.hoverDeadzoneRadius) {
                //basically we are too close to the middle to accurately predict what position they want
                result = 'deadzone';
            }

            if (this.equalsArithmeticOperators(targetStep) && this.equalsArithmeticOperators(stepToDrop)) {
                result = {
                    step: targetStep,
                    position: 'CENTER',
                    proximity: absYDistance
                };
            } else if (absYDistance > absXDistance && !targetStep.isRootElement() && this.options.options.allowMultipleChildNodes) {
                result = {
                    step: targetStep,
                    position: yDiff > 0 ? 'BELOW' : 'ABOVE',
                    proximity: absYDistance
                };
            } else {
                result = {
                    step: targetStep,
                    position: xDiff > 0 ? 'RIGHT' : 'LEFT',
                    proximity: absXDistance
                };
            }
        }

        if (result && result !== 'deadzone') {
            if (!targetStep.getDropPositionsForStep(stepToDrop).includes(result.position)) {
                //we had a valid drop but the target step doesnt allow this location
                result = null;
            }
        }

        return result;
    }

    private isDropAcceptable(targetStep: NgFlowchartStepComponent, stepToDrop: NgFlowchartStepComponent | NgFlowchart.Step, position: string): boolean {
        if (stepToDrop && this) {
            const hasArithmeticOperatorStep = this.equalsArithmeticOperators(stepToDrop);
            if (position === 'RIGHT' && targetStep.children[0]) {
                return !hasArithmeticOperatorStep || !this.equalsArithmeticOperators(targetStep.children[0]);
            } else if (position === 'LEFT' && targetStep.parent) {
                return !hasArithmeticOperatorStep || !this.equalsArithmeticOperators(targetStep.parent);
            }
            return true;
        }
        return false;
    }

    private equalsArithmeticOperators(step: NgFlowchartStepComponent | NgFlowchart.Step): boolean {
        const operatorsType = ['minus', 'plus', 'cross', 'divide'];
        for (let operatorType of operatorsType) {
            if (operatorType === step.type) {
                return true;
            }
        }
        return false;
    }

    private adjustDimensions(flow: CanvasFlow, canvasRect: DOMRect): void {
        let maxRight = 0;
        let maxBottom = 0;

        //TODO this can be better
        flow.steps.forEach(
            ele => {
                let rect = ele.getCurrentRect(canvasRect);
                maxRight = Math.max(rect.right, maxRight);
                maxBottom = Math.max(rect.bottom, maxBottom);
            }
        );

        const widthBorderGap = 100;
        const widthDiff = canvasRect.width - (maxRight - canvasRect.left);
        if (widthDiff < widthBorderGap) {
            let growWidth = widthBorderGap;
            if(widthDiff < 0) {
                growWidth += Math.abs(widthDiff);
            }
            this.getCanvasContentElement().style.minWidth = `${canvasRect.width + growWidth}px`;
            if (this.options.options.centerOnResize) {
                this.render(flow, true, true);
            }
        } else if(widthDiff > widthBorderGap) {
            let totalTreeWidth = widthDiff - widthBorderGap;
            if(this.isNestedCanvas()) {
                this.getCanvasContentElement().style.minWidth = `${canvasRect.width - totalTreeWidth}px`;
                if (this.options.options.centerOnResize) {
                    this.render(flow, true, true);
                }
            } else if(this.getCanvasContentElement().style.minWidth) {
                // reset normal canvas width if auto width set
                this.getCanvasContentElement().style.minWidth = null;
                if (this.options.options.centerOnResize) {
                    this.render(flow, true, true);
                }
            }
        }
        
        const heightBorderGap = 30;
        const heightDiff = canvasRect.height - (maxBottom - canvasRect.top);
        if (heightDiff < heightBorderGap) {
            let growHeight = heightBorderGap;
            if(heightDiff < 0) {
                growHeight += Math.abs(heightDiff);
            }
            this.getCanvasContentElement().style.minHeight = `${canvasRect.height + growHeight}px`;
            if (this.options.options.centerOnResize) {
                this.render(flow, true, true);
            }
        } else if(heightDiff > heightBorderGap){
            if(this.isNestedCanvas()) {
                let shrinkHeight = heightDiff - heightBorderGap;
                this.getCanvasContentElement().style.minHeight = `${canvasRect.height - shrinkHeight}px`;
                if (this.options.options.centerOnResize) {
                    this.render(flow, true, true);
                }
            } else if(this.getCanvasContentElement().style.minHeight) {
                // reset normal canvas height if auto height set
                this.getCanvasContentElement().style.minHeight = null;
                if (this.options.options.centerOnResize) {
                    this.render(flow, true, true);
                }
            }
        }
    }

    private findBestMatchForSteps(dragStep: NgFlowchart.Step, event: DragEvent, steps: ReadonlyArray<NgFlowchartStepComponent>): DropProximity | null {
        const absXY = [event.clientX, event.clientY];

        let bestMatch: DropProximity = null;

        for (let i = 0; i < steps.length; i++) {

            const step = steps[i];

            if (step.isHidden()) {
                continue;
            }

            const position = this.findDropLocationForHover(absXY, step, dragStep);
            if (position) {
                if (position == 'deadzone') {
                    bestMatch = null;
                    break;
                }
                //if this step is closer than previous best match then we have a new best
                else if (bestMatch == null || bestMatch.proximity > position.proximity) {
                    if (this.isDropAcceptable(step, dragStep, position.position)) {
                        bestMatch = position;
                    }
                }
            }
        }

        return bestMatch
    }

    public findAndShowClosestDrop(dragStep: NgFlowchart.Step, event: DragEvent, steps: ReadonlyArray<NgFlowchartStepComponent>): NgFlowchart.DropTarget {
        if (!steps || steps.length == 0) {
            return;
        }

        let bestMatch: DropProximity = this.findBestMatchForSteps(dragStep, event, steps);

        // TODO make this more efficient. two loops
        steps.forEach(step => {
            if (bestMatch == null || step.nativeElement.id !== bestMatch.step.nativeElement.id) {

                step.clearHoverIcons();
            }
        })

        if (!bestMatch) {
            return;
        }

        bestMatch.step.showHoverIcon(bestMatch.position);

        return {
            step: bestMatch.step,
            position: bestMatch.position
        };
    }

    public showSnaps(dragStep: NgFlowchart.PendingStep) {


    }

    public clearAllSnapIndicators(steps: ReadonlyArray<NgFlowchartStepComponent>) {
        steps.forEach(
            step => step.clearHoverIcons()
        )
    }

    private setRootPosition(step: NgFlowchartStepComponent, dragEvent?: DragEvent) {

        if (!dragEvent) {
            const canvasLeft = this.getCanvasLeftVerticalCenterPosition(step.nativeElement);
            step.zsetPosition(canvasLeft, true)
            return;
        }

        switch (this.options.options.rootPosition) {
            case 'CENTER':
                const canvasCenter = this.getCanvasCenterPosition();
                step.zsetPosition(canvasCenter, true);
                return;
            case 'TOP_CENTER':
                const canvasTop = this.getCanvasLeftVerticalCenterPosition(step.nativeElement);
                step.zsetPosition(canvasTop, true)
                return;
            default:
                const relativeXY = this.getRelativeXY(dragEvent);
                step.zsetPosition(relativeXY, true);
                return;
        }
    }

    private getRelativeXY(dragEvent: DragEvent) {
        const canvasRect = this.getCanvasContentElement().getBoundingClientRect();

        return [
            dragEvent.clientX - canvasRect.left,
            dragEvent.clientY - canvasRect.top
        ]
    }

    private getCanvasLeftVerticalCenterPosition(htmlRootElement: HTMLElement) {
        const canvasRect = this.getCanvasContentElement().getBoundingClientRect();
        const rootElementWidth = htmlRootElement.getBoundingClientRect().width;
        const xCoord = rootElementWidth / 2 + this.options.options.stepGap
        const scaleXOffset = (1 - this.scale) * 100
            
        return [
            xCoord + scaleXOffset,
            canvasRect.height / (this.scale * 2)
        ]
    }

    private getCanvasCenterPosition() {
        const canvasRect = this.getCanvasContentElement().getBoundingClientRect();
        return [
            canvasRect.width / 2,
            canvasRect.height / 2
        ]
    }

    private getCanvasContentElement(): HTMLElement {
        const canvas = this.viewContainer.element.nativeElement as HTMLElement;
        let canvasContent = canvas.getElementsByClassName(CONSTANTS.CANVAS_CONTENT_CLASS).item(0);
        return canvasContent as HTMLElement;
    }

    private isNestedCanvas(): boolean {
        if (this.viewContainer) {
            const canvasWrapper = (this.viewContainer.element.nativeElement as HTMLElement).parentElement;
            if (canvasWrapper) {
                return canvasWrapper.classList.contains('ngflowchart-step-wrapper');
            }
        }
        return false;
    }

    public resetScale(flow: CanvasFlow) {
        this.setScale(flow, 1)
    }

    public scaleUp(flow: CanvasFlow, step? : number) {
        const newScale = this.scale + (this.scale * step || this.options.options.zoom.defaultStep)
        this.setScale(flow, newScale)
       
    }

    public scaleDown(flow: CanvasFlow, step? : number) {
        const newScale = this.scale - (this.scale * step || this.options.options.zoom.defaultStep)
        this.setScale(flow, newScale)
    }

    public setScale(flow: CanvasFlow, scaleValue: number) {
        const minDimAdjust = `${1/scaleValue * 100}%`

        const canvasContent = this.getCanvasContentElement()

        canvasContent.style.transform = `scale(${scaleValue})`;
        canvasContent.style.minHeight = minDimAdjust
        canvasContent.style.minWidth = minDimAdjust
        canvasContent.style.transformOrigin = 'top left'
        canvasContent.classList.add('scaling')

        this.scale = scaleValue
        this.render(flow, true)

        if(this.options.callbacks?.afterScale) {
            this.options.callbacks.afterScale(this.scale)
        }
        
        this.scaleDebounceTimer && clearTimeout(this.scaleDebounceTimer)
        this.scaleDebounceTimer = setTimeout(() => {
            canvasContent.classList.remove('scaling')
        }, 300)

    }


}
