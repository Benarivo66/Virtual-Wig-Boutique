import postgres from "postgres";
import { UserField } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchUserById(id: string): Promise<UserField | null> {
  try {
    const data = await sql<UserField[]>`SELECT * FROM users WHERE id = ${id}`;
    return data[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}