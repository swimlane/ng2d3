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
import { select } from 'd3-selection';
import { interpolate } from 'd3-interpolate';
import { roundedRect } from '../common/shape.helper';
import { id } from '../utils/id';
import * as ease from 'd3-ease';

/* tslint:disable-next-line */
import { transition } from 'd3-transition';

@Component({
  selector: 'g[ngx-charts-bar]',
  template: `
    <svg:defs *ngIf="hasGradient">
      <svg:g ngx-charts-svg-linear-gradient [orientation]="orientation" [name]="gradientId" [stops]="gradientStops" />
    </svg:defs>
    <svg:path
      class="bar"
      stroke="none"
      role="img"
      tabIndex="-1"
      [class.active]="isActive"
      [class.hidden]="hideBar"
      [attr.d]="path"
      [attr.aria-label]="ariaLabel"
      [attr.fill]="hasGradient ? gradientFill : fill"
      (click)="select.emit(data)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent implements OnChanges {
  @Input() fill;
  @Input() data: any;
  @Input() width: number;
  @Input() height: number;
  @Input() x: number;
  @Input() y: number;
  @Input() orientation: string;
  @Input() roundEdges: boolean = true;
  @Input() gradient: boolean = false;
  @Input() offset = 0;
  @Input() isActive: boolean = false;
  @Input() stops: any[];
  @Input() animations: boolean = true;
  @Input() ariaLabel: string;
  @Input() noBarWhenZero: boolean = true;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  element: any;
  oldPath: any;
  path: any;
  gradientId: any;
  gradientFill: any;
  startOpacity: any;
  gradientStops: any[];
  hasGradient: boolean = false;
  hideBar: boolean = false;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.roundEdges) {
      this.loadAnimation();
    }
    this.update();
  }

  update(): void {
    this.gradientId = 'grad' + id().toString();
    this.gradientFill = `url(#${this.gradientId})`;

    if (this.gradient || this.stops) {
      this.gradientStops = this.getGradient();
      this.hasGradient = true;
    } else {
      this.hasGradient = false;
    }

    this.updatePathEl();
    this.checkToHideBar();
  }

  loadAnimation(): void {
    this.path = this.getStartingPath();
    this.oldPath = this.path;
    setTimeout(this.update.bind(this), 100);
  }

  updatePathEl(): void {
    const node = select(this.element).select('.bar');
    const path = this.getPath();
    if (this.animations) {
      // node.transition().duration(500).attr('d', path);
      node
        .attr('d', path)
        .transition()
        .ease(ease.easeSinInOut)
        .duration(1000)
        .attrTween('d', this.pathTween(path, 4));
    } else {
      node.attr('d', path);
    }
  }

  getGradient() {
    if (this.stops) {
      return this.stops;
    }

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

  getStartingPath() {
    if (!this.animations) {
      return this.getPath();
    }

    let radius = this.getRadius();
    let path = '';

    if (this.roundEdges) {
      if (this.orientation === 'vertical') {
        radius = Math.min(this.height, radius);
        path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
      } else if (this.orientation === 'horizontal') {
        radius = Math.min(this.width, radius);
        path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
      }
    } else {
      if (this.orientation === 'vertical') {
        path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
      } else if (this.orientation === 'horizontal') {
        path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
      }
    }

    return path;
  }

  getPath() {
    let radius = this.getRadius();
    let path = '';

    if (this.roundEdges) {
      if (this.orientation === 'vertical') {
        radius = Math.min(this.height, radius);
        path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
      } else if (this.orientation === 'horizontal') {
        radius = Math.min(this.width, radius);
        path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
      }
    } else {
      path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
    }

    return path;
  }

  pathTween(d1: string, precision: number) {
    return function() {
      // tslint:disable-next-line: no-this-assignment
      const path0 = this;
      const path1 = this.cloneNode();
      const n0 = path0.getTotalLength();
      // tslint:disable-next-line: ban-comma-operator
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
      const points = distances.map(function(t) {
        const p0 = path0.getPointAtLength(t * n0);
        const p1 = path1.getPointAtLength(t * n1);
        return interpolate([p0.x, p0.y], [p1.x, p1.y]);
      });

      return function(t) {
        return t < 1
          ? 'M' +
              points
                .map(function(p) {
                  return p(t);
                })
                .join('L')
          : d1;
      };
    };
  }

  getRadius(): number {
    let radius = 0;

    if (this.roundEdges && this.height > 5 && this.width > 5) {
      radius = Math.floor(Math.min(5, this.height / 2, this.width / 2));
    }

    return radius;
  }

  getStartOpacity(): number {
    if (this.roundEdges) {
      return 0.2;
    } else {
      return 0.5;
    }
  }

  get edges() {
    let edges = [false, false, false, false];
    if (this.roundEdges) {
      if (this.orientation === 'vertical') {
        if (this.data.value > 0) {
          edges = [true, true, false, false];
        } else {
          edges = [false, false, true, true];
        }
      } else if (this.orientation === 'horizontal') {
        if (this.data.value > 0) {
          edges = [false, true, false, true];
        } else {
          edges = [true, false, true, false];
        }
      }
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

  private checkToHideBar() {
    this.hideBar =
      this.noBarWhenZero &&
      ((this.orientation === 'vertical' && this.height === 0) ||
        (this.orientation === 'horizontal' && this.width === 0));
  }
}
