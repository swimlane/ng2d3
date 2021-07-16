import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '../common/label.helper';
import { DataItem, StringOrNumberOrDate } from '../models/chart-data.model';
import { PlacementTypes } from '../common/tooltip/position';
import { StyleTypes } from '../common/tooltip/style.type';
import { ScaleType, ViewDimensions, BarOrientation } from '../common/types';
import { ColorHelper } from '../common/color.helper';
import { BarChartType } from './types/bar-chart-type.enum';
import { D0Types } from './types/d0-type.enum';
import { Bar } from './types/bar.model';

@Component({
  selector: 'g[ngx-charts-series-vertical]',
  template: `
    <svg:g
      ngx-charts-bar
      *ngFor="let bar of bars; trackBy: trackBy"
      [@animationState]="'active'"
      [@.disabled]="!animations"
      [width]="bar.width"
      [height]="bar.height"
      [x]="bar.x"
      [y]="bar.y"
      [fill]="bar.color"
      [stops]="bar.gradientStops"
      [data]="bar.data"
      [orientation]="barOrientation.Vertical"
      [roundEdges]="bar.roundEdges"
      [gradient]="gradient"
      [ariaLabel]="bar.ariaLabel"
      [isActive]="isActive(bar.data)"
      (select)="onClick($event)"
      (activate)="activate.emit($event)"
      (deactivate)="deactivate.emit($event)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipType]="tooltipType"
      [tooltipTitle]="tooltipTemplate ? undefined : bar.tooltipText"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="bar.data"
      [noBarWhenZero]="noBarWhenZero"
      [animations]="animations"
    ></svg:g>
    <svg:g *ngIf="showDataLabel">
      <svg:g
        ngx-charts-bar-label
        *ngFor="let b of barsForDataLabels; let i = index; trackBy: trackDataLabelBy"
        [barX]="b.x"
        [barY]="b.y"
        [barWidth]="b.width"
        [barHeight]="b.height"
        [value]="b.total"
        [valueFormatting]="dataLabelFormatting"
        [orientation]="barOrientation.Vertical"
        (dimensionsChanged)="dataLabelHeightChanged.emit({ size: $event, index: i })"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SeriesVerticalComponent implements OnChanges {
  @Input() dims: ViewDimensions;
  @Input() type: BarChartType = BarChartType.Standard;
  @Input() series: DataItem[];
  @Input() xScale;
  @Input() yScale;
  @Input() colors: ColorHelper;
  @Input() gradient: boolean;
  @Input() activeEntries: DataItem[];
  @Input() seriesName: StringOrNumberOrDate;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() roundEdges: boolean;
  @Input() animations: boolean = true;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;

  @Output() select: EventEmitter<DataItem> = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() dataLabelHeightChanged = new EventEmitter();

  tooltipPlacement: PlacementTypes;
  tooltipType: StyleTypes;

  bars: Bar[];
  barsForDataLabels: Array<{ x: number; y: number; width: number; height: number; total: number; series: string }> = [];

  barOrientation = BarOrientation;

  ngOnChanges(changes): void {
    this.update();
  }

  update(): void {
    this.updateTooltipSettings();
    let width;
    if (this.series.length) {
      width = this.xScale.bandwidth();
    }
    width = Math.round(width);
    const yScaleMin = Math.max(this.yScale.domain()[0], 0);

    const d0 = {
      [D0Types.positive]: 0,
      [D0Types.negative]: 0
    };
    let d0Type = D0Types.positive;

    let total;
    if (this.type === BarChartType.Normalized) {
      total = this.series.map(d => d.value).reduce((sum, d) => sum + d, 0);
    }

    let topNameOfGroup: string | undefined;

    for (let i = this.series.length - 1; i >= 0; i--) {
      if (this.series[i].value !== 0) {
        topNameOfGroup = this.series[i].name;
        break;
      }
    }

    this.bars = this.series.map((d, index) => {
      let value = d.value as any;
      const label = this.getLabel(d);
      const formattedLabel = formatLabel(label);
      let roundEdges;

      if ((this.type === 'stacked' && d.name === topNameOfGroup)) {
        roundEdges = true;
      }
      else {
        roundEdges = this.roundEdges;
      }

      d0Type = value > 0 ? D0Types.positive : D0Types.negative;

      const bar: any = {
        value,
        label,
        roundEdges,
        data: d,
        width,
        formattedLabel,
        height: 0,
        x: 0,
        y: 0
      };

      if (this.type === BarChartType.Standard) {
        bar.height = Math.abs(this.yScale(value) - this.yScale(yScaleMin));
        bar.x = this.xScale(label);

        if (value < 0) {
          bar.y = this.yScale(0);
        } else {
          bar.y = this.yScale(value);
        }
      } else if (this.type === BarChartType.Stacked) {
        const offset0 = d0[d0Type];
        const offset1 = offset0 + value;
        d0[d0Type] += value;

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (this.type === BarChartType.Normalized) {
        let offset0 = d0[d0Type];
        let offset1 = offset0 + value;
        d0[d0Type] += value;

        if (total > 0) {
          offset0 = (offset0 * 100) / total;
          offset1 = (offset1 * 100) / total;
        } else {
          offset0 = 0;
          offset1 = 0;
        }

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
        value = (offset1 - offset0).toFixed(2) + '%';
      }

      if (this.colors.scaleType === ScaleType.Ordinal) {
        bar.color = this.colors.getColor(label);
      } else {
        if (this.type === BarChartType.Standard) {
          bar.color = this.colors.getColor(value);
          bar.gradientStops = this.colors.getLinearGradientStops(value);
        } else {
          bar.color = this.colors.getColor(bar.offset1);
          bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
        }
      }

      let tooltipLabel = formattedLabel;
      bar.ariaLabel = formattedLabel + ' ' + value.toLocaleString();
      if (this.seriesName !== null && this.seriesName !== undefined) {
        tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
        bar.data.series = this.seriesName;
        bar.ariaLabel = this.seriesName + ' ' + bar.ariaLabel;
      }

      bar.tooltipText = this.tooltipDisabled
        ? undefined
        : `
        <span class="tooltip-label">${escapeLabel(tooltipLabel)}</span>
        <span class="tooltip-val">${
          this.dataLabelFormatting ? this.dataLabelFormatting(value) : value.toLocaleString()
        }</span>
      `;

      return bar;
    });

    this.updateDataLabels();
  }

  updateDataLabels(): void {
    if (this.type === BarChartType.Stacked) {
      this.barsForDataLabels = [];
      const section: any = {};
      section.series = this.seriesName;
      const totalPositive = this.series.map(d => d.value).reduce((sum, d) => (d > 0 ? sum + d : sum), 0);
      const totalNegative = this.series.map(d => d.value).reduce((sum, d) => (d < 0 ? sum + d : sum), 0);
      section.total = totalPositive + totalNegative;
      section.x = 0;
      section.y = 0;
      if (section.total > 0) {
        section.height = this.yScale(totalPositive);
      } else {
        section.height = this.yScale(totalNegative);
      }
      section.width = this.xScale.bandwidth();
      this.barsForDataLabels.push(section);
    } else {
      this.barsForDataLabels = this.series.map(d => {
        const section: any = {};
        section.series = this.seriesName ?? d.label;
        section.total = d.value;
        section.x = this.xScale(d.label);
        section.y = this.yScale(0);
        section.height = this.yScale(section.total) - this.yScale(0);
        section.width = this.xScale.bandwidth();
        return section;
      });
    }
  }

  updateTooltipSettings(): void {
    this.tooltipPlacement = this.tooltipDisabled ? undefined : PlacementTypes.Top;
    this.tooltipType = this.tooltipDisabled ? undefined : StyleTypes.tooltip;
  }

  isActive(entry: DataItem): boolean {
    if (!this.activeEntries) return false;

    const item = this.activeEntries.find(active => {
      return entry.name === active.name && entry.value === active.value;
    });

    return item !== undefined;
  }

  onClick(data: DataItem): void {
    this.select.emit(data);
  }

  getLabel(dataItem: DataItem): StringOrNumberOrDate {
    if (dataItem.label) {
      return dataItem.label;
    }
    return dataItem.name;
  }

  trackBy(index: number, bar: Bar): string {
    return bar.label;
  }

  trackDataLabelBy(index: number, barLabel: any): string {
    return index + '#' + barLabel.series + '#' + barLabel.total;
  }
}
