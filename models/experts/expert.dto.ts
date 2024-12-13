import { School } from '@prisma/client';

export interface ExpertDto {
  id: string;
  userId: string;
  authorizationNumber: string | null;
  isVerified: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
  };
  schools: School[];
}
