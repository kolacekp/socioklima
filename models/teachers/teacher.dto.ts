import { ClassDto } from '../classes/class.dto';

export interface TeacherDto {
  id: string;
  schoolId: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
  };
  classes: ClassDto[];
}
