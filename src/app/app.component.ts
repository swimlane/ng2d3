import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';

import { colorSets } from '@swimlane/ngx-charts/utils/color-sets';
import { formatLabel, escapeLabel } from '@swimlane/ngx-charts/common/label.helper';
import {
  single,
  multi,
  bubble,
  generateData,
  generateGraph,
  treemap,
  timelineFilterBarData,
  fiscalYearReport
} from './data';
import { bubbleDemoData } from './custom-charts/bubble-chart-interactive/data';
import { BubbleChartInteractiveServerDataModel } from './custom-charts/bubble-chart-interactive/models';
import { data as countries } from 'emoji-flags';
import chartGroups from './chartTypes';
import { barChart, lineChartSeries } from './combo-chart-data';
import { version } from '../../projects/swimlane/ngx-charts/package.json';
import { MultiSeries } from '@swimlane/ngx-charts/models/chart-data.model';

const monthName = new Intl.DateTimeFormat('en-us', { month: 'short' });
const weekdayName = new Intl.DateTimeFormat('en-us', { weekday: 'short' });

function multiFormat(value) {
  if (value < 1000) return `${value.toFixed(2)}ms`;
  value /= 1000;
  if (value < 60) return `${value.toFixed(2)}s`;
  value /= 60;
  if (value < 60) return `${value.toFixed(2)}mins`;
  value /= 60;
  return `${value.toFixed(2)}hrs`;
}

@Component({
  selector: 'app-root',
  providers: [Location, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../node_modules/@swimlane/ngx-ui/index.css', './app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  APP_VERSION = version;

  theme = 'dark';
  chartType: string;
  chartGroups: any[];
  chart: any;
  realTimeData: boolean = false;
  countries: any[];
  single: any[];
  multi: any[];
  fiscalYearReport: any[];
  dateData: any[];
  dateDataWithRange: any[];
  calendarData: any[];
  statusData: any[];
  sparklineData: any[];
  timelineFilterBarData: any[];
  graph: { links: any[]; nodes: any[] };
  bubble: any;
  linearScale: boolean = false;
  range: boolean = false;

  view: any[];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = false;
  noBarWhenZero = true;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;

  curves = {
    Basis: shape.curveBasis,
    'Basis Closed': shape.curveBasisClosed,
    Bundle: shape.curveBundle.beta(1),
    Cardinal: shape.curveCardinal,
    'Cardinal Closed': shape.curveCardinalClosed,
    'Catmull Rom': shape.curveCatmullRom,
    'Catmull Rom Closed': shape.curveCatmullRomClosed,
    Linear: shape.curveLinear,
    'Linear Closed': shape.curveLinearClosed,
    'Monotone X': shape.curveMonotoneX,
    'Monotone Y': shape.curveMonotoneY,
    Natural: shape.curveNatural,
    Step: shape.curveStep,
    'Step After': shape.curveStepAfter,
    'Step Before': shape.curveStepBefore,
    default: shape.curveLinear
  };

  // line interpolation
  curveType: string = 'Linear';
  curve: any = this.curves[this.curveType];
  interpolationTypes = [
    'Basis',
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];

  closedCurveType: string = 'Linear Closed';
  closedCurve: any = this.curves[this.closedCurveType];
  closedInterpolationTypes = ['Basis Closed', 'Cardinal Closed', 'Catmull Rom Closed', 'Linear Closed'];

  colorSets: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  selectedColorScheme: string;
  rangeFillOpacity: number = 0.15;

  // Override colors for certain values
  customColors: any[] = [
    {
      name: 'Germany',
      value: '#a8385d'
    }
  ];

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;

  // line, area
  autoScale = true;
  timeline = false;

  // margin
  margin: boolean = false;
  marginTop: number = 40;
  marginRight: number = 40;
  marginBottom: number = 40;
  marginLeft: number = 40;

  // gauge
  gaugeMin: number = 0;
  gaugeMax: number = 100;
  gaugeLargeSegments: number = 10;
  gaugeSmallSegments: number = 5;
  gaugeTextValue: string = '';
  gaugeUnits: string = 'alerts';
  gaugeAngleSpan: number = 240;
  gaugeStartAngle: number = -120;
  gaugeShowAxis: boolean = true;
  gaugeValue: number = 50; // linear gauge value
  gaugePreviousValue: number = 70;

  // heatmap
  heatmapMin: number = 0;
  heatmapMax: number = 50000;

  // Combo Chart
  barChart: any[] = barChart;
  lineChartSeries: any[] = lineChartSeries;
  lineChartScheme = {
    name: 'coolthree',
    selectable: true,
    group: 'Ordinal',
    domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5']
  };

  comboBarScheme = {
    name: 'singleLightBlue',
    selectable: true,
    group: 'Ordinal',
    domain: ['#01579b']
  };

  showRightYAxisLabel: boolean = true;
  yAxisLabelRight: string = 'Utilization';

  // demos
  totalSales = 0;
  salePrice = 100;
  personnelCost = 100;

  mathText = '3 - 1.5*sin(x) + cos(2*x) - 1.5*abs(cos(x))';
  mathFunction: (o: any) => any;

  treemap: any[];
  treemapPath: any[] = [];
  sumBy: string = 'Size';

  // bubble chart interactive demo
  bubbleDemoTempData: any[] = [];
  bubbleDemoChart: BubbleChartInteractiveServerDataModel;

  // Reference lines
  showRefLines: boolean = true;
  showRefLabels: boolean = true;

  // Supports any number of reference lines.
  refLines = [
    { value: 42500, name: 'Maximum' },
    { value: 37750, name: 'Average' },
    { value: 33000, name: 'Minimum' }
  ];

  // data
  plotData: any;

  // Sidebar Controls:
  colorVisible: boolean = true;
  dataVisible: boolean = true;
  dimVisible: boolean = true;
  optsVisible: boolean = true;

  // Custom double line chart
  secondaryDateData: MultiSeries = [];
  secondaryYAxisLabel = 'Temperature';
  showSecondaryYAxisLabel = true;
  showSecondaryYAxis = true;
  secondaryYScaleMin: number = null;
  secondaryYScaleMax: number = null;
  maxSecondaryYAxisTickLength = 16;
  trimSecondaryYAxisTicks = true;

  constructor(public location: Location) {
    this.mathFunction = this.getFunction();

    Object.assign(this, {
      single,
      multi,
      countries,
      chartGroups,
      colorSets,
      graph: generateGraph(50),
      bubble,
      plotData: this.generatePlotData(),
      treemap,
      bubbleDemoData,
      fiscalYearReport
    });

    // interactive drilldown demos
    this.treemapProcess();
    this.bubbleDemoChart = new BubbleChartInteractiveServerDataModel();
    this.bubbleDemoProcess(bubbleDemoData[0]);

    this.dateData = generateData(5, false);
    this.secondaryDateData = generateData(2, false, 5, true);
    this.dateDataWithRange = generateData(2, true);
    this.setColorScheme('cool');
    this.calendarData = this.getCalendarData();
    this.statusData = this.getStatusData();
    this.sparklineData = generateData(1, false, 30);
    this.timelineFilterBarData = timelineFilterBarData();
  }

  get dateDataWithOrWithoutRange() {
    if (this.range) {
      return this.dateDataWithRange;
    } else {
      return this.dateData;
    }
  }

  ngOnInit() {
    const state = this.location.path(true);
    this.selectChart(state.length ? state : 'bar-vertical');

    setInterval(this.updateData.bind(this), 1000);

    if (!this.fitContainer) {
      this.applyDimensions();
    }
  }

  updateData() {
    if (!this.realTimeData) {
      return;
    }

    this.gaugeValue = this.gaugeMin + Math.floor(Math.random() * (this.gaugeMax - this.gaugeMin));

    const country = this.countries[Math.floor(Math.random() * this.countries.length)];
    const add = Math.random() < 0.7;
    const remove = Math.random() < 0.5;

    if (remove) {
      if (this.single.length > 1) {
        const index = Math.floor(Math.random() * this.single.length);
        this.single.splice(index, 1);
        this.single = [...this.single];
      }

      if (this.multi.length > 1) {
        const index = Math.floor(Math.random() * this.multi.length);
        this.multi.splice(index, 1);
        this.multi = [...this.multi];
      }

      if (this.bubble.length > 1) {
        const index = Math.floor(Math.random() * this.bubble.length);
        this.bubble.splice(index, 1);
        this.bubble = [...this.bubble];
      }

      if (this.graph.nodes.length > 1) {
        const index = Math.floor(Math.random() * this.graph.nodes.length);
        const value = this.graph.nodes[index].value;
        this.graph.nodes.splice(index, 1);
        const nodes = [...this.graph.nodes];

        const links = this.graph.links.filter(link => {
          return (
            link.source !== value && link.source.value !== value && link.target !== value && link.target.value !== value
          );
        });
        this.graph = { links, nodes };
      }
    }

    if (add) {
      // single
      const entry = {
        name: country.name,
        value: Math.floor(10000 + Math.random() * 50000)
      };
      this.single = [...this.single, entry];

      // multi
      const multiEntry = {
        name: country.name,
        series: [
          {
            name: '1990',
            value: Math.floor(10000 + Math.random() * 50000)
          },
          {
            name: '2000',
            value: Math.floor(10000 + Math.random() * 50000)
          },
          {
            name: '2010',
            value: Math.floor(10000 + Math.random() * 50000)
          }
        ]
      };

      this.multi = [...this.multi, multiEntry];

      // graph
      const node = { value: country.name };
      const nodes = [...this.graph.nodes, node];
      const link = {
        source: country.name,
        target: nodes[Math.floor(Math.random() * (nodes.length - 1))].value
      };
      const links = [...this.graph.links, link];
      this.graph = { links, nodes };

      // bubble
      const bubbleYear = Math.floor((2010 - 1990) * Math.random() + 1990);
      const bubbleEntry = {
        name: country.name,
        series: [
          {
            name: '' + bubbleYear,
            x: new Date(bubbleYear, 0, 1),
            y: Math.floor(30 + Math.random() * 70),
            r: Math.floor(30 + Math.random() * 20)
          }
        ]
      };

      this.bubble = [...this.bubble, bubbleEntry];

      // bubble interactive demo
      const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };
      this.bubbleDemoProcess(bubbleDemoData[getRandomInt(0, bubbleDemoData.length - 1)]);

      this.statusData = this.getStatusData();

      this.timelineFilterBarData = timelineFilterBarData();
    }

    const date = new Date(Math.floor(1473700105009 + Math.random() * 1000000000));
    for (const series of this.dateData) {
      series.series.push({
        name: date,
        value: Math.floor(2000 + Math.random() * 5000)
      });
    }
    this.dateData = [...this.dateData];

    for (const series of this.secondaryDateData) {
      series.series.push({
        name: date,
        value: Math.floor(10 + Math.random() * 5)
      });
    }
    this.secondaryDateData = [...this.secondaryDateData];

    this.dateDataWithRange = generateData(2, true);

    if (this.chart.inputFormat === 'calendarData') this.calendarData = this.getCalendarData();
  }

  applyDimensions() {
    this.view = [this.width, this.height];
  }

  toggleFitContainer(event) {
    this.fitContainer = event;

    if (this.fitContainer) {
      this.view = undefined;
    } else {
      this.applyDimensions();
    }
  }

  selectChart(chartSelector) {
    this.chartType = chartSelector = chartSelector.replace('/', '');
    this.location.replaceState(this.chartType);

    for (const group of this.chartGroups) {
      this.chart = group.charts.find(x => x.selector === chartSelector);
      if (this.chart) break;
    }

    this.linearScale = false;
    this.yAxisLabel = 'GDP Per Capita';
    this.xAxisLabel = 'Country';

    this.width = 700;
    this.height = 300;

    Object.assign(this, this.chart.defaults);

    if (!this.fitContainer) {
      this.applyDimensions();
    }
  }

  select(data) {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  activate(data) {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  deactivate(data) {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getInterpolationType(curveType) {
    return this.curves[curveType] || this.curves['default'];
  }

  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  getCalendarData(): any[] {
    // today
    const now = new Date();
    const todaysDay = now.getDate();
    const thisDay = new Date(now.getFullYear(), now.getMonth(), todaysDay);

    // Monday
    const thisMonday = new Date(thisDay.getFullYear(), thisDay.getMonth(), todaysDay - thisDay.getDay() + 1);
    const thisMondayDay = thisMonday.getDate();
    const thisMondayYear = thisMonday.getFullYear();
    const thisMondayMonth = thisMonday.getMonth();

    // 52 weeks before monday
    const calendarData = [];
    const getDate = d => new Date(thisMondayYear, thisMondayMonth, d);
    for (let week = -52; week <= 0; week++) {
      const mondayDay = thisMondayDay + week * 7;
      const monday = getDate(mondayDay);

      // one week
      const series = [];
      for (let dayOfWeek = 7; dayOfWeek > 0; dayOfWeek--) {
        const date = getDate(mondayDay - 1 + dayOfWeek);

        // skip future dates
        if (date > now) {
          continue;
        }

        // value
        const value = dayOfWeek < 6 ? date.getMonth() + 1 : 0;

        series.push({
          date,
          name: weekdayName.format(date),
          value
        });
      }

      calendarData.push({
        name: monday.toString(),
        series
      });
    }

    return calendarData;
  }

  calendarAxisTickFormatting(mondayString: string) {
    const monday = new Date(mondayString);
    const month = monday.getMonth();
    const day = monday.getDate();
    const year = monday.getFullYear();
    const lastSunday = new Date(year, month, day - 1);
    const nextSunday = new Date(year, month, day + 6);
    return lastSunday.getMonth() !== nextSunday.getMonth() ? monthName.format(nextSunday) : '';
  }

  calendarTooltipText(c): string {
    return `
      <span class="tooltip-label">${c.label} • ${c.cell.date.toLocaleDateString()}</span>
      <span class="tooltip-val">${c.data.toLocaleString()}</span>
    `;
  }

  pieTooltipText({ data }) {
    const label = formatLabel(data.name);
    const val = formatLabel(data.value);

    return `
      <span class="tooltip-label">${escapeLabel(label)}</span>
      <span class="tooltip-val">$${val}</span>
    `;
  }

  dollarValueFormat(c): string {
    return `\$${c.value.toLocaleString()}`;
  }

  getStatusData() {
    const sales = Math.round(1e4 * Math.random());
    const dur = 36e5 * Math.random();
    return this.calcStatusData(sales, dur);
  }

  calcStatusData(sales = this.statusData[0].value, dur = this.statusData[2].value) {
    const ret = sales * this.salePrice;
    const cost = ((sales * dur) / 60 / 60 / 1000) * this.personnelCost;
    const ROI = (ret - cost) / cost;
    return [
      {
        name: 'Sales',
        value: sales
      },
      {
        name: 'Gross',
        value: ret,
        extra: { format: 'currency' }
      },
      {
        name: 'Avg. Time',
        value: dur,
        extra: { format: 'time' }
      },
      {
        name: 'Cost',
        value: cost,
        extra: { format: 'currency' }
      },
      {
        name: 'ROI',
        value: ROI,
        extra: { format: 'percent' }
      }
    ];
  }

  statusValueFormat(c): string {
    switch (c.data.extra ? c.data.extra.format : '') {
      case 'currency':
        return `\$${Math.round(c.value).toLocaleString()}`;
      case 'time':
        return multiFormat(c.value);
      case 'percent':
        return `${Math.round(c.value * 100)}%`;
      default:
        return c.value.toLocaleString();
    }
  }

  valueFormatting(value: number): string {
    return `${Math.round(value).toLocaleString()} €`;
  }

  currencyFormatting(value: number) {
    return `\$${Math.round(value).toLocaleString()}`;
  }

  gdpLabelFormatting(c) {
    return `${escapeLabel(c.label)}<br/><small class="number-card-label">GDP Per Capita</small>`;
  }

  statusLabelFormat(c): string {
    return `${c.label}<br/><small class="number-card-label">This week</small>`;
  }

  generatePlotData() {
    if (!this.mathFunction) {
      return [];
    }
    const twoPi = 2 * Math.PI;
    const length = 25;
    const series = Array.apply(null, { length }).map((d, i) => {
      const x = i / (length - 1);
      const t = x * twoPi;
      return {
        name: ~~(x * 360),
        value: this.mathFunction(t)
      };
    });

    return [
      {
        name: this.mathText,
        series
      }
    ];
  }

  getFunction(text = this.mathText) {
    try {
      text = `with (Math) { return ${this.mathText} }`;
      // tslint:disable-next-line: function-constructor
      const fn = new Function('x', text).bind(Math); // tslint:disable-line: tsr-detect-eval-with-expression
      return typeof fn(1) === 'number' ? fn : null;
    } catch (err) {
      return null;
    }
  }

  treemapProcess(sumBy = this.sumBy) {
    this.sumBy = sumBy;
    const children = treemap[0];
    const value = sumBy === 'Size' ? sumChildren(children) : countChildren(children);
    this.treemap = [children];
    this.treemapPath = [{ name: 'Top', children: [children], value }];

    function sumChildren(node) {
      return (node.value = node.size || d3Array.sum(node.children, sumChildren));
    }

    function countChildren(node) {
      return (node.value = node.children ? d3Array.sum(node.children, countChildren) : 1);
    }
  }

  treemapSelect(item) {
    let node;
    if (item.children) {
      const idx = this.treemapPath.indexOf(item);
      this.treemapPath.splice(idx + 1);
      this.treemap = this.treemapPath[idx].children;
      return;
    }
    node = this.treemap.find(d => d.name === item.name);
    if (node.children) {
      this.treemapPath.push(node);
      this.treemap = node.children;
    }
  }

  getFlag(country) {
    return this.countries.find(c => c.name === country).emoji;
  }

  onFilter(event) {
    console.log('timeline filter', event);
  }

  /*
  **
  Combo Chart
  **
  [yLeftAxisScaleFactor]="yLeftAxisScale" and [yRightAxisScaleFactor]="yRightAxisScale"
  exposes the left and right min and max axis values for custom scaling, it is probably best to
  scale one axis in relation to the other axis but for flexibility to scale either the left or
  right axis bowth were exposed.
  **
  */

  yLeftAxisScale(min, max) {
    return { min: `${min}`, max: `${max}` };
  }

  yRightAxisScale(min, max) {
    return { min: `${min}`, max: `${max}` };
  }

  yLeftTickFormat(data) {
    return `${data.toLocaleString()}`;
  }

  yRightTickFormat(data) {
    return `${data}%`;
  }
  /*
  **
  End of Combo Chart
  **
  */

  onSelect(event) {
    console.log(event);
  }

  dblclick(event) {
    console.log('Doube click', event);
  }

  /*
  **
  Bubble Chart Interactive Demo
  **
  */

  bubbleDemoProcess(dataFromServer) {
    this.bubbleDemoChart.setDataFromServer(dataFromServer);
    this.bubbleDemoTempData = this.bubbleDemoChart.toChart();
  }

  getBubbleInteractiveTitle() {
    return this.bubbleDemoChart.getChartTitle();
  }

  bubbleShowDrilldownResetLink() {
    return this.bubbleDemoChart.getDrilldownDepth() > 0;
  }

  onClickResetBubbleInteractiveDrill() {
    this.bubbleDemoChart.resetDrilldown();
    this.bubbleDemoTempData = this.bubbleDemoChart.toChart();
  }

  onSelectBubbleInteractivePoint(event) {
    this.bubbleDemoChart.drilldown(event);
    this.bubbleDemoTempData = this.bubbleDemoChart.toChart();
  }
}
