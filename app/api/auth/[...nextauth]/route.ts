import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { UserData, UserInfo } from 'models/user-info';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { GetActiveSchool } from 'services/activeSchool.service';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      // @ts-ignore
      async authorize(credentials) {
        const { usernameOrEmail, password, impersonatingAs, impersonationCancelling } = credentials as {
          usernameOrEmail: string;
          password?: string;
          impersonatingAs?: string;
          impersonationCancelling?: boolean;
        };
        if (!usernameOrEmail || (!impersonatingAs && !impersonationCancelling && !password)) {
          throw new Error('login_error');
        }
        const user = await prisma.user.findFirst({
          where: {
            AND: [
              {
                OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
              },
              {
                deletedAt: null
              }
            ]
          },
          include: {
            roles: true,
            principal: true,
            expert: true,
            teacher: true
          }
        });

        if (!user) throw new Error('login_error_bad_credentials');

        if (!impersonatingAs && !impersonationCancelling) {
          // if user doesn't exist or password doesn't match
          if (!(await compare(password || '', user.password))) {
            throw new Error('login_error_bad_credentials');
          }

          // if the verification is required
          if (user.verificationRequired && !user.verifiedAt) {
            throw new Error('login_error_unverified');
          }
        }

        const impersonated =
          impersonatingAs && !impersonationCancelling
            ? await prisma.user.findFirst({
                where: {
                  id: impersonatingAs
                },
                select: {
                  id: true,
                  email: true
                }
              })
            : undefined;

        const school = await GetActiveSchool(user.id);

        return new UserInfo(user as UserData, school, impersonated);
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600 // 1 hour (3600 seconds)
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }

      if (trigger === 'update') {
        if (!session) return token;
        return { ...token, user: { ...session.user } };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
