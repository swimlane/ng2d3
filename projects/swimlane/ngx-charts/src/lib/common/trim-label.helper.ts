export function trimLabel(s: any, max: number = 16): string {
  if (typeof s !== 'string') {
    if (typeof s === 'number') {
      return s + '';
    } else {
      return '';
    }
  }

  s = s.trim();
  if (s.length <= max) {
    return s;
  } else {
    return `${s.slice(0, max)}...`;
  }
}

export function chunkLabel(s, max = 16) {
  return s.split(/(\s+)/).reduce((output, item) => {
    const last = output.pop() || '';
    return last.length + item.length > max ? [...output, last.trim(), item.trim()] : [...output, last + item];
  }, []);
}
