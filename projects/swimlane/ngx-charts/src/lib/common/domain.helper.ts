import { ScaleType } from '../enums/scale.enum';

/**
 * Based on the data, return an array with unique values.
 *
 * @export
 * @returns array
 */
export function getUniqueXDomainValues(results: any[]): any[] {
  const valueSet = new Set();
  for (const result of results) {
    for (const d of result.series) {
      valueSet.add(d.name);
    }
  }
  return Array.from(valueSet);
}

/**
 * Get the scaleType of enumerable of values.
 * @returns  'time', 'linear' or 'ordinal'
 */
export function getScaleType(values: any[], checkDateType = true): string {
  if (checkDateType) {
    const allDates = values.every(value => value instanceof Date);
    if (allDates) {
      return ScaleType.time;
    }
  }

  const allNumbers = values.every(value => typeof value === 'number');
  if (allNumbers) {
    return ScaleType.linear;
  }

  return ScaleType.ordinal;
}
