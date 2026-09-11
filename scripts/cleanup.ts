import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  await db.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
    },
  });
  await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  console.log("Expired sessions and rate limits cleaned.");
}
main().finally(() => db.$disconnect());
