'use client';

import { cva } from 'class-variance-authority';
import { PupilDto } from '../models/pupilDto';
import { AnswerOptionType } from '@/models/questionnaires/answerOptionTypes.enum';

const styles = cva('w-full h-full cursor-pointer h-fit w-fit p-5 rounded-lg border text-md font-semibold', {
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

export default function OptionClassmate({
  pupil,
  isSelected,
  handleOptionSelect
}: {
  pupil: PupilDto;
  isSelected: boolean;
  handleOptionSelect: (optionId: string, optionType: number) => void;
}) {
  return (
    <>
      <div className="flex w-full sm:w-[50%] md:w-[33%] lg:w-[25%] xl:w-[20%] p-4">
        <div
          className={styles({ isSelected })}
          onClick={() => handleOptionSelect(pupil.id, AnswerOptionType.CLASSMATE)}
        >
          {pupil.user.name}
        </div>
      </div>
    </>
  );
}
