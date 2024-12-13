/*
  Warnings:

  - You are about to drop the `_PupilToQuestionnaire` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `answer_options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PupilToQuestionnaire" DROP CONSTRAINT "_PupilToQuestionnaire_A_fkey";

-- DropForeignKey
ALTER TABLE "_PupilToQuestionnaire" DROP CONSTRAINT "_PupilToQuestionnaire_B_fkey";

-- AlterTable
ALTER TABLE "answer_options" ADD COLUMN     "acceptance" INTEGER,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "involvement" INTEGER,
ADD COLUMN     "safety" INTEGER,
ADD COLUMN     "type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "questionnaire_parts" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "questionnaire_result_answers" ADD COLUMN     "pupil_id" TEXT;

-- AlterTable
ALTER TABLE "questionnaire_results" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_completed_part_id" TEXT;

-- AlterTable
ALTER TABLE "questionnaires" ADD COLUMN     "closed_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "_PupilToQuestionnaire";

-- CreateTable
CREATE TABLE "PupilToQuestionnaire" (
    "id" TEXT NOT NULL,
    "pupil_id" TEXT NOT NULL,
    "questionnaire_id" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PupilToQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PupilToQuestionnaireResultAnswer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PupilToQuestionnaireResultAnswer_AB_unique" ON "_PupilToQuestionnaireResultAnswer"("A", "B");

-- CreateIndex
CREATE INDEX "_PupilToQuestionnaireResultAnswer_B_index" ON "_PupilToQuestionnaireResultAnswer"("B");

-- AddForeignKey
ALTER TABLE "PupilToQuestionnaire" ADD CONSTRAINT "PupilToQuestionnaire_pupil_id_fkey" FOREIGN KEY ("pupil_id") REFERENCES "pupils"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PupilToQuestionnaire" ADD CONSTRAINT "PupilToQuestionnaire_questionnaire_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PupilToQuestionnaireResultAnswer" ADD CONSTRAINT "_PupilToQuestionnaireResultAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "pupils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PupilToQuestionnaireResultAnswer" ADD CONSTRAINT "_PupilToQuestionnaireResultAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "questionnaire_result_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
