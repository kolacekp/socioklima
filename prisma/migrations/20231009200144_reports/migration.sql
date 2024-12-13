/*
  Warnings:

  - You are about to drop the `Diagnostics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diagnostics" DROP CONSTRAINT "Diagnostics_questionnaire_type_id_fkey";

-- DropTable
DROP TABLE "Diagnostics";

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "product" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "questionnaire_type_id" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_questionnaire_type_id_fkey" FOREIGN KEY ("questionnaire_type_id") REFERENCES "questionnaire_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
