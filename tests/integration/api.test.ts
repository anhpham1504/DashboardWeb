import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { hashPassword } from "../../src/lib/password";
import { assertIsolatedTestDatabase } from "../../scripts/test-database";

const port = 3201;
const origin = `http://127.0.0.1:${port}`;
const prisma = new PrismaClient();
const adminPassword = `Adm-${randomUUID()}!`;
const userPassword = `Usr-${randomUUID()}!`;
const lockPassword = `Lck-${randomUUID()}!`;
let server: ChildProcess | undefined;
let serverOutput = "";

type ApiResult<T = unknown> = { status: number; body: { success: boolean; data?: T; error?: { code: string; message: string } }; cookie?: string; setCookie?: string };

async function api<T = unknown>(path: string, options: { method?: string; body?: unknown; cookie?: string; origin?: string | null; form?: FormData } = {}): Promise<ApiResult<T>> {
  const headers = new Headers();
  if (options.cookie) headers.set("cookie", options.cookie);
  if (options.origin !== null) headers.set("origin", options.origin ?? origin);
  if (!options.form) headers.set("content-type", "application/json");
  const response = await fetch(`${origin}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.form ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
    redirect: "manual",
  });
  const setCookie = response.headers.get("set-cookie") ?? undefined;
  const text = await response.text();
  const body = text ? JSON.parse(text) : { success: response.ok };
  return { status: response.status, body, setCookie, cookie: setCookie?.split(";", 1)[0] };
}

async function login(username: string, password: string) {
  return api<{ redirect: string }>("/api/auth/login", { method: "POST", body: { username, password } });
}

before(async () => {
  assertIsolatedTestDatabase();
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.rateLimit.deleteMany();
  await prisma.website.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminLock.upsert({ where: { id: 1 }, create: { id: 1 }, update: { version: { increment: 1 } } });
  await prisma.user.createMany({ data: [
    { username: "admin", fullName: "Quản trị kiểm thử", passwordHash: await hashPassword(adminPassword), role: "ADMIN", mustChangePassword: false },
    { username: "student", fullName: "Người dùng kiểm thử", passwordHash: await hashPassword(userPassword), role: "USER", mustChangePassword: false },
    { username: "lock-target", fullName: "Tài khoản khóa", passwordHash: await hashPassword(lockPassword), role: "USER", mustChangePassword: false },
  ] });

  const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, APP_ORIGINS: origin, NEXT_PUBLIC_SITE_URL: origin, LOGIN_ACCOUNT_LIMIT: "4", LOGIN_LOCK_THRESHOLD: "3", STORAGE_DRIVER: "local" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout?.on("data", (chunk) => { serverOutput = `${serverOutput}${chunk}`.slice(-8_000); });
  server.stderr?.on("data", (chunk) => { serverOutput = `${serverOutput}${chunk}`.slice(-8_000); });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next server stopped early.\n${serverOutput}`);
    try { if ((await fetch(`${origin}/robots.txt`)).ok) return; } catch { /* server is starting */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for Next server.\n${serverOutput}`);
});

after(async () => {
  server?.kill();
  await prisma.$disconnect();
});

test("khách bị chặn và CSRF từ origin sai bị từ chối", async () => {
  const headers = await fetch(`${origin}/robots.txt`);
  assert.equal(headers.headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.headers.get("x-frame-options"), "DENY");
  assert.match(headers.headers.get("content-security-policy") ?? "", /object-src 'none'/);
  for (const path of ["dashboard", "websites", "categories", "users", "audit"]) {
    assert.equal((await api(`/api/admin/${path}`)).status, 401);
  }
  const guestUpload = new FormData();
  guestUpload.set("kind", "logo");
  guestUpload.set("file", new File(["x"], "x.txt", { type: "text/plain" }));
  assert.equal((await api("/api/admin/upload", { method: "POST", form: guestUpload })).status, 401);
  assert.equal((await api("/api/auth/login", { method: "POST", origin: "https://evil.example", body: { username: "admin", password: adminPassword } })).status, 403);
  assert.equal((await api("/api/auth/login", { method: "POST", origin: null, body: { username: "admin", password: adminPassword } })).status, 403);
});

test("đăng nhập sai gây lockout và rate limit dùng storage chung", async () => {
  for (let attempt = 0; attempt < 3; attempt += 1) assert.equal((await login("lock-target", "wrong-password")).status, 401);
  const lockedAt = (await prisma.user.findUniqueOrThrow({ where: { username: "lock-target" } })).lockedUntil;
  assert.equal((await login("lock-target", lockPassword)).status, 401);
  const stillLockedAt = (await prisma.user.findUniqueOrThrow({ where: { username: "lock-target" } })).lockedUntil;
  assert.equal(stillLockedAt?.getTime(), lockedAt?.getTime(), "attempts during lockout must not extend the lock indefinitely");
  for (let attempt = 0; attempt < 4; attempt += 1) assert.equal((await login("unknown-account", "wrong-password")).status, 401);
  const limited = await login("unknown-account", "wrong-password");
  assert.equal(limited.status, 429);
  assert.equal(limited.body.error?.code, "RATE_LIMIT");
});

test("USER nhận 403 còn ADMIN đọc dashboard thật", async () => {
  const userLogin = await login("student", userPassword);
  assert.equal(userLogin.status, 200);
  for (const path of ["dashboard", "websites", "categories", "users", "audit"]) {
    assert.equal((await api(`/api/admin/${path}`, { cookie: userLogin.cookie })).status, 403);
  }

  const adminLogin = await login("admin", adminPassword);
  assert.equal(adminLogin.status, 200);
  assert.match(adminLogin.setCookie ?? "", /HttpOnly/i);
  assert.match(adminLogin.setCookie ?? "", /SameSite=Lax/i);
  const dashboard = await api<{ websites: number; visible: number; categories: number; users: number }>("/api/admin/dashboard", { cookie: adminLogin.cookie });
  assert.equal(dashboard.status, 200);
  assert.equal(dashboard.body.data?.users, 3);
  const storedSession = await prisma.session.findFirstOrThrow({ where: { user: { username: "admin" }, revokedAt: null } });
  assert.notEqual(adminLogin.cookie?.split("=")[1], storedSession.tokenHash);
});

test("bảo vệ admin cuối cùng và CRUD website, danh mục, tài khoản", async () => {
  const session = await login("admin", adminPassword);
  const cookie = session.cookie;
  const admin = await prisma.user.findUniqueOrThrow({ where: { username: "admin" } });
  const lastAdmin = await api(`/api/admin/users/${admin.id}`, { method: "PUT", cookie, body: { username: "admin", email: "", fullName: admin.fullName, role: "USER", status: "ACTIVE" } });
  assert.equal(lastAdmin.status, 409);
  assert.equal(lastAdmin.body.error?.code, "LAST_ADMIN");

  const category = await api<{ id: string }>("/api/admin/categories", { method: "POST", cookie, body: { name: "Kiểm thử", slug: "kiem-thu", description: "Danh mục kiểm thử", displayOrder: 99, isVisible: true } });
  assert.equal(category.status, 201);
  const categoryId = category.body.data!.id;
  const websiteInput = { name: "Website kiểm thử", slug: "website-kiem-thu", url: "https://example.com/demo", shortDescription: "Mô tả ngắn", description: "<script>globalThis.pwned=true</script>", logoUrl: "", posterUrl: "", categoryId, keywords: "demo, test", displayOrder: 99, isFeatured: false, isVisible: true };
  const website = await api<{ id: string }>("/api/admin/websites", { method: "POST", cookie, body: websiteInput });
  assert.equal(website.status, 201);
  const websiteId = website.body.data!.id;
  assert.equal((await api("/api/admin/categories/" + categoryId, { method: "DELETE", cookie })).status, 409);
  assert.equal(await prisma.category.count({ where: { id: categoryId } }), 1);
  assert.equal((await api("/api/admin/websites", { method: "POST", cookie, body: websiteInput })).status, 409);

  const publicList = await api<Array<{ id: string; description: string }>>("/api/websites?search=Website%20ki%E1%BB%83m%20th%E1%BB%AD");
  assert.equal(publicList.status, 200);
  assert.equal(publicList.body.data?.[0]?.id, websiteId);
  assert.match(publicList.body.data?.[0]?.description ?? "", /<script>/);

  const badUrl = await api("/api/admin/websites", { method: "POST", cookie, body: { ...websiteInput, slug: "bad-url", url: "javascript:alert(1)" } });
  assert.equal(badUrl.status, 400);
  const massAssignment = await api("/api/admin/websites", { method: "POST", cookie, body: { ...websiteInput, slug: "forced-id", id: "forced" } });
  assert.equal(massAssignment.status, 400);
  const injection = await api("/api/admin/websites?search=%27%20OR%201%3D1--", { cookie });
  assert.equal(injection.status, 200);

  const hiddenWebsite = await api<{ isVisible: boolean; sortOrder: number }>(`/api/admin/websites/${websiteId}`, {
    method: "PUT",
    cookie,
    body: { ...websiteInput, shortDescription: "Đã cập nhật", displayOrder: 17, isVisible: false },
  });
  assert.equal(hiddenWebsite.status, 200);
  assert.deepEqual({ isVisible: hiddenWebsite.body.data?.isVisible, sortOrder: hiddenWebsite.body.data?.sortOrder }, { isVisible: false, sortOrder: 17 });
  assert.equal((await api(`/api/websites/${websiteId}`)).status, 404);
  assert.equal((await api(`/api/admin/websites/${websiteId}`, { method: "PUT", cookie, body: { ...websiteInput, displayOrder: 18, isVisible: true } })).status, 200);

  assert.equal((await api(`/api/admin/categories/${categoryId}`, {
    method: "PUT",
    cookie,
    body: { name: "Kiểm thử cập nhật", slug: "kiem-thu-cap-nhat", description: "Danh mục đã cập nhật", displayOrder: 98, isVisible: true },
  })).status, 200);

  const managedUser = await api<{ id: string }>("/api/admin/users", { method: "POST", cookie, body: { username: "managed-user", email: "managed@example.test", fullName: "Tài khoản quản lý", password: userPassword, role: "USER", status: "ACTIVE" } });
  assert.equal(managedUser.status, 201);
  const managedId = managedUser.body.data!.id;
  assert.equal((await api(`/api/admin/users/${managedId}`, { method: "PUT", cookie, body: { username: "managed-user", email: "managed@example.test", fullName: "Tài khoản quản lý", role: "ADMIN", status: "LOCKED" } })).status, 200);
  const unlocked = await api<{ role: string; status: string }>(`/api/admin/users/${managedId}`, { method: "PUT", cookie, body: { username: "managed-user", email: "managed@example.test", fullName: "Tài khoản quản lý", role: "USER", status: "ACTIVE" } });
  assert.equal(unlocked.status, 200);
  assert.deepEqual({ role: unlocked.body.data?.role, status: unlocked.body.data?.status }, { role: "USER", status: "ACTIVE" });
  assert.equal((await api(`/api/admin/users/${managedId}`, { method: "PATCH", cookie, body: { password: `Reset-${randomUUID()}!` } })).status, 200);

  assert.equal((await api(`/api/admin/websites/${websiteId}`, { method: "DELETE", cookie })).status, 200);
  assert.equal((await api(`/api/admin/categories/${categoryId}`, { method: "DELETE", cookie })).status, 200);

  const responses = [category, website, managedUser];
  assert.equal(JSON.stringify(responses).includes("passwordHash"), false);
  assert.equal(JSON.stringify(responses).includes("tokenHash"), false);
  const logs = await prisma.auditLog.findMany();
  const serializedLogs = JSON.stringify(logs);
  assert.equal(serializedLogs.includes(adminPassword), false);
  assert.equal(serializedLogs.includes(userPassword), false);
  assert.equal(serializedLogs.includes("passwordHash"), false);
});

test("upload từ chối sai loại và nhận PNG hợp lệ khi storage local bật", async () => {
  const session = await login("admin", adminPassword);
  const userSession = await login("student", userPassword);
  const invalid = new FormData();
  invalid.set("kind", "poster");
  invalid.set("file", new File(["not-an-image"], "payload.txt", { type: "text/plain" }));
  assert.equal((await api("/api/admin/upload", { method: "POST", cookie: session.cookie, form: invalid })).status, 400);

  const userUpload = new FormData();
  userUpload.set("kind", "logo");
  userUpload.set("file", new File(["not-an-image"], "fake.png", { type: "image/png" }));
  assert.equal((await api("/api/admin/upload", { method: "POST", cookie: userSession.cookie, form: userUpload })).status, 403);

  const spoofed = new FormData();
  spoofed.set("kind", "logo");
  spoofed.set("file", new File(["not-an-image"], "fake.png", { type: "image/png" }));
  assert.equal((await api("/api/admin/upload", { method: "POST", cookie: session.cookie, form: spoofed })).status, 400);

  const png = await sharp({ create: { width: 2, height: 2, channels: 4, background: "#ff6b00" } }).png().toBuffer();
  const valid = new FormData();
  valid.set("kind", "logo");
  valid.set("file", new File([png], "logo.png", { type: "image/png" }));
  const uploaded = await api<{ url: string }>("/api/admin/upload", { method: "POST", cookie: session.cookie, form: valid });
  assert.equal(uploaded.status, 201);
  assert.match(uploaded.body.data?.url ?? "", /^\/uploads\/logo-[a-f0-9-]+\.webp$/);

  const chunked = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode("x")); controller.close(); } });
  const missingLength = await fetch(`${origin}/api/admin/upload`, {
    method: "POST",
    headers: { cookie: session.cookie!, origin, "content-type": "multipart/form-data; boundary=test" },
    body: chunked,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  assert.equal(missingLength.status, 411);
});

test("khóa hoặc đổi quyền tài khoản thu hồi session hiện có", async () => {
  const userSession = await login("student", userPassword);
  const adminSession = await login("admin", adminPassword);
  const user = await prisma.user.findUniqueOrThrow({ where: { username: "student" } });
  assert.equal((await api(`/api/admin/users/${user.id}`, { method: "PUT", cookie: adminSession.cookie, body: { username: "student", email: "", fullName: user.fullName, role: "USER", status: "LOCKED" } })).status, 200);
  assert.equal((await api("/api/auth/me", { cookie: userSession.cookie })).status, 401);
  assert.equal((await api(`/api/admin/users/${user.id}`, { method: "PUT", cookie: adminSession.cookie, body: { username: "student", email: "", fullName: user.fullName, role: "USER", status: "ACTIVE" } })).status, 200);
});

test("mật khẩu tạm buộc đổi, rotation và reset thu hồi toàn bộ session", async () => {
  const adminSession = await login("admin", adminPassword);
  const temporaryPassword = `Tmp-${randomUUID()}!`;
  const nextPassword = `New-${randomUUID()}!`;
  const resetPassword = `Rst-${randomUUID()}!`;
  const created = await api<{ id: string }>("/api/admin/users", {
    method: "POST",
    cookie: adminSession.cookie,
    body: { username: "password-flow", email: "", fullName: "Luồng mật khẩu", password: temporaryPassword, role: "USER", status: "ACTIVE" },
  });
  assert.equal(created.status, 201);

  const temporarySession = await login("password-flow", temporaryPassword);
  assert.equal(temporarySession.body.data?.redirect, "/change-password");
  const blocked = await api("/api/admin/dashboard", { cookie: temporarySession.cookie });
  assert.equal(blocked.status, 403);
  assert.equal(blocked.body.error?.code, "PASSWORD_CHANGE_REQUIRED");

  const changed = await api<{ redirect: string }>("/api/auth/change-password", {
    method: "POST",
    cookie: temporarySession.cookie,
    body: { currentPassword: temporaryPassword, password: nextPassword },
  });
  assert.equal(changed.status, 200);
  assert.equal(changed.body.data?.redirect, "/systems");
  assert.notEqual(changed.cookie, temporarySession.cookie);
  assert.equal((await api("/api/auth/me", { cookie: temporarySession.cookie })).status, 401);
  assert.equal((await api("/api/auth/me", { cookie: changed.cookie })).status, 200);

  assert.equal((await api(`/api/admin/users/${created.body.data!.id}`, { method: "PATCH", cookie: adminSession.cookie, body: { password: resetPassword } })).status, 200);
  assert.equal((await api("/api/auth/me", { cookie: changed.cookie })).status, 401);
});

test("logout thu hồi session và session hết hạn bị từ chối", async () => {
  const first = await login("admin", adminPassword);
  assert.equal((await api("/api/auth/logout", { method: "POST", cookie: first.cookie, body: {} })).status, 200);
  assert.equal((await api("/api/admin/dashboard", { cookie: first.cookie })).status, 401);

  const second = await login("admin", adminPassword);
  const hash = await prisma.session.findFirstOrThrow({ where: { user: { username: "admin" }, revokedAt: null }, orderBy: { createdAt: "desc" } });
  await prisma.session.update({ where: { id: hash.id }, data: { expiresAt: new Date(Date.now() - 1_000) } });
  assert.equal((await api("/api/admin/dashboard", { cookie: second.cookie })).status, 401);
});

test("đổi mật khẩu sai liên tục bị rate limit", async () => {
  const password = `Pw-${randomUUID()}!`;
  const target = await prisma.user.create({
    data: { username: `password-limit-${randomUUID().slice(0, 8)}`, fullName: "Giới hạn đổi mật khẩu", passwordHash: await hashPassword(password), role: "USER", mustChangePassword: false },
  });
  const session = await login(target.username, password);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    assert.equal((await api("/api/auth/change-password", { method: "POST", cookie: session.cookie, body: { currentPassword: "wrong-password", password: `New-${randomUUID()}!` } })).status, 400);
  }
  assert.equal((await api("/api/auth/change-password", { method: "POST", cookie: session.cookie, body: { currentPassword: "wrong-password", password: `New-${randomUUID()}!` } })).status, 429);
});

test("hai yêu cầu đồng thời không thể vô hiệu hóa toàn bộ admin", async () => {
  const firstLogin = await login("admin", adminPassword);
  const secondPassword = `Adm2-${randomUUID()}!`;
  const second = await api<{ id: string }>("/api/admin/users", {
    method: "POST",
    cookie: firstLogin.cookie,
    body: { username: "second-admin", email: "", fullName: "Quản trị thứ hai", password: secondPassword, role: "ADMIN", status: "ACTIVE" },
  });
  assert.equal(second.status, 201);
  await prisma.user.update({ where: { id: second.body.data!.id }, data: { mustChangePassword: false } });
  const secondLogin = await login("second-admin", secondPassword);
  const first = await prisma.user.findUniqueOrThrow({ where: { username: "admin" } });
  const results = await Promise.all([
    api(`/api/admin/users/${first.id}`, { method: "PUT", cookie: firstLogin.cookie, body: { username: "admin", email: "", fullName: first.fullName, role: "USER", status: "ACTIVE" } }),
    api(`/api/admin/users/${second.body.data!.id}`, { method: "PUT", cookie: secondLogin.cookie, body: { username: "second-admin", email: "", fullName: "Quản trị thứ hai", role: "USER", status: "ACTIVE" } }),
  ]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
  assert.equal(await prisma.user.count({ where: { role: "ADMIN", status: "ACTIVE" } }), 1);
});
