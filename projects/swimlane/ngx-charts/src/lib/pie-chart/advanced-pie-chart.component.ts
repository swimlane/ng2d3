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

import { calculateViewDimensions, IViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { DataItem } from '../models/chart-data.model';

@Component({
  selector: 'ngx-charts-advanced-pie-chart',
  template: `
    <div [style.width.px]="width" [style.height.px]="height">
      <div class="advanced-pie chart" [style.width.px]="dims.width" [style.height.px]="dims.height">
        <ngx-charts-chart [view]="[width, height]" [showLegend]="false" [animations]="animations">
          <svg:g [attr.transform]="transform" class="pie chart">
            <svg:g
              ngx-charts-pie-series
              [colors]="colors"
              [series]="results"
              [innerRadius]="innerRadius"
              [activeEntries]="activeEntries"
              [outerRadius]="outerRadius"
              [gradient]="gradient"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipText]="tooltipText"
              (select)="onClick($event)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
              [animations]="animations"
            ></svg:g>
          </svg:g>
        </ngx-charts-chart>
      </div>
      <div class="advanced-pie-legend-wrapper" [style.width.px]="width - dims.width" [style.height.px]="height">
        <ngx-charts-advanced-legend
          [data]="results"
          [colors]="colors"
          [width]="width - dims.width - margin[1]"
          [label]="label"
          [animations]="animations"
          [valueFormatting]="valueFormatting"
          [labelFormatting]="nameFormatting"
          [percentageFormatting]="percentageFormatting"
          (select)="onClick($event)"
          (activate)="onActivate($event, true)"
          (deactivate)="onDeactivate($event, true)"
        >
        </ngx-charts-advanced-legend>
      </div>
    </div>
  `,
  styleUrls: ['../common/base-chart.component.scss', './advanced-pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedPieChartComponent extends BaseChartComponent {
  @Input() gradient: boolean;
  @Input() activeEntries: any[] = [];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() label: string = 'Total';

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  data: any;
  dims: IViewDimensions;
  domain: any[];
  outerRadius: number;
  innerRadius: number;
  transform: string;
  colors: ColorHelper;
  legendWidth: number;
  margin = [20, 20, 20, 20];

  @Input() valueFormatting: (value: number) => any;
  @Input() nameFormatting: (value: string) => any;
  @Input() percentageFormatting: (value: number) => any;

  update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: (this.width * 4) / 12.0,
      height: this.height,
      margins: this.margin
    });

    this.formatDates();

    this.domain = this.getDomain();
    this.setColors();

    const xOffset = this.dims.width / 2;
    const yOffset = this.margin[0] + this.dims.height / 2;
    this.legendWidth = this.width - this.dims.width - this.margin[1];

    this.outerRadius = Math.min(this.dims.width, this.dims.height) / 2.5;
    this.innerRadius = this.outerRadius * 0.75;

    this.transform = `translate(${xOffset} , ${yOffset})`;
  }

  getDomain(): any[] {
    return this.results.map(d => d.label);
  }

  onClick(data: DataItem) {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
  }

  onActivate(item, fromLegend = false) {
    item = this.results.find(d => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item, fromLegend = false) {
    item = this.results.find(d => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }
}
