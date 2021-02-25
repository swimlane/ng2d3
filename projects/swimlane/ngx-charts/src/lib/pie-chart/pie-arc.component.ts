import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { interpolate } from 'd3-interpolate';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';

import { id } from '../utils/id';
/* tslint:disable */
import { MouseEvent } from '../events';

@Component({
  selector: 'g[ngx-charts-pie-arc]',
  template: `
    <svg:g class="arc-group">
      <svg:defs *ngIf="gradient">
        <svg:g
          ngx-charts-svg-radial-gradient
          [color]="fill"
          orientation="vertical"
          [name]="radialGradientId"
          [startOpacity]="startOpacity"
        />
      </svg:defs>
      <svg:path
        [attr.d]="path"
        class="arc"
        [class.active]="isActive"
        [attr.fill]="getGradient()"
        (click)="onClick()"
        (dblclick)="onDblClick($event)"
        (mouseenter)="activate.emit(data)"
        (mouseleave)="deactivate.emit(data)"
        [style.pointer-events]="getPointerEvents()"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieArcComponent implements OnChanges {
  @Input() fill;
  @Input() startAngle: number = 0;
  @Input() endAngle: number = Math.PI * 2;
  @Input() innerRadius;
  @Input() outerRadius;
  @Input() cornerRadius: number = 0;
  @Input() value;
  @Input() max;
  @Input() data;
  @Input() explodeSlices: boolean = false;
  @Input() gradient: boolean = false;
  @Input() animate: boolean = true;
  @Input() pointerEvents: boolean = true;
  @Input() isActive: boolean = false;
  @Input() explodeOnHover: boolean;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() dblclick = new EventEmitter();

  element: HTMLElement;
  path: any;
  startOpacity: number;
  radialGradientId: string;
  linearGradientId: string;
  gradientFill: string;
  initialized: boolean = false;
  private _timeout;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
    if (changes.isActive != null) {
      this.isActive = changes.isActive.currentValue;
      if (changes.isActive.previousValue != null && this.explodeOnHover) {
        this.explodeAnimation();
      }
    }
  }

  getGradient() {
    return this.gradient ? this.gradientFill : this.fill;
  }

  getPointerEvents() {
    return this.pointerEvents ? 'auto' : 'none';
  }

  explodeAnimation() {
    const node = select(this.element)
      .selectAll('.arc')
      .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
    if (this.isActive)
      node
        .transition()
        .duration(300)
        .attr(
          'd',
          arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.calculateOuterRadius() + this.calculateOuterRadius() * 0.25)
            .cornerRadius(this.cornerRadius)
        );
    else node.transition().attr('d', this.calculateArc());
  }

  update(): void {
    const calc = this.calculateArc();
    this.startOpacity = 0.5;
    this.radialGradientId = 'linearGrad' + id().toString();
    this.gradientFill = `url(#${this.radialGradientId})`;

    if (this.animate) {
      if (this.initialized) {
        this.updateAnimation();
      } else {
        this.loadAnimation();
        this.initialized = true;
      }
    } else {
      this.path = calc.startAngle(this.startAngle).endAngle(this.endAngle)();
    }
  }

  calculateOuterRadius(): number {
    let outerRadius = this.outerRadius;
    if (this.explodeSlices && this.innerRadius === 0) {
      outerRadius = (this.outerRadius * this.value) / this.max;
    }
    return outerRadius;
  }

  calculateArc(): any {
    return arc().innerRadius(this.innerRadius).outerRadius(this.calculateOuterRadius()).cornerRadius(this.cornerRadius);
  }

  loadAnimation(): void {
    const node = select(this.element)
      .selectAll('.arc')
      .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);

    const calc = this.calculateArc();

    node
      .transition()
      .attrTween('d', function (d) {
        (<any>this)._current = (<any>this)._current || d;
        const copyOfD = Object.assign({}, d);
        copyOfD.endAngle = copyOfD.startAngle;
        const interpolater = interpolate(copyOfD, copyOfD);
        (<any>this)._current = interpolater(0);
        return function (t) {
          return calc(interpolater(t));
        };
      })
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        (<any>this)._current = (<any>this)._current || d;
        const interpolater = interpolate((<any>this)._current, d);
        (<any>this)._current = interpolater(0);
        return function (t) {
          return calc(interpolater(t));
        };
      });
  }

  updateAnimation(): void {
    const node = select(this.element)
      .selectAll('.arc')
      .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);

    const calc = this.calculateArc();

    node
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        (<any>this)._current = (<any>this)._current || d;
        const interpolater = interpolate((<any>this)._current, d);
        (<any>this)._current = interpolater(0);
        return function (t) {
          return calc(interpolater(t));
        };
      });
  }

  onClick(): void {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => this.select.emit(this.data), 200);
  }

  onDblClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this._timeout);

    this.dblclick.emit({
      data: this.data,
      nativeEvent: event
    });
  }
}
