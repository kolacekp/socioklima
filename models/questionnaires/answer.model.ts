export class Answer {
  questionId: string;
  options: string[];
  optionType?: number;
  pupilId?: string;
  value?: string;
  comment?: string;

  constructor(
    questionId: string,
    pupilId?: string,
    options?: string[],
    optionType?: number,
    value?: string,
    comment?: string
  ) {
    this.questionId = questionId;
    this.pupilId = pupilId;
    this.value = value;
    this.options = options || [];
    this.optionType = optionType;
    this.comment = comment;
  }
}

export type AnswerQuestion = {
  questionId: string;
  partId: string;
  name: string;
  isCompleted: boolean;
  answers: Answer[];
};
