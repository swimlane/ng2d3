import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { select, BaseType } from 'd3-selection';
import { interpolate } from 'd3-interpolate';
import { easeSinInOut } from 'd3-ease';
import { roundedRect } from '../common/shape.helper';
import { id } from '../utils/id';
import { IBoxModel } from '../models/chart-data.model';
import { IVector2D } from '../models/coordinates.model';
import { BarOrientation, Gradient } from '../common/types';

@Component({
  selector: 'g[ngx-charts-box]',
  template: `
    <svg:defs>
      <svg:g
        *ngIf="hasGradient"
        ngx-charts-svg-linear-gradient
        [orientation]="orientation"
        [name]="gradientId"
        [stops]="gradientStops"
      />
      <svg:mask [attr.id]="maskLineId">
        <svg:g>
          <rect height="100%" width="100%" fill="white" fill-opacity="1" />
          <path class="bar" [attr.d]="boxPath" fill="black" fill-opacity="1" />
        </svg:g>
      </svg:mask>
    </svg:defs>
    <svg:g>
      <svg:path
        class="bar"
        role="img"
        tabIndex="-1"
        [class.active]="isActive"
        [class.hidden]="hideBar"
        [attr.d]="boxPath"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
        [attr.aria-label]="ariaLabel"
        [attr.fill]="hasGradient ? gradientFill : fill"
        (click)="select.emit(data)"
      />
      <svg:line
        class="bar-line"
        [class.hidden]="hideBar"
        [attr.x1]="lineCoordinates[0].v1.x"
        [attr.y1]="lineCoordinates[0].v1.y"
        [attr.x2]="lineCoordinates[0].v2.x"
        [attr.y2]="lineCoordinates[0].v2.y"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
        [attr.mask]="maskLine"
        fill="none"
      />
      <svg:line
        class="bar-line"
        [class.hidden]="hideBar"
        [attr.x1]="lineCoordinates[1].v1.x"
        [attr.y1]="lineCoordinates[1].v1.y"
        [attr.x2]="lineCoordinates[1].v2.x"
        [attr.y2]="lineCoordinates[1].v2.y"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
        fill="none"
      />
      <svg:line
        class="bar-line"
        [class.hidden]="hideBar"
        [attr.x1]="lineCoordinates[2].v1.x"
        [attr.y1]="lineCoordinates[2].v1.y"
        [attr.x2]="lineCoordinates[2].v2.x"
        [attr.y2]="lineCoordinates[2].v2.y"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
        fill="none"
      />
      <svg:line
        class="bar-line"
        [class.hidden]="hideBar"
        [attr.x1]="lineCoordinates[3].v1.x"
        [attr.y1]="lineCoordinates[3].v1.y"
        [attr.x2]="lineCoordinates[3].v2.x"
        [attr.y2]="lineCoordinates[3].v2.y"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
        fill="none"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent implements OnChanges {
  @Input() strokeColor: string;
  @Input() strokeWidth: number;
  @Input() fill: string;
  @Input() data: IBoxModel;
  @Input() width: number;
  @Input() height: number;
  @Input() x: number;
  @Input() y: number;
  @Input() lineCoordinates: [IVector2D, IVector2D, IVector2D, IVector2D];
  @Input() orientation: BarOrientation;
  @Input() roundEdges: boolean = true;
  @Input() gradient: boolean = false;
  @Input() gradientStops: Gradient[];
  @Input() offset: number = 0;
  @Input() isActive: boolean = false;
  @Input() animations: boolean = true;
  @Input() ariaLabel: string;
  @Input() noBarWhenZero: boolean = true;

  @Output() select: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() activate: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() deactivate: EventEmitter<IBoxModel> = new EventEmitter();

  nativeElm: any;

  // Path related properties.
  oldPath: string;
  boxPath: string;
  oldLineCoordinates: [IVector2D, IVector2D, IVector2D, IVector2D];

  // Color related properties.
  gradientId: string;
  gradientFill: string;
  initialized: boolean = false;
  hasGradient: boolean = false;
  hideBar: boolean = false;

  /** Mask Path to cut the line on the box part. */
  maskLine: string;
  /** Mask Path Id to keep track of the mask element */
  maskLineId: string;

  constructor(element: ElementRef) {
    this.nativeElm = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      this.loadAnimation();
      this.initialized = true;
    } else {
      this.update();
    }
  }

  update(): void {
    this.gradientId = 'grad' + id().toString();
    this.gradientFill = `url(#${this.gradientId})`;

    if (this.gradient) {
      this.gradientStops = this.getGradient();
      this.hasGradient = true;
    } else {
      this.hasGradient = false;
    }

    this.updateLineEl();
    this.updatePathEl();
    this.checkToHideBar();
    this.maskLineId = 'mask' + id().toString();
    this.maskLine = `url(#${this.maskLineId})`;
  }

  loadAnimation(): void {
    this.boxPath = this.getStartingPath();
    setTimeout(this.update.bind(this), 100);
  }

  updatePathEl(): void {
    const nodeBar = select(this.nativeElm).selectAll('.bar');
    const path = this.getPath();
    if (this.animations) {
      nodeBar
        .attr('d', this.oldPath)
        .transition()
        .ease(easeSinInOut)
        .duration(500)
        .attrTween('d', this.pathTween(path, 4));
    } else {
      nodeBar.attr('d', path);
    }
    this.oldPath = path;
  }

  updateLineEl(): void {
    const lineEl = select(this.nativeElm).selectAll('.bar-line');
    if (this.animations) {
      lineEl
        .transition()
        .duration(0)
        .attr('x1', (d, index, node) => (this.oldLineCoordinates ? this.oldLineCoordinates[index].v1.x : undefined))
        .attr('y1', (d, index, node) => (this.oldLineCoordinates ? this.oldLineCoordinates[index].v1.y : undefined))
        .attr('x2', (d, index, node) => (this.oldLineCoordinates ? this.oldLineCoordinates[index].v2.x : undefined))
        .attr('y2', (d, index, node) => (this.oldLineCoordinates ? this.oldLineCoordinates[index].v2.y : undefined))
        .transition()
        .ease(easeSinInOut)
        .duration(500)
        .attr('x1', (d, index, node) => this.lineCoordinates[index].v1.x)
        .attr('y1', (d, index, node) => this.lineCoordinates[index].v1.y)
        .attr('x2', (d, index, node) => this.lineCoordinates[index].v2.x)
        .attr('y2', (d, index, node) => this.lineCoordinates[index].v2.y);
    } else {
      lineEl
        .attr('x1', (d, index, node) => this.lineCoordinates[index].v1.x)
        .attr('y1', (d, index, node) => this.lineCoordinates[index].v1.y)
        .attr('x2', (d, index, node) => this.lineCoordinates[index].v2.x)
        .attr('y2', (d, index, node) => this.lineCoordinates[index].v2.y);
    }
    this.oldLineCoordinates = this.lineCoordinates;
  }

  /**
   * See [D3 Selections](https://www.d3indepth.com/selections/)
   * @param d The joined data.
   * @param index The index of the element within the selection
   * @param node The node element (Line).
   */
  lineTween(attr: string, d: any, index: number, node: BaseType[] | ArrayLike<BaseType>) {
    const nodeLineEl = node[index] as SVGLineElement;
    return nodeLineEl[attr].baseVal.value;
  }

  // TODO: Refactor into another .ts file if https://github.com/swimlane/ngx-charts/pull/1179 gets merged.
  pathTween(d1: string, precision: number) {
    return function () {
      // tslint:disable-next-line: no-this-assignment
      const path0 = this;
      const path1 = this.cloneNode();
      const n0 = path0.getTotalLength();
      const n1 = (path1.setAttribute('d', d1), path1).getTotalLength();

      // Uniform sampling of distance based on specified precision.
      const distances = [0];
      let i = 0;
      const dt = precision / Math.max(n0, n1);
      while (i < 1) {
        distances.push(i);
        i += dt;
      }
      distances.push(1);

      // Compute point-interpolators at each distance.
      const points = distances.map((t: number) => {
        const p0 = path0.getPointAtLength(t * n0);
        const p1 = path1.getPointAtLength(t * n1);
        return interpolate([p0.x, p0.y], [p1.x, p1.y]);
      });

      // 't': T is the fraction of time (between 0 and 1) since the transition began.
      return (t: any) => {
        return t < 1 ? 'M' + points.map((p: (t: number) => any[]) => p(t)).join('L') : d1;
      };
    };
  }

  getStartingPath(): string {
    if (!this.animations) {
      return this.getPath();
    }

    let path = '';

    if (this.roundEdges) {
      if (this.orientation === BarOrientation.Vertical) {
        path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
      } else if (this.orientation === BarOrientation.Horizontal) {
        path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
      }
    } else {
      if (this.orientation === BarOrientation.Vertical) {
        path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
      } else if (this.orientation === BarOrientation.Horizontal) {
        path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
      }
    }

    return path;
  }

  getPath(): string {
    let radius = this.getRadius();
    let path = '';

    if (this.roundEdges) {
      if (this.orientation === 'vertical') {
        radius = Math.min(this.height, radius);
      } else if (this.orientation === 'horizontal') {
        radius = Math.min(this.width, radius);
      }
    }
    path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);

    return path;
  }

  getRadius(): number {
    let radius = 0;

    if (this.roundEdges && this.height > 5 && this.width > 5) {
      radius = Math.floor(Math.min(5, this.height / 2, this.width / 2));
    }

    return radius;
  }

  getGradient(): Gradient[] {
    return [
      {
        offset: 0,
        color: this.fill,
        opacity: this.getStartOpacity()
      },
      {
        offset: 100,
        color: this.fill,
        opacity: 1
      }
    ];
  }

  getStartOpacity(): number {
    if (this.roundEdges) {
      return 0.2;
    } else {
      return 0.5;
    }
  }

  get edges(): boolean[] {
    let edges: [boolean, boolean, boolean, boolean] = [false, false, false, false];
    if (this.roundEdges) {
      edges = [true, true, true, true];
    }
    return edges;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.activate.emit(this.data);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.deactivate.emit(this.data);
  }

  private checkToHideBar(): void {
    this.hideBar =
      this.noBarWhenZero &&
      ((this.orientation === 'vertical' && this.height === 0) ||
        (this.orientation === 'horizontal' && this.width === 0));
  }
}
