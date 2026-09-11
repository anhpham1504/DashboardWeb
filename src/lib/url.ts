export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function assertSafeUrl(value: string) {
  const normalized = normalizeUrl(value);
  const parsed = new URL(normalized);
  if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.username || parsed.password) {
    throw new Error("Only http and https URLs without embedded credentials are allowed.");
  }
  return parsed.toString();
}

export function getDomain(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return value; }
}

export const softwareLogoByHostname: Record<string, string> = {
  "admin.anhemmotor.online": "/software-icons/anh-em-motor.ico",
  "myinterview.hzi.io.vn": "/software-icons/my-interview.svg",
  "v-shield.site": "/software-icons/v-shield.svg",
  "victionaryenglish.com": "/software-icons/victionary.png",
  "shbagents.site": "/software-icons/shb-agents.jpg",
  "drive.google.com": "/software-icons/google-drive.png",
};

export function getSoftwareLogo(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return softwareLogoByHostname[hostname] ?? null;
  } catch {
    return null;
  }
}

export function getFaviconUrl(value: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(getDomain(value))}&sz=128`;
}
