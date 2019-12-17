/**
 * Formats a label given a date, number or string.
 *
 * @export
 */
export function formatLabel(label: string | number | Date): string {
  if (label instanceof Date) {
    label = label.toLocaleDateString();
  } else {
    label = label.toLocaleString();
  }

  return label;
}

/**
 * Escapes a label.
 *
 * @export
 */
export function escapeLabel(label: any): string {
  return label.toLocaleString().replace(/[&'`"<>]/g, match => {
    return {
      '&': '&amp;',
      // tslint:disable-next-line: quotemark
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;'
    }[match];
  });
}
