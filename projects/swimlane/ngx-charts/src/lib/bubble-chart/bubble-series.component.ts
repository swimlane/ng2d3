import {
  Component,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '../common/label.helper';
import { ColorHelper } from '../common';
import { ScaleTime, ScaleLinear, ScalePoint } from 'd3-scale';
import { BubbleChartSeries, BubbleChartDataItem } from '../models/chart-data.model';
import { IShapeCircle, IShapeData, IShapePolygon, IShapeRectangle, IShapeBase } from '../models/shape.model';
import { ScaleType } from '../enums/scale.enum';
import { ShapeType } from '../enums/shape.enum';

@Component({
  selector: 'g[ngx-charts-bubble-series]',
  template: `
    <svg:g *ngFor="let shape of shapes; trackBy: trackBy">
      <svg:g [attr.transform]="shape.transform">
        <svg:g
          ngx-charts-shape
          [@animationState]="'active'"
          class="circle"
          [cx]="shape.cx"
          [cy]="shape.cy"
          [width]="shape.width"
          [height]="shape.height"
          [r]="shape.radius"
          [shapeType]="shapeType"
          [points]="shape.formattedPoints"
          [fill]="shape.color"
          [style.opacity]="shape.opacity"
          [class.active]="shape.isActive"
          [pointerEvents]="'all'"
          [data]="shape.value"
          [classNames]="shape.classNames"
          (select)="onClick(shape.data)"
          (activate)="activateCircle(shape)"
          (deactivate)="deactivateCircle(shape)"
          ngx-tooltip
          [tooltipDisabled]="tooltipDisabled"
          [tooltipPlacement]="'top'"
          [tooltipType]="'tooltip'"
          [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(shape)"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipContext]="shape.data"
        />
      </svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0)'
        }),
        animate(250, style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class BubbleSeriesComponent implements OnChanges {
  @Input() data: BubbleChartSeries;
  @Input() xScale: ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string>;
  @Input() yScale: ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string>;
  @Input() rScale: ScaleLinear<number, number>;
  @Input() xScaleType: string;
  @Input() yScaleType: string;
  @Input() colors: ColorHelper;
  @Input() activeEntries: IShapeData[] = [];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() shapeType: string = ShapeType.rectangle;

  @Output() select: EventEmitter<IShapeData> = new EventEmitter();
  @Output() activate: EventEmitter<Partial<IShapeData>> = new EventEmitter();
  @Output() deactivate: EventEmitter<Partial<IShapeData>> = new EventEmitter();

  shapes: Array<IShapeCircle | IShapeRectangle | IShapePolygon>;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.shapes = this.getCircles();
  }

  getCircles(): Array<IShapeCircle | IShapeRectangle | IShapePolygon> {
    const seriesName = this.data.name;

    return this.data.series
      .map((d, i) => {
        if (typeof d.y !== 'undefined' && typeof d.x !== 'undefined') {
          const x = d.x;
          const y = d.y;
          const r = d.r;

          const radius = this.rScale(r || 1);
          const tooltipLabel = formatLabel(d.name);

          const cx = this.xScale(x as any);
          const cy = this.yScale(y as any);

          const width = radius * 2;
          const height = radius * 2;

          // Example of triangle using circle data.
          const polygonPoints = [
            [cx, cy + radius],
            [Math.round(cx - 0.866 * radius), Math.round(cy - 0.5 * radius)],
            [Math.round(cx + 0.866 * radius), Math.round(cy - 0.5 * radius)]
          ];

          const formattedPoints = polygonPoints.map(item => item.join(',')).join(' ');

          const color =
            this.colors.scaleType === ScaleType.linear ? this.colors.getColor(r) : this.colors.getColor(seriesName);

          const isActive = !this.activeEntries.length ? true : this.isActive({ name: seriesName });
          const opacity = isActive ? 1 : 0.3;

          const data: IShapeData = {
            series: d.name,
            name: seriesName,
            value: d.y,
            x: d.x,
            radius: d.r
          };

          const baseData: IShapeBase = {
            data,
            x,
            y,
            r,
            classNames: [`circle-data-${i}`],
            value: y,
            label: d.name,
            tooltipLabel,
            color,
            opacity,
            seriesName,
            isActive,
            transform: `translate(${cx},${cy})`,
            barVisible: true
          };

          switch (this.shapeType) {
            case ShapeType.circle:
              const circleData: IShapeCircle = { ...baseData, cx: 0, cy: 0, radius };
              return circleData;
            case ShapeType.rectangle:
              const rectData: IShapeRectangle = {
                ...baseData,
                cx: -width / 2,
                cy: -height / 2,
                width,
                height,
                rx: 0,
                ry: 0
              };
              return rectData;
            case ShapeType.polygon:
              const polygonData: IShapePolygon = { ...baseData, formattedPoints, transform: `` };
              return polygonData;
          }
        }
      })
      .filter(shape => shape !== undefined);
  }

  getTooltipText(shape: IShapeCircle | IShapeRectangle | IShapePolygon): string {
    let radiusValue = '';
    if (this.shapeType === ShapeType.circle) {
      const shapeCircle = shape as IShapeCircle;
      if (typeof shapeCircle.r !== 'undefined') {
        radiusValue = formatLabel(shapeCircle.r);
      }
    }
    const hasTooltipLabel = shape.tooltipLabel && shape.tooltipLabel.length;
    const hasSeriesName = shape.seriesName && shape.seriesName.toString().length;
    const xAxisLabel = this.xAxisLabel && this.xAxisLabel !== '' ? `${this.xAxisLabel}:` : '';
    const yAxisLabel = this.yAxisLabel && this.yAxisLabel !== '' ? `${this.yAxisLabel}:` : '';
    const x = formatLabel(shape.x);
    const y = formatLabel(shape.y);
    const name =
      hasSeriesName && hasTooltipLabel
        ? `${shape.seriesName} • ${shape.tooltipLabel}`
        : shape.seriesName + shape.tooltipLabel;
    const tooltipTitle =
      hasSeriesName || hasTooltipLabel ? `<span class="tooltip-label">${escapeLabel(name)}</span>` : '';

    return `
      ${tooltipTitle}
      <span class="tooltip-label">
        <label>${escapeLabel(xAxisLabel)}</label> ${escapeLabel(x)}<br />
        <label>${escapeLabel(yAxisLabel)}</label> ${escapeLabel(y)}
      </span>
      <span class="tooltip-val">
        ${escapeLabel(radiusValue)}
      </span>
    `;
  }

  onClick(data: IShapeData): void {
    this.select.emit(data);
  }

  isActive(entry: Partial<BubbleChartDataItem>): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => entry.name === d.name);
    return item !== undefined;
  }

  isVisible(circle: IShapeCircle): boolean {
    if (this.activeEntries.length) {
      return this.isActive({ name: circle.seriesName });
    }

    return circle.opacity !== 0;
  }

  activateCircle(circle: IShapeCircle): void {
    circle.barVisible = true;
    this.activate.emit(circle.data);
  }

  deactivateCircle(circle: IShapeCircle): void {
    circle.barVisible = false;
    this.deactivate.emit(circle.data);
  }

  trackBy(index: number, circle: IShapeCircle): string {
    return `${circle.data.series} ${circle.data.name}`;
  }
}
