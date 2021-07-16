import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { formatLabel, escapeLabel } from '../common/label.helper';
import { ColorHelper } from '../common/color.helper';
import { DataItem } from '../models/chart-data.model';
import { PlacementTypes } from '../common/tooltip/position';
import { StyleTypes } from '../common/tooltip/style.type';

export interface ArcItem {
  data: DataItem;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

@Component({
  selector: 'g[ngx-charts-gauge-arc]',
  template: `
    <svg:g
      ngx-charts-pie-arc
      class="background-arc"
      [startAngle]="0"
      [endAngle]="backgroundArc.endAngle"
      [innerRadius]="backgroundArc.innerRadius"
      [outerRadius]="backgroundArc.outerRadius"
      [cornerRadius]="cornerRadius"
      [data]="backgroundArc.data"
      [animate]="false"
      [pointerEvents]="false"
    ></svg:g>
    <svg:g
      ngx-charts-pie-arc
      [startAngle]="valueArc.startAngle"
      [endAngle]="valueArc.endAngle"
      [innerRadius]="valueArc.innerRadius"
      [outerRadius]="valueArc.outerRadius"
      [cornerRadius]="cornerRadius"
      [fill]="colors.getColor(valueArc.data.name)"
      [data]="valueArc.data"
      [animate]="animations"
      [isActive]="isActive"
      (select)="select.emit($event)"
      (activate)="activate.emit($event)"
      (deactivate)="deactivate.emit($event)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="placementTypes.Top"
      [tooltipType]="styleTypes.tooltip"
      [tooltipTitle]="tooltipTemplate ? undefined : tooltipText(valueArc)"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="valueArc.data"
    ></svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GaugeArcComponent {
  @Input() backgroundArc: ArcItem;
  @Input() valueArc: ArcItem;
  @Input() cornerRadius: number;
  @Input() colors: ColorHelper;
  @Input() isActive: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() valueFormatting: (value: any) => string;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() animations: boolean = true;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  placementTypes = PlacementTypes;
  styleTypes = StyleTypes;

  tooltipText(arc: ArcItem): string {
    const label = formatLabel(arc.data.name);
    let val;

    if (this.valueFormatting) {
      val = this.valueFormatting(arc.data.value);
    } else {
      val = formatLabel(arc.data.value);
    }

    return `
      <span class="tooltip-label">${escapeLabel(label)}</span>
      <span class="tooltip-val">${val}</span>
    `;
  }
}
