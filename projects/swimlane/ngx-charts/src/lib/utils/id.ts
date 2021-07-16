// js uses only double-precision arithmetic, and truncation
// (e.g. operator '~~') is not reliable above 2^31-1 as it
// treats the number as signed, while a Linear Congruential
// Generator works on unsigned arithmetic. A double has a
// mantissa of 52 bits, so we need to stay in the interval
// [0, 2^52) if we don't want to loose precision.
const m = 2 ** 21;
const a = 214013;
const c = 2531011;

// The choice of these parameters reflects this thought.
// During computation, the maximum state value is (m - 1):
// for this reason, the highest value we are computing is
// (m - 1) * a + c.
// In this case, 448820107974 < 2^39.
let x = +(new Date());

function lcg_next(): number {
  // Max value here is
  // (m - 1) * a + c
  x = (a * x + c) % m;
  return x;
}

const MAX_ID = 36 ** 4;

/**
 * Generates a short id.
 *
 * Description:
 *   A 4-character alphanumeric sequence (36^4 = 1.6 million)
 *   This should only be used for JavaScript specific models.
 *   https://en.wikipedia.org/wiki/Linear_congruential_generator
 * 
 *   The random 4-character string is prefixed with an 'a'.
 * 
 *   Example: `aebgf`
 */
export function id(): string {
  // lcg_next outputs a 21-bit result, giving us a 4-5 character id
  // (since 2^21 is slightly higher than 36^4).
  // Given that we don't want ids with 5 character, if we don't want
  // duplicates in the rage, we must discard values above 36^4.
  let newId: number;
  do {
    newId = lcg_next();
  } while (newId >= MAX_ID);

  // append a 'a' because neo gets mad
  let id = ('0000' + newId.toString(36)).slice(-4);
  return `a${id}`;
}
