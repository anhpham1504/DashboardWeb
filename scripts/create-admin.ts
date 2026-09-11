import { PrismaClient } from "@prisma/client";
import { userCreateSchema } from "../src/schemas/admin.schema";
import { hashPassword } from "../src/lib/password";
const db = new PrismaClient();
async function main() {
  const input = userCreateSchema.parse({
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL || "",
    fullName: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWORD,
    role: "ADMIN",
  });
  const passwordHash = await hashPassword(input.password);
  await db.$transaction(async (tx) => {
    await tx.adminLock.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: { version: { increment: 1 } },
    });
    if (await tx.user.count({ where: { role: "ADMIN", status: "ACTIVE" } }))
      throw new Error("An active admin already exists. Use the admin UI.");
    const user = await tx.user.create({
      data: {
        username: input.username,
        email: input.email || null,
        fullName: input.fullName,
        passwordHash,
        role: "ADMIN",
        mustChangePassword: true,
      },
    });
    await tx.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "ADMIN_BOOTSTRAP",
        entityType: "User",
        entityId: user.id,
      },
    });
  });
  console.log("First admin created. Password change required on first login.");
}
main()
  .catch(() => {
    console.error(
      "Admin creation failed: check ADMIN_USERNAME, optional ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD (8–128 characters), and existing administrator.",
    );
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
