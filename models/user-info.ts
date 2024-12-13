import { Expert, Principal, Role, Teacher, User } from '@prisma/client';

export class UserInfo {
  id?: string;
  username?: string | null;
  email?: string | null;
  name?: string | null;
  roles?: Role[];
  principal?: Principal;
  expert?: Expert;
  teacher?: Teacher;
  activeSchool?:
    | {
        id: string;
        schoolName: string;
      }
    | undefined;
  impersonated?:
    | {
        id: string;
        email: string;
      }
    | undefined;

  constructor(model?: UserData, activeSchool?: any, impersonated?: any) {
    this.id = model?.id;
    this.username = model?.username;
    this.email = model?.email;
    this.name = model?.name;
    this.roles = model?.roles;
    this.principal = model?.principal;
    this.expert = model?.expert;
    this.teacher = model?.teacher;
    this.activeSchool = activeSchool;
    this.impersonated = impersonated;
  }
}

export type UserData = User & {
  roles: Role[];
  principal: Principal;
  expert: Expert;
  teacher: Teacher;
};
