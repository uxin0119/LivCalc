import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { query, queryOne } from "./db";

// Secret 확인 및 경고
const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
if (!secret && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: AUTH_SECRET is not set in production environment');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // 이메일/비밀번호 로그인
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 사용자 조회
        const user = await queryOne<any>(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email as string]
        );

        if (!user || !user.password) {
          return null;
        }

        // 비밀번호 확인
        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),

    // Google 로그인
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // 기존 사용자 확인
        const existingUser = await queryOne<any>(
          'SELECT * FROM users WHERE email = $1',
          [user.email]
        );

        if (!existingUser) {
          // 새 사용자 생성
          const newUser = await queryOne<any>(
            'INSERT INTO users (email, name, image, email_verified) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.email, user.name, user.image, new Date()]
          );
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }

        // 소셜 로그인인 경우 account 정보 저장
        if (account && account.provider !== 'credentials') {
          const existingAccount = await queryOne<any>(
            'SELECT * FROM accounts WHERE provider = $1 AND provider_account_id = $2',
            [account.provider, account.providerAccountId]
          );

          if (!existingAccount) {
            await query(
              `INSERT INTO accounts (user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [
                user.id,
                account.type,
                account.provider,
                account.providerAccountId,
                account.refresh_token,
                account.access_token,
                account.expires_at,
                account.token_type,
                account.scope,
                account.id_token,
              ]
            );
          }
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: secret,
});
