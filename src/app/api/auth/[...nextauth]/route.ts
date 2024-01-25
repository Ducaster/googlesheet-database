import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Identification",
          type: "text",
          placeholder: "아이디",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/login`,
          {
            username: credentials?.username,
            password: credentials?.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const user = res.data;
        console.log(user);

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
