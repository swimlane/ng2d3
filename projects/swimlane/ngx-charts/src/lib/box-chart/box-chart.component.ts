import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ColorHelper } from '../common/color.helper';
import { BoxChartMultiSeries, BoxChartSeries, IBoxModel, StringOrNumberOrDate } from '../models/chart-data.model';
import { scaleLinear, ScaleLinear, scaleBand, ScaleBand } from 'd3-scale';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ViewDimensions, LegendPosition, ScaleType, LegendOptions } from '../common/types';

@Component({
  selector: 'ngx-charts-box-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:g [attr.transform]="transform" class="box-chart chart">
        <svg:g
          ngx-charts-x-axis
          [showGridLines]="showGridLines"
          [dims]="dims"
          [xScale]="xScale"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          (dimensionsChanged)="updateXAxisHeight($event)"
        />
        <svg:g
          ngx-charts-y-axis
          [showGridLines]="showGridLines"
          [dims]="dims"
          [yScale]="yScale"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          (dimensionsChanged)="updateYAxisWidth($event)"
        />
      </svg:g>
      <svg:g [attr.transform]="transform">
        <svg:g *ngFor="let result of results; trackBy: trackBy">
          <svg:g
            ngx-charts-box-series
            [xScale]="xScale"
            [yScale]="yScale"
            [colors]="colors"
            [roundEdges]="roundEdges"
            [strokeColor]="strokeColor"
            [strokeWidth]="strokeWidth"
            [tooltipDisabled]="tooltipDisabled"
            [tooltipTemplate]="tooltipTemplate"
            [dataSerie]="result"
            [dims]="dims"
            [animations]="animations"
            (activate)="onActivate($event)"
            (deactivate)="onDeactivate($event)"
            (select)="onClick($event)"
          />
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['../common/base-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BoxChartComponent extends BaseChartComponent {
  /** Show or hide the legend. */
  @Input() legend: boolean = false;
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() legendTitle: string = 'Legend';
  /** I think it is better to handle legend options as single Input object of type ILegendOptions */
  @Input() legendOptionsConfig: LegendOptions;
  @Input() showGridLines: boolean = true;
  @Input() xAxis: boolean = true;
  @Input() yAxis: boolean = true;
  @Input() showXAxisLabel: boolean = true;
  @Input() showYAxisLabel: boolean = true;
  @Input() roundDomains: boolean = false;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() roundEdges: boolean = true;
  @Input() strokeColor: string = '#FFFFFF';
  @Input() strokeWidth: number = 2;
  @Input() tooltipDisabled: boolean = false;

  @Output() select: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() activate: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() deactivate: EventEmitter<IBoxModel> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  /** Input Data, this came from Base Chart Component. */
  results: BoxChartMultiSeries;
  /** Chart Dimensions, this came from Base Chart Component. */
  dims: ViewDimensions;
  /** Color data. */
  colors: ColorHelper;
  /** Transform string css attribute for the chart container */
  transform: string;

  /** Chart Margins (For each side, counterclock wise). */
  margin: [number, number, number, number] = [10, 20, 10, 20];

  /** Legend Options object to handle positioning, title, colors and domain. */
  legendOptions: LegendOptions;

  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  xDomain: StringOrNumberOrDate[];
  yDomain: number[];
  seriesDomain: string[];
  /** Chart X axis dimension. */
  xAxisHeight: number = 0;
  /** Chart Y axis dimension. */
  yAxisWidth: number = 0;

  trackBy(index: number, item: BoxChartSeries): StringOrNumberOrDate {
    return item.name;
  }

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
      legendPosition: this.legendPosition
    });

    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.setScales();
    this.setColors();

    this.legendOptions = this.getLegendOptions();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  setColors(): void {
    let domain: string[] | number[];
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  setScales() {
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);
  }

  getXScale(domain: Array<string | number | Date>, width: number): ScaleBand<string> {
    const scale = scaleBand()
      .domain(domain.map(d => d.toString()))
      .rangeRound([0, width])
      .padding(0.5);

    return scale;
  }

  getYScale(domain: number[], height: number): ScaleLinear<number, number> {
    const scale = scaleLinear().domain(domain).range([height, 0]);

    return this.roundDomains ? scale.nice() : scale;
  }

  getUniqueBoxChartXDomainValues(results: BoxChartMultiSeries) {
    const valueSet = new Set<string | number | Date>();
    for (const result of results) {
      valueSet.add(result.name);
    }
    return Array.from(valueSet);
  }

  getXDomain(): Array<string | number | Date> {
    let domain: Array<string | number | Date> = [];
    const values: Array<string | number | Date> = this.getUniqueBoxChartXDomainValues(this.results);
    let min: number;
    let max: number;
    if (typeof values[0] === 'string') {
      domain = values.map(val => val.toString());
    } else if (typeof values[0] === 'number') {
      const mappedValues = values.map(v => Number(v));
      min = Math.min(...mappedValues);
      max = Math.max(...mappedValues);
      domain = [min, max];
    } else {
      const mappedValues = values.map(v => Number(new Date(v)));
      min = Math.min(...mappedValues);
      max = Math.max(...mappedValues);
      domain = [new Date(min), new Date(max)];
    }
    return domain;
  }

  getYDomain(): number[] {
    const domain: Array<number | Date> = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
      }
    }

    const values = [...domain];
    const mappedValues = values.map(v => Number(v));

    const min: number = Math.min(...mappedValues);
    const max: number = Math.max(...mappedValues);

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

  onClick(data: IBoxModel): void {
    this.select.emit(data);
  }

  onActivate(data: IBoxModel): void {
    this.activate.emit(data);
  }

  onDeactivate(data: IBoxModel): void {
    this.deactivate.emit(data);
  }

  private getLegendOptions(): LegendOptions {
    const legendOpts: LegendOptions = {
      scaleType: this.schemeType,
      colors: this.colors,
      domain: [],
      position: this.legendPosition,
      title: this.legendTitle
    };
    if (this.schemeType === ScaleType.Ordinal) {
      legendOpts.domain = this.xDomain;
      legendOpts.colors = this.colors;
    } else {
      legendOpts.domain = this.yDomain;
      legendOpts.colors = this.colors.scale;
    }
    return legendOpts;
  }
}
