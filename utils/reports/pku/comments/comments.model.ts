export interface PkuCommentsResult {
  info: {
    schoolName: string;
    questionnaireName: string;
    questionnaireShortName: string;
    className: string;
    schoolYear: string;
    pupilsTotal: number;
    pupilsCompleted: number;
    dateCreated: Date;
    dateClosed: Date | null;
    genderRequired: boolean;
    nationalityRequired: boolean;
  };
  results: {
    questions: {
      1: {
        comments: string[];
      };
      2: {
        comments: string[];
      };
      3: {
        comments: string[];
      };
      4: {
        comments: string[];
      };
    };
  };
}
