-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "verification_required" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "verification_token_valid_to" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3),
    "password_reset_token" TEXT,
    "password_reset_token_valid_to" TIMESTAMP(3),
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "active_school_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "group" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "country" INTEGER NOT NULL,
    "school_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "tax_number" TEXT,
    "billing_info_equal" BOOLEAN NOT NULL,
    "billing_name" TEXT,
    "billing_address" TEXT,
    "billing_city" TEXT,
    "billing_zip_code" TEXT,
    "billing_business_id" TEXT,
    "billing_tax_number" TEXT,
    "school_type" INTEGER NOT NULL,
    "website" TEXT,
    "contact_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "classes_total" INTEGER NOT NULL,
    "classes_remaining" INTEGER NOT NULL,
    "product" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "generate_invoice" BOOLEAN NOT NULL DEFAULT true,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "school_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "license_id" TEXT NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "school_id" TEXT NOT NULL,
    "gender_required" BOOLEAN NOT NULL DEFAULT false,
    "teacher_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pupils" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "class_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gender" INTEGER NOT NULL DEFAULT 0,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pupils_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "principals" (
    "id" TEXT NOT NULL,
    "school_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "principals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experts" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "authorization_number" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaires" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,
    "questionnaire_type_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "questionnaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "questionnaire_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_parts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "questionnaire_type_id" TEXT NOT NULL,

    CONSTRAINT "questionnaire_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "enable_comment" BOOLEAN NOT NULL,
    "has_answer_options" BOOLEAN NOT NULL,
    "answer_for_all_classmates" BOOLEAN NOT NULL DEFAULT false,
    "select_options_min" INTEGER,
    "select_options_max" INTEGER,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "img_url" TEXT,
    "description" TEXT,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_results" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "pupil_id" TEXT NOT NULL,
    "questionnaire_id" TEXT NOT NULL,

    CONSTRAINT "questionnaire_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_result_answers" (
    "id" TEXT NOT NULL,
    "value" TEXT,
    "comment" TEXT,
    "question_id" TEXT NOT NULL,
    "questionnaire_result_id" TEXT NOT NULL,

    CONSTRAINT "questionnaire_result_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PupilToQuestionnaire" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_QuestionToQuestionnairePart" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerOptionToQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerOptionToQuestionnaireResultAnswer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_reset_token_key" ON "users"("password_reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "schools_business_id_key" ON "schools"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "principals_school_id_key" ON "principals"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "principals_user_id_key" ON "principals"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "experts_user_id_key" ON "experts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PupilToQuestionnaire_AB_unique" ON "_PupilToQuestionnaire"("A", "B");

-- CreateIndex
CREATE INDEX "_PupilToQuestionnaire_B_index" ON "_PupilToQuestionnaire"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToQuestionnairePart_AB_unique" ON "_QuestionToQuestionnairePart"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToQuestionnairePart_B_index" ON "_QuestionToQuestionnairePart"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerOptionToQuestion_AB_unique" ON "_AnswerOptionToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerOptionToQuestion_B_index" ON "_AnswerOptionToQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerOptionToQuestionnaireResultAnswer_AB_unique" ON "_AnswerOptionToQuestionnaireResultAnswer"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerOptionToQuestionnaireResultAnswer_B_index" ON "_AnswerOptionToQuestionnaireResultAnswer"("B");

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_contact_user_id_fkey" FOREIGN KEY ("contact_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "licenses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pupils" ADD CONSTRAINT "pupils_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pupils" ADD CONSTRAINT "pupils_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principals" ADD CONSTRAINT "principals_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principals" ADD CONSTRAINT "principals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_questionnaire_type_id_fkey" FOREIGN KEY ("questionnaire_type_id") REFERENCES "questionnaire_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_parts" ADD CONSTRAINT "questionnaire_parts_questionnaire_type_id_fkey" FOREIGN KEY ("questionnaire_type_id") REFERENCES "questionnaire_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_results" ADD CONSTRAINT "questionnaire_results_pupil_id_fkey" FOREIGN KEY ("pupil_id") REFERENCES "pupils"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_results" ADD CONSTRAINT "questionnaire_results_questionnaire_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_result_answers" ADD CONSTRAINT "questionnaire_result_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_result_answers" ADD CONSTRAINT "questionnaire_result_answers_questionnaire_result_id_fkey" FOREIGN KEY ("questionnaire_result_id") REFERENCES "questionnaire_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PupilToQuestionnaire" ADD CONSTRAINT "_PupilToQuestionnaire_A_fkey" FOREIGN KEY ("A") REFERENCES "pupils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PupilToQuestionnaire" ADD CONSTRAINT "_PupilToQuestionnaire_B_fkey" FOREIGN KEY ("B") REFERENCES "questionnaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionnairePart" ADD CONSTRAINT "_QuestionToQuestionnairePart_A_fkey" FOREIGN KEY ("A") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionnairePart" ADD CONSTRAINT "_QuestionToQuestionnairePart_B_fkey" FOREIGN KEY ("B") REFERENCES "questionnaire_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerOptionToQuestion" ADD CONSTRAINT "_AnswerOptionToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "answer_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerOptionToQuestion" ADD CONSTRAINT "_AnswerOptionToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerOptionToQuestionnaireResultAnswer" ADD CONSTRAINT "_AnswerOptionToQuestionnaireResultAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "answer_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerOptionToQuestionnaireResultAnswer" ADD CONSTRAINT "_AnswerOptionToQuestionnaireResultAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "questionnaire_result_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
