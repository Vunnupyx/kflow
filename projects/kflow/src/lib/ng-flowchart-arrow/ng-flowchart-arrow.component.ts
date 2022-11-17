import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-ng-flowchart-arrow',
  templateUrl: './ng-flowchart-arrow.component.html',
  styleUrls: ['./ng-flowchart-arrow.component.scss']
})
export class NgFlowchartArrowComponent implements OnInit, AfterViewInit {

  @ViewChild('arrow')
  arrow: ElementRef;

  @Input()
  set position(pos: { start: number[], end: number[] }) {
    this._position = pos;

    this.isUpFlowing = pos.start[1] > pos.end[1];

    //in the case where steps are directly leftwards we need some minimum height
    this.containerHeight = Math.abs(pos.start[1] - pos.end[1]) + (this.padding * 2);

    this.containerTop = Math.min(pos.start[1], pos.end[1]) - this.padding;

    this.containerWidth = Math.abs(pos.start[0] - pos.end[0]);
    this.containerLeft = pos.start[0];

    this.updatePath();
  }

  opacity = 1;
  containerWidth: number = 0;
  containerHeight: number = 0;
  containerLeft: number = 0;
  containerTop: number = 0;
  _position: { start: number[], end: number[] }


  //to be applied on left and right edges
  private padding = 10;
  private isUpFlowing = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.updatePath();
  }

  hideArrow() {
    this.opacity = .2;
  }

  showArrow() {
    this.opacity = 1;
  }

  private updatePath() {
    if (!this.arrow?.nativeElement) {
      return;
    }

    if (this.isUpFlowing) {
      this.arrow.nativeElement.setAttribute("d", `
        M0,${this.containerHeight - this.padding} 
        L${this.containerWidth / 2},${this.containerHeight - this.padding}
        L${this.containerWidth / 2},${this.padding}
        L${this.containerWidth - 4},${this.padding}
      `);
    }
    else {
      this.arrow.nativeElement.setAttribute("d", `
        M0,${this.padding} 
        L${this.containerWidth / 2},${this.padding}
        L${this.containerWidth / 2},${this.containerHeight - this.padding}
        L${this.containerWidth - 4},${this.containerHeight - this.padding}
      `);
    }


  }

}
