
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {  SessionUserProfile, SignInCredentials } from "./app/types";


declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;
        // send request to your api route where you can sign in you user and send error or success response to this function.
        const { user, error } = await fetch(process.env.API_SIGN_IN_ENDPOINT!, {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }).then(async (res) => await res.json());

        if (error) return null;
        return { id: user.id, ...user };
      },
    }),
  ],

  callbacks:{
    async jwt(params) {
      if(params.user){
        params.token.user = params.user
      }
      return params.token
    },

    async session(params) {
      if(params.token.user){
        params.session.user = {...params.session.user, ...params.token.user}
      }
      return params.session
    },
  }
  
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);

  