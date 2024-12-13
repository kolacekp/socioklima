-- Update data to prevent nulls
UPDATE "users" SET "username" = "email" WHERE "username" IS NULL AND "email" IS NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
