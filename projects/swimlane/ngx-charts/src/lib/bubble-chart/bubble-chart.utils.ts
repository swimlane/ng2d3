import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';
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
    const min = minVal ?? Math.min(...values);
    const max = maxVal ?? Math.max(...values);

    domain = [min, max];
  } else {
    domain = values;
  }

  return domain;
}

export function getScale(domain: number[], range: number[], scaleType: ScaleType, roundDomains: boolean): any {
  let scale: any;

  if (scaleType === ScaleType.Time) {
    scale = scaleTime().range(range).domain(domain);
  } else if (scaleType === ScaleType.Linear) {
    scale = scaleLinear().range(range).domain(domain);

    if (roundDomains) {
      scale = scale.nice();
    }
  } else if (scaleType === ScaleType.Ordinal) {
    scale = scalePoint().range([range[0], range[1]]).domain(domain);
  }

  return scale;
}
