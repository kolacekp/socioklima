export interface PupilQuestionnaireListDto {
  id: string;
  createdAt: Date;
  closedAt: Date | null;
  questionnaireType: {
    name: string;
    shortName: string;
  };
  questionnaireResults: {
    isCompleted: boolean;
  }[];
}
