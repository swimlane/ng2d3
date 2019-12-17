import { range } from 'd3-array';
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleQuantile,
  ScaleQuantile,
  ScaleOrdinal,
  ScaleLinear
} from 'd3-scale';

import { colorSets } from '../utils/color-sets';
import { ScaleType } from '../enums/scale.enum';

export interface IColorSet {
  name: string;
  group: string;
  domain: string[];
  selectable?: boolean;
}

export interface ICustomColor {
  name: string | number | Date;
  value: string;
}

export class ColorHelper {
  scale: ScaleQuantile<string> | ScaleOrdinal<string | number, string> | ScaleLinear<string, string>;
  scaleType: string;
  colorDomain: string[];
  domain: Array<string | number>;
  customColors: ICustomColor[] | ((val) => string);

  constructor(
    scheme: string | IColorSet,
    type: string,
    domain: Array<string | number>,
    customColors?: ICustomColor[] | ((val) => string)
  ) {
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

  generateColorScheme(scheme: string | IColorSet, type: string, domain: Array<string | number>) {
    if (typeof scheme === 'string') {
      scheme = colorSets.find(cs => {
        return cs.name === scheme;
      });
    }
    let colorScale: ScaleQuantile<string> | ScaleOrdinal<string | number, string> | ScaleLinear<string, string>;
    switch (type) {
      case ScaleType.quantile:
        // Please refer to: https://github.com/tomwanzek/d3-v4-definitelytyped/issues/134
        colorScale = scaleQuantile<string>()
          .range(scheme.domain)
          .domain(domain as any);
        break;
      case ScaleType.ordinal:
        colorScale = scaleOrdinal<string | number, string>()
          .range(scheme.domain)
          .domain(domain);
        break;
      case ScaleType.linear:
        // linear schemes must have at least 2 colors
        const colorDomain = [...scheme.domain];
        if (colorDomain.length === 1) {
          colorDomain.push(colorDomain[0]);
          this.colorDomain = colorDomain;
        }

        const points = range(0, 1, 1.0 / colorDomain.length);
        colorScale = scaleLinear<string, string>()
          .domain(points)
          .range(colorDomain);
        break;
      default:
        // Do nothing.
        break;
    }

    return colorScale;
  }

  getColor(value: string | number | Date): string {
    if (value === undefined || value === null) {
      throw new Error('Value can not be null');
    }
    switch (this.scaleType) {
      case ScaleType.linear:
        const valueScale = scaleLinear<number, number>()
          .domain(this.domain as any)
          .range([0, 1]);
        return this.scale(valueScale(Number(value)));
      default:
        if (typeof this.customColors === 'function') {
          return this.customColors(value);
        }
        const formattedValue = value.toString();
        let found: ICustomColor; // todo type customColors
        if (this.customColors && this.customColors.length > 0) {
          found = this.customColors.find(mapping => {
            return mapping.name.toString().toLowerCase() === formattedValue.toLowerCase();
          });
        }

        if (found) {
          return found.value;
        } else {
          return this.scale(value as any);
        }
    }
  }

  getLinearGradientStops(value: string | number, start: string | number) {
    if (start === undefined) {
      start = this.domain[0];
    }

    const valueScale = scaleLinear()
      .domain(this.domain as any)
      .range([0, 1]);

    const colorValueScale = scaleBand()
      .domain(this.colorDomain)
      .range([0, 1]);

    const endColor = this.getColor(value);

    // generate the stops
    const startVal = valueScale(Number(start).valueOf());
    const startColor = this.getColor(start);

    const endVal = valueScale(Number(value).valueOf());
    let i = 1;
    let currentVal = startVal;
    const stops = [];

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
