import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import {
  BaseChartComponent,
  ColorHelper,
  getScaleType,
  getUniqueXDomainValues,
  id,
  LegendOptions,
  LegendPosition,
  MultiSeries,
  Orientation,
  ScaleType,
  ViewDimensions
} from 'projects/swimlane/ngx-charts/src/public-api';
import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';

@Component({
  selector: 'custom-double-line-chart',
  templateUrl: './double-line-chart.component.html',
  styleUrls: ['./double-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(
          500,
          style({
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class DoubleLineChartComponent extends BaseChartComponent implements OnInit {
  // general
  /** activate auto scaling */
  @Input() autoScale: boolean;
  /** fill elements with a gradient instead of a solid color */
  @Input() gradient: boolean;
  /** show grid lines */
  @Input() showGridLines = true;
  /** interpolation curve from d3.curve */
  @Input() curve: any = curveLinear;
  /** elements to highlight */
  @Input() activeEntries: any[] = [];
  /** the color scale type. Can be either 'ordinal' or 'linear' */
  @Input() schemeType: ScaleType;
  /** opacity of the shadow around the line indication the (optional) min and max values.
   * The range shadow is only displayed if min and max values are provided with the data.
   * The color of the shadow is always the color of the central line.
   */
  @Input() rangeFillOpacity: number;
  /** round domains for aligned gridlines */
  @Input() roundDomains = false;

  /**  */
  dims: ViewDimensions;
  /**  */
  seriesDomain: any;
  /**  */
  secondarySeriesDomain: any;

  /**  */
  colors: ColorHelper;
  /**  */
  scaleType: ScaleType;
  /**  */
  transform: string;
  /**  */
  clipPath: string;
  /**  */
  clipPathId: string;
  /**  */
  areaPath: any;
  /**  */
  margin: number[] = [10, 20, 10, 20];
  /**  */
  hoveredVertical: any; // the value of the x axis that is hovered over
  /**  */
  filteredDomain: any;
  /**  */
  legendOptions: any;
  /**  */
  hasRange: boolean; // whether the line has a min-max range around it

  // legend
  /** show legend */
  @Input() legend: boolean;
  /** Legend title */
  @Input() legendTitle = 'Legend';
  /** Legend Position [LegendPosition.Below, LegendPosition.Right] */
  @Input() legendPosition: LegendPosition = LegendPosition.Right;

  // x axis
  /** List of main and secondary results */
  allResults: MultiSeries;
  /** Show x axis */
  @Input() xAxis: boolean;
  /** show x axis label */
  @Input() showXAxisLabel: boolean;
  /** x axis label */
  @Input() xAxisLabel: string;
  /** activate trimming x axis ticks */
  @Input() trimXAxisTicks = true;
  /** activate x axis tick rotation */
  @Input() rotateXAxisTicks = true;
  /** max length of x axis ticks */
  @Input() maxXAxisTickLength = 16;
  /** format function for x axis ticks */
  @Input() xAxisTickFormatting: any;
  /** predefined x axis ticks */
  @Input() xAxisTicks: any[];
  /** min limit of x axis values */
  @Input() xScaleMin: number | Date;
  /** max limit of x axis values */
  @Input() xScaleMax: number | Date;

  /** height of x axis */
  xAxisHeight = 0;
  /** domain of x axis values [smallestValue, biggestValue] */
  xDomain: any;
  /** x axis scale function from d3 library */
  xScale: any;

  // Main Y Axis
  /** data for main y axis (left) */
  @Input() results: MultiSeries;
  /** show main y axis */
  @Input() yAxis: boolean;
  /** show main y axis label */
  @Input() showYAxisLabel: boolean;
  /** main y axis label */
  @Input() yAxisLabel: string;
  /** activate trimming main y axis ticks */
  @Input() trimYAxisTicks = true;
  /** max length main y axis tick text */
  @Input() maxYAxisTickLength = 16;
  /** format function for main y axis ticks */
  @Input() yAxisTickFormatting: any;
  /** predefined main y axis ticks */
  @Input() yAxisTicks: any[];
  /** min limit of main y axis values */
  @Input() yScaleMin: number;
  /** max limit of main y axis values */
  @Input() yScaleMax: number;

  /** Orientation of main y axis  */
  yOrient = Orientation.Left;
  /** width of main y axis */
  yAxisWidth = 0;
  /** domain of main y axis values [smallestValue, biggestValue] */
  yDomain: [number, number];
  /** main y axis scale function from s3 library */
  yScale: any;

  // Secondary Y Axis
  /** data for secondary y axis (right) */
  @Input() secondaryResults: MultiSeries;
  /** show secondary y axis */
  @Input() secondaryYAxis: boolean;
  /** show secondary y axis label */
  @Input() showSecondaryYAxisLabel: boolean;
  /** secondary y axis label */
  @Input() secondaryYAxisLabel: string;
  /** activate trimming secondary y axis ticks */
  @Input() trimSecondaryYAxisTicks = true;
  /** max length secondary y axis tick text */
  @Input() maxSecondaryYAxisTickLength = 16;
  /** format function for secondary y axis ticks */
  @Input() secondaryYAxisTickFormatting: any;
  /** predefined secondary y axis ticks */
  @Input() secondaryYAxisTicks: any[];
  /** min limit of secondary y axis values */
  @Input() secondaryYScaleMin: number;
  /** max limit of secondary y axis values */
  @Input() secondaryYScaleMax: number;

  /** Orientation of secondary y axis */
  secondaryYOrient = Orientation.Right;
  /** Width of secondary y axis */
  secondaryYAxisWidth = 0;
  /** domain of secondary y axis values [smallestValue, biggestValue] */
  secondaryYDomain: [number, number];
  /** secondary y axis scale function from s3 library */
  secondaryYScale: any;

  // timeline
  /** show timeline */
  @Input() timeline: boolean;

  /** timeline width in pixel */
  timelineWidth: any;
  /** timeline height in pixel */
  timelineHeight = 50;
  /** timeline scaling function for x axis from d3 library */
  timelineXScale: any;
  /** timeline scaling function for main y axis from d3 library */
  timelineYScale: any;
  /** timeline scaling function for secondary y axis from d3 library */
  timelineSecondaryYScale: any;
  /** timeline domain for x axis values */
  timelineXDomain: any;
  /** timeline domain for main y axis values */
  timelineYDomain: any;
  /** timeline domain for secondary y axis values */
  timelineSecondaryYDomain: any;
  /**  */
  timelineTransform: any;
  /** timeline padding */
  timelinePadding = 10;

  // Reference lines
  /** show reference lines */
  @Input() showRefLines = false;
  /** reference lines for main y axis */
  @Input() referenceLines: any;
  /** reference lines for secondary y axis */
  @Input() secondaryReferenceLines: any;
  /** show reference line labels */
  @Input() showRefLabels = true;

  // tooltip
  /** disable tooltip */
  @Input() tooltipDisabled = false;
  /** all possible x values; needed for tooltip display */
  xSet: any;
  /**  */
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;
  /**  */
  @ContentChild('seriesTooltipTemplate')
  seriesTooltipTemplate: TemplateRef<any>;

  /**  */
  @Output() activate: EventEmitter<any> = new EventEmitter();
  /**  */
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  public ngOnInit(): void {
    super.ngOnInit();
  }

  update(): void {
    super.update();

    this.allResults = [...this.results, ...this.secondaryResults];

    this.dims = this.calculateViewDimensions({ columns: 12 });

    if (this.timeline) {
      this.dims.height -= this.timelineHeight + this.margin[2] + this.timelinePadding;
    }

    this.xDomain = this.getXDomain();
    if (this.filteredDomain) {
      this.xDomain = this.filteredDomain;
    }

    this.yDomain = this.getYDomain(this.results, this.yScaleMin, this.yScaleMax);
    this.secondaryYDomain = this.getYDomain(this.secondaryResults, this.secondaryYScaleMin, this.secondaryYScaleMax);

    this.seriesDomain = this.getSeriesDomain();

    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);
    this.secondaryYScale = this.getYScale(this.secondaryYDomain, this.dims.height);

    this.updateTimeline();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;
  }

  calculateViewDimensions({ columns = 12 }): ViewDimensions {
    let xOffset = this.margin[3];
    let chartWidth = this.width;
    let chartHeight = this.height - this.margin[0] - this.margin[2];

    if (this.legend) {
      if (this.legendPosition === LegendPosition.Right) {
        if (this.schemeType === ScaleType.Ordinal) {
          columns -= 2;
        } else {
          columns -= 1;
        }
      } else if (this.legendPosition === LegendPosition.Below) {
        if (this.schemeType === ScaleType.Ordinal) {
          chartHeight -= 72;
          this.height -= 72;
        } else {
          chartHeight -= 32;
          this.height -= 32;
        }
      }
    }

    chartWidth = (chartWidth * columns) / 12;

    chartWidth = chartWidth - this.margin[1] - this.margin[3];

    if (this.xAxis) {
      chartHeight -= 5;
      chartHeight -= this.xAxisHeight;

      if (this.showXAxisLabel) {
        // text height + spacing between axis label and tick labels
        const offset = 25 + 5;
        chartHeight -= offset;
      }
    }

    if (this.yAxis) {
      chartWidth -= 5;
      chartWidth -= this.yAxisWidth;
      xOffset += this.yAxisWidth;
      xOffset += 10;

      if (this.showYAxisLabel) {
        // text height + spacing between axis label and tick labels
        const offset = 25 + 5;
        chartWidth -= offset;
        xOffset += offset;
      }
    }

    if (this.secondaryYAxis) {
      chartWidth -= 20;
      chartWidth -= this.secondaryYAxisWidth;

      if (this.showSecondaryYAxisLabel) {
        // text height + spacing between axis label and tick labels
        const offset = 25 + 5;
        chartWidth -= offset;
      }
    }

    chartWidth = Math.max(0, chartWidth);
    chartHeight = Math.max(0, chartHeight);

    return {
      width: Math.floor(chartWidth),
      height: Math.floor(chartHeight),
      xOffset: Math.floor(xOffset)
    };
  }

  updateTimeline(): void {
    if (this.timeline) {
      this.timelineWidth = this.dims.width;
      this.timelineXDomain = this.getXDomain();
      this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
      // Main y axis
      this.timelineYDomain = this.getYDomain(this.results, this.yScaleMin, this.yScaleMax, true);
      this.timelineYScale = this.getYScale(this.timelineYDomain, this.timelineHeight);

      // secondary y axis
      this.timelineSecondaryYDomain = this.getYDomain(
        this.secondaryResults,
        this.secondaryYScaleMin,
        this.secondaryYScaleMax,
        true
      );
      this.timelineSecondaryYScale = this.getYScale(this.timelineSecondaryYDomain, this.timelineHeight);

      this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
    }
  }

  getXDomain(): any[] {
    // unique x values of both series
    let xAxisValues = getUniqueXDomainValues(this.allResults);

    this.scaleType = getScaleType(xAxisValues);
    let domain: any[];

    if (this.scaleType === ScaleType.Linear) {
      xAxisValues = xAxisValues.map(v => Number(v));
    }

    let min;
    let max;
    if (this.scaleType === ScaleType.Time || this.scaleType === ScaleType.Linear) {
      min = this.xScaleMin ?? Math.min(...xAxisValues);

      max = this.xScaleMax ?? Math.max(...xAxisValues);
    }

    if (this.scaleType === ScaleType.Time) {
      domain = [new Date(min), new Date(max)];
      this.xSet = [...xAxisValues].sort((a, b) => {
        const aDate = a.getTime();
        const bDate = b.getTime();
        if (aDate > bDate) {
          return 1;
        }
        if (bDate > aDate) {
          return -1;
        }
        return 0;
      });
    } else if (this.scaleType === ScaleType.Linear) {
      domain = [min, max];
      // Use compare function to sort numbers numerically
      this.xSet = [...xAxisValues].sort((a, b) => a - b);
    } else {
      domain = xAxisValues;
      this.xSet = xAxisValues;
    }

    return domain;
  }

  getYDomain(
    multiSeries: MultiSeries,
    limitMin: number,
    limitMax: number,
    timeline: boolean = false
  ): [number, number] {
    const domain = [];
    for (const results of multiSeries) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    const values = [...domain];
    if (!this.autoScale) {
      values.push(0);
    }

    let min: number;
    let max: number;
    // Timeline always display full chart domain

    if (timeline) {
      min = limitMin == null ? Math.min(...values) : Math.min(...values, limitMin);
      max = limitMax == null ? Math.max(...values) : Math.max(...values, limitMax);
    } else {
      min = limitMin ?? Math.min(...values);
      max = limitMax ?? Math.max(...values);
    }

    return [min, max];
  }

  getSeriesDomain(): Array<string | number | Date> {
    return this.allResults.map(d => d.name);
  }

  getXScale(domain, width: number): any {
    let scale;

    if (this.scaleType === ScaleType.Time) {
      scale = scaleTime().range([0, width]).domain(domain);
    } else if (this.scaleType === ScaleType.Linear) {
      scale = scaleLinear().range([0, width]).domain(domain);

      if (this.roundDomains) {
        scale = scale.nice();
      }
    } else if (this.scaleType === ScaleType.Ordinal) {
      scale = scalePoint().range([0, width]).padding(0.1).domain(domain);
    }

    return scale;
  }

  getYScale(domain, height: number): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  updateDomain(domain): void {
    this.filteredDomain = domain;
    this.xDomain = this.filteredDomain;
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
  }

  updateHoveredVertical(item): void {
    this.hoveredVertical = item.value;
    this.deactivateAll();
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.hoveredVertical = null;
    this.deactivateAll();
  }

  onClick(data): void {
    this.select.emit(data);
  }

  trackBy(index: number, item): string {
    return item.name;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions(): LegendOptions {
    const opts = {
      scaleType: this.schemeType as any,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === ScaleType.Ordinal) {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.yDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateSecondaryYAxisWidth({ width }: { width: number }): void {
    this.secondaryYAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(item): void {
    this.deactivateAll();

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item): void {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  deactivateAll(): void {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }
}
