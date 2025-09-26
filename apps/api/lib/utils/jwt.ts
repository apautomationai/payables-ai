import jwt, { Secret, SignOptions } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET as string;
// export const JWT_SECRET =  crypto.randomBytes(64).toString('hex') as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export const signJwt = (payload: object, expiresIn: string | number = "1h") => {
  return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn } as SignOptions);
};

export const verifyJwt = <T = any>(token: string): T => {
  return jwt.verify(token, JWT_SECRET as Secret) as T;
};
