export type StringOrNumberOrDate = string | number | Date;

export interface DataItem {
  name: StringOrNumberOrDate;
  value: number;
  extra?: any;
  min?: number;
  max?: number;
  label?: string;
}

export interface SingleSeries extends Array<DataItem> {}

export interface Series {
  name: StringOrNumberOrDate;
  series: DataItem[];
}

export interface MultiSeries extends Array<Series> {}

export interface AreaChartDataItem extends DataItem {
  d0: number;
  d1: number;
}

export interface AreaChartSeries {
  name: StringOrNumberOrDate;
  series: AreaChartDataItem[];
}

export interface PieGridDataItem extends DataItem {
  percent: number;
  total: number;
}

export interface BubbleChartDataItem {
  name: StringOrNumberOrDate;
  x: StringOrNumberOrDate;
  y: StringOrNumberOrDate;
  r: number;
  extra?: any;
}

export interface BubbleChartSeries {
  name: StringOrNumberOrDate;
  series: BubbleChartDataItem[];
}

export interface BubbleChartMultiSeries extends Array<BubbleChartSeries> {}

export interface TreeMapDataItem {
  name: StringOrNumberOrDate;
  size?: number;
  children?: TreeMapDataItem[];
  extra?: any;
}

export interface TreeMapData extends Array<TreeMapDataItem> {}
