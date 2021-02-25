import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';

export function getDomain(values, scaleType, autoScale, minVal?, maxVal?): number[] {
  let domain: number[] = [];
  if (scaleType === 'linear') {
    values = values.map(v => Number(v));
    if (!autoScale) {
      values.push(0);
    }
  }

  if (scaleType === 'time' || scaleType === 'linear') {
    const min = minVal || minVal === 0 ? minVal : Math.min(...values);
    const max = maxVal ? maxVal : Math.max(...values);

    domain = [min, max];
  } else {
    domain = values;
  }

  return domain;
}

export function getScale(domain, range: number[], scaleType, roundDomains): any {
  let scale: any;

  if (scaleType === 'time') {
    scale = scaleTime().range(range).domain(domain);
  } else if (scaleType === 'linear') {
    scale = scaleLinear().range(range).domain(domain);

    if (roundDomains) {
      scale = scale.nice();
    }
  } else if (scaleType === 'ordinal') {
    scale = scalePoint().range([range[0], range[1]]).domain(domain);
  }

  return scale;
}
