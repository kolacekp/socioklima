-- CreateTable
CREATE TABLE "Diagnostics" (
    "id" TEXT NOT NULL,
    "questionnaire_type_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "product" INTEGER NOT NULL,

    CONSTRAINT "Diagnostics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Diagnostics" ADD CONSTRAINT "Diagnostics_questionnaire_type_id_fkey" FOREIGN KEY ("questionnaire_type_id") REFERENCES "questionnaire_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
