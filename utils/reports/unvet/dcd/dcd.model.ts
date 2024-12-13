export interface UnvetDcdResult {
  info: {
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
    table: {
      optionsTotal: number;
      categories: Categories;
      options: Options;
    };
    charts: {
      barChart: {
        total: number[];
        given: number[];
        received: number[];
      };
    };
    factors: {
      strengths: (keyof Options)[];
      risks: (keyof Options)[];
      threats: (keyof Options)[];
    };
    pupilsOptions: OptionsCountsPupils;
    pupilsCategories: CategoriesCountsPupils;
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

export interface PupilOptions {
  pupil: Pupil;
  options: OptionsCounts;
}

export interface OptionsCounts {
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

export interface Pupil {
  id: string;
  name: string | null;
  number: number;
}

export interface IndexTiers {
  1: {
    gender: {
      1: number;
      2: number;
    };
  };
  2: {
    gender: {
      1: number;
      2: number;
    };
  };
  3: {
    gender: {
      1: number;
      2: number;
    };
  };
  4: {
    gender: {
      1: number;
      2: number;
    };
  };
  5: {
    gender: {
      1: number;
      2: number;
    };
  };
  6: {
    gender: {
      1: number;
      2: number;
    };
  };
}

export interface OptionsCountsPupils {
  A1: PupilCounts[];
  A2: PupilCounts[];
  A3: PupilCounts[];
  B1: PupilCounts[];
  B2: PupilCounts[];
  B3: PupilCounts[];
  C1: PupilCounts[];
  C2: PupilCounts[];
  C3: PupilCounts[];
  D1: PupilCounts[];
  D2: PupilCounts[];
  D3: PupilCounts[];
  E1: PupilCounts[];
  E2: PupilCounts[];
  E3: PupilCounts[];
  F1: PupilCounts[];
  F2: PupilCounts[];
  F3: PupilCounts[];
  G1: PupilCounts[];
  G2: PupilCounts[];
  G3: PupilCounts[];
  H1: PupilCounts[];
  H2: PupilCounts[];
  H3: PupilCounts[];
  I1: PupilCounts[];
  I2: PupilCounts[];
  I3: PupilCounts[];
}

export interface PupilCounts {
  pupil: Pupil;
  value: number;
}

export interface CategoriesCountsPupils {
  A: PupilCounts[];
  B: PupilCounts[];
  C: PupilCounts[];
  D: PupilCounts[];
  E: PupilCounts[];
  F: PupilCounts[];
  G: PupilCounts[];
  H: PupilCounts[];
  I: PupilCounts[];
}

export interface CategoriesGiven {
  A: string[];
  B: string[];
  C: string[];
  D: string[];
  E: string[];
  F: string[];
  G: string[];
  H: string[];
  I: string[];
}
