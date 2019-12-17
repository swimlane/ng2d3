import { scaleBand, ScaleBand } from 'd3-scale';
import { IViewDimensions } from './view-dimensions.helper';
import { NumberCardsChartDataItem, IGridLayout } from '../models/chart-data.model';

export function gridSize(dims: IViewDimensions, len: number, minWidth: number) {
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
  dims: IViewDimensions,
  data: NumberCardsChartDataItem[],
  minWidth: number,
  designatedTotal: number
): IGridLayout[] {
  const xScale: ScaleBand<number> = scaleBand<number>();
  const yScale: ScaleBand<number> = scaleBand<number>();
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

  // v4’s .rangeRound() and .padding() replaced v3’s rangeRoundBands().
  xScale.rangeRound([0, width]);
  xScale.padding(0.1);
  yScale.rangeRound([0, height]);
  yScale.padding(0.1);

  const res: IGridLayout[] = [];
  const total = designatedTotal ? designatedTotal : getTotal(data);
  const cardWidth = xScale.bandwidth();
  const cardHeight = yScale.bandwidth();

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    res.push({
      data: {
        name: item && item.name ? item.name : '',
        value: item && item.value ? item.value : undefined,
        extra: item && item.extra ? item.extra : undefined,
        label: item && item.label ? item.label : ''
      },
      x: xScale(i % columns),
      y: yScale(Math.floor(i / columns)),
      width: cardWidth,
      height: cardHeight,
      percent: total > 0 ? item.value / total : 0,
      total: total ? total : 0
    });
  }
  return res;
}

function getTotal(results: NumberCardsChartDataItem[]): number {
  return results.map(d => (d ? d.value : 0)).reduce((sum, val) => sum + val, 0);
}
