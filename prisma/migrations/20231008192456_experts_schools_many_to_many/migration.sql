/*
  Warnings:

  - You are about to drop the column `school_id` on the `experts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "experts" DROP CONSTRAINT "experts_school_id_fkey";

-- AlterTable
ALTER TABLE "experts" DROP COLUMN "school_id";

-- CreateTable
CREATE TABLE "_ExpertToSchool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExpertToSchool_AB_unique" ON "_ExpertToSchool"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpertToSchool_B_index" ON "_ExpertToSchool"("B");

-- AddForeignKey
ALTER TABLE "_ExpertToSchool" ADD CONSTRAINT "_ExpertToSchool_A_fkey" FOREIGN KEY ("A") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpertToSchool" ADD CONSTRAINT "_ExpertToSchool_B_fkey" FOREIGN KEY ("B") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
