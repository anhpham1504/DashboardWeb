export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function assertSafeUrl(value: string) {
  const normalized = normalizeUrl(value);
  const parsed = new URL(normalized);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("Only http and https URLs are allowed.");
  return parsed.toString();
}

export function getDomain(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return value; }
}

export function getFaviconUrl(value: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(getDomain(value))}&sz=128`;
}
