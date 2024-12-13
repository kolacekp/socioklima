import { socialIndexColor } from '@/utils/colors';
import { getTiers } from './reports/socialIndex/socialIndexV2';

export const categoriesArray = {
  A: ['A1', 'A2', 'A3'],
  B: ['B1', 'B2', 'B3'],
  C: ['C1', 'C2', 'C3'],
  D: ['D1', 'D2', 'D3'],
  E: ['E1', 'E2', 'E3'],
  F: ['F1', 'F2', 'F3'],
  G: ['G1', 'G2', 'G3'],
  H: ['H1', 'H2', 'H3'],
  I: ['I1', 'I2', 'I3']
};

export const indexesArray = [
  { tier: 1, indexCode: '1', color: socialIndexColor.OPTIMAL },
  { tier: 2, indexCode: '2', color: socialIndexColor.RATHER_SATISFACTORY },
  { tier: 3, indexCode: '3a', color: socialIndexColor.AMBIVALENT_POSITIVE },
  { tier: 4, indexCode: '3b', color: socialIndexColor.AMBIVALENT_NEGATIVE },
  { tier: 5, indexCode: '4', color: socialIndexColor.RATHER_UNSATISFACTORY },
  { tier: 6, indexCode: '5', color: socialIndexColor.UNSATISFACTORY }
];

interface SocialIndexTiersInterface {
  [tier: number]: {
    code: string;
    color: string;
    range: [number, number];
  };
}

export const socialIndexTiers: SocialIndexTiersInterface = {};
indexesArray.forEach(({ tier, indexCode, color }: { tier: number; indexCode: string; color: string }) => {
  const tiers = getTiers();
  socialIndexTiers[tier] = {
    code: indexCode,
    color: color,
    range: [tiers[tier - 1][0], tiers[tier - 1][1]]
  };
});

export const teacherCategoriesArray = {
  UA: ['UA1', 'UA2', 'UA3', 'UA4'],
  UB: ['UB1', 'UB2', 'UB3', 'UB4'],
  UC: ['UC1', 'UC2', 'UC3', 'UC4'],
  UD: ['UD1', 'UD2', 'UD3', 'UD4'],
  UE: ['UE1', 'UE2', 'UE3', 'UE4'],
  UF: ['UF1', 'UF2', 'UF3', 'UF4']
};
