'use client';

import { Role, User } from '@prisma/client';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikTextInput from '@/app/components/inputs/formikTextInput';

export interface EditUserFormValues {
  id: string;
  name: string;
  phone: string;
}

export default function UserDetailForm({ user }: { user: User & { roles: Role[] } }) {
  const t = useTranslations('dashboard.users.users.detail');
  const tGeneral = useTranslations('dashboard.general');
  const router = useRouter();

  async function handleSubmit(values: EditUserFormValues) {
    const res = await fetch('/api/users/edit', {
      method: 'POST',
      body: JSON.stringify(values)
    });

    if (res.status == 200) {
      toast.success(t('user_edited'));
    } else {
      toast.error(t('user_edit_failure'));
    }
  }

  const editUserSchema = Yup.object().shape({
    name: Yup.string().max(50, t('validation_name_length')),
    phone: Yup.string().max(14, t('validation_phone_length'))
  });

  return (
    <>
      <div className="mb-2">
        <a
          className="font-medium text-blue-700 dark:text-blue-500 hover:underline hover:cursor-pointer"
          onClick={() => router.back()}
        >
          ← {tGeneral('back')}
        </a>
      </div>

      <h6 className="text-lg font-bold dark:text-white text-purple-600">
        {t('heading')} {user.username && <span className="text-blue-700">{user.username}</span>}
      </h6>

      <div className="mt-4">
        <Card>
          <Formik
            validateOnMount={true}
            initialValues={{
              id: user.id,
              name: user.name || '',
              phone: user.phone || ''
            }}
            validationSchema={editUserSchema}
            onSubmit={async (values) => {
              await handleSubmit(values);
            }}
          >
            <Form>
              <div className="pb-4">
                <p className="pb-2 font-bold text-blue-700">{t('basic_settings')}</p>
                <div className="grid grid-cols-1 max-w-md">
                  <div className="mb-4">
                    <div className="mb-2 block">
                      <Label htmlFor="username" value={t('username')} />
                    </div>
                    <TextInput
                      id="username"
                      type="text"
                      sizing="md"
                      defaultValue={user.username || undefined}
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 block">
                      <Label htmlFor="email" value={t('email')} />
                    </div>
                    <TextInput id="email" type="email" sizing="md" defaultValue={user.email || undefined} disabled />
                  </div>

                  <div className="mb-4">
                    <FormikTextInput label={t('name')} name="name" />
                  </div>

                  <div className="mb-4">
                    <FormikTextInput label={t('phone')} name="phone" />
                  </div>
                </div>
              </div>
              <Button className="w-fit" outline pill gradientDuoTone="purpleToBlue" type="submit">
                {t('save_settings')}
              </Button>
            </Form>
          </Formik>
        </Card>
      </div>
    </>
  );
}
