export interface PupilResultListDto {
  id: string;
  user: {
    id: string;
    name: string | null;
  };
  questionnaireResults: {
    isCompleted: boolean;
  }[];
}
