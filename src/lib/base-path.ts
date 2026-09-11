const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const basePath = configuredBasePath.replace(/\/$/, "");

export function assetPath(path: string) {
  if (/^(?:https?:|data:|blob:)/.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
