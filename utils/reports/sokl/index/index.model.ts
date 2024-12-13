import { SocialIndexV2 } from '../../socialIndex/model';

export interface SoklSocialIndexResult {
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
    index: {
      tiers: IndexTiers;
      pupilIndexes: PupilIndex[];
    };
  };
}

export interface PupilIndex {
  pupilId: string;
  name: string | null;
  gender: number | null;
  number: number | null;
  index: SocialIndexV2;
  distance: number;
  tier: number;
  threatOrThreatened: ThreatOrThreatened;
}

export interface IndexTiers {
  1: Count;
  2: Count;
  3: Count;
  4: Count;
  5: Count;
  6: Count;
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

export interface GenderCount {
  0: number;
  1: number;
  2: number;
  3: number;
}

export interface Count {
  total: number;
  gender: GenderCount;
}

export interface ThreatOrThreatened {
  threatCount: number;
  threatenedCount: number;
}
