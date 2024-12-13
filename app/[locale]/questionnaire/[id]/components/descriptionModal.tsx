'use client';

import { QuestionnaireType } from '@/models/questionnaires/questionnaire.model';
import { useQuestionnaireContext } from '../../components/questionnaireContextProvider';
import { useTranslations } from 'next-intl';
import { Modal, Button } from 'flowbite-react';

export default function DescriptionModal({ questionnaire }: { questionnaire: QuestionnaireType }) {
  const { showDescDialog, setShowDescDialog } = useQuestionnaireContext();
  const t = useTranslations('questionnaires');

  const descriptionLines = [];
  if (questionnaire.description && questionnaire.linesOfDescription) {
    for (let i = 1; i <= questionnaire.linesOfDescription; i++) {
      descriptionLines.push(
        <p className="mb-2" key={i}>
          {t(questionnaire.description + '.' + i)}
        </p>
      );
    }
  }

  return (
    <Modal show={showDescDialog} onClose={() => setShowDescDialog(false)} className="z-50">
      <Modal.Header>{t('general.desc_modal.title')}</Modal.Header>
      <Modal.Body>{descriptionLines}</Modal.Body>
      <Modal.Footer>
        <Button
          size="sm"
          pill={true}
          outline={true}
          gradientDuoTone="purpleToBlue"
          onClick={() => setShowDescDialog(false)}
        >
          <p>{t('general.desc_modal.continue')}</p>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
