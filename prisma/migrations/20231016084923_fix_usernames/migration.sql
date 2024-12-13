-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;

UPDATE "users" SET "username" = NULL WHERE email IS NOT NULL;
