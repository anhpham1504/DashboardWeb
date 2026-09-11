-- Add username without changing the checksum of the already deployed baseline.
-- Existing accounts receive a deterministic, collision-free placeholder that an
-- administrator can change later through the account management screen.
ALTER TABLE `User`
  ADD COLUMN `username` VARCHAR(64) NULL AFTER `id`,
  MODIFY `email` VARCHAR(191) NULL;

UPDATE `User`
SET `username` = CONCAT('user-', LEFT(REPLACE(`id`, '-', ''), 40))
WHERE `username` IS NULL;

ALTER TABLE `User`
  MODIFY `username` VARCHAR(64) NOT NULL,
  ADD UNIQUE INDEX `User_username_key` (`username`),
  ADD INDEX `User_status_lockedUntil_idx` (`status`, `lockedUntil`);

CREATE INDEX `Session_userId_revokedAt_idx` ON `Session` (`userId`, `revokedAt`);
DROP INDEX `Session_userId_idx` ON `Session`;

CREATE INDEX `AuditLog_entityType_entityId_idx`
  ON `AuditLog` (`entityType`, `entityId`);
