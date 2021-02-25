import {
  Component,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import { max } from 'd3-array';
import { arc, pie } from 'd3-shape';

import { formatLabel, escapeLabel } from '../common/label.helper';

@Component({
  selector: 'g[ngx-charts-pie-series]',
  template: `
    <svg:g *ngFor="let arc of data; trackBy: trackBy">
      <svg:g
        ngx-charts-pie-label
        *ngIf="labelVisible(arc)"
        [data]="arc"
        [radius]="outerRadius"
        [color]="color(arc)"
        [label]="labelText(arc)"
        [labelTrim]="trimLabels"
        [labelTrimSize]="maxLabelLength"
        [max]="max"
        [value]="arc.value"
        [explodeSlices]="explodeSlices"
        [animations]="animations"
      ></svg:g>
      <svg:g
        ngx-charts-pie-arc
        [startAngle]="arc.startAngle"
        [endAngle]="arc.endAngle"
        [innerRadius]="innerRadius"
        [outerRadius]="outerRadius"
        [fill]="color(arc)"
        [value]="arc.data.value"
        [gradient]="gradient"
        [data]="arc.data"
        [max]="max"
        [explodeSlices]="explodeSlices"
        [explodeOnHover]="explodeOnHover"
        [isActive]="isActive(arc.data)"
        [animate]="animations"
        (select)="onClick($event)"
        (activate)="activate.emit($event)"
        (deactivate)="deactivate.emit($event)"
        (dblclick)="dblclick.emit($event)"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'top'"
        [tooltipType]="'tooltip'"
        [tooltipTitle]="getTooltipTitle(arc)"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipContext]="arc.data"
      ></svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieSeriesComponent implements OnChanges {
  @Input() colors;
  @Input() series: any = [];
  @Input() dims;
  @Input() innerRadius = 60;
  @Input() outerRadius = 80;
  @Input() explodeSlices;
  @Input() explodeOnHover: boolean;
  @Input() showLabels;
  @Input() gradient: boolean;
  @Input() activeEntries: any[];
  @Input() labelFormatting: any;
  @Input() trimLabels: boolean = true;
  @Input() maxLabelLength: number = 10;
  @Input() tooltipText: (o: any) => any;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() animations: boolean = true;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() dblclick = new EventEmitter();

  max: number;
  data: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    const pieGenerator = pie<any, any>()
      .value(d => d.value)
      .sort(null);

    const arcData = pieGenerator(this.series);

    this.max = max(arcData, d => {
      return d.value;
    });

    this.data = this.calculateLabelPositions(arcData);
    this.tooltipText = this.tooltipText || this.defaultTooltipText;
  }

  midAngle(d): number {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  outerArc(): any {
    const factor = 1.5;

    return arc()
      .innerRadius(this.outerRadius * factor)
      .outerRadius(this.outerRadius * factor);
  }

  calculateLabelPositions(pieData): any {
    const factor = 1.5;
    const minDistance = 10;
    const labelPositions = pieData;

    labelPositions.forEach(d => {
      d.pos = this.outerArc().centroid(d);
      d.pos[0] = factor * this.outerRadius * (this.midAngle(d) < Math.PI ? 1 : -1);
    });

    for (let i = 0; i < labelPositions.length - 1; i++) {
      const a = labelPositions[i];
      if (!this.labelVisible(a)) {
        continue;
      }

      for (let j = i + 1; j < labelPositions.length; j++) {
        const b = labelPositions[j];
        if (!this.labelVisible(b)) {
          continue;
        }
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

    return labelPositions;
  }

  labelVisible(myArc): boolean {
    return this.showLabels && myArc.endAngle - myArc.startAngle > Math.PI / 30;
  }

  getTooltipTitle(a) {
    return this.tooltipTemplate ? undefined : this.tooltipText(a);
  }

  labelText(myArc): string {
    if (this.labelFormatting) {
      return this.labelFormatting(myArc.data.name);
    }
    return this.label(myArc);
  }

  label(myArc): string {
    return formatLabel(myArc.data.name);
  }

  defaultTooltipText(myArc): string {
    const label = this.label(myArc);
    const val = formatLabel(myArc.data.value);

    return `
      <span class="tooltip-label">${escapeLabel(label)}</span>
      <span class="tooltip-val">${val}</span>
    `;
  }

  color(myArc): any {
    return this.colors.getColor(this.label(myArc));
  }

  trackBy(index, item): string {
    return item.data.name;
  }

  onClick(data): void {
    this.select.emit(data);
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.name === d.name && entry.series === d.series;
    });
    return item !== undefined;
  }
}
