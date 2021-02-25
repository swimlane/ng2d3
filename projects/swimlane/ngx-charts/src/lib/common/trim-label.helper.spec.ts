import { trimLabel } from './trim-label.helper';

describe('trimLabel', () => {
  it('converts a number to a string when passed', () => {
    const num = 15;

    expect(trimLabel(num)).toEqual('15');
  });

  // hmm..not sure this is desired, but it's the currently implemented behavior
  it('returns empty string when untrimmable datatype is passed', () => {
    expect(trimLabel(() => false)).toEqual('');
  });

  it('returns empty string when passing null or undefined', () => {
    expect(trimLabel(undefined)).toEqual('');
    expect(trimLabel(null)).toEqual('');
  });

  it('returns the same string in case it is <= max length', () => {
    const text = 'Hi, try ngx-charts';

    expect(trimLabel(text, 18)).toEqual(text);
  });

  it('should trim down to 16 chars by default', () => {
    const text = 'Hi, you should check out ngx-charts, DO IT!';
    const trimmedText = trimLabel(text);

    expect(trimmedText).toEqual('Hi, you should c...');
  });

  it('should trim the passed text to the given max length', () => {
    const text = 'Hi, ngx-charts is cool!';

    const trimmedText = trimLabel(text, 8);
    expect(trimmedText).toEqual(`Hi, ngx-...`);
  });
});
