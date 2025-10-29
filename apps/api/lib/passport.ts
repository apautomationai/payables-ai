import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { eq, or } from 'drizzle-orm';

import db from './db';
import { usersModel } from '@/models/users.model';
import { verifyPassword, hashPassword } from './utils/hash';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');

// Local strategy for login (email + password)
passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(usersModel)
          .where(eq(usersModel.email, email))
          .limit(1)

        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        // return safe user object (omit passwordHash)
        return done(null, { id: user.id, email: user.email });
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// JWT strategy for protecting endpoints
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      passReqToCallback: false,
    },
    async (payload: any, done: any) => {
      try {
        const userId = (payload as any).sub;
        if (!userId) return done(null, false);

        const user = await db
          .select()
          .from(usersModel)
          .where(eq(usersModel.id, Number(userId)))
          .limit(1)
          .then((r) => r[0]);

        if (!user) return done(null, false);

        return done(null, { id: user.id, email: user.email });
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// Google OAuth strategy for authentication
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_AUTH_REDIRECT_URI = process.env.GOOGLE_AUTH_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI as string;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_AUTH_REDIRECT_URI) {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_AUTH_REDIRECT_URI,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;
          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';
          const avatar = profile.photos?.[0]?.value || null;

          if (!email || !googleId) {
            return done(new Error('Missing email or Google ID'), null);
          }

          // Check if user exists by providerId or email
          const [existingUser] = await db
            .select()
            .from(usersModel)
            .where(
              or(
                eq(usersModel.providerId, googleId),
                eq(usersModel.email, email)
              )
            )
            .limit(1);

          if (existingUser) {
            // User exists, return it
            return done(null, { id: existingUser.id, email: existingUser.email });
          }

          // Create new user
          // For OAuth users, we'll use a placeholder passwordHash since they don't have passwords
          // You might want to generate a random secure string here
          const placeholderPassword = 'oauth_user_no_password';
          const passwordHash = await hashPassword(placeholderPassword);

          const [newUser] = await db
            .insert(usersModel)
            .values({
              email,
              firstName,
              lastName,
              avatar,
              provider: 'google',
              providerId: googleId,
              passwordHash,
              isActive: true,
              isBanned: false,
            })
            .returning();

          return done(null, { id: newUser.id, email: newUser.email });
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
}

export default passport;
