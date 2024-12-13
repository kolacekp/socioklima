export interface BcdResult {
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
      optionsTotal: number;
      categories: Categories;
      options: Options;
    };
    charts: {
      reviewObtainedChart: Categories;
      reviewGivenChart: Categories;
      doughnutChart: number[];
      reviewMeToMyselfChart: Categories;
      reviewOthersToMyselfChart: Categories;
      idealMeChart: Categories;
      rejectedMeChart: Categories;
    };
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
  total: number;
  gender: {
    1: number;
    2: number;
    3: number;
  };
}

export interface PupilResult {
  pupilId: string;
  gender: number | null;
  results: {
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
  };
}

export interface IndexTiers {
  1: {
    total: number;
    gender: {
      1: number;
      2: number;
      3: number;
    };
  };
  2: {
    total: number;
    gender: {
      1: number;
      2: number;
      3: number;
    };
  };
  3: {
    total: number;
    gender: {
      1: number;
      2: number;
      3: number;
    };
  };
  4: {
    total: number;
    gender: {
      1: number;
      2: number;
      3: number;
    };
  };
  5: {
    total: number;
    gender: {
      1: number;
      2: number;
      3: number;
    };
  };
  6: {
    total: number;
    gender: {
      1: number;
      2: number;
      3: number;
    };
  };
}
