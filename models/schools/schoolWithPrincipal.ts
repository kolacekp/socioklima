import { School, User } from '@prisma/client';

export interface SchoolWithPrincipal extends School {
  principal: {
    user: User;
  };
}
