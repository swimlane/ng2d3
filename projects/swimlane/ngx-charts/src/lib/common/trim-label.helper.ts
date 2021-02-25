export function trimLabel(text: any, max = 16): string {
  let newString = '';
  switch (typeof text) {
    case 'string':
      newString = text;
      break;
    case 'number':
      newString = text.toString();
      break;
    default:
      newString = '';
      break;
  }

  newString = newString.trim();
  if (newString.length <= max) {
    return newString;
  } else {
    return `${newString.slice(0, max)}...`;
  }
}
