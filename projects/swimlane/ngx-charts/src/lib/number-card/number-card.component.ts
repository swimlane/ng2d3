import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ContentChild, TemplateRef } from '@angular/core';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions, IViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { gridLayout, gridSize } from '../common/grid-layout.helper';
import { IGridLayout } from '../models/chart-data.model';

@Component({
  selector: 'ngx-charts-number-card',
  template: `
    <ngx-charts-chart [view]="[width, height]" [showLegend]="false" [animations]="animations">
      <svg:g [attr.transform]="transform" class="number-card chart" [class.clickable]="clickable">
        <svg:g
          ngx-charts-card-series
          [colors]="colors"
          [cardColor]="cardColor"
          [bandColor]="bandColor"
          [textColor]="textColor"
          [emptyColor]="emptyColor"
          [data]="data"
          [dims]="dims"
          [innerPadding]="innerPadding"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [valueFormatting]="valueFormatting"
          [labelFormatting]="labelFormatting"
          [animations]="animations"
          (select)="onClick($event)"
        ></svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['../common/base-chart.component.scss', './card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberCardComponent extends BaseChartComponent {
  @Input() cardColor: string;
  @Input() bandColor: string;
  @Input() emptyColor: string = 'rgba(0, 0, 0, 0)';
  @Input() innerPadding: number | number[] = 15;
  @Input() textColor: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() valueFormatting: (val: any) => string;
  @Input() labelFormatting: (val: any) => string;
  @Input() designatedTotal: number;

  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  dims: IViewDimensions;
  data: IGridLayout[];
  colors: ColorHelper;
  transform: string;
  domain: any[];
  margin: number[] = [10, 10, 10, 10];

  get clickable() {
    return !!this.select.observers.length;
  }

  update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin
    });

    this.formatDates();

    this.domain = this.getDomain();

    this.setColors();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    const size = gridSize(this.dims, this.results.length, 150);
    const N = size[0] * size[1];

    const data = this.results.slice();

    while (data.length < N) {
      data.push({ value: null });
    }

    this.data = gridLayout(this.dims, data, 150, this.designatedTotal);
  }

  getDomain(): any[] {
    return this.results.map(d => d.label);
  }

  onClick(data): void {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
  }
}
