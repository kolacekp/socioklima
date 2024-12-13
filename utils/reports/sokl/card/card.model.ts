export interface SoklPupilCardResult {
  info: {
    pupil: {
      name: string | null;
      number: number;
    };
    schoolName: string;
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
    factors: Factors;
    options: {
      fromOthers: Options;
      fromOthersTotal: number;
      1: string[];
      2: string[];
      3: string[];
      4: string[];
    };
    categories: {
      fromOthers: Categories;
    };
    charts: {
      total: number[];
      gender: {
        1: number[];
        2: number[];
        3: number[];
      };
    };
    comments: string[];
  };
}

export interface Categories {
  A: Count;
  B: Count;
  C: Count;
  D: Count;
  E: Count;
  F: Count;
  G: Count;
  H: Count;
  I: Count;
}

export interface Options {
  A1: Count;
  A2: Count;
  A3: Count;
  B1: Count;
  B2: Count;
  B3: Count;
  C1: Count;
  C2: Count;
  C3: Count;
  D1: Count;
  D2: Count;
  D3: Count;
  E1: Count;
  E2: Count;
  E3: Count;
  F1: Count;
  F2: Count;
  F3: Count;
  G1: Count;
  G2: Count;
  G3: Count;
  H1: Count;
  H2: Count;
  H3: Count;
  I1: Count;
  I2: Count;
  I3: Count;
}

export interface Count {
  key?: keyof Options;
  total: number;
  gender: {
    1: number;
    2: number;
    3: number;
  };
}

export interface Factors {
  strengths: (keyof Options)[];
  risks: (keyof Options)[];
  threats: (keyof Options)[];
}

export interface Pupil {
  id: string;
  name: string | null;
  number: number;
}