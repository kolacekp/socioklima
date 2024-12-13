'use client';

import { useTranslations } from 'next-intl';
import { ClassDto } from '../models/classDto';
import { QuestionnaireTypeDto } from '../models/questionnaireTypeDto';
import { HiOutlinePlusCircle, HiOutlineInformationCircle } from 'react-icons/hi2';
import { Label, Button, Alert } from 'flowbite-react';
import { Formik, FormikProps, Form } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

export interface CreateQuestionnaireFormValues {
  schoolId: string;
  classId: string;
  questionnaireTypeId: string;
}

export default function CreateQuestionnaireForm({
  schoolId,
  classes,
  questionnaireTypes
}: {
  schoolId: string;
  classes: ClassDto[];
  questionnaireTypes: QuestionnaireTypeDto[];
}) {
  const t = useTranslations('dashboard.questionnaires.create');
  const tq = useTranslations('questionnaires');

  const router = useRouter();

  return (
    <>
      <div
        className="text-gray-300 cursor-pointer hover:text-gray-400 text-sm w-fit"
        onClick={() => router.push('/dashboard/questionnaires')}
      >
        ← {t('back')}
      </div>
      <div className="shadow-md mx-auto max-w-xl rounded-t-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <span className="text-gray-800 dark:text-white">{t('heading')}</span>
      </div>
      <div className="shadow-md mx-auto max-w-xl rounded-b-xl border-x border-b border-gray-200 bg-white bg-gradient-to-r p-0 dark:border-gray-600 dark:bg-gray-900">
        <div className="mx-auto w-full rounded-b-xl bg-white bg-gradient-to-r p-2 dark:bg-gray-900 sm:p-6">
          <Alert className="mb-4" icon={HiOutlineInformationCircle}>
            {t('alert')}
          </Alert>
          <Formik
            validateOnMount
            initialValues={{
              schoolId: schoolId,
              classId: classes[0].id,
              questionnaireTypeId: questionnaireTypes[0].id
            }}
            validationSchema={Yup.object({
              classId: Yup.string().required(t('required')),
              questionnaireTypeId: Yup.string().required(t('required'))
            })}
            onSubmit={async (values) => {
              const response = await fetch('/api/questionnaires/create', {
                method: 'POST',
                body: JSON.stringify(values)
              });

              if (response.ok) {
                toast.success(t('toast_success'));
                setTimeout(() => {
                  window.location.href = '/dashboard/questionnaires';
                }, 1000);
              } else {
                toast.error(t('toast_failure'));
              }
            }}
          >
            {(props: FormikProps<CreateQuestionnaireFormValues>) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="classes" value={t('class')} className="mb-2 block" />
                  <select
                    id="classes"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...props.getFieldProps('classId')}
                    value={props.values.classId}
                    onChange={props.handleChange}
                  >
                    {classes.map((class_) => (
                      <option value={class_.id} key={class_.id}>
                        {class_.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="questionnaireTypes" value={t('questionnaire')} className="mb-2 block" />
                  <select
                    id="questionnaireTypes"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...props.getFieldProps('questionnaireTypeId')}
                    value={props.values.questionnaireTypeId}
                    onChange={props.handleChange}
                  >
                    {questionnaireTypes.map((qType) => (
                      <option value={qType.id} key={qType.id}>
                        {tq(qType.name) + ' (' + tq(qType.shortName) + ')'}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  isProcessing={props.isSubmitting}
                  disabled={!props.isValid || props.isSubmitting}
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                  className="mt-2"
                >
                  <p>{t('create')}</p>
                  <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
