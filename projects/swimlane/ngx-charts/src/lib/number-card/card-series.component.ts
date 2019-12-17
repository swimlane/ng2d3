import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import { invertColor } from '../utils/color-utils';
import { ColorHelper, IViewDimensions } from '../common';
import { IGridLayout, ICardModel, NumberCardsChartDataItem } from '../models/chart-data.model';

@Component({
  selector: 'g[ngx-charts-card-series]',
  template: `
    <svg:rect
      *ngFor="let c of emptySlots; trackBy: trackBy"
      class="card-empty"
      [attr.x]="c.x"
      [attr.y]="c.y"
      [style.fill]="emptyColor"
      [attr.width]="c.width"
      [attr.height]="c.height"
      rx="3"
      ry="3"
    />
    <svg:g
      ngx-charts-card
      *ngFor="let c of cards; trackBy: trackBy"
      [x]="c.x"
      [y]="c.y"
      [width]="c.width"
      [height]="c.height"
      [color]="c.color"
      [bandColor]="c.bandColor"
      [textColor]="c.textColor"
      [data]="c.data"
      [label]="c.label"
      [medianSize]="medianSize"
      [valueFormatting]="valueFormatting"
      [labelFormatting]="labelFormatting"
      [animations]="animations"
      (select)="onClick($event)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipType]="tooltipType"
      [tooltipTitle]="tooltipTemplate ? undefined : c.tooltipText"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="c.data"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSeriesComponent implements OnChanges {
  @Input() data: IGridLayout[];
  @Input() dims: IViewDimensions;
  @Input() colors: ColorHelper;
  @Input() innerPadding: number | number[] = 15;

  @Input() cardColor: string;
  @Input() bandColor: string;
  @Input() emptyColor: string = 'rgba(0, 0, 0, 0)';
  @Input() textColor: string;
  @Input() valueFormatting: (val: any) => string;
  @Input() labelFormatting: (val: any) => string;
  @Input() animations: boolean = true;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() select: EventEmitter<NumberCardsChartDataItem> = new EventEmitter<NumberCardsChartDataItem>();

  cards: ICardModel[];
  emptySlots: any[];
  medianSize: number;

  tooltipPlacement: string;
  tooltipType: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.updateTooltipSettings();
    if (this.data.length > 2) {
      const valueFormatting = this.valueFormatting || (card => card.value.toLocaleString());

      const sortedLengths = this.data
        .map(d => {
          const hasValue = d && d.data && typeof d.data.value !== 'undefined' && d.data.value !== null;
          return hasValue
            ? valueFormatting({
                data: d.data,
                label: d ? d.data.name : '',
                value: d && d.data ? d.data.value : ''
              }).length
            : 0;
        })
        .sort((a, b) => b - a);
      const idx = Math.ceil(this.data.length / 2);
      this.medianSize = sortedLengths[idx];
    }

    const cards = this.getCards();
    this.cards = cards.filter(d => d.data.value !== null);
    this.emptySlots = cards.filter(d => d.data.value === null);
  }

  getCards(): any[] {
    const yPadding =
      typeof this.innerPadding === 'number' ? this.innerPadding : this.innerPadding[0] + this.innerPadding[2];
    const xPadding =
      typeof this.innerPadding === 'number' ? this.innerPadding : this.innerPadding[1] + this.innerPadding[3];

    return this.data.map((d, index) => {
      let label = d.data.name;
      if (label && label instanceof Date) {
        label = label.toLocaleDateString();
      } else {
        label = label ? label.toLocaleString() : label;
      }

      const value = d.data.value;
      const valueColor = label ? this.colors.getColor(label) : this.emptyColor;
      const color = this.cardColor || valueColor || '#000';
      return {
        x: d.x,
        y: d.y,
        width: d.width - xPadding,
        height: d.height - yPadding,
        color,
        bandColor: this.bandColor || valueColor,
        textColor: this.textColor || invertColor(color),
        label,
        data: d.data,
        tooltipText: `${label}: ${value}`
      };
    });
  }

  trackBy(index: number, card: ICardModel): string {
    return card.label;
  }

  updateTooltipSettings() {
    this.tooltipPlacement = this.tooltipDisabled ? undefined : 'top';
    this.tooltipType = this.tooltipDisabled ? undefined : 'tooltip';
  }

  onClick(data: NumberCardsChartDataItem): void {
    this.select.emit(data);
  }
}
