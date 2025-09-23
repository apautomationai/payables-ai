import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Define the secret key for signing the JWT
const secretKey = process.env.SESSION_SECRET || "your-default-secret-key";
const key = new TextEncoder().encode(secretKey);

// Encrypt the session payload
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Set session to expire in 1 hour
    .sign(key);
}

// Decrypt the session token
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // Return null if token is invalid or expired
    return null;
  }
}

// Function to handle logging in
export async function login(user: any) {
  // Create a session with user data
  const session = await encrypt({
    user,
    expires: new Date(Date.now() + 3600 * 1000),
  });
  const cookieStore = await (cookies() as any);
  // Save the session in a secure, httpOnly cookie
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

// Function to handle logging out
export async function logout() {
  const cookieStore = await (cookies() as any);
  // Destroy the session cookie
  cookieStore.set("session", "", { expires: new Date(0) });
}

// Function to get the current session
export async function getSession() {
  const cookieStore = await (cookies() as any);
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
