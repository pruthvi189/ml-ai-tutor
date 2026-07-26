import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "./schema";
import { eq, and } from "drizzle-orm";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ml-tutor-secret-change-in-production"
);
const COOKIE_NAME = "session";
const EXPIRES_IN = "7d";

export interface Session {
  userId: number;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: {
  id: number;
  email: string;
  name: string;
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET);

  return token;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function upsertOAuthUser({
  provider,
  providerId,
  email,
  name,
}: {
  provider: string;
  providerId: string;
  email: string;
  name: string;
}) {
  const existing = await db
    .select()
    .from(users)
    .where(and(eq(users.oauthProvider, provider), eq(users.oauthId, providerId)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const emailUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (emailUser.length > 0) {
    await db
      .update(users)
      .set({ oauthProvider: provider, oauthId: providerId })
      .where(eq(users.id, emailUser[0].id));
    return emailUser[0];
  }

  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      name,
      oauthProvider: provider,
      oauthId: providerId,
    })
    .returning();

  return user;
}
