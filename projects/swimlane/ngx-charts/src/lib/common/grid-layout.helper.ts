import { scaleBand } from 'd3-scale';
import { ViewDimensions } from './types';
import { DataItem, SingleSeries } from '../models/chart-data.model';

export interface GridItem<Data extends GridData = GridData> {
  data: Data;
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface GridData extends DataItem {
  percent: number;
  total: number;
}

export function gridSize(dims: ViewDimensions, len: number, minWidth: number): [number, number] {
  let rows = 1;
  let cols = len;
  const width = dims.width;

  if (width > minWidth) {
    while (width / cols < minWidth) {
      rows += 1;
      cols = Math.ceil(len / rows);
    }
  }

  return [cols, rows];
}

export function gridLayout(
  dims: ViewDimensions,
  data: SingleSeries,
  minWidth: number,
  designatedTotal: number
): GridItem[] {
  const xScale: any = scaleBand<number>();
  const yScale: any = scaleBand<number>();
  const width = dims.width;
  const height = dims.height;

  const [columns, rows] = gridSize(dims, data.length, minWidth);

  const xDomain = [];
  const yDomain = [];
  for (let i = 0; i < rows; i++) {
    yDomain.push(i);
  }
  for (let i = 0; i < columns; i++) {
    xDomain.push(i);
  }
  xScale.domain(xDomain);
  yScale.domain(yDomain);

  xScale.rangeRound([0, width], 0.1);
  yScale.rangeRound([0, height], 0.1);

  const res: GridItem[] = [];
  const total = designatedTotal ? designatedTotal : getTotal(data);
  const cardWidth = xScale.bandwidth();
  const cardHeight = yScale.bandwidth();

  for (let i = 0; i < data.length; i++) {
    res[i] = {
      x: xScale(i % columns),
      y: yScale(Math.floor(i / columns)),
      width: cardWidth,
      height: cardHeight,
      data: {
        name: data[i] ? data[i].name : '',
        value: data[i] ? data[i].value : undefined,
        extra: data[i] ? data[i].extra : undefined,
        label: data[i] ? data[i].label : '',
        percent: total > 0 ? data[i].value / total : 0,
        total
      }
    };
  }
  return res;
}

function getTotal(results: SingleSeries): number {
  return results.map(d => (d ? d.value : 0)).reduce((sum, val) => sum + val, 0);
}
