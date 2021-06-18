import { ScaleLinear, scaleLinear, ScalePoint, scalePoint, ScaleTime, scaleTime } from 'd3-scale';
import { ScaleType } from '../common/types';

export function getDomain(
  values: any[],
  scaleType: ScaleType,
  autoScale: boolean,
  minVal?: number,
  maxVal?: number
): number[] {
  let domain: number[] = [];
  if (scaleType === ScaleType.Linear) {
    values = values.map(v => Number(v));
    if (!autoScale) {
      values.push(0);
    }
  }

  if (scaleType === ScaleType.Time || scaleType === ScaleType.Linear) {
    const min = minVal ? minVal : Math.min(...values);
    const max = maxVal ? maxVal : Math.max(...values);

    domain = [min, max];
  } else {
    domain = values;
  }

  return domain;
}

export function getScale(
  domain: number[],
  range: number[],
  scaleType: ScaleType,
  roundDomains: boolean
): ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string> {
  switch (scaleType) {
    case ScaleType.Time:
      return scaleTime().range(range).domain(domain);
    case ScaleType.Linear: {
      const scale = scaleLinear().range(range).domain(domain);
      if (roundDomains) {
        return scale.nice();
      }
      return scale;
    }
    case ScaleType.Ordinal:
      return scalePoint()
        .range([range[0], range[1]])
        .domain(domain.map(r => r.toString()));
    default:
      return undefined;
  }
}
