export function assertIsolatedTestDatabase(rawUrl = process.env.DATABASE_URL) {
  if (!rawUrl) throw new Error("DATABASE_URL is required for destructive test setup.");

  let databaseUrl: URL;
  try {
    databaseUrl = new URL(rawUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid MySQL URL.");
  }

  const databaseName = decodeURIComponent(databaseUrl.pathname.replace(/^\//, ""));
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(databaseUrl.hostname);
  if (
    databaseUrl.protocol !== "mysql:" ||
    !isLocalHost ||
    !/^fpt_dashboard_test_[a-z0-9_]+$/i.test(databaseName)
  ) {
    throw new Error(
      "Tests that clear data require a local MySQL database named fpt_dashboard_test_<suffix>.",
    );
  }
  return databaseName;
}
