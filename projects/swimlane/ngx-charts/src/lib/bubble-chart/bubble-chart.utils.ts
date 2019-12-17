import { scaleLinear, scalePoint, scaleTime, ScaleTime, ScaleLinear, ScalePoint } from 'd3-scale';
import { ScaleType } from '../enums/scale.enum';

export function getBubbleDomain(
  values: any[],
  scaleType: string,
  autoScale: boolean,
  minVal?: number,
  maxVal?: number
): number[] {
  let domain: number[] = [];
  if (scaleType === ScaleType.linear) {
    values = values.map(v => Number(v));
    if (!autoScale) {
      values.push(0);
    }
  }

  if (scaleType === ScaleType.time || scaleType === ScaleType.linear) {
    const min = minVal ? minVal : Math.min(...values);
    const max = maxVal ? maxVal : Math.max(...values);

    domain = [min, max];
  } else {
    domain = values;
  }

  return domain;
}

export function getBubbleScale(
  domain,
  range: number[],
  scaleType: string,
  roundDomains: boolean
): ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string> {
  let scale: ScaleTime<number, number> | ScaleLinear<number, number> | ScalePoint<string>;

  switch (scaleType) {
    case ScaleType.linear:
      scale = scaleLinear()
        .range(range)
        .domain(domain);
      if (roundDomains) {
        scale = scale.nice();
      }
      break;
    case ScaleType.ordinal:
      scale = scalePoint()
        .range([range[0], range[1]])
        .domain(domain);
      break;
    case ScaleType.time:
      scale = scaleTime()
        .range(range)
        .domain(domain);
      break;
    default:
      // Do nothing by default. Should we throw an error message here?
      break;
  }
  return scale;
}
