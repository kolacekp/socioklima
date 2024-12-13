export interface Result {
  id: string;
  pupil: Pupil;
  questions: Question[];
}

export interface Question {
  id: string;
  questionId: string;
  pupil: Pupil;
  name: string;
  order: number;
  comment: string | null;
  answers: Answer[];
  classmates: string[];
}

export interface Answer {
  id: string;
  type: number;
  value: string;
  category: string | null;
}

export interface Pupil {
  id: string;
  gender: number | null;
  user: {
    name: string | null;
  };
  number: number | null;
}
