import {
  Component,
  Input,
  Output,
  OnChanges,
  ElementRef,
  ViewChild,
  EventEmitter,
  AfterViewInit,
  ChangeDetectionStrategy,
  SimpleChanges,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { reduceTicks } from './ticks.helper';
import { roundedRect } from '../../common/shape.helper';
import { isPlatformBrowser } from '@angular/common';
import { Orientation } from '../types/orientation.enum';
import { TextAnchor } from '../types/text-anchor.enum';

@Component({
  selector: 'g[ngx-charts-y-axis-ticks]',
  template: `
    <svg:g #ticksel>
      <svg:g *ngFor="let tick of ticks" class="tick" [attr.transform]="transform(tick)">
        <title>{{ tickFormat(tick) }}</title>
        <svg:text
          stroke-width="0.01"
          [attr.dy]="dy"
          [attr.x]="x1"
          [attr.y]="y1"
          [attr.text-anchor]="textAnchor"
          [style.font-size]="'12px'"
        >
          {{ tickTrim(tickFormat(tick)) }}
        </svg:text>
      </svg:g>
    </svg:g>

    <svg:path
      *ngIf="referenceLineLength > 1 && refMax && refMin && showRefLines"
      class="reference-area"
      [attr.d]="referenceAreaPath"
      [attr.transform]="gridLineTransform()"
    />
    <svg:g *ngFor="let tick of ticks" [attr.transform]="transform(tick)">
      <svg:g *ngIf="showGridLines" [attr.transform]="gridLineTransform()">
        <svg:line
          *ngIf="orient === Orientation.Left"
          class="gridline-path gridline-path-horizontal"
          x1="0"
          [attr.x2]="gridLineWidth"
        />
        <svg:line
          *ngIf="orient === Orientation.Right"
          class="gridline-path gridline-path-horizontal"
          x1="0"
          [attr.x2]="-gridLineWidth"
        />
      </svg:g>
    </svg:g>

    <svg:g *ngFor="let refLine of referenceLines">
      <svg:g *ngIf="showRefLines" [attr.transform]="transform(refLine.value)">
        <svg:line
          class="refline-path gridline-path-horizontal"
          x1="0"
          [attr.x2]="gridLineWidth"
          [attr.transform]="gridLineTransform()"
        />
        <svg:g *ngIf="showRefLabels">
          <title>{{ tickTrim(tickFormat(refLine.value)) }}</title>
          <svg:text
            class="refline-label"
            [attr.dy]="dy"
            [attr.y]="-6"
            [attr.x]="gridLineWidth"
            [attr.text-anchor]="textAnchor"
          >
            {{ refLine.name }}
          </svg:text>
        </svg:g>
      </svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YAxisTicksComponent implements OnChanges, AfterViewInit {
  @Input() scale;
  @Input() orient: Orientation;
  @Input() tickArguments: number[] = [5];
  @Input() tickValues: string[] | number[];
  @Input() tickStroke = '#ccc';
  @Input() trimTicks: boolean = true;
  @Input() maxTickLength: number = 16;
  @Input() tickFormatting;
  @Input() showGridLines: boolean = false;
  @Input() gridLineWidth: number;
  @Input() height: number;
  @Input() referenceLines;
  @Input() showRefLabels: boolean = false;
  @Input() showRefLines: boolean = false;

  @Output() dimensionsChanged = new EventEmitter();

  innerTickSize: number = 6;
  tickPadding: number = 3;
  tickSpacing: number;
  verticalSpacing: number = 20;
  textAnchor: TextAnchor = TextAnchor.Middle;
  dy: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  adjustedScale: any;
  transform: (o: any) => string;
  tickFormat: (o: any) => string;
  ticks: any[];
  width: number = 0;
  outerTickSize: number = 6;
  rotateLabels: boolean = false;
  refMax: number;
  refMin: number;
  referenceLineLength: number = 0;
  referenceAreaPath: string;

  readonly Orientation = Orientation;

  @ViewChild('ticksel') ticksElement: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateDims());
  }

  updateDims(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // for SSR, use approximate value instead of measured
      this.width = this.getApproximateAxisWidth();
      this.dimensionsChanged.emit({ width: this.width });
      return;
    }

    const width = Math.round(this.ticksElement.nativeElement.getBoundingClientRect().width);
    if (width !== this.width) {
      this.width = width;
      this.dimensionsChanged.emit({ width });
      setTimeout(() => this.updateDims());
    }
  }

  update(): void {
    let scale;
    const sign = this.orient === Orientation.Top || this.orient === Orientation.Right ? -1 : 1;
    this.tickSpacing = Math.max(this.innerTickSize, 0) + this.tickPadding;

    scale = this.scale;
    this.ticks = this.getTicks();

    if (this.tickFormatting) {
      this.tickFormat = this.tickFormatting;
    } else if (scale.tickFormat) {
      this.tickFormat = scale.tickFormat.apply(scale, this.tickArguments);
    } else {
      this.tickFormat = function (d) {
        if (d.constructor.name === 'Date') {
          return d.toLocaleDateString();
        }
        return d.toLocaleString();
      };
    }

    this.adjustedScale = scale.bandwidth
      ? function (d) {
          return scale(d) + scale.bandwidth() * 0.5;
        }
      : scale;

    if (this.showRefLines && this.referenceLines) {
      this.setReferencelines();
    }

    switch (this.orient) {
      case Orientation.Top:
        this.transform = function (tick) {
          return 'translate(' + this.adjustedScale(tick) + ',0)';
        };
        this.textAnchor = TextAnchor.Middle;
        this.y2 = this.innerTickSize * sign;
        this.y1 = this.tickSpacing * sign;
        this.dy = sign < 0 ? '0em' : '.71em';
        break;
      case Orientation.Bottom:
        this.transform = function (tick) {
          return 'translate(' + this.adjustedScale(tick) + ',0)';
        };
        this.textAnchor = TextAnchor.Middle;
        this.y2 = this.innerTickSize * sign;
        this.y1 = this.tickSpacing * sign;
        this.dy = sign < 0 ? '0em' : '.71em';
        break;
      case Orientation.Left:
        this.transform = function (tick) {
          return 'translate(0,' + this.adjustedScale(tick) + ')';
        };
        this.textAnchor = TextAnchor.End;
        this.x2 = this.innerTickSize * -sign;
        this.x1 = this.tickSpacing * -sign;
        this.dy = '.32em';
        break;
      case Orientation.Right:
        this.transform = function (tick) {
          return 'translate(0,' + this.adjustedScale(tick) + ')';
        };
        this.textAnchor = TextAnchor.Start;
        this.x2 = this.innerTickSize * -sign;
        this.x1 = this.tickSpacing * -sign;
        this.dy = '.32em';
        break;
      default:
    }
    setTimeout(() => this.updateDims());
  }

  setReferencelines(): void {
    this.refMin = this.adjustedScale(
      Math.min.apply(
        null,
        this.referenceLines.map(item => item.value)
      )
    );
    this.refMax = this.adjustedScale(
      Math.max.apply(
        null,
        this.referenceLines.map(item => item.value)
      )
    );
    this.referenceLineLength = this.referenceLines.length;

    this.referenceAreaPath = roundedRect(0, this.refMax, this.gridLineWidth, this.refMin - this.refMax, 0, [
      false,
      false,
      false,
      false
    ]);
  }

  getTicks(): any[] {
    let ticks;
    const maxTicks = this.getMaxTicks(20);
    const maxScaleTicks = this.getMaxTicks(50);

    if (this.tickValues) {
      ticks = this.tickValues;
    } else if (this.scale.ticks) {
      ticks = this.scale.ticks.apply(this.scale, [maxScaleTicks]);
    } else {
      ticks = this.scale.domain();
      ticks = reduceTicks(ticks, maxTicks);
    }

    return ticks;
  }

  getMaxTicks(tickHeight: number): number {
    return Math.floor(this.height / tickHeight);
  }

  tickTransform(tick: number): string {
    return `translate(${this.adjustedScale(tick)},${this.verticalSpacing})`;
  }

  gridLineTransform(): string {
    return `translate(5,0)`;
  }

  tickTrim(label: string): string {
    return this.trimTicks ? trimLabel(label, this.maxTickLength) : label;
  }

  getApproximateAxisWidth(): number {
    const maxChars = Math.max(...this.ticks.map(t => this.tickTrim(this.tickFormat(t)).length));
    const charWidth = 7;
    return maxChars * charWidth;
  }
}
