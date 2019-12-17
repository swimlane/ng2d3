import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear, ScaleTime, ScaleLinear, ScalePoint } from 'd3-scale';

import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions, ViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { getScaleType } from '../common/domain.helper';
import { getBubbleDomain, getBubbleScale } from './bubble-chart.utils';
import { id } from '../utils/id';
import { BubbleChartMultiSeries, BubbleChartSeries } from '../models/chart-data.model';
import { ScaleType } from '../enums/scale.enum';
import { IShapeData } from '../models/shape.model';

@Component({
  selector: 'ngx-charts-bubble-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [activeEntries]="activeEntriesCopy"
      [legendOptions]="legendOptions"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:defs>
        <svg:clipPath [attr.id]="clipPathId">
          <svg:rect
            [attr.width]="dims.width + 10"
            [attr.height]="dims.height + 10"
            [attr.transform]="'translate(-5, -5)'"
          />
        </svg:clipPath>
      </svg:defs>
      <svg:g [attr.transform]="transform" class="bubble-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [showGridLines]="showGridLines"
          [dims]="dims"
          [xScale]="xScale"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        />
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [showGridLines]="showGridLines"
          [yScale]="yScale"
          [dims]="dims"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        />
        <svg:rect
          class="bubble-chart-area"
          x="0"
          y="0"
          [attr.width]="dims.width"
          [attr.height]="dims.height"
          style="fill: rgb(255, 0, 0); opacity: 0; cursor: 'auto';"
          (mouseenter)="deactivateAll()"
        />
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of data; trackBy: trackBy" [@animationState]="'active'">
            <svg:g
              ngx-charts-bubble-series
              [xScale]="xScale"
              [yScale]="yScale"
              [rScale]="rScale"
              [xScaleType]="xScaleType"
              [yScaleType]="yScaleType"
              [xAxisLabel]="xAxisLabel"
              [yAxisLabel]="yAxisLabel"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntriesCopy"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              (select)="onClick($event, series)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['../common/base-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
export class BubbleChartComponent extends BaseChartComponent {
  @Input() showGridLines: boolean = true;
  @Input() legend: boolean = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() xAxis: boolean = true;
  @Input() yAxis: boolean = true;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() roundDomains: boolean = false;
  @Input() maxRadius: number = 10;
  @Input() minRadius: number = 3;
  @Input() autoScale: boolean;
  @Input() schemeType: string = ScaleType.ordinal;
  @Input() tooltipDisabled: boolean = false;
  @Input() xScaleMin: any;
  @Input() xScaleMax: any;
  @Input() yScaleMin: any;
  @Input() yScaleMax: any;
  @Input() activeEntries: IShapeData[] = [];

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  colors: ColorHelper;
  scaleType: string = ScaleType.linear;
  margin: number[] = [10, 20, 10, 20];
  bubblePadding: number[] = [0, 0, 0, 0];
  results: BubbleChartMultiSeries;
  data: BubbleChartMultiSeries;
  activeEntriesCopy: IShapeData[] = [];

  legendOptions: any;
  transform: string;

  clipPath: string;
  clipPathId: string;

  seriesDomain: string[];
  xDomain: Array<string | number | Date>;
  yDomain: Array<string | number | Date>;
  rDomain: number[];

  xScaleType: string;
  yScaleType: string;

  yScale: ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string>;
  xScale: ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string>;
  rScale: ScaleLinear<number, number>;

  xAxisHeight: number = 0;
  yAxisWidth: number = 0;

  update(): void {
    super.update();

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

    this.seriesDomain = this.results.map(d => d.name.toString());
    this.rDomain = this.getRDomain();
    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();

    // console.log(
    //   `Domains: \n - R Domain: ${this.rDomain} \n - X Domain: ${this.xDomain} \n - Y Domain: ${this.yDomain}`
    // );

    this.transform = `translate(${this.dims.xOffset},${this.margin[0]})`;

    const colorDomain = this.schemeType === ScaleType.ordinal ? this.seriesDomain : this.rDomain;
    this.colors = new ColorHelper(this.scheme, this.schemeType, colorDomain, this.customColors);

    this.data = this.results;
    this.activeEntriesCopy = this.activeEntries && this.activeEntries.length ? this.activeEntries : [];

    this.minRadius = Math.max(this.minRadius, 1);
    this.maxRadius = Math.max(this.maxRadius, 1);

    this.rScale = this.getRScale(this.rDomain, [this.minRadius, this.maxRadius]);

    this.bubblePadding = [0, 0, 0, 0];
    this.setScales();

    this.bubblePadding = this.getBubblePadding();
    this.setScales();

    this.legendOptions = this.getLegendOptions();

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.deactivateAll();
  }

  onClick(data: IShapeData, series?: BubbleChartSeries): void {
    if (series) {
      data.name = series.name;
    }
    this.select.emit(data);
  }

  getBubblePadding() {
    let yMin = 0;
    let xMin = 0;
    let yMax = this.dims.height;
    let xMax = this.dims.width;

    for (const s of this.data) {
      for (const d of s.series) {
        const r = this.rScale(d.r);
        const cx = this.xScale(d.x as any);
        const cy = this.yScale(d.y as any);
        xMin = Math.max(r - cx, xMin);
        yMin = Math.max(r - cy, yMin);
        yMax = Math.max(cy + r, yMax);
        xMax = Math.max(cx + r, xMax);
      }
    }

    xMax = Math.max(xMax - this.dims.width, 0);
    yMax = Math.max(yMax - this.dims.height, 0);

    return [yMin, xMax, yMax, xMin];
  }

  setScales() {
    let width = this.dims.width;
    if (this.xScaleMin === undefined && this.xScaleMax === undefined) {
      width = width - this.bubblePadding[1];
    }
    let height = this.dims.height;
    if (this.yScaleMin === undefined && this.yScaleMax === undefined) {
      height = height - this.bubblePadding[2];
    }
    this.xScale = this.getXScale(this.xDomain, width);
    this.yScale = this.getYScale(this.yDomain, height);
  }

  getYScale(domain, height: number) {
    return getBubbleScale(domain, [height, this.bubblePadding[0]], this.yScaleType, this.roundDomains);
  }

  getXScale(domain, width: number) {
    return getBubbleScale(domain, [this.bubblePadding[3], width], this.xScaleType, this.roundDomains);
  }

  getRScale(domain: number[], range: number[]): ScaleLinear<number, number> {
    const scale = scaleLinear()
      .range(range)
      .domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getLegendOptions(): any {
    const opts = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      position: this.legendPosition,
      title: undefined
    };

    if (opts.scaleType === ScaleType.ordinal) {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.rDomain;
      opts.colors = this.colors.scale;
    }

    return opts;
  }

  getXDomain(): Array<string | number | Date> {
    const values: Array<string | number | Date> = [];

    for (const results of this.results) {
      for (const d of results.series) {
        if (!values.includes(d.x)) {
          values.push(d.x);
        }
      }
    }

    this.xScaleType = getScaleType(values);
    return getBubbleDomain(values, this.xScaleType, this.autoScale, this.xScaleMin, this.xScaleMax);
  }

  getYDomain(): Array<string | number | Date> {
    const values: Array<string | number | Date> = [];

    for (const results of this.results) {
      for (const d of results.series) {
        if (!values.includes(d.y)) {
          values.push(d.y);
        }
      }
    }

    this.yScaleType = getScaleType(values);
    return getBubbleDomain(values, this.yScaleType, this.autoScale, this.yScaleMin, this.yScaleMax);
  }

  getRDomain(): number[] {
    let min = Infinity;
    let max = -Infinity;

    for (const results of this.results) {
      for (const d of results.series) {
        const value = Number(d.r) || 1;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }

    return [min, max];
  }

  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(item: IShapeData): void {
    const idx =
      this.activeEntries && this.activeEntries.length
        ? this.activeEntries.findIndex(entry => entry.name === item.name)
        : -1;
    if (idx !== -1) {
      return;
    } else {
      this.activeEntriesCopy = [item, ...this.activeEntriesCopy];
      this.activate.emit({ value: item, entries: this.activeEntriesCopy });
    }
  }

  onDeactivate(item: IShapeData): void {
    const idx = this.activeEntriesCopy.findIndex(entry => entry.name === item.name);
    if (idx === -1) {
      return;
    } else {
      this.activeEntriesCopy.splice(idx, 1);
      this.activeEntriesCopy = [...this.activeEntriesCopy];
      this.deactivate.emit({ value: item, entries: this.activeEntriesCopy });
    }
  }

  deactivateAll(): void {
    this.activeEntriesCopy = [...this.activeEntriesCopy];
    for (const entry of this.activeEntriesCopy) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntriesCopy = this.activeEntries && this.activeEntries.length ? [...this.activeEntries] : [];
  }

  trackBy(index: number, item: BubbleChartSeries): string | number | Date {
    return item.name;
  }
}
