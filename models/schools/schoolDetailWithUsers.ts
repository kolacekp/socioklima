import { Expert, School, User } from '@prisma/client';

export interface SchoolDetailWithUsers extends School {
  principal: {
    user: User;
  };
  experts: Array<Expert & { user: User }>;
  contactUser: User;
}
