export interface DataItem {
  name: string | number | Date;
  value: string | number | Date;
  extra?: any;
  min?: number;
  max?: number;
  label?: string;
}

export interface SingleSeries extends Array<DataItem> {}

export interface Series {
  name: string | number | Date;
  series: DataItem[];
}

export interface MultiSeries extends Array<Series> {}

export interface BubbleChartDataItem {
  name: string | number | Date;
  x: string | number | Date;
  y: string | number | Date;
  r: number;
  extra?: any;
}

export interface BubbleChartSeries {
  name: string | number | Date;
  series: BubbleChartDataItem[];
}

export interface BubbleChartMultiSeries extends Array<BubbleChartSeries> {}

export interface TreeMapDataItem {
  name: string | number | Date;
  size?: number;
  children?: TreeMapDataItem[];
  extra?: any;
}

export interface TreeMapData extends Array<TreeMapDataItem> {}

export interface NumberCardsChartDataItem {
  name: string | number | Date;
  value: number;
  extra?: any;
  label?: string;
}

export interface ICardModel {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  data: NumberCardsChartDataItem[];
  tooltipText: string;
  bandColor?: string;
  textColor?: string;
}

export interface IGridLayout {
  data: DataItem;
  x: number;
  y: number;
  width: number;
  height: number;
  percent: number;
  total: number;
}
