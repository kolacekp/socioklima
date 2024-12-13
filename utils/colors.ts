export enum socialIndexColor {
  OPTIMAL = '#A8D5BA',
  RATHER_SATISFACTORY = '#FFF3B0',
  AMBIVALENT_POSITIVE = '#B3DDF2',
  AMBIVALENT_NEGATIVE = '#F8C8A0',
  RATHER_UNSATISFACTORY = '#E8A097',
  UNSATISFACTORY = '#B0B0B0'
}

export enum categoryColor {
  A = '#fdfb00',
  B = '#b7ff00',
  C = '#ff00ff',
  D = '#b600ff',
  E = '#ff0000',
  F = '#dddddd',
  G = '#d5c672',
  H = '#3d00ff',
  I = '#27bbff'
}

export const getCategoryColorByKey = (key: string): string | undefined => {
  const color = categoryColor[key as keyof typeof categoryColor];
  return color ? color : undefined;
};

export enum teacherCategoryColor {
  UA = categoryColor.A,
  UB = categoryColor.B,
  UC = categoryColor.C,
  UD = categoryColor.D,
  UE = categoryColor.E,
  UF = categoryColor.I
}

export const getTeacherCategoryColorByKey = (key: string): string | undefined => {
  const color = teacherCategoryColor[key as keyof typeof teacherCategoryColor];
  return color ? color : undefined;
};
