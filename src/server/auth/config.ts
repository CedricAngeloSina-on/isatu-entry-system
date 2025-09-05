import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      idNumber: string | null;
      college: string | null;
      plateNumber: string | null;
      vehicleType: string | null;
      role: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    idNumber: string | null;
    college: string | null;
    plateNumber: string | null;
    vehicleType: string | null;
    role: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const username = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email in your database
        const user = await db.query.users.findFirst({
          where: (users, { eq, and }) =>
            and(eq(users.email, username), eq(users.password, password)),
        });

        if (!user) {
          return null;
        }

        return user;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    // Fixed: Use token parameter instead of user for JWT strategy
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        idNumber: token.idNumber as string | null,
        college: token.college as string | null,
        plateNumber: token.plateNumber as string | null,
        vehicleType: token.vehicleType as string | null,
        role: token.role as string | null,
      },
    }),
    // JWT callback to store user ID in token
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.idNumber = user.idNumber;
        token.college = user.college;
        token.plateNumber = user.plateNumber;
        token.vehicleType = user.vehicleType;
        token.role = user.role;
      }
      return token;
    },
  },
  // Required for credentials provider
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;
