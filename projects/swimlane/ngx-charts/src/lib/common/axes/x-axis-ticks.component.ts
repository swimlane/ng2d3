import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef,
  ViewChild,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { reduceTicks } from './ticks.helper';
import { Orientation } from '../types/orientation.enum';
import { TextAnchor } from '../types/text-anchor.enum';

@Component({
  selector: 'g[ngx-charts-x-axis-ticks]',
  template: `
    <svg:g #ticksel>
      <svg:g *ngFor="let tick of ticks" class="tick" [attr.transform]="tickTransform(tick)">
        <title>{{ tickFormat(tick) }}</title>
        <svg:text
          stroke-width="0.01"
          [attr.text-anchor]="textAnchor"
          [attr.transform]="textTransform"
          [style.font-size]="'12px'"
        >
          {{ tickTrim(tickFormat(tick)) }}
        </svg:text>
      </svg:g>
    </svg:g>

    <svg:g *ngFor="let tick of ticks" [attr.transform]="tickTransform(tick)">
      <svg:g *ngIf="showGridLines" [attr.transform]="gridLineTransform()">
        <svg:line class="gridline-path gridline-path-vertical" [attr.y1]="-gridLineHeight" y2="0" />
      </svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XAxisTicksComponent implements OnChanges, AfterViewInit {
  @Input() scale;
  @Input() orient: Orientation;
  @Input() tickArguments: number[] = [5];
  @Input() tickValues: string[] | number[];
  @Input() tickStroke: string = '#ccc';
  @Input() trimTicks: boolean = true;
  @Input() maxTickLength: number = 16;
  @Input() tickFormatting;
  @Input() showGridLines = false;
  @Input() gridLineHeight: number;
  @Input() width: number;
  @Input() rotateTicks: boolean = true;

  @Output() dimensionsChanged = new EventEmitter();

  verticalSpacing: number = 20;
  rotateLabels: boolean = false;
  innerTickSize: number = 6;
  outerTickSize: number = 6;
  tickPadding: number = 3;
  textAnchor: TextAnchor = TextAnchor.Middle;
  maxTicksLength: number = 0;
  maxAllowedLength: number = 16;
  adjustedScale: any;
  textTransform: string;
  ticks: any[];
  tickFormat: (o: any) => any;
  height: number = 0;
  approxHeight: number = 10;

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
      this.dimensionsChanged.emit({ height: this.approxHeight });
      return;
    }

    const height = Math.round(this.ticksElement.nativeElement.getBoundingClientRect().height);
    if (height !== this.height) {
      this.height = height;
      this.dimensionsChanged.emit({ height: this.height });
      setTimeout(() => this.updateDims());
    }
  }

  update(): void {
    const scale = this.scale;
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

    const angle = this.rotateTicks ? this.getRotationAngle(this.ticks) : null;

    this.adjustedScale = this.scale.bandwidth
      ? function (d) {
          return this.scale(d) + this.scale.bandwidth() * 0.5;
        }
      : this.scale;

    this.textTransform = '';
    if (angle && angle !== 0) {
      this.textTransform = `rotate(${angle})`;
      this.textAnchor = TextAnchor.End;
      this.verticalSpacing = 10;
    } else {
      this.textAnchor = TextAnchor.Middle;
    }

    setTimeout(() => this.updateDims());
  }

  getRotationAngle(ticks: any[]): number {
    let angle = 0;
    this.maxTicksLength = 0;
    for (let i = 0; i < ticks.length; i++) {
      const tick = this.tickFormat(ticks[i]).toString();
      let tickLength = tick.length;
      if (this.trimTicks) {
        tickLength = this.tickTrim(tick).length;
      }

      if (tickLength > this.maxTicksLength) {
        this.maxTicksLength = tickLength;
      }
    }

    const len = Math.min(this.maxTicksLength, this.maxAllowedLength);
    const charWidth = 7; // need to measure this
    const wordWidth = len * charWidth;

    let baseWidth = wordWidth;
    const maxBaseWidth = Math.floor(this.width / ticks.length);

    // calculate optimal angle
    while (baseWidth > maxBaseWidth && angle > -90) {
      angle -= 30;
      baseWidth = Math.cos(angle * (Math.PI / 180)) * wordWidth;
    }

    this.approxHeight = Math.max(Math.abs(Math.sin(angle * (Math.PI / 180)) * wordWidth), 10);

    return angle;
  }

  getTicks(): any[] {
    let ticks;
    const maxTicks = this.getMaxTicks(20);
    const maxScaleTicks = this.getMaxTicks(100);

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

  getMaxTicks(tickWidth: number): number {
    return Math.floor(this.width / tickWidth);
  }

  tickTransform(tick: number): string {
    return 'translate(' + this.adjustedScale(tick) + ',' + this.verticalSpacing + ')';
  }

  gridLineTransform(): string {
    return `translate(0,${-this.verticalSpacing - 5})`;
  }

  tickTrim(label: string): string {
    return this.trimTicks ? trimLabel(label, this.maxTickLength) : label;
  }
}
