export interface AnswerOption {
  id: string;
  name: string;
  group: number;
  value: string;
  type: number;
  imgUrl: string | null;
  description: string | null;
}

export interface Question {
  id: string;
  name: string;
  description: string | null;
  enableComment: boolean;
  hasAnswerOptions: boolean;
  answerForAllClassmates: boolean;
  selectOptionsMin: number | null;
  selectOptionsMax: number | null;
  answerOptions: AnswerOption[];
  isCompleted?: boolean;
  order: number | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface QuestionnairePart {
  id: string;
  name: string;
  description: string | null;
  order: number;
  questions: Question[];
}

interface QuestionnaireTypeModel {
  id: string;
  name: string;
  shortName: string;
  description: string | null;
  linesOfDescription: number | null;
  createdAt: Date;
  isActive: boolean;
  questionnaireParts: QuestionnairePart[];
}

export class QuestionnaireType {
  id: string;
  name: string;
  shortName: string;
  description: string | null;
  linesOfDescription: number | null;
  createdAt: Date;
  isActive: boolean;
  questionnaireParts: QuestionnairePart[];

  constructor(data: QuestionnaireTypeModel) {
    this.id = data.id;
    this.name = data.name;
    this.shortName = data.shortName;
    this.description = data.description;
    this.linesOfDescription = data.linesOfDescription;
    this.createdAt = new Date(data.createdAt);
    this.isActive = data.isActive;
    this.questionnaireParts = data.questionnaireParts.map((part) => ({
      id: part.id,
      name: part.name,
      description: part.description,
      order: part.order,
      questions: part.questions.map((question) => ({
        id: question.id,
        name: question.name,
        order: question.order,
        description: question.description,
        enableComment: question.enableComment,
        hasAnswerOptions: question.hasAnswerOptions,
        answerForAllClassmates: question.answerForAllClassmates,
        selectOptionsMin: question.selectOptionsMin,
        selectOptionsMax: question.selectOptionsMax,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        deletedAt: question.deletedAt,
        answerOptions: question.answerOptions.map((option) => ({
          id: option.id,
          name: option.name,
          group: option.group,
          value: option.value,
          type: option.type,
          imgUrl: option.imgUrl,
          description: option.description
        }))
      }))
    }));
  }
}

export type QuestionnaireStructure = {
  id: string;
  name: string;
  shortName: string;
  description: string | null;
  createdAt: Date;
  isActive: boolean;
  questionnaireParts: {
    id: string;
    name: string;
    order: number;
    questions: {
      id: string;
      name: string;
      description: string | null;
      enableComment: boolean;
      hasAnswerOptions: boolean;
      answerForAllClassmates: boolean;
      selectOptionsMin: number | null;
      selectOptionsMax: number | null;
      answerOptions: {
        id: string;
        name: string;
        group: number;
        value: string;
        imgUrl: string | null;
        description: string | null;
      }[];
    }[];
  }[];
};
