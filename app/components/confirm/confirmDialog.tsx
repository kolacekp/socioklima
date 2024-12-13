'use client';

import { Button, Modal } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { ConfirmComponentProps } from './confirmProvider';
const ConfirmDialog = (props: ConfirmComponentProps) => {
  const t = useTranslations('components.confirmDialog');

  return (
    <Modal show={props.open} onClose={props.onClose} className="z-50">
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Body>
        <p className="text-base">{props.message}</p>
        <div className="mt-4 flex flex-row gap-2">
          <Button size="sm" pill={true} outline={true} gradientDuoTone="purpleToBlue" onClick={props.onConfirm}>
            <p>{props.confirming ? t('loading') : t('yes')}</p>
            <HiOutlineCheckCircle className="ml-2 h-5 w-5" />
          </Button>

          <Button size="sm" pill={true} outline={true} gradientDuoTone="pinkToOrange" onClick={props.onClose}>
            <p>{t('no')}</p>
            <HiOutlineXCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ConfirmDialog;
