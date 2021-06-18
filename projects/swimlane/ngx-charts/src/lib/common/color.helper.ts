import { range } from 'd3-array';
import {
  scaleBand,
  ScaleLinear,
  scaleLinear,
  ScaleOrdinal,
  scaleOrdinal,
  ScaleQuantile,
  scaleQuantile
} from 'd3-scale';

import { colorSets } from '../utils/color-sets';
import { Gradient, ScaleType } from './types';
import { StringOrNumberOrDate } from '../models/chart-data.model';

export class ColorHelper {
  scale: any;
  scaleType: ScaleType;
  colorDomain: string[];
  domain: number[] | string[];
  customColors: any;

  constructor(scheme: any, type: ScaleType, domain: number[] | string[], customColors?) {
    if (typeof scheme === 'string') {
      scheme = colorSets.find(cs => {
        return cs.name === scheme;
      });
    }
    this.colorDomain = scheme.domain;
    this.scaleType = type;
    this.domain = domain;
    this.customColors = customColors;

    this.scale = this.generateColorScheme(scheme, type, this.domain);
  }

  generateColorScheme(scheme: any, type: ScaleType, domain: number[] | string[]): any {
    if (typeof scheme === 'string') {
      scheme = colorSets.find(cs => {
        return cs.name === scheme;
      });
    }

    let colorScale: ScaleQuantile<number> | ScaleOrdinal<string, unknown> | ScaleLinear<number, number>;
    switch (type) {
      case ScaleType.Quantile:
        colorScale = scaleQuantile()
          .range(scheme.domain)
          .domain(domain as number[]);
        break;
      case ScaleType.Ordinal:
        colorScale = scaleOrdinal()
          .range(scheme.domain)
          .domain(domain as string[]);
        break;
      case ScaleType.Linear:
        {
          const colorDomain = [...scheme.domain];
          if (colorDomain.length === 1) {
            colorDomain.push(colorDomain[0]);
            this.colorDomain = colorDomain;
          }

          const points = range(0, 1, 1.0 / colorDomain.length);
          colorScale = scaleLinear().range(colorDomain).domain(points);
        }
        break;
      default:
        break;
    }

    return colorScale;
  }

  getColor(value: StringOrNumberOrDate): string {
    if (value === undefined || value === null) {
      throw new Error('Value can not be null');
    }
    if (this.scaleType === ScaleType.Linear) {
      const valueScale = scaleLinear()
        .domain(this.domain as number[])
        .range([0, 1]);

      return this.scale(valueScale(value as number));
    } else {
      if (typeof this.customColors === 'function') {
        return this.customColors(value);
      }

      const formattedValue = value.toString();
      let found: any; // todo type customColors
      if (this.customColors && this.customColors.length > 0) {
        found = this.customColors.find(mapping => {
          return mapping.name.toLowerCase() === formattedValue.toLowerCase();
        });
      }

      if (found) {
        return found.value;
      } else {
        return this.scale(value);
      }
    }
  }

  getLinearGradientStops(value: number | string, start?: number | string): Gradient[] {
    if (start === undefined) {
      start = this.domain[0];
    }
    const valueScale = scaleLinear().domain(this.domain as number[]).range([0, 1]);

    const colorValueScale = scaleBand().domain(this.colorDomain).range([0, 1]);

    const endColor = this.getColor(value);

    // generate the stops
    const startVal = valueScale(start as number);
    const startColor = this.getColor(start);

    const endVal = valueScale(value as number);
    let i = 1;
    let currentVal = startVal;
    const stops: Gradient[] = [];

    stops.push({
      color: startColor,
      offset: startVal,
      originalOffset: startVal,
      opacity: 1
    });

    while (currentVal < endVal && i < this.colorDomain.length) {
      const color = this.colorDomain[i];
      const offset = colorValueScale(color);
      if (offset <= startVal) {
        i++;
        continue;
      }

      if (offset.toFixed(4) >= (endVal - colorValueScale.bandwidth()).toFixed(4)) {
        break;
      }

      stops.push({
        color,
        offset,
        opacity: 1
      });
      currentVal = offset;
      i++;
    }

    if (stops[stops.length - 1].offset < 100) {
      stops.push({
        color: endColor,
        offset: endVal,
        opacity: 1
      });
    }

    if (endVal === startVal) {
      stops[0].offset = 0;
      stops[1].offset = 100;
    } else {
      // normalize the offsets into percentages
      if (stops[stops.length - 1].offset !== 100) {
        for (const s of stops) {
          s.offset = ((s.offset - startVal) / (endVal - startVal)) * 100;
        }
      }
    }

    return stops;
  }
}
