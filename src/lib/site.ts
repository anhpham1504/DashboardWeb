const deploymentUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://anhpham1504.github.io/DashboardWeb/"
      : "http://localhost:3000/"),
);

export const siteUrl = new URL(deploymentUrl.origin);

export function absoluteSiteUrl(path = "") {
  return new URL(path.replace(/^\//, ""), deploymentUrl).toString();
}
