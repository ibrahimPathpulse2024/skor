import {
  AuthOptions,
  DefaultSession,
  NextAuthOptions,
  Profile as NextAuthProfile,
  User as NextAuthUser,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string;
    hasVisitedQuest?: boolean;
    emailVerified?: boolean;
    remember?: boolean;
    oktoObject?: any;
    profile_img?: string; // Add the 'profile_img' property
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      id_token: string;
      token: string;
      oktoObject?: any;
      gamerId?: string;
    };
  }
}

declare module "next-auth" {
  interface Profile {
    email_verified?: boolean;
    profile?: string; // Add the 'profile' property to the Profile interface
    picture?: string; // Add the 'picture' property to the Profile interface
  }
}

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { addMilliseconds } from "date-fns";
import jwt from "jsonwebtoken";
import EmailProvider from "next-auth/providers/email";
import { isDateEqualOrAfter } from "../common/utils";
import { USERS_VALIDATE } from "../constant/apiEndPoints";
import client from "../lib/db";
import { sendVerificationRequest } from "../lib/email";

const MS_OF_30_YEARS = 30 * 365 * 24 * 60 * 60 * 1000;
const MS_OF_30_DAYS = 30 * 24 * 60 * 60 * 1000;
const secretKey = process.env.NEXTAUTH_SECRET;
const uri = process.env.MONGODB_URI;

export const nextauthOptions: AuthOptions = {
  debug: true,
  secret: secretKey,
  pages: {
    signIn: "/games",
    error: "/error",
    newUser: "/games",
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "lax", // Adjust based on your app’s behavior
        path: "/",
      },
    },
  },
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      authorization: { params: { scope: "openid email profile" } },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const remember = req.query?.remember === "true"; // request values are strings

        const response = await fetch(USERS_VALIDATE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const res = await response.json();

        const user = res?.user; // Extract user from the API response
        if (!user) {
          return null; // Return null if user is not found
        }

        return {
          ...user,
          remember,
        };
        // const user = await signInWithCredentials({
        // 	email: credentials?.email,
        // 	password: credentials?.password
        // })
        // return user
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async signIn(args) {
      const { user, account, profile } = args;

      if (user != null && account != null && profile != null) {
        user.image = user.profile_img != null ? user.profile_img : user.image;
        delete user.image;
        user.hasVisitedQuest = false;
      }

      if (account?.provider === "google") {
        // user.referralCode = `REF-${uuidv4().slice(0, 12)}`;
        user.image = profile.image || profile.picture || profile.sub;
        user.emailVerified = profile?.email_verified;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Check if the token is expired
      const isTokenExpired =
        token?.expiresAt && isDateEqualOrAfter(Date.now(), token.expiresAt);

      if (isTokenExpired) {
        throw new Error("Token expired");
      }

      if (token && user) {
        if (user.profile_img) {
          token.img = user.profile_img;
        }

        if (user.id) {
          token.id = user.id;
        }

        // Save the expiration date in the token as milliseconds
        const expiresIn = user.remember ? MS_OF_30_YEARS : MS_OF_30_DAYS;
        token.expiresAt = addMilliseconds(Date.now(), expiresIn).getTime();
      }

      if (account && user) {
        token.id_token = account.id_token as string;
        token.oktoObject = user.oktoObject;
      }

      const db = client.db();
      const dbUser = await db
        .collection("users")
        .findOne({ email: token.email });

      if (dbUser?.oktoObject) {
        token.oktoObject = dbUser.oktoObject;
      }

      return token;
    },
    async session(params) {
      // const encoding = jwt.sign(token, secretKey)
      const { session, token } = params || {};

      if (session && session.user && token) {
        if (token.img) {
          session.user.image = token.img as string;
        }
        if (token.id) {
          session.user.id = token.id as string;
        }
      }

      const db = client.db();
      const userData = await db.collection("users").findOne({
        email: session.user?.email,
      });

      if (userData) {
        session.user = {
          ...session.user,
          name: userData.name,
          email: userData.email,
          image: userData.image,
          gamerId: userData.gamerId,
        };
      }
      session.user.oktoObject = token.oktoObject;
      session.id_token = token.id_token;

      const encoding = jwt.sign(token, secretKey);
      session.token = encoding as string | undefined;
      return session;
    },
  },
};

// export const nextauthOptions: NextAuthOptions = {
//   debug: true,
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/user",
//     error: "/error",
//     newUser: "/quest",
//   },
//   adapter: MongoDBAdapter(client), // MongoDB adapter for storing sessions
//   session: {
//     strategy: "database", // Use database for session management
//   },
//   cookies: {
//     sessionToken: {
//       name: `next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // Secure only in production
//         sameSite: "lax", // Adjust based on your app’s behavior
//         path: "/",
//       },
//     },
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", required: true },
//         password: { label: "Password", type: "password", required: true },
//       },
//       async authorize(credentials, req) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required");
//         }

//         // Replace this with your actual API call to validate the user
//         const response = await fetch(process.env.USERS_VALIDATE_URL!, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(credentials),
//         });

//         const user = await response.json();

//         if (!response.ok || !user) {
//           throw new Error("Invalid credentials");
//         }

//         return user;
//       },
//     }),
//     EmailProvider({
//       server: {
//         host: process.env.EMAIL_SERVER_HOST,
//         port: process.env.EMAIL_SERVER_PORT,
//         auth: {
//           user: process.env.EMAIL_SERVER_USER,
//           pass: process.env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM,
//       maxAge: 24 * 60 * 60, // 24 hours
//       sendVerificationRequest,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       console.log("SignIn callback triggered:", user);
//       return true;
//     },
//     async session({ session, user }) {
//       console.log("Session callback triggered:", { session, user });

//       // Attach additional data to the session
//       if (user) {
//         session.user.id = user.id;
//         session.user.email = user.email;
//       }

//       return session;
//     },
//   },
// };
