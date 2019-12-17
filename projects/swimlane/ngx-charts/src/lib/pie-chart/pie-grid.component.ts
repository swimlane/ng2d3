import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { min } from 'd3-array';
import { format } from 'd3-format';

import { calculateViewDimensions, IViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { trimLabel } from '../common/trim-label.helper';
import { gridLayout } from '../common/grid-layout.helper';
import { formatLabel } from '../common/label.helper';
import { DataItem } from '../models/chart-data.model';

@Component({
  selector: 'ngx-charts-pie-grid',
  template: `
    <ngx-charts-chart [view]="[width, height]" [showLegend]="false" [animations]="animations">
      <svg:g [attr.transform]="transform" class="pie-grid chart">
        <svg:g *ngFor="let series of series" class="pie-grid-item" [attr.transform]="series.transform">
          <svg:g
            ngx-charts-pie-grid-series
            [colors]="series.colors"
            [data]="series.data"
            [innerRadius]="series.innerRadius"
            [outerRadius]="series.outerRadius"
            [animations]="animations"
            (select)="onClick($event)"
            ngx-tooltip
            [tooltipDisabled]="tooltipDisabled"
            [tooltipPlacement]="'top'"
            [tooltipType]="'tooltip'"
            [tooltipTitle]="tooltipTemplate ? undefined : tooltipText({ data: series })"
            [tooltipTemplate]="tooltipTemplate"
            [tooltipContext]="series.data[0].data"
            (activate)="onActivate($event)"
            (deactivate)="onDeactivate($event)"
          />
          <svg:text
            *ngIf="animations"
            class="label percent-label"
            dy="-0.5em"
            x="0"
            y="5"
            ngx-charts-count-up
            [countTo]="series.percent"
            [countSuffix]="'%'"
            text-anchor="middle"
          ></svg:text>
          <svg:text *ngIf="!animations" class="label percent-label" dy="-0.5em" x="0" y="5" text-anchor="middle">
            {{ series.percent.toLocaleString() }}
          </svg:text>
          <svg:text class="label" dy="0.5em" x="0" y="5" text-anchor="middle">
            {{ series.label }}
          </svg:text>
          <svg:text
            *ngIf="animations"
            class="label"
            dy="1.23em"
            x="0"
            [attr.y]="series.outerRadius"
            text-anchor="middle"
            ngx-charts-count-up
            [countTo]="series.total"
            [countPrefix]="label + ': '"
          ></svg:text>
          <svg:text
            *ngIf="!animations"
            class="label"
            dy="1.23em"
            x="0"
            [attr.y]="series.outerRadius"
            text-anchor="middle"
          >
            {{ label }}: {{ series.total.toLocaleString() }}
          </svg:text>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['../common/base-chart.component.scss', './pie-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieGridComponent extends BaseChartComponent {
  @Input() designatedTotal: number;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: (o: any) => any;
  @Input() label: string = 'Total';
  @Input() minWidth: number = 150;
  @Input() activeEntries: any[] = [];

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  dims: IViewDimensions;
  data: any[];
  transform: string;
  series: any[];
  domain: any[];
  colorScale: ColorHelper;
  margin = [20, 20, 20, 20];

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin
    });

    this.formatDates();

    this.domain = this.getDomain();

    this.data = gridLayout(this.dims, this.results, this.minWidth, this.designatedTotal);
    this.transform = `translate(${this.margin[3]} , ${this.margin[0]})`;

    this.series = this.getSeries();
    this.setColors();

    this.tooltipText = this.tooltipText || this.defaultTooltipText;
  }

  defaultTooltipText({ data }): string {
    const label = trimLabel(formatLabel(data.name));
    const val = data.value.toLocaleString();
    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">${val}</span>
    `;
  }

  getDomain(): any[] {
    return this.results.map(d => d.label);
  }

  getSeries(): any[] {
    const total = this.designatedTotal ? this.designatedTotal : this.getTotal();

    return this.data.map(d => {
      const baselineLabelHeight = 20;
      const padding = 10;
      const name = d.data.name;
      const label = formatLabel(name);
      const value = d.data.value;
      const radius = min([d.width - padding, d.height - baselineLabelHeight]) / 2 - 5;
      const innerRadius = radius * 0.9;

      let count = 0;
      const colors = () => {
        count += 1;
        if (count === 1) {
          return 'rgba(100,100,100,0.3)';
        } else {
          return this.colorScale.getColor(label);
        }
      };

      const xPos = d.x + (d.width - padding) / 2;
      const yPos = d.y + (d.height - baselineLabelHeight) / 2;

      return {
        transform: `translate(${xPos}, ${yPos})`,
        colors,
        innerRadius,
        outerRadius: radius,
        name,
        label: trimLabel(label),
        total: value,
        value,
        percent: format('.1%')(d.data.percent),
        data: [
          d,
          {
            data: {
              other: true,
              value: total - value,
              name: d.data.name
            }
          }
        ]
      };
    });
  }

  getTotal(): any {
    return this.results.map(d => d.value).reduce((sum, d) => sum + d, 0);
  }

  onClick(data: DataItem): void {
    this.select.emit(data);
  }

  setColors(): void {
    this.colorScale = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
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
