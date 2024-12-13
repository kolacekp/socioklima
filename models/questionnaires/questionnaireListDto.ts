export interface QuestionnaireListDto {
  id: string;
  createdAt: Date;
  closedAt: Date | null;
  isArchived: boolean;
  class: {
    name: string;
  };
  questionnaireType: {
    name: string;
    shortName: string;
  };
  pupilCount: number;
  completedCount: number;
}
