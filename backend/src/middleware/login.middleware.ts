import * as v from 'valibot';
import { db } from '../db/database';
import { LoginUserQuerie } from '../repositories/LoginUserQuery';
import { UserLoginSchema } from '../validators/auth.validator';


export const loginUser = async (req: Request) => {
  try {
    const body = await req.json();

    const result = v.safeParse(UserLoginSchema, body);
    
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.issues }, 
        { status: 400 }
      );
    }

    const { email, password } = result.output;

    const userQuery = db.query(LoginUserQuerie.getByEmail);
    const user = userQuery.get(email) as any;

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await Bun.password.verify(password, user.password);
    
    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = crypto.randomUUID(); 

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `session=${sessionToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=86400`
    );

    return Response.json({ message: "Login successful" }, { status: 200, headers });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};