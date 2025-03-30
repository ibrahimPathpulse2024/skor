import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      id_token: string;
      token: string;
      oktoObject?: any;
    };
    expires: string;
    id_token: string;
    token: string;
  }

  interface User extends DefaultUser {
    id: string;
    id_token?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id_token: string;
    token: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}
