import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import { assertIsolatedTestDatabase } from "./test-database";

const prisma = new PrismaClient();

async function main() {
  assertIsolatedTestDatabase();
  if (await prisma.website.count({ where: { isFeatured: true, isVisible: true } }) < 5) {
    throw new Error("Import the SQLite showcase into the test database before running E2E tests.");
  }

  const credentials = {
    admin: { username: `e2e-admin-${randomUUID().slice(0, 8)}`, password: `Adm-${randomUUID()}!` },
    user: { username: `e2e-user-${randomUUID().slice(0, 8)}`, password: `Usr-${randomUUID()}!` },
  };
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.rateLimit.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: [
    { username: credentials.admin.username, fullName: "E2E Admin", passwordHash: await hashPassword(credentials.admin.password), role: "ADMIN", mustChangePassword: false },
    { username: credentials.user.username, fullName: "E2E User", passwordHash: await hashPassword(credentials.user.password), role: "USER", mustChangePassword: false },
  ] });
  const outputDirectory = join(process.cwd(), "artifacts");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, "e2e-credentials.json"), JSON.stringify(credentials), { encoding: "utf8", mode: 0o600 });
  console.log("E2E test accounts prepared in the isolated database.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unable to prepare E2E data.");
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
