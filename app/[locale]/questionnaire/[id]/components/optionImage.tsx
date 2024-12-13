'use client';

import { AnswerOption } from '@/models/questionnaires/questionnaire.model';
import { cva } from 'class-variance-authority';
import { Tooltip } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const styles = cva('absolute h-[150px] w-[150px] rounded-lg border', {
  variants: {
    isSelected: {
      true: 'border-green-300 bg-green-500 bg-opacity-20',
      false: 'border-gray-300 bg-gray-200 bg-opacity-10'
    }
  },
  defaultVariants: {
    isSelected: false
  }
});

export default function OptionImage({
  option,
  isSelected,
  handleOptionSelect
}: {
  option: AnswerOption;
  isSelected: boolean;
  handleOptionSelect: (optionId: string, optionType: number) => void;
}) {
  const t = useTranslations('questionnaires');

  return (
    <div className="mx-auto">
      <Tooltip key={option.id} content={t(option.name)}>
        <div
          className="relative flex h-[150px] w-[150px] cursor-pointer items-center justify-center rounded-lg"
          onClick={() => handleOptionSelect(option.id, option.type)}
        >
          {option.imgUrl && (
            <Image
              src={option.imgUrl}
              alt={option.name}
              width={148}
              height={148}
              className="max-h-[150px] max-w-[150px] rounded-lg object-contain"
            />
          )}
          <div className={styles({ isSelected })}></div>
        </div>
      </Tooltip>
    </div>
  );
}
