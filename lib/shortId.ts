/** Matches: a001, a002, cs001, cs002, ex001, ex002, etc. */
const SHORT_ID_PATTERN = /^(a|cs|ex)\d+$/

/**
 * Given a URL slug segment like "a001-old-title" or "a001",
 * returns the shortId portion if it matches the pattern, otherwise null.
 */
export function extractShortId(segment: string): string | null {
  const firstDash = segment.indexOf('-')
  const candidate = firstDash === -1 ? segment : segment.slice(0, firstDash)
  return SHORT_ID_PATTERN.test(candidate) ? candidate : null
}

/**
 * Constructs the canonical URL segment from shortId + slug.current.
 */
export function buildCanonicalSegment(shortId: string, slugCurrent: string): string {
  return `${shortId}-${slugCurrent}`
}
