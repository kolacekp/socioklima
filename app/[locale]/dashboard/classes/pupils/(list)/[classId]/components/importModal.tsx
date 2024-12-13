import { Alert, Button, FileInput, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineBarsArrowUp, HiOutlineInformationCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';
import { useState } from 'react';
import * as Papa from 'papaparse';
import { PupilCreateRequest } from '@/app/api/pupils/create/route';

interface CsvPupilDataItem {
  name: string;
  number: string;
  gender: string | null;
  nationality: string | null;
}

export default function ImportModal({
  openModal,
  classId,
  className,
  onClose,
  onSave
}: {
  openModal: boolean;
  classId: string;
  className: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const t = useTranslations('dashboard.pupils.import');
  const tGeneral = useTranslations('dashboard.general');
  const [isLoading, setIsLoading] = useState(false);

  const checkMimeType = (file: File): boolean => {
    const allowedMimeTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel'];
    const fileMimeType = file.type;
    return allowedMimeTypes.includes(fileMimeType);
  };

  const parsePupilsCsvString = (csvString: string): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      const results: Array<any> = [];

      Papa.parse(csvString, {
        delimiter: ';',
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: (result: Papa.ParseStepResult<any>) => {
          if (result.data) {
            results.push(result.data);
          }
        },
        complete: () => {
          resolve(results);
        },
        error: () => {
          reject();
        }
      });
    });
  };

  const mapGender = (gender: string | null) => {
    switch (gender) {
      case 'M':
        return 1;
      case 'F':
        return 2;
      case 'O':
        return 3;
      default:
        return 0;
    }
  };

  const handleCsvUpload = async (file: File | null) => {
    if (!file) return;

    if (!checkMimeType(file)) {
      toast.error(t('only_csv_is_allowed'));
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        const csvString = fileReader.result as string;

        parsePupilsCsvString(csvString)
          .then(async (data) => {
            let pupilsImported = 0;

            for (const item of data) {
              if (item) {
                const dataItem = {
                  name: item[0],
                  number: item[1],
                  gender: item[2] ?? null,
                  nationality: item[3] ?? null
                } as CsvPupilDataItem;

                const response = await fetch('/api/pupils/create', {
                  method: 'POST',
                  body: JSON.stringify({
                    classId: classId,
                    name: dataItem.name,
                    number: dataItem.number,
                    gender: mapGender(dataItem.gender),
                    nationality: dataItem.nationality
                  } as PupilCreateRequest)
                });

                if (response.ok) {
                  pupilsImported++;
                }
              }
            }

            if (pupilsImported) toast.success(t('imported_pupils') + pupilsImported);

            setIsLoading(false);
            onSave();
          })
          .catch(() => {
            toast.error(t('error_parsing_csv'));
            setIsLoading(false);
          });
      } catch (error) {
        toast.error(t('error_parsing_csv'));
        setIsLoading(false);
      }
    };

    await fileReader.readAsText(file, 'utf8');
  };

  return (
    <Modal dismissible show={openModal} onClose={onClose}>
      <Modal.Header>
        {t('import_pupils_into')} {className}
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            file: null
          }}
          validationSchema={Yup.object().shape({
            file: Yup.mixed()
              .required(t('select_a_file'))
              .test('fileSize', t('too_large'), (value: any) => {
                if (!value) return true; // Allow empty file (user cleared selection)
                return value.size <= 1024 * 1024 * 10; // 10MB limit
              })
          })}
          onSubmit={async (values, { setSubmitting }) => {
            if (values.file) {
              setIsLoading(true);
              await handleCsvUpload(values.file);
            }
            setSubmitting(false);
          }}
        >
          {(props: FormikProps<any>) => (
            <Form className="flex flex-col gap-4">
              <div>
                <FileInput
                  id="file"
                  name="file"
                  onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedFile = event.currentTarget.files?.[0];
                    await props.setFieldValue('file', selectedFile);
                    await props.setFieldTouched('file', true);
                  }}
                />
              </div>

              <div>
                <Alert color="success" icon={HiOutlineInformationCircle}>
                  <span>
                    <p>{t('help')}</p>
                  </span>
                </Alert>
              </div>

              <div>
                <Alert color="purple" icon={HiOutlineInformationCircle}>
                  <span>
                    <p>{t('format_info')}</p>
                  </span>
                </Alert>
              </div>

              <div className="mt-4">
                <Button
                  disabled={!props.isValid || isLoading || !props.touched.file}
                  type="submit"
                  className="w-full"
                  isProcessing={isLoading}
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                >
                  <p>{t('import')}</p>
                  <HiOutlineBarsArrowUp className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button outline pill gradientDuoTone="pinkToOrange" color="danger" onClick={onClose}>
          <p>{tGeneral('close')}</p>
          <HiOutlineXCircle className="ml-2 h-5 w-5" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
