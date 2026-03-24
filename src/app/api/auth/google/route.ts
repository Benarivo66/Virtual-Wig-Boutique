import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "@/app/lib/jwt";
import { findOrCreateGoogleUser } from "@/app/lib/auth-service";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Create or find user in DB
    const user = await findOrCreateGoogleUser({
      email: payload.email!,
      name: payload.name!
    });

    const jwt = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ user });

    response.cookies.set("auth-token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 500 }
    );
  }
}