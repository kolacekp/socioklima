import { Questionnaire } from '@prisma/client';
import { Pupil } from './results.model';

export function getReportPupilName(pupil: Pupil, questionnaire: Questionnaire) {
  if (questionnaire.isArchived) {
    // This value will be displayed instead of pupils name in reports if the questionnaire is archived
    const anonName = (pupil.number?.toString() ?? '0') + '/' + pupil.id.slice(0, 3).toUpperCase();
    return anonName;
  } else {
    return pupil.user.name;
  }
}
