import socioklimaConfig from 'socioklima.config.json';

import type { SocialIndexV2 } from './model';
import type { Options } from '../sokl/bcd/bcd.model';
import { ThreatOrThreatened } from '../sokl/index/index.model';

export const getSocialIndexV2 = (options: Options): SocialIndexV2 => {
  const socialIndexVector: SocialIndexV2 = {
    acceptance: 0,
    involvement: 0,
    safety: 0
  };
  let votesCount: number = 0;

  Object.entries(socioklimaConfig.categories).forEach(([category, { acceptance, involvement, safety }]) => {
    const optionCount = options[category as keyof Options].total;
    votesCount += optionCount;
    socialIndexVector.acceptance += optionCount * acceptance;
    socialIndexVector.involvement += optionCount * involvement;
    socialIndexVector.safety += optionCount * safety;
  });

  socialIndexVector.acceptance /= votesCount;
  socialIndexVector.involvement /= votesCount;
  socialIndexVector.safety /= votesCount;

  return socialIndexVector;
};

export const getSocialIndexV2Distance = (index: SocialIndexV2): number =>
  Math.sqrt((index.acceptance - 1) ** 2 + (index.involvement - 1) ** 2 + (index.safety - 1) ** 2);

export const getTiers = () => {
  const maxDistance = Math.max(...Object.values(socioklimaConfig.categories).map(getSocialIndexV2Distance));
  const subintervalsMultipliersSum = Object.values(socioklimaConfig.tiers).reduce(
    (partialSum, { width }) => partialSum + width,
    0
  );
  const step = maxDistance / subintervalsMultipliersSum;
  return Object.values(socioklimaConfig.tiers).map(({ minMultiplier, maxMultiplier }) => [
    step * minMultiplier,
    step * maxMultiplier
  ]);
};

export const getSocialIndexV2Tier = (index: SocialIndexV2): number => {
  const tiers = getTiers();
  const distance = getSocialIndexV2Distance(index);
  return tiers.findIndex(([min, max]) => distance >= min && distance < max) + 1;
};

export const isThreatOrThreatened = (options: Options): ThreatOrThreatened => {
  const result = {
    threatCount: 0,
    threatenedCount: 0
  };

  Object.entries(socioklimaConfig.categories).forEach(([category, { threat }]) => {
    const optionCount = options[category as keyof Options].total;
    if (threat > 0) {
      result.threatCount += optionCount;
    } else if (threat < 0) {
      result.threatenedCount += optionCount;
    }
  });

  return result;
};
