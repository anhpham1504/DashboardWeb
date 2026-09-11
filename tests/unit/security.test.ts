import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertAdmin,
  assertLastAdmin,
  HttpError,
} from "../../src/lib/http-error";
import { hashPassword, verifyPassword } from "../../src/lib/password";
import { slugify } from "../../src/lib/slug";
import { assertIsolatedTestDatabase } from "../../scripts/test-database";
import {
  listQuerySchema,
  loginSchema,
  safeUrlSchema,
  userCreateSchema,
  websiteAdminSchema,
} from "../../src/schemas/admin.schema";

test("username đăng nhập được chuẩn hóa và body lạ bị từ chối", () => {
  assert.deepEqual(
    loginSchema.parse({ username: "  Admin.User  ", password: "secret" }),
    { username: "admin.user", password: "secret" },
  );
  assert.equal(
    loginSchema.safeParse({
      username: "admin",
      password: "secret",
      role: "ADMIN",
    }).success,
    false,
  );
});

test("URL chỉ chấp nhận HTTP(S) không kèm credential", () => {
  assert.equal(
    safeUrlSchema.safeParse("https://example.com/path").success,
    true,
  );
  assert.equal(safeUrlSchema.safeParse("javascript:alert(1)").success, false);
  assert.equal(
    safeUrlSchema.safeParse("https://user:pass@example.com").success,
    false,
  );
});

test("website schema chống mass assignment và URL nguy hiểm", () => {
  const base = {
    name: "Demo",
    slug: "",
    url: "https://example.com",
    displayOrder: 0,
    isFeatured: false,
    isVisible: true,
  };
  assert.equal(
    websiteAdminSchema.safeParse({ ...base, id: "forced" }).success,
    false,
  );
  assert.equal(
    websiteAdminSchema.safeParse({ ...base, url: "data:text/html,payload" })
      .success,
    false,
  );
  assert.equal(websiteAdminSchema.parse(base).slug, "demo");
});

test("query chỉ cho phép trường sort trong allowlist", () => {
  assert.equal(listQuerySchema.parse({ sort: "updated" }).sort, "updated");
  assert.equal(
    listQuerySchema.safeParse({ sort: "passwordHash" }).success,
    false,
  );
  assert.equal(listQuerySchema.safeParse({ pageSize: 101 }).success, false);
});

test("schema tài khoản yêu cầu username và mật khẩu mạnh tối thiểu", () => {
  const valid = {
    username: "student_01",
    email: "",
    fullName: "Sinh viên",
    password: "Strong-Test-Password!",
    role: "USER",
  };
  assert.equal(userCreateSchema.safeParse(valid).success, true);
  assert.equal(
    userCreateSchema.safeParse({ ...valid, password: "Eight@88" }).success,
    true,
  );
  assert.equal(
    userCreateSchema.safeParse({ ...valid, username: "Tên có dấu" }).success,
    false,
  );
  assert.equal(
    userCreateSchema.safeParse({ ...valid, password: "short" }).success,
    false,
  );
});

test("slug tiếng Việt được chuẩn hóa ổn định", () => {
  assert.equal(slugify("Victionary English"), "victionary-english");
  assert.equal(
    slugify("Bộ môn Công nghệ Thông tin"),
    "bo-mon-cong-nghe-thong-tin",
  );
});

test("Argon2id hash và verify mật khẩu", async () => {
  const password = "Generated-Test-Password!";
  const hash = await hashPassword(password);
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, password), true);
  assert.equal(await verifyPassword(hash, `${password}x`), false);
});

test("RBAC và quy tắc admin cuối cùng", () => {
  assert.throws(
    () => assertAdmin("USER"),
    (error) => error instanceof HttpError && error.status === 403,
  );
  assert.doesNotThrow(() => assertAdmin("ADMIN"));
  assert.throws(
    () => assertLastAdmin(1, true, false),
    (error) => error instanceof HttpError && error.code === "LAST_ADMIN",
  );
  assert.doesNotThrow(() => assertLastAdmin(2, true, false));
});

test("test destructive chỉ chấp nhận database MySQL cục bộ đúng tiền tố", () => {
  assert.equal(
    assertIsolatedTestDatabase(
      "mysql://app:secret@127.0.0.1:3306/fpt_dashboard_test_acceptance",
    ),
    "fpt_dashboard_test_acceptance",
  );
  assert.throws(() =>
    assertIsolatedTestDatabase(
      "mysql://app:secret@127.0.0.1:3306/fpt_dashboard",
    ),
  );
  assert.throws(() =>
    assertIsolatedTestDatabase(
      "mysql://app:secret@example.com:3306/fpt_dashboard_test_remote",
    ),
  );
  assert.throws(() =>
    assertIsolatedTestDatabase(
      "postgresql://app:secret@127.0.0.1:5432/fpt_dashboard_test_wrong",
    ),
  );
});
