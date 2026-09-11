import "server-only";

import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http-error";

function boundedInteger(value: string | undefined, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

export const loginPolicy = {
  windowMinutes: boundedInteger(process.env.LOGIN_WINDOW_MINUTES, 15, 1, 60),
  ipLimit: boundedInteger(process.env.LOGIN_IP_LIMIT, 50, 5, 500),
  accountLimit: boundedInteger(process.env.LOGIN_ACCOUNT_LIMIT, 10, 3, 100),
  lockThreshold: boundedInteger(process.env.LOGIN_LOCK_THRESHOLD, 5, 3, 20),
  lockMinutes: boundedInteger(process.env.LOGIN_LOCK_MINUTES, 15, 1, 1_440),
};

export function rateLimitKey(scope: "ip" | "account" | "password-ip" | "password-account", value: string) {
  return createHash("sha256").update(`${scope}:${value}`).digest("hex");
}

async function consumeLimits(limits: Array<{ key: string; maximum: number }>) {
  for (const limit of limits) {
    const expiresAt = new Date(Date.now() + loginPolicy.windowMinutes * 60_000);
    const hits = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO RateLimit (\`key\`, count, expiresAt)
        VALUES (${limit.key}, 1, ${expiresAt})
        ON DUPLICATE KEY UPDATE
          count = IF(expiresAt <= UTC_TIMESTAMP(3), 1, LEAST(count + 1, 1000000)),
          expiresAt = IF(expiresAt <= UTC_TIMESTAMP(3), VALUES(expiresAt), expiresAt)
      `;
      return tx.rateLimit.findUniqueOrThrow({ where: { key: limit.key } });
    });
    if (hits.count > limit.maximum) {
      throw new HttpError(429, "RATE_LIMIT", "Quá nhiều lần thử. Vui lòng thử lại sau.");
    }
  }
}

export async function consumeLoginLimits(address: string, username: string) {
  return consumeLimits([
    { key: rateLimitKey("ip", address), maximum: loginPolicy.ipLimit },
    { key: rateLimitKey("account", username), maximum: loginPolicy.accountLimit },
  ]);
}

export async function consumePasswordChangeLimits(address: string, userId: string) {
  return consumeLimits([
    { key: rateLimitKey("password-ip", address), maximum: loginPolicy.ipLimit },
    { key: rateLimitKey("password-account", userId), maximum: loginPolicy.accountLimit },
  ]);
}
