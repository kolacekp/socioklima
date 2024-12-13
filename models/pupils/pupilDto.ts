export interface PupilDto {
  id: string;
  classId: string;
  gender: number;
  number: number;
  consent: boolean;
  nationality: string | null;
  user: {
    id: string;
    username: string | null;
    name: string | null;
  };
}
