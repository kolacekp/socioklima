import { TeacherDto } from '../teachers/teacher.dto';

export interface ClassListDto {
  id: string;
  name: string;
  grade: number;
  pupilCount: number;
  isArchived: boolean;
  genderRequired: boolean;
  license: {
    id: string;
    validFrom: Date;
    validUntil: Date;
    product: number;
    schoolId: string;
    deletedAt: Date | null;
    isPaid: boolean;
  };
  teacher: TeacherDto;
}
