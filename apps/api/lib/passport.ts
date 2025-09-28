import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { eq } from 'drizzle-orm';

import db from './db';
import { usersModel } from '@/models/users.model';
import { verifyPassword } from './utils/hash';

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

export default passport;
