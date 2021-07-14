import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { curveCardinalClosed } from 'd3-shape';

import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { getScaleType } from '../common/domain.helper';
import { isDate } from '../utils/types';
import { ViewDimensions, LegendPosition, ScaleType, Orientation } from '../common/types';
import { MultiSeries } from '../models/chart-data.model';

const twoPI = 2 * Math.PI;

@Component({
  selector: 'ngx-charts-polar-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:g class="polar-chart chart" [attr.transform]="transform">
        <svg:g [attr.transform]="transformPlot">
          <svg:circle class="polar-chart-background" cx="0" cy="0" [attr.r]="this.outerRadius" />
          <svg:g *ngIf="showGridLines">
            <svg:circle
              *ngFor="let r of radiusTicks"
              class="gridline-path radial-gridline-path"
              cx="0"
              cy="0"
              [attr.r]="r"
            />
          </svg:g>
          <svg:g *ngIf="xAxis">
            <svg:g
              ngx-charts-pie-label
              *ngFor="let tick of thetaTicks"
              [data]="tick"
              [radius]="outerRadius"
              [label]="tick.label"
              [max]="outerRadius"
              [value]="showGridLines ? 1 : outerRadius"
              [explodeSlices]="true"
              [animations]="animations"
              [labelTrim]="labelTrim"
              [labelTrimSize]="labelTrimSize"
            ></svg:g>
          </svg:g>
        </svg:g>
        <svg:g
          ngx-charts-y-axis
          [attr.transform]="transformYAxis"
          *ngIf="yAxis"
          [yScale]="yAxisScale"
          [dims]="yAxisDims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          ngx-charts-axis-label
          *ngIf="xAxis && showXAxisLabel"
          [label]="xAxisLabel"
          [offset]="labelOffset"
          [orient]="orientation.Bottom"
          [height]="dims.height"
          [width]="dims.width"
        ></svg:g>
        <svg:g [attr.transform]="transformPlot">
          <svg:g *ngFor="let series of results; trackBy: trackBy" [@animationState]="'active'">
            <svg:g
              ngx-charts-polar-series
              [gradient]="gradient"
              [xScale]="xScale"
              [yScale]="yScale"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [scaleType]="scaleType"
              [curve]="curve"
              [rangeFillOpacity]="rangeFillOpacity"
              [animations]="animations"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              (select)="onClick($event)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: [
    '../common/base-chart.component.scss',
    '../pie-chart/pie-chart.component.scss',
    './polar-chart.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(
          500,
          style({
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class PolarChartComponent extends BaseChartComponent {
  @Input() results: MultiSeries;
  @Input() legend: boolean;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() xAxis: boolean;
  @Input() yAxis: boolean;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() autoScale: boolean;
  @Input() showGridLines: boolean = true;
  @Input() curve: any = curveCardinalClosed;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  @Input() rangeFillOpacity: number = 0.15;
  @Input() trimYAxisTicks: boolean = true;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: (o: any) => any;
  @Input() yAxisTickFormatting: (o: any) => any;
  @Input() roundDomains: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() showSeriesOnHover: boolean = true;
  @Input() gradient: boolean = false;
  @Input() yAxisMinScale: number = 0;
  @Input() labelTrim: boolean = true;
  @Input() labelTrimSize: number = 10;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  yAxisDims: ViewDimensions;
  labelOffset: number;
  xDomain: any;
  yDomain: any;
  seriesDomain: any;
  yScale: any; // -> rScale
  xScale: any; // -> tScale
  yAxisScale: any; // -> yScale
  colors: ColorHelper;
  scaleType: ScaleType;
  transform: string;
  transformPlot: string;
  transformYAxis: string;
  transformXAxis: string;
  // series: any; // ???
  margin: number[] = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  filteredDomain: any;
  legendOptions: any;
  thetaTicks: any[];
  radiusTicks: number[];
  outerRadius: number;

  orientation = Orientation;

  update(): void {
    super.update();

    this.setDims();

    this.setScales();
    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.setTicks();
  }

  setDims() {
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    const halfWidth = Math.floor(this.dims.width / 2);
    const halfHeight = Math.floor(this.dims.height / 2);

    const outerRadius = (this.outerRadius = Math.min(halfHeight / 1.5, halfWidth / 1.5));

    const yOffset = Math.max(0, halfHeight - outerRadius);

    this.yAxisDims = {
      ...this.dims,
      width: halfWidth
    };

    this.transform = `translate(${this.dims.xOffset}, ${this.margin[0]})`;
    this.transformYAxis = `translate(0, ${yOffset})`;
    this.labelOffset = this.dims.height + 40;
    this.transformPlot = `translate(${halfWidth}, ${halfHeight})`;
  }

  setScales() {
    const xValues = this.getXValues();
    this.scaleType = getScaleType(xValues);
    this.xDomain = this.filteredDomain || this.getXDomain(xValues);

    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();

    this.xScale = this.getXScale(this.xDomain, twoPI);
    this.yScale = this.getYScale(this.yDomain, this.outerRadius);
    this.yAxisScale = this.getYScale(this.yDomain.reverse(), this.outerRadius);
  }

  setTicks() {
    let tickFormat;
    if (this.xAxisTickFormatting) {
      tickFormat = this.xAxisTickFormatting;
    } else if (this.xScale.tickFormat) {
      tickFormat = this.xScale.tickFormat.apply(this.xScale, [5]);
    } else {
      tickFormat = d => {
        if (isDate(d)) {
          return d.toLocaleDateString();
        }
        return d.toLocaleString();
      };
    }

    const outerRadius = this.outerRadius;
    const s = 1.1;

    this.thetaTicks = this.xDomain.map(d => {
      const startAngle = this.xScale(d);
      const dd = s * outerRadius * (startAngle > Math.PI ? -1 : 1);
      const label = tickFormat(d);

      const startPos = [outerRadius * Math.sin(startAngle), -outerRadius * Math.cos(startAngle)];
      const pos = [dd, s * startPos[1]];
      return {
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle: startAngle,
        value: outerRadius,
        label,
        startPos,
        pos
      };
    });

    const minDistance = 10;

    /* from pie chart, abstract out -*/
    for (let i = 0; i < this.thetaTicks.length - 1; i++) {
      const a = this.thetaTicks[i];

      for (let j = i + 1; j < this.thetaTicks.length; j++) {
        const b = this.thetaTicks[j];
        // if they're on the same side
        if (b.pos[0] * a.pos[0] > 0) {
          // if they're overlapping
          const o = minDistance - Math.abs(b.pos[1] - a.pos[1]);
          if (o > 0) {
            // push the second up or down
            b.pos[1] += Math.sign(b.pos[0]) * o;
          }
        }
      }
    }

    this.radiusTicks = this.yAxisScale.ticks(Math.floor(this.dims.height / 50)).map(d => this.yScale(d));
  }

  getXValues(): any[] {
    const values = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (!values.includes(d.name)) {
          values.push(d.name);
        }
      }
    }
    return values;
  }

  getXDomain(values = this.getXValues()): any[] {
    if (this.scaleType === ScaleType.Time) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      return [min, max];
    } else if (this.scaleType === ScaleType.Linear) {
      values = values.map(v => Number(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      return [min, max];
    }
    return values;
  }

  getYValues(): any[] {
    const domain = [];

    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }
    return domain;
  }

  getYDomain(domain = this.getYValues()): any[] {
    let min = Math.min(...domain);
    const max = Math.max(this.yAxisMinScale, ...domain);

    min = Math.max(0, min);
    if (!this.autoScale) {
      min = Math.min(0, min);
    }

    return [min, max];
  }

  getSeriesDomain(): any[] {
    return this.results.map(d => d.name);
  }

  getXScale(domain, width: number): any {
    switch (this.scaleType) {
      case ScaleType.Time:
        return scaleTime().range([0, width]).domain(domain);
      case ScaleType.Linear:
        const scale = scaleLinear().range([0, width]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
      default:
        return scalePoint()
          .range([0, width - twoPI / domain.length])
          .padding(0)
          .domain(domain);
    }
  }

  getYScale(domain, height: number): any {
    const scale = scaleLinear().range([0, height]).domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  onClick(data, series?): void {
    if (series) {
      data.series = series.name;
    }

    this.select.emit(data);
  }

  setColors(): void {
    const domain = this.schemeType === ScaleType.Ordinal ? this.seriesDomain : this.yDomain.reverse();
    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions() {
    if (this.schemeType === ScaleType.Ordinal) {
      return {
        scaleType: this.schemeType,
        colors: this.colors,
        domain: this.seriesDomain,
        title: this.legendTitle,
        position: this.legendPosition
      };
    }
    return {
      scaleType: this.schemeType,
      colors: this.colors.scale,
      domain: this.yDomain,
      title: undefined,
      position: this.legendPosition
    };
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(item): void {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });
    if (idx > -1) {
      return;
    }
    this.activeEntries = this.showSeriesOnHover ? [item, ...this.activeEntries] : this.activeEntries;
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item): void {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  deactivateAll(): void {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }

  trackBy(index: number, item): string {
    return `${item.name}`;
  }
}
