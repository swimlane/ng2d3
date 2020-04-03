import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '../common/label.helper';
import { DataItem } from '../models/chart-data.model';

export enum D0Types {
  positive = 'positive',
  negative = 'negative'
}

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
      [orientation]="'vertical'"
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
        [orientation]="'vertical'"
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
  @Input() dims;
  @Input() type = 'standard';
  @Input() series;
  @Input() xScale;
  @Input() yScale;
  @Input() colors;
  @Input() gradient: boolean;
  @Input() activeEntries: any[];
  @Input() seriesName: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() roundEdges: boolean = false;
  @Input() animations: boolean = true;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() dataLabelHeightChanged = new EventEmitter();

  tooltipPlacement: string;
  tooltipType: string;

  bars: any;
  x: any;
  y: any;
  barsForDataLabels: Array<{ x: number; y: number; width: number; height: number; total: number; series: string }> = [];

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
    if (this.type === 'normalized') {
      total = this.series.map(d => d.value).reduce((sum, d) => sum + d, 0);
    }

    this.bars = this.series.map((d, index) => {
      let value = d.value;
      const label = this.getLabel(d);
      const formattedLabel = formatLabel(label);
      const roundEdges = this.roundEdges;
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

      if (this.type === 'standard') {
        bar.height = Math.abs(this.yScale(value) - this.yScale(yScaleMin));
        bar.x = this.xScale(label);

        if (value < 0) {
          bar.y = this.yScale(0);
        } else {
          bar.y = this.yScale(value);
        }
      } else if (this.type === 'stacked') {
        const offset0 = d0[d0Type];
        const offset1 = offset0 + value;
        d0[d0Type] += value;

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (this.type === 'normalized') {
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

      if (this.colors.scaleType === 'ordinal') {
        bar.color = this.colors.getColor(label);
      } else {
        if (this.type === 'standard') {
          bar.color = this.colors.getColor(value);
          bar.gradientStops = this.colors.getLinearGradientStops(value);
        } else {
          bar.color = this.colors.getColor(bar.offset1);
          bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
        }
      }

      let tooltipLabel = formattedLabel;
      bar.ariaLabel = formattedLabel + ' ' + value.toLocaleString();
      if (this.seriesName) {
        tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
        bar.data.series = this.seriesName;
        bar.ariaLabel = this.seriesName + ' ' + bar.ariaLabel;
      }

      bar.tooltipText = this.tooltipDisabled
        ? undefined
        : `
        <span class="tooltip-label">${escapeLabel(tooltipLabel)}</span>
        <span class="tooltip-val">${value.toLocaleString()}</span>
      `;

      return bar;
    });

    this.updateDataLabels();
  }

  updateDataLabels() {
    if (this.type === 'stacked') {
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
        section.series = this.seriesName ? this.seriesName : d.label;
        section.total = d.value;
        section.x = this.xScale(d.label);
        section.y = this.yScale(0);
        section.height = this.yScale(section.total) - this.yScale(0);
        section.width = this.xScale.bandwidth();
        return section;
      });
    }
  }

  updateTooltipSettings() {
    this.tooltipPlacement = this.tooltipDisabled ? undefined : 'top';
    this.tooltipType = this.tooltipDisabled ? undefined : 'tooltip';
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.name === d.name && entry.series === d.series;
    });
    return item !== undefined;
  }

  onClick(data: DataItem): void {
    this.select.emit(data);
  }

  getLabel(dataItem): string {
    if (dataItem.label) {
      return dataItem.label;
    }
    return dataItem.name;
  }

  trackBy(index, bar): string {
    return bar.label;
  }

  trackDataLabelBy(index, barLabel) {
    return index + '#' + barLabel.series + '#' + barLabel.total;
  }
}
