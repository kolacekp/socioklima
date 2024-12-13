/*
  Warnings:

  - You are about to drop the column `shortname` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "shortname",
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true;
