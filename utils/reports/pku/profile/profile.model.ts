export interface PkuOpinionProfileResult {
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
        options: Options;
        categories: Categories;
        optionsTotal: number;
        chart: number[];
      };
      2: {
        options: Options;
        categories: Categories;
        optionsTotal: number;
        chart: number[];
      };
      3: {
        options: Options;
        categories: Categories;
        optionsTotal: number;
        chart: number[];
      };
      4: {
        options: Options;
        categories: Categories;
        optionsTotal: number;
        chart: number[];
      };
    };
  };
}

export interface Categories {
  UA: Count;
  UB: Count;
  UC: Count;
  UD: Count;
  UE: Count;
  UF: Count;
}

export interface Options {
  UA1: Count;
  UA2: Count;
  UA3: Count;
  UA4: Count;
  UB1: Count;
  UB2: Count;
  UB3: Count;
  UB4: Count;
  UC1: Count;
  UC2: Count;
  UC3: Count;
  UC4: Count;
  UD1: Count;
  UD2: Count;
  UD3: Count;
  UD4: Count;
  UE1: Count;
  UE2: Count;
  UE3: Count;
  UE4: Count;
  UF1: Count;
  UF2: Count;
  UF3: Count;
  UF4: Count;
}

export interface Count {
  total: number;
  gender: {
    1: number;
    2: number;
    3: number;
  };
}
