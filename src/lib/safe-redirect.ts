/**
 * Returns a safe redirect URL.
 *
 * @param raw - The raw redirect URL.
 * @param fallback - The fallback URL to redirect to if the raw URL is not safe.
 * @returns The safe redirect URL.
 */
export function getSafeRedirect(
  raw: string | null | undefined,
  fallback: string = "/",
): string {
  if (!raw) {
    return fallback;
  }

  // decode once; ignore decode errors
  let dest;
  try {
    dest = decodeURIComponent(raw.trim());
  } catch {
    dest = raw.trim();
  }

  // Only allow same-origin, absolute path redirects like: "/some/path?x=y#z"
  // Disallow protocol-relative ("//..."), external ("http(s)://..."),
  // backslashes, and non-absolute (like "foo" or "./bar").
  const isAbsolutePath = dest.startsWith("/");
  const isProtocolRelative = dest.startsWith("//");
  const hasBackslash = dest.includes("\\");
  const isExternal = /^https?:\/\//i.test(dest);

  if (!isAbsolutePath || isProtocolRelative || hasBackslash || isExternal) {
    return fallback;
  }
  return dest;
}
