// export class ResultAnswersDto {
//   questionnaireId: string;
//   partId: string;
//   isCompleted: boolean;
//   answers: Answer[];

//   constructor(
//     questionnaireId: string,
//     partId: string,
//     isCompleted: boolean,
//     answers: Answer[]
//   ) {
//     this.questionnaireId = questionnaireId;
//     this.partId = partId;
//     this.isCompleted = isCompleted;
//     this.answers = answers;
//   }
// }

export interface ResultAnswersDto {
  questionnaireId: string;
  partId: string;
  isCompleted: boolean;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  options: string[];
  optionType?: number;
  pupilId?: string;
  value?: string;
  comment?: string;
}
