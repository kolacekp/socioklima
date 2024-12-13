export interface SoklChoicesSummaryResult {
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
    table: {
      pupilOptions: PupilOptions[];
      optionsSummary: Options;
    };
  };
}

export interface PupilOptions {
  pupilId: string;
  name: string | null;
  number: number | null;
  options: Options;
}

export interface Options {
  A1: number;
  A2: number;
  A3: number;
  B1: number;
  B2: number;
  B3: number;
  C1: number;
  C2: number;
  C3: number;
  D1: number;
  D2: number;
  D3: number;
  E1: number;
  E2: number;
  E3: number;
  F1: number;
  F2: number;
  F3: number;
  G1: number;
  G2: number;
  G3: number;
  H1: number;
  H2: number;
  H3: number;
  I1: number;
  I2: number;
  I3: number;
}
