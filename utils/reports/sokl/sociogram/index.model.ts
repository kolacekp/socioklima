export type PupilId = string;
export type PupilName = string;
export type PupilGender = number;

export interface Pupil {
  gender: PupilGender;
  name: PupilName;
}

export interface Pupils {
  [key: PupilId]: Pupil;
}

export interface Relations {
  [key: PupilName]: PupilName[];
}

export type Layer = 'positive' | 'negative' | 'aspirational';

export type GenderColor = 'gray' | 'lightblue' | 'pink' | 'green';

export type LayerColor = '#FFC107' | '#000000' | '#1E90FF';

export interface SociogramResult {
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
    diagrams: {
      positive: string;
      negative: string;
      aspirational: string;
    };
  };
}
